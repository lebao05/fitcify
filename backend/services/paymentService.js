const PayOS = require("@payos/node");
const Subscription = require("../models/subscription");
const Payment = require("../models/payment");
const User = require("../models/user");
const dayjs = require("dayjs");
const ShortUniqueId = require("short-unique-id");

const payos = new PayOS(
  process.env.client_id,
  process.env.api_key,
  process.env.checksum_key
);
const uid = new ShortUniqueId({ length: 15, dictionary: "number" }).randomUUID;

async function createSubscription(userId, planType, paymentMethod = "PayOS") {
  const validPlans = {
    premium: { amount: 2000, currency: "VND", durationInDays: 30 },
    family: { amount: 3000, currency: "VND", durationInDays: 30 },
  };

  const plan = validPlans[planType];
  if (!plan) throw new Error("Invalid plan type");

  const now = new Date();
  const endDate = dayjs(now).add(plan.durationInDays, "day").toDate();
  const orderCode = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
  const subscription = new Subscription({
    userId,
    planType,
    status: "pending",
    startDate: now,
    endDate,
    paymentMethod,
    amount: plan.amount,
    currency: plan.currency,
    autoRenew: false,
    orderCode,
  });
  await subscription.save();

  const payment = new Payment({
    userId,
    subscriptionId: subscription._id,
    amount: plan.amount,
    currency: plan.currency,
    status: "pending",
    paymentMethod,
    transactionId: "",
    processedAt: null,
    orderCode,
  });
  await payment.save();

  const paymentResponse = await processPayment(
    userId,
    plan.amount,
    paymentMethod
  );

  return {
    checkoutUrl: paymentResponse.checkoutUrl,
    paymentMethod,
    orderCode,
    subscriptionId: subscription._id,
    paymentId: payment._id,
  };
}

async function processPayment(userId, amount, paymentMethod) {
  const payment = await Payment.findOne({
    userId,
    amount,
    paymentMethod,
    status: "pending",
  }).sort({ createdAt: -1 });

  if (!payment) throw new Error("Payment not found.");

  const subscription = await Subscription.findById(payment.subscriptionId);
  if (!subscription) throw new Error("Subscription not found.");

  const { planType, _id: subscriptionId } = subscription;
  const orderCode = payment.orderCode;
  switch (paymentMethod) {
    case "PayOS": {
      const description = `Đăng ký ${planType}`;
      const returnUrl = `${process.env.DOMAIN}/api/payment/payment-success?orderCode=${orderCode}`;
      const cancelUrl = `${process.env.DOMAIN}/api/payment/payment-cancel?orderCode=${orderCode}`;
      console.log("🔍 DEBUG PayOS call:", {
        orderCode,
        amount,
        description,
        returnUrl,
        cancelUrl,
        expiredAt,
      });

      const paymentLinkRes = await payos.createPaymentLink({
        orderCode: orderCode,
        amount,
        description,
        returnUrl,
        cancelUrl,
        expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
      });

      return {
        checkoutUrl: paymentLinkRes.checkoutUrl,
        orderCode,
      };
    }

    case "ZaloPay":
      return {
        checkoutUrl: "https://zalopay.dev/mock-url",
        orderCode,
      };

    case "CreditCard":
      return {
        message: "Thẻ đã thanh toán thành công (mock)",
        orderCode,
      };

    default:
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
  }
}

async function cancelPayment(orderCode) {
  const payment = await Payment.findOne({ orderCode });
  if (!payment) throw new Error("Payment not found");

  if (payment.status === "completed")
    throw new Error("Payment was already completed. Cannot cancel.");

  if (payment.status === "pending") {
    payment.status = "failed";
    await payment.save();
    await Subscription.deleteOne({ _id: payment.subscriptionId });
    return { message: "Payment was cancelled." };
  }

  throw new Error("Payment already cancelled.");
}

async function confirmPayment(orderCode) {
  const statusRes = await payos.getPaymentLinkInformation(orderCode);

  const payment = await Payment.findOne({ orderCode: Number(orderCode) });
  if (!payment) throw new Error("Payment not found.");

  if (payment.status === "completed")
    return { message: "Payment already completed." };

  payment.status = "completed";
  payment.transactionId = statusRes.transactionId;
  payment.processedAt = new Date();
  await payment.save();

  const subscription = await Subscription.findById(payment.subscriptionId);
  if (subscription) {
    subscription.status = "active";
    subscription.startDate = new Date();
    subscription.endDate = dayjs().add(30, "day").toDate();
    await subscription.save();
  }

  const user = await User.findById(payment.userId);
  if (user) {
    user.isPremium = true;
    user.subscribedUntil = subscription.endDate;
    await user.save();
  }

  return { message: "Subscription activated!" };
}

async function cancelSubscription(subscriptionId) {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new Error("Subscription not found.");

  subscription.status = "cancelled";
  await subscription.save();

  const user = await User.findById(subscription.userId);
  if (user) {
    user.isPremium = false;
    user.subscribedUntil = null;
    await user.save();
  }

  return { message: "Subscription cancelled successfully." };
}

module.exports = {
  createSubscription,
  processPayment,
  cancelPayment,
  confirmPayment,
  cancelSubscription,
};

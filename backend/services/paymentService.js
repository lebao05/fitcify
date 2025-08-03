const PayOS = require("@payos/node");
const Subscription = require("../models/Subscription");
const Payment = require("../models/payment");
const User = require("../models/user");
const dayjs = require("dayjs");

const payos = new PayOS(
  process.env.client_id,
  process.env.api_key,
  process.env.checksum_key
);

async function createSubscription(userId, planType) {
  try {
    const validPlans = {
      premium: {
        amount: Number(process.env.premium_cost),
        currency: "VND",
        durationInDays: 30,
      },
      family: {
        amount: Number(process.env.family_cost),
        currency: "VND",
        durationInDays: 30,
      },
    };

    const plan = validPlans[planType];
    if (!plan) throw new Error("Invalid plan type");

    const now = new Date();
    const endDate = dayjs(now).add(plan.durationInDays, "day").toDate();
    const orderCode = Number(
      `${Date.now()}${Math.floor(Math.random() * 1000)}`
    );
    const subscription = new Subscription({
      userId,
      planType,
      status: "pending",
      startDate: now,
      endDate,
      paymentMethod: "PayOS",
      amount: plan.amount,
      currency: plan.currency,
      autoRenew: false,
    });
    await subscription.save();

    const payment = new Payment({
      userId,
      subscriptionId: subscription._id,
      amount: plan.amount,
      currency: plan.currency,
      status: "pending",
      paymentMethod: "PayOS",
      transactionId: "",
      processedAt: null,
      orderCode,
    });
    await payment.save();

    const description = `Dang ki ${planType}`;
    const returnUrl = `${process.env.FRONTEND_DOMAIN}/payment-success?orderCode=${orderCode}`;
    const cancelUrl = `${process.env.FRONTEND_DOMAIN}/payment-cancel?orderCode=${orderCode}`;

    console.log("🟢 orderCode:", orderCode);
    console.log("🟢 amount:", plan.amount);
    console.log("🟢 description:", description);
    console.log("🟢 returnUrl:", returnUrl);
    console.log("🟢 cancelUrl:", cancelUrl);

    const paymentLinkRes = await payos.createPaymentLink({
      orderCode,
      amount: plan.amount,
      description,
      returnUrl,
      cancelUrl,
      expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
    });

    return {
      checkoutUrl: paymentLinkRes.checkoutUrl,
      paymentId: payment._id,
      subscriptionId: subscription._id,
      orderCode,
    };
  } catch (err) {
    console.error("[createSubscription] error:", err);
    throw err;
  }
}

async function cancelPayment(orderCode) {
  try {
    const payment = await Payment.findOne({ orderCode });

    if (!payment) {
      return { status: 404, message: "❌ Payment not found." };
    }

    if (payment.status === "completed")
      return {
        status: 409,
        message: "⚠️ Payment was already completed. Cannot cancel.",
      };

    if (payment.status === "pending") {
      payment.status = "failed";
      await payment.save();

      await Subscription.deleteOne({ _id: payment.subscriptionId });

      return { status: 200, message: "❌ Payment was cancelled." };
    }

    if (payment.status === "failed") {
      return {
        status: 410,
        message: "❌ Payment was already cancelled before.",
      };
    }
  } catch (err) {
    console.error("[cancelPayment] error:", err);
    return { status: 500, message: "❌ Internal server error." };
  }
}

async function confirmPayment(orderCode) {
  try {
    let statusRes;
    try {
      statusRes = await payos.getPaymentLinkInformation(orderCode);
    } catch (err) {
      console.error("[getPaymentLinkInformation] error:", err.message);
      return {
        status: 404,
        message: "❌ Payment not found in PayOS.",
      };
    }

    // cmt để test không cần chuyển khoản nếu muốn chuyển khoản thì tắt cmt
    // if (statusRes.status !== 'PAID') {
    //   return {
    //     status: 202,
    //     message: '⏳ Payment not completed yet.',
    //   };
    // }

    const payment = await Payment.findOne({ orderCode: Number(orderCode) });
    if (!payment) {
      return {
        status: 404,
        message: "❌ Payment not found.",
      };
    }

    if (payment.status === "completed") {
      return {
        status: 409,
        message: "⚠️ Payment already completed before.",
      };
    }

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

    return {
      status: 200,
      message: "✅ Subscription activated!",
      data: {
        orderCode: payment.orderCode,
        amount: payment.amount,
        currency: payment.currency,
        username: user.username,
        email: user.email,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        planType: subscription.planType,
        paymentMethod: payment.paymentMethod,
      },
    };
  } catch (err) {
    console.error("[confirmPayment] error:", err);
    return {
      status: 500,
      message: "❌ Internal server error.",
    };
  }
}

async function cancelSubscription(subscriptionId) {
  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      console.error(
        "[cancelSubscription] ❌ Subscription not found:",
        subscriptionId
      );
      return { status: 404, message: "❌ Subscription not found." };
    }

    subscription.status = "cancelled";
    await subscription.save();
    console.log(
      "[cancelSubscription] ✅ Subscription cancelled:",
      subscriptionId
    );

    const user = await User.findById(subscription.userId);
    if (!user) {
      console.error(
        "[cancelSubscription] ❌ User not found:",
        subscription.userId
      );
      return { status: 404, message: "❌ User not found." };
    }

    user.isPremium = false;
    user.subscribedUntil = null;
    await user.save();
    console.log("[cancelSubscription] ✅ User downgraded:", user._id);

    return { status: 200, message: "✅ Subscription cancelled successfully." };
  } catch (err) {
    console.error("[cancelSubscription] 🔥 Internal error:", err);
    return { status: 500, message: "❌ Failed to cancel subscription." };
  }
}

module.exports = {
  createSubscription,
  cancelPayment,
  confirmPayment,
  cancelSubscription,
};

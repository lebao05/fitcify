const { checkout } = require("../routes/paymentRoute");
const paymentService = require("../services/paymentService");

async function cancelSubscription(req, res) {
  const { subscriptionId } = req.body;
  const result = await paymentService.cancelSubscription(subscriptionId);
  return res.status(result.status).json({ message: result.message });
}

async function createSubscription(req, res) {
  try {
    const { planType } = req.body;
    const userId = req.user._id;

    const result = await paymentService.createSubscription(userId, planType);

    res.status(200).json({
      message: "Payment link created successfully",
      checkoutUrl: result.checkoutUrl,
      paymentMethod: "PayOS",
      orderCode: result.orderCode,
      subscriptionId: result.subscriptionId,
      paymentId: result.paymentId,
    });
  } catch (err) {
    console.error("[createSubscription controller] error:", err);
    res.status(500).json({ message: "Failed to create subscription" });
  }
}

async function paymentFailure(req, res) {
  try {
    const { orderCode } = req.query;
    if (!orderCode) return res.status(400).send("Missing orderCode");

    const result = await paymentService.cancelPayment(orderCode);
    return res.status(result.status).send(result.message);
  } catch (err) {
    console.error("[cancelSubscription controller] error:", err);
    res.status(500).send("Error cancelling subscription.");
  }
}

async function paymentSuccess(req, res) {
  try {
    const { orderCode } = req.query;
    if (!orderCode) {
      return res.status(400).json({ message: "Missing orderCode" });
    }

    const result = await paymentService.confirmPayment(Number(orderCode));
    return res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error("[paymentSuccess controller] error:", err);
    return res.status(500).json({ message: "❌ Internal server error" });
  }
}

const crypto = require('crypto');

async function paymentWebhook(req, res) {
  try {
    const rawBody = req.body.toString();
    const signatureFromHeader = req.headers['x-signature'];
    const secretKey = process.env.checksum_key;

    console.log('📩 Webhook Received from PayOS');
    console.log('🔐 Signature:', signatureFromHeader);
    console.log('📦 Raw Body:', rawBody);

    // Tính chữ ký kiểm tra
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody)
      .digest('hex');

    console.log('🧮 Expected Signature:', expectedSignature);

    if (signatureFromHeader !== expectedSignature) {
      console.warn('❌ Signature mismatch! Possible spoofed request.');
      return res.status(400).send('Invalid signature');
    }

    const body = JSON.parse(rawBody);
    const { orderCode, status } = body;

    console.log('✅ Webhook VERIFIED');
    console.log('➡️ Order Code:', orderCode);
    console.log('➡️ Status:', status);

    if (status === 'PAID') {
      await paymentService.confirmPayment(orderCode);
    } else if (status === 'CANCELLED') {
      await paymentService.cancelPayment(orderCode);
    }

    res.status(200).send('Webhook processed');
  } catch (err) {
    console.error('🔥 Webhook handler failed:', err);
    res.status(500).send('Internal error');
  }
}


module.exports = {
  createSubscription,
  cancelSubscription,
  paymentFailure,
  paymentSuccess,
};

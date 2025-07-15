const paymentService = require('../services/paymentService');


async function createSubscription(req, res) {
  try {
    const { planType, paymentMethod = "PayOS" } = req.body;
    const userId = req.user._id;

    const result = await paymentService.createSubscription(userId, planType, paymentMethod);
    return res.status(200).json({ message: "Created subscription successfully", data: result });
  } catch (err) {
    console.error("[createSubscription] error:", err);
    return res.status(400).json({ message: err.message });
  }
}

async function cancelSubscription(req, res) {
  try {
    const { subscriptionId } = req.body;
    const result = await paymentService.cancelSubscription(subscriptionId);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[cancelSubscription] error:", err);
    return res.status(400).json({ message: err.message });
  }
}

async function paymentSuccess(req, res) {
  try {
    const { orderCode } = req.query;
    if (!orderCode) return res.status(400).json({ message: "Missing orderCode" });

    const result = await paymentService.confirmPayment(Number(orderCode));
    return res.status(200).json(result);
  } catch (err) {
    console.error("[paymentSuccess] error:", err);
    return res.status(400).json({ message: err.message });
  }
}

async function paymentFailure(req, res) {
  try {
    const { orderCode } = req.query;
    if (!orderCode) return res.status(400).json({ message: "Missing orderCode" });

    const result = await paymentService.cancelPayment(orderCode);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[paymentFailure] error:", err);
    return res.status(400).json({ message: err.message });
  }
}



module.exports = {
  createSubscription,
  cancelSubscription,
  paymentSuccess,
  paymentFailure
}
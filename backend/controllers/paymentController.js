const paymentService = require("../services/paymentService");

const createSubscription = async (req, res, next) => {
  try {
    const { planType } = req.body;
    const userId = req.user._id;

    const result = await paymentService.createSubscription(userId, planType);

    res.status(200).json({
      Message: "Payment link created successfully",
      Error: 0,
      Data: {
        checkoutUrl: result.checkoutUrl,
        paymentMethod: "PayOS",
        orderCode: result.orderCode,
        subscriptionId: result.subscriptionId,
        paymentId: result.paymentId,
      },
    });
  } catch (err) {
    next(err);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.body;
    const result = await paymentService.cancelSubscription(subscriptionId);

    res.status(result.status).json({
      Message: result.message,
      Error: result.status === 200 ? 0 : 1,
      Data: null,
    });
  } catch (err) {
    next(err);
  }
};

const paymentFailure = async (req, res, next) => {
  try {
    const { orderCode } = req.query;
    if (!orderCode) {
      return res.status(400).json({
        Message: "Missing orderCode",
        Error: 1,
        Data: null,
      });
    }

    const result = await paymentService.cancelPayment(orderCode);

    res.status(result.status).json({
      Message: result.message,
      Error: result.status === 200 ? 0 : 1,
      Data: null,
    });
  } catch (err) {
    next(err);
  }
};

const paymentSuccess = async (req, res, next) => {
  try {
    const { orderCode } = req.query;
    if (!orderCode) {
      return res.status(400).json({
        Message: "Missing orderCode",
        Error: 1,
        Data: null,
      });
    }

    const result = await paymentService.confirmPayment(Number(orderCode));

    res.status(result.status).json({
      Message: result.message,
      Error: result.status === 200 ? 0 : 1,
      Data: result.data || null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSubscription,
  cancelSubscription,
  paymentFailure,
  paymentSuccess,
};

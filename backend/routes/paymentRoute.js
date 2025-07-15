const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// RESTful routes
router.post('/subscriptions', authMiddleware, paymentController.createSubscription);
router.delete('/subscriptions/:subscriptionId', authMiddleware, paymentController.cancelSubscription);
router.get('/success', authMiddleware, paymentController.paymentSuccess);
router.get('/cancel', authMiddleware, paymentController.paymentFailure);

module.exports = router;

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/subscribe-create', authMiddleware, paymentController.createSubscription);
router.post('/subscribe-cancel', authMiddleware, paymentController.cancelSubscription);
router.get('/payment-success', authMiddleware,paymentController.paymentSuccess);
router.get('/payment-cancel', authMiddleware, paymentController.paymentFailure);

module.exports = router;


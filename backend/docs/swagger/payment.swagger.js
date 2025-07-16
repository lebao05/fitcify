/**
 * @swagger
 * /api/payment/subscribe-create:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Create a subscription and generate a PayOS payment link
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planType
 *             properties:
 *               planType:
 *                 type: string
 *                 enum: [premium, family]
 *                 description: Type of subscription plan
 *                 example: premium
 *     responses:
 *       200:
 *         description: Payment link successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment link created successfully
 *                 checkoutUrl:
 *                   type: string
 *                 paymentMethod:
 *                   type: string
 *                   example: PayOS
 *                 orderCode:
 *                   type: number
 *                 subscriptionId:
 *                   type: string
 *                 paymentId:
 *                   type: string
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/payment/subscribe-cancel:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Cancel a subscription and downgrade user
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionId
 *             properties:
 *               subscriptionId:
 *                 type: string
 *                 description: ID of the subscription to cancel
 *     responses:
 *       200:
 *         description: Subscription cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ✅ Subscription cancelled successfully.
 *       404:
 *         description: Subscription or user not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/payment/payment-success:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Confirm payment success and activate subscription
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: orderCode
 *         required: true
 *         schema:
 *           type: number
 *         description: Order code returned from PayOS
 *     responses:
 *       200:
 *         description: Subscription activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ✅ Subscription activated!
 *       404:
 *         description: Payment not found
 *       409:
 *         description: Payment already completed
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/payment/payment-cancel:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Cancel payment and remove pending subscription
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: orderCode
 *         required: true
 *         schema:
 *           type: number
 *         description: Order code to cancel
 *     responses:
 *       200:
 *         description: Payment cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: ❌ Payment was cancelled.
 *       404:
 *         description: Payment not found
 *       409:
 *         description: Payment already completed
 *       410:
 *         description: Payment already cancelled
 *       500:
 *         description: Internal server error
 */

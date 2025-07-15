/**
 * @swagger
 * /api/payments/subscriptions:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Create a subscription and generate a payment link
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
 *               paymentMethod:
 *                 type: string
 *                 enum: [PayOS, ZaloPay, CreditCard]
 *                 description: Payment method to use
 *                 example: PayOS
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     checkoutUrl:
 *                       type: string
 *                     paymentMethod:
 *                       type: string
 *                     orderCode:
 *                       type: number
 *                     subscriptionId:
 *                       type: string
 *                     paymentId:
 *                       type: string
 *       400:
 *         description: Invalid request or plan type
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/payments/subscriptions/{subscriptionId}:
 *   delete:
 *     tags:
 *       - Payment
 *     summary: Cancel a subscription and update user status
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: subscriptionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subscription to cancel
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
 *       400:
 *         description: Invalid subscriptionId
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/payments/success:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Confirm successful payment and activate subscription
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: orderCode
 *         required: true
 *         schema:
 *           type: number
 *         description: Order code provided by PayOS
 *     responses:
 *       200:
 *         description: Subscription activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing or invalid orderCode
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/payments/cancel:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Cancel payment and remove related data
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: orderCode
 *         required: true
 *         schema:
 *           type: number
 *         description: Order code of the cancelled payment
 *     responses:
 *       200:
 *         description: Payment cancelled and data removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing or invalid orderCode
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to cancel payment or cleanup
 */

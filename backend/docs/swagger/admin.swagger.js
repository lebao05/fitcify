/**
 * @swagger
 * /api/admin/verification-requests:
 *   get:
 *     summary: Get all pending artist verification requests
 *     tags: [Moderation]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of pending verification requests
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/verification-requests/{requestId}/approve:
 *   post:
 *     summary: Approve a pending artist verification request
 *     tags: [Moderation]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the verification request
 *     responses:
 *       200:
 *         description: Request approved successfully
 *       404:
 *         description: Request not found
 *       409:
 *         description: Already approved
 */

/**
 * @swagger
 * /api/admin/verification-requests/{requestId}/reject:
 *   post:
 *     summary: Reject an artist verification request
 *     tags: [Moderation]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the verification request
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: Missing required documents
 *     responses:
 *       200:
 *         description: Request rejected successfully
 *       404:
 *         description: Request not found
 *       409:
 *         description: Already rejected
 */

/**
 * @swagger
 * /api/admin/users/{userId}/suspend:
 *   post:
 *     summary: Suspend a user account
 *     tags: [Moderation]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to suspend
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Violating community guidelines
 *     responses:
 *       200:
 *         description: User suspended successfully
 *       404:
 *         description: User not found
 *       409:
 *         description: Already suspended
 */

/**
 * @swagger
 * /api/admin/users/{userId}/activate:
 *   post:
 *     summary: Reactivate (unsuspend) a user account
 *     tags: [Moderation]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to reactivate
 *     responses:
 *       200:
 *         description: User reactivated successfully
 *       404:
 *         description: User not found
 *       409:
 *         description: Not currently suspended
 */

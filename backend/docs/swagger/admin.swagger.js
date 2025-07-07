/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin actions for managing users, artists, and songs
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */

/**
 * @swagger
 * /api/admin/verification-requests:
 *   get:
 *     summary: Get all artist verification requests
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Verification requests fetched successfully
 */

/**
 * @swagger
 * /api/admin/verification-requests/{id}/approve:
 *   post:
 *     summary: Approve an artist verification request
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Request ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artist approved successfully
 */

/**
 * @swagger
 * /api/admin/verification-requests/{id}/reject:
 *   post:
 *     summary: Reject an artist verification request
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Request ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Artist request rejected
 */

/**
 * @swagger
 * /api/admin/artists/{id}/suspend:
 *   post:
 *     summary: Suspend an artist
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Artist User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artist suspended successfully
 */

/**
 * @swagger
 * /api/admin/artists/{id}/activate:
 *   post:
 *     summary: Activate a suspended artist
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Artist User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artist activated successfully
 */


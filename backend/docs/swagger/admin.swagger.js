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
 * /api/admin/users/{id}/suspend:
 *   patch:
 *     summary: Suspend a user account
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for suspension
 *             required:
 *               - reason
 *     responses:
 *       200:
 *         description: User suspended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                 Error:
 *                   type: integer
 *                 Data:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/admin/users/{id}/activate:
 *   patch:
 *     summary: Activate a previously suspended user account
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to activate
 *     responses:
 *       200:
 *         description: User activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                 Error:
 *                   type: integer
 *                 Data:
 *                   $ref: '#/components/schemas/User'
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
 *   patch:
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
 *   patch:
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
 *   patch:
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
 *   patch:
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

/**
 * @swagger
 * /api/admin/songs/{songId}/approve:
 *   post:
 *     summary: Approve a song
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the song to approve
 *     responses:
 *       200:
 *         description: Song approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                 Error:
 *                   type: integer
 *                 Data:
 *                   $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/admin/songs/{songId}/reject:
 *   post:
 *     summary: Reject a song
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the song to reject
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for rejection
 *             example:
 *               reason: "Does not meet content guidelines"
 *     responses:
 *       200:
 *         description: Song rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                 Error:
 *                   type: integer
 *                 Data:
 *                   $ref: '#/components/schemas/Song'
 */

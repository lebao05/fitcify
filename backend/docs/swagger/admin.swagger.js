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
 * tags:
 *   - name: Admin
 *   - name: Songs
 *     description: Admin operations on songs
 *   - name: ContentVerifications
 *     description: Admin operations on content verification requests
 *
 * components:
 *   schemas:
 *     Song:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         artistId:
 *           type: string
 *         duration:
 *           type: number
 *         audioUrl:
 *           type: string
 *         imageUrl:
 *           type: string
 *         albumId:
 *           type: string
 *           nullable: true
 *         isApproved:
 *           type: boolean
 *         approvedBy:
 *           type: string
 *           nullable: true
 *         approvedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         rejectionReason:
 *           type: string
 *           nullable: true
 *         rejectedBy:
 *           type: string
 *           nullable: true
 *         rejectedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ContentVerificationRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         objectId:
 *           type: string
 *           description: ID of the content being verified
 *         artistId:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *         type:
 *           type: string
 *           enum: [Song, Album]
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         submittedAt:
 *           type: string
 *           format: date-time
 *         processedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         processedBy:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *         rejectionReason:
 *           type: string
 *           nullable: true
 *         rejectedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */

/**
 * @swagger
 * /api/admin/songs:
 *   get:
 *     summary: List all songs
 *     tags: [Admin, Songs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all songs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: integer
 *                   example: 0
 *                 Message:
 *                   type: string
 *                   example: Songs fetched successfully
 *                 Data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/admin/songs/{songId}/approve:
 *   post:
 *     summary: Approve a song
 *     tags: [Admin, Songs]
 *     security:
 *       - bearerAuth: []
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
 *                 Error:
 *                   type: integer
 *                   example: 0
 *                 Message:
 *                   type: string
 *                   example: Song approved
 *                 Data:
 *                   $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/admin/songs/{songId}/reject:
 *   post:
 *     summary: Reject a song
 *     tags: [Admin, Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the song to reject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for rejection
 *             required:
 *               - reason
 *     responses:
 *       200:
 *         description: Song rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: integer
 *                   example: 0
 *                 Message:
 *                   type: string
 *                   example: Song rejected
 *                 Data:
 *                   $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/admin/content-verifications:
 *   get:
 *     summary: List content verification requests
 *     tags: [Admin, ContentVerifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by request status
 *     responses:
 *       200:
 *         description: A list of verification requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: integer
 *                   example: 0
 *                 Message:
 *                   type: string
 *                   example: Verification requests fetched
 *                 Data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContentVerificationRequest'
 */

/**
 * @swagger
 * /api/admin/content-verifications/{requestId}/approve:
 *   post:
 *     summary: Approve a content verification request
 *     tags: [Admin, ContentVerifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the verification request to approve
 *     responses:
 *       200:
 *         description: Verification request approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: integer
 *                   example: 0
 *                 Message:
 *                   type: string
 *                   example: Verification request approved
 *                 Data:
 *                   $ref: '#/components/schemas/ContentVerificationRequest'
 */

/**
 * @swagger
 * /api/admin/content-verifications/{requestId}/reject:
 *   post:
 *     summary: Reject a content verification request
 *     tags: [Admin, ContentVerifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the verification request to reject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Rejection notes
 *             required:
 *               - notes
 *     responses:
 *       200:
 *         description: Verification request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: integer
 *                   example: 0
 *                 Message:
 *                   type: string
 *                   example: Verification request rejected
 *                 Data:
 *                   $ref: '#/components/schemas/ContentVerificationRequest'
 */

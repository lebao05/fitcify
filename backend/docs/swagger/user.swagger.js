/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User-related routes
 */

/**
 * @swagger
 * /api/user/profile/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 */

/**
 * @swagger
 * /api/user/profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile
 */

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile
 */
/**
 * @swagger
 * /api/user/profile/followed-artists:
 *   get:
 *     summary: Get list of artists followed by the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of followed artists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                   example: Followed artists fetched
 *                 Error:
 *                   type: integer
 *                   example: 0
 *                 Data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Artist's user ID
 *                         example: "64f88c2a9e1f3b0012345678"
 *                       username:
 *                         type: string
 *                         example: "Artist One"
 *                       avatarUrl:
 *                         type: string
 *                         format: uri
 *                         example: "https://res.cloudinary.com/.../artist1.jpg"
 *       401:
 *         description: Unauthorized (no valid token)
 */

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile (username, avatar)
 *     tags: [Users]
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /api/user/profile/avatar:
 *   delete:
 *     summary: Delete user avatar
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Avatar deleted
 */

/**
 * @swagger
 * /api/user/account:
 *   get:
 *     summary: Get account info
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Account details
 *   patch:
 *     summary: Update account info
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Account updated
 */
/**
 * @swagger
 * /api/user/artists/{artistId}/follow:
 *   post:
 *     summary: Follow an artist
 *     tags: [Users]
 *     parameters:
 *       - name: artistId
 *         in: path
 *         description: Artist user ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Followed artist
 */

/**
 * @swagger
 * /api/user/artists/{artistId}/follow:
 *   delete:
 *     summary: Unfollow an artist
 *     tags: [Users]
 *     parameters:
 *       - name: artistId
 *         in: path
 *         description: Artist user ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unfollowed artist
 */

/**
 * @swagger
 * /api/music/songs/liked:
 *   get:
 *     summary: Get all liked songs of the current user
 *     tags: [Songs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of liked songs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likedTracks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Song'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/music/songs/{songId}/toggle-like:
 *   post:
 *     summary: Toggle like/unlike a song
 *     tags: [Songs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the song to like or unlike
 *     responses:
 *       200:
 *         description: Toggle like success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Song liked
 *                 liked:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: integer
 *                   example: 1
 *                 Message:
 *                   type: string
 *                   example: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
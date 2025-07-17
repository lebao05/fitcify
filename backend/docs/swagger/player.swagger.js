/**
 * @swagger
 * tags:
 *   name: Music
 */

/**
 * @swagger
 * /api/music/like/{songId}:
 *   post:
 *     summary: Like or unlike a song
 *     tags: [Music]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the song to like or unlike
 *     responses:
 *       200:
 *         description: Successfully liked or unliked the song
 *       404:
 *         description: Song not found
 */

/**
 * @swagger
 * /api/music/stream-url/{songId}:
 *   get:
 *     summary: Get the audio stream URL of a song
 *     tags: [Music]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the song
 *     responses:
 *       200:
 *         description: Audio URL returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 audioUrl:
 *                   type: string
 *       404:
 *         description: Song not found
 */

/**
 * @swagger
 * /api/music/queue/add/{songId}:
 *   post:
 *     summary: Add a song to the user's playback queue
 *     tags: [Music]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the song to add to the queue
 *     responses:
 *       200:
 *         description: Song added to queue
 *       404:
 *         description: Song not found or not approved
 */
/**
 * @swagger
 * /api/music/queue/skip:
 *   post:
 *     summary: Skip to the next song in the queue
 *     tags: [Music]
 *     responses:
 *       200:
 *         description: Skipped to next song
 *       404:
 *         description: Queue is empty or player not found
 */
/**
 * @swagger
 * /api/music/queue:
 *   get:
 *     summary: Get the current queue for the user
 *     tags: [Music]
 *     responses:
 *       200:
 *         description: List of songs in the queue
 *       404:
 *         description: Player not found or queue is empty
 */
/**
 * @swagger
 * /api/music/repeat/toggle:
 *   post:
 *     summary: Toggle repeat mode for the current user
 *     tags: [Music]
 *     responses:
 *       200:
 *         description: Repeat mode toggled
 *       500:
 *         description: Internal server error
 */

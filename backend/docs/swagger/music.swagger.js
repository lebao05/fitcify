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
/**
 * @swagger
 * /api/music/albums/{albumId}:
 *   get:
 *     summary: Get album details by ID
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the album to fetch
 *     responses:
 *       200:
 *         description: Album fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *       400:
 *         description: Invalid album id
 *       404:
 *         description: Album not found
 */

/**
 * @swagger
 * /api/music/artists/{artistId}/albums:
 *   get:
 *     summary: Get all albums of an artist
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the artist whose albums to fetch
 *     responses:
 *       200:
 *         description: Albums fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *       400:
 *         description: Invalid artist id
 *       404:
 *         description: Artist not found
 */

/**
 * @swagger
 * /api/music/play/album/{albumId}:
 *   post:
 *     summary: Play an album
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the album
 *       - in: query
 *         name: songOrder
 *         schema:
 *           type: integer
 *         description: Index of the song to start playing (default 0)
 *     responses:
 *       200:
 *         description: Album is now playing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 */


/**
 * @swagger
 * /api/music/play/playlist/{playlistId}:
 *   post:
 *     summary: Play a playlist
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the playlist
 *       - in: query
 *         name: songOrder
 *         schema:
 *           type: integer
 *         description: Index of the song to start (default 0)
 *     responses:
 *       200:
 *         description: Playlist is now playing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/music/play/artist/{artistId}:
 *   post:
 *     summary: Play songs from an artist
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the artist
 *     responses:
 *       200:
 *         description: Artist songs are now playing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/music/play-song:
 *   post:
 *     summary: Play a specific song
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - songId
 *             properties:
 *               songId:
 *                 type: string
 *                 example: "64f8e12345678abcde000999"
 *     responses:
 *       200:
 *         description: Song is now playing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/music/previous:
 *   post:
 *     summary: Go to the previous song
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Previous song is now playing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 */
/**
 * @swagger
 * /api/music/next:
 *   post:
 *     summary: Go to the next song
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Next song is now playing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 */

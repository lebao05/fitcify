/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: Playlist-related routes
 */

/**
 * @swagger
 * /api/playlists:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               cover:
 *                 type: string
 *                 format: binary
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Playlist created
 */

/**
 * @swagger
 * /api/playlists/{playlistId}:
 *   put:
 *     summary: Update playlist details (name, description, cover, privacy)
 *     tags: [Playlists]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         description: Playlist ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               cover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Playlist updated
 */

/**
 * @swagger
 * /api/playlists/{playlistId}/songs:
 *   post:
 *     summary: Add a song to a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         description: Playlist ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               songId:
 *                 type: string
 *             required:
 *               - songId
 *     responses:
 *       200:
 *         description: Song added to playlist
 */

/**
 * @swagger
 * /api/playlists/{playlistId}/songs/{songId}:
 *   delete:
 *     summary: Remove a song from a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         description: Playlist ID
 *         required: true
 *         schema:
 *           type: string
 *       - name: songId
 *         in: path
 *         description: Song ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song removed from playlist
 */

/**
 * @swagger
 * /api/playlists/{playlistId}:
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         description: Playlist ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist deleted
 */

/**
 * @swagger
 * /api/playlists:
 *   get:
 *     summary: Get all playlists of the authenticated user
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of playlists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 */

/**
 * @swagger
 * /api/playlists/{playlistId}:
 *   get:
 *     summary: Get a single playlist by ID
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the playlist
 *     responses:
 *       200:
 *         description: Playlist details with songs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *       403:
 *         description: Forbidden (private playlist)
 *       404:
 *         description: Playlist not found
 */

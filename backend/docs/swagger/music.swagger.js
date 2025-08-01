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
/**
 * @swagger
 * /api/music/top/songs:
 *   get:
 *     summary: Get top songs sorted by play count
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of top songs to return
 *     responses:
 *       200:
 *         description: A list of top songs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *             examples:
 *               TopSongs:
 *                 value:
 *                   Message: Top songs fetched
 *                   Error: 0
 *                   Data:
 *                     - _id: "64f1a2..."
 *                       title: "Hit Song"
 *                       artistId: "64f1b3..."
 *                       playCount: 12345
 *                       imageUrl: "https://..."
 *       401:
 *         description: Unauthorized (no valid token)
 */
/**
 * @swagger
 * /api/music/top/artists:
 *   get:
 *     summary: Get top artists sorted by total play count
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of artists to return
 *     responses:
 *       200:
 *         description: A list of top artists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *             examples:
 *               TopArtists:
 *                 value:
 *                   Message: Top artists fetched
 *                   Error: 0
 *                   Data:
 *                     - _id: "64f1b3a7..."
 *                       userId: "64f1b3a7..."
 *                       name: "Artist Name"
 *                       imageUrl: "https://..."
 *                       totalPlays: 987654
 *                     - _id: "64f2c4b8..."
 *                       userId: "64f2c4b8..."
 *                       name: "Another Artist"
 *                       imageUrl: "https://..."
 *                       totalPlays: 876543
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
/**
 * @swagger
 * /api/music/top/albums:
 *   get:
 *     summary: Get top albums sorted by view count
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of albums to return
 *     responses:
 *       200:
 *         description: A list of top albums
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *             examples:
 *               TopAlbums:
 *                 value:
 *                   Message: Top albums fetched
 *                   Error: 0
 *                   Data:
 *                     - _id: "64f3a9f..."
 *                       title: "Hit Album"
 *                       artistId: "64f1b3a7..."
 *                       imageUrl: "https://..."
 *                       viewCount: 54321
 *                       releaseDate: "2023-07-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/music/search:
 *   get:
 *     summary: Search songs, albums, artists, or playlists
 *     tags: [Music]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term (e.g., keyword, song title, artist name)
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [song, album, artist, playlist]
 *         description: Type of content to search for (defaults to all)
 *     responses:
 *       200:
 *         description: Search results
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
 *                   example: Search results fetched
 *                 Data:
 *                   type: object
 *                   properties:
 *                     songs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Song'
 *                     albums:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Album'
 *                     artists:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     playlists:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Bad request (e.g., missing query param)
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
 *                   example: Missing or invalid search query
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/music/normalize:
 *   put:
 *     summary: Normalize text fields for search (diacritics, case-insensitive)
 *     tags: [Music]
 *     description: Removes accents and normalizes the title, name, and username fields for songs, albums, playlists, and artists.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Normalization completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Normalization complete for all content
 *       401:
 *         description: Unauthorized (missing or invalid token)
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
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * tags:
 *   name: Artist
 *   description: artist actions for submit verification, content request , and songs
 */

/**
 * @swagger
 * /api/artist/verification-request:
 *   post:
 *     summary: Submit a verification request to become an artist
 *     tags: [Artist]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Optional note or message from the user
 *     responses:
 *       200:
 *         description: Verification request submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 */

/**
 * @swagger
 * /api/artist/songs:
 *   post:
 *     summary: Upload a new song (artist only)
 *     tags: [Artist]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - audio
 *             properties:
 *               title:
 *                 type: string
 *               albumId:
 *                 type: string
 *                 description: Optional album ObjectId
 *               audio:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Song uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 */

/**
 * @swagger
 * /api/artist/songs/{id}:
 *   patch:
 *     summary: Update an existing song (audio, image, title, or album)
 *     tags: [Artist]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Song ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               albumId:
 *                 type: string
 *               audio:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Song updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 */

/**
 * @swagger
 * /api/artist/songs/{songId}:
 *   delete:
 *     summary: Delete a song by artist
 *     tags: [Artist]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the song to delete
 *     responses:
 *       200:
 *         description: Song deleted successfully
 *       400:
 *         description: Bad request or unauthorized
 */

/**
 * @swagger
 * /api/artist/profile:
 *   get:
 *     summary: Retrieve the authenticated artist’s profile
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Artist profile fetched successfully
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
 *                   example: Profile fetched
 *                 Data:
 *                   $ref: '#/components/schemas/ArtistProfile'
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Forbidden (user is not an artist)
 */

/**
 * @swagger
 * /api/artist/profile:
 *   put:
 *     summary: Update the authenticated artist’s bio and social links
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: "Updated artist bio"
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   spotify:
 *                     type: string
 *                     example: "https://open.spotify.com/artist/…"
 *                   instagram:
 *                     type: string
 *                     example: "https://instagram.com/artist"
 *                   twitter:
 *                     type: string
 *                     example: "https://twitter.com/artist"
 *                   website:
 *                     type: string
 *                     example: "https://artist-website.com"
 *     responses:
 *       200:
 *         description: Artist profile updated successfully
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
 *                   example: Profile updated
 *                 Data:
 *                   $ref: '#/components/schemas/ArtistProfile'
 *       400:
 *         description: Bad request (invalid payload or user ID)
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Forbidden (user is not an artist)
 */

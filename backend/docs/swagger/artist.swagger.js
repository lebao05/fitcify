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
 * /api/artist/songs:
 *   get:
 *     summary: Get all songs by the artist
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of songs by the artist
 */

/**
 * @swagger
 * /api/artist/songs/{id}:
 *   get:
 *     summary: Get a specific song by ID
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Song ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song details
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
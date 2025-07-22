/**
 * @swagger
 * /api/artist/playlists/{playlistId}:
 *   get:
 *     summary: Get playlist by id
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist id
 *     responses:
 *       200:
 *         description: Playlist info
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
 *                   $ref: '#/components/schemas/Playlist'
 *       404:
 *         description: Playlist not found
 */
  /**
   * @swagger
   * /api/artist/playlists/me:
   *   get:
   *     summary: Get Playlists by Artist
   *     tags: [Artist]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Danh sách playlist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Playlist'
   *       401:
   *         description: Unauthorized
   */

  /**
   * @swagger
   * /api/artist/playlists:
   *   post:
   *     summary: Create a new playlist
   *     tags: [Artist]
   *     consumes:
   *       - multipart/form-data
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - songIds
   *             properties:
   *               name:
   *                 type: string
   *                 description: Playlist name
   *               description:
   *                 type: string
   *                 description: Playlist description (optional)
   *               songIds:
   *                 type: string
   *                 description: JSON array hoặc mảng các songId (ít nhất 1, tối đa 100)
   *                 example: '["songId1","songId2"]'
   *               coverImage:
   *                 type: string
   *                 format: binary
   *                 description: Playlist cover image (optional)
   *     responses:
   *       200:
   *         description: Playlist created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DefaultResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */

  /**
   * @swagger
   * /api/artist/playlists/{playlistId}:
   *   patch:
   *     summary: Update playlist metadata (name, description, coverImage, songIds)
   *     tags: [Artist]
   *     consumes:
   *       - multipart/form-data
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: playlistId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the playlist to update
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: New playlist name (optional)
   *               description:
   *                 type: string
   *                 description: New playlist description (optional)
   *               songIds:
   *                 type: string
   *                 description: JSON array hoặc mảng các songId mới cho playlist (ít nhất 1, tối đa 100)
   *                 example: '["songId1","songId2"]'
   *               coverImage:
   *                 type: string
   *                 format: binary
   *                 description: New playlist cover image (optional)
   *     responses:
   *       200:
   *         description: Playlist metadata updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DefaultResponse'
   *       400:
   *         description: Validation error or no metadata changes
   *       401:
   *         description: Unauthorized
   */

  /**
   * @swagger
   * /api/artist/playlists/{playlistId}:
   *   delete:
   *     summary: Delete a playlist
   *     tags: [Artist]
   *     parameters:
   *       - in: path
   *         name: playlistId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the playlist to delete
   *     responses:
   *       200:
   *         description: Playlist deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DefaultResponse'
   *       400:
   *         description: Bad request or unauthorized
   */

/**
 * @swagger
 * /api/artist/albums/{albumId}:
 *   get:
 *     summary: Get album by id
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Album id
 *     responses:
 *       200:
 *         description: Album info
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
 *                   $ref: '#/components/schemas/Album'
 *       404:
 *         description: Album not found
 */

 /**
 * @swagger
 * /api/artist/albums/me:
 *   get:
 *     summary: Get Albums by Artist
 *     tags:
 *       - Artist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách album
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Album'
 *       401:
 *         description: Unauthorized
 */

 /**
 * @swagger
 * /api/artist/albums:
 *   post:
 *     summary: Create a new album
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
 *               - songIds
 *             properties:
 *               title:
 *                 type: string
 *                 description: Album name
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: Release date (optional)
 *               description:
 *                 type: string
 *                 description: Album description (optional)
 *               songIds:
 *                 type: string
 *                 description: JSON array hoặc mảng các songId (ít nhất 1, tối đa 30)
 *                 example: '["songId1","songId2"]'
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Album cover image (optional)
 *     responses:
 *       200:
 *         description: Album created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

 
/**
 * @swagger
 * /api/artist/albums/{albumId}:
 *   patch:
 *     summary: Update album metadata (title, description, releaseDate, coverImage, songIds) - only when status is 'draft'
 *     tags: [Artist]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the album to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New album name (optional)
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: New release date (optional)
 *               description:
 *                 type: string
 *                 description: New album description (optional)
 *               songIds:
 *                 type: string
 *                 description: JSON array hoặc mảng các songId mới cho album (ít nhất 1, tối đa 30, chỉ nhận bài hát thuộc artist)
 *                 example: '["songId1","songId2"]'
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: New album cover image (optional)
 *     responses:
 *       200:
 *         description: Album metadata updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *       400:
 *         description: Validation error or no metadata changes
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/artist/albums/{albumId}:
 *   delete:
 *     summary: Delete an album
 *     tags: [Artist]
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the album to delete
 *     responses:
 *       200:
 *         description: Album deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *       400:
 *         description: Bad request or unauthorized
 */


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

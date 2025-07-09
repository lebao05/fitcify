/**
 * @swagger
 * tags:
 *   name: Songs
 *   description: Endpoints for artists to manage their songs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *           description: Duration in seconds
 *         audioUrl:
 *           type: string
 *         imageUrl:
 *           type: string
 *         albumId:
 *           type: string
 *           nullable: true
 *         isApproved:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/songs:
 *   post:
 *     summary: Create a new song
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - duration
 *               - audioUrl
 *             properties:
 *               title:
 *                 type: string
 *               duration:
 *                 type: number
 *                 description: Duration in seconds
 *               audioUrl:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 description: Optional cover image URL
 *               albumId:
 *                 type: string
 *                 description: Optional album ID
 *     responses:
 *       201:
 *         description: Song created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/listsongs:
 *   get:
 *     summary: Get all songs created by the authenticated artist
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the artist's songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */

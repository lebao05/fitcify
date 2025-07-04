/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes (email, OTP, Google, Facebook)
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: P@ssw0rd
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *     responses:
 *       201:
 *         description: User created
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: P@ssw0rd
 *               remember:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Logged in, accessToken set in cookie
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and clear cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get currently logged-in user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user info
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/otp/login/send:
 *   post:
 *     summary: Send OTP for login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: OTP sent to email
 */

/**
 * @swagger
 * /api/auth/otp/login/verify:
 *   post:
 *     summary: Verify OTP for login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *               remember:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Logged in with OTP
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /api/auth/otp/forgot/send:
 *   post:
 *     summary: Send OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: OTP sent to email
 */

/**
 * @swagger
 * /api/auth/otp/forgot/verify:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *               remember:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: OTP verified, accessToken issued
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               newPassword:
 *                 type: string
 *                 example: NewSecurePass123!
 *     responses:
 *       200:
 *         description: Password changed
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Start Google OAuth 2 login
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: redirect
 *         schema:
 *           type: string
 *           format: uri
 *           example: http://localhost:5173/home
 *         required: false
 *         description: >
 *           Where to send the user **after** successful login.<br/>
 *           Must be URL‑encoded (e.g. `redirect=http%3A%2F%2Flocalhost%3A5173%2Fhome`).
 *       - in: query
 *         name: redirectUrl
 *         schema:
 *           type: string
 *           format: uri
 *         required: false
 *         description: Alias of **redirect** (either name is accepted).
 *     responses:
 *       302:
 *         description: Redirects to Google consent screen
 */


/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google login callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect back to client
 */

/**
 * @swagger
 * /api/auth/facebook:
 *   get:
 *     summary: Redirect to Facebook login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Facebook OAuth
 */

/**
 * @swagger
 * /api/auth/facebook:
 *   get:
 *     summary: Start Facebook OAuth 2 login
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: redirect
 *         schema:
 *           type: string
 *           format: uri
 *           example: http://localhost:5173/home
 *         required: false
 *         description: >
 *           Where to send the user **after** successful login.<br/>
 *           Must be URL‑encoded.
 *       - in: query
 *         name: redirectUrl
 *         schema:
 *           type: string
 *           format: uri
 *         required: false
 *         description: Alias of **redirect**.
 *     responses:
 *       302:
 *         description: Redirects to Facebook consent screen
 */

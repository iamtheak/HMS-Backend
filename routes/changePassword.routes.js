const express = require("express");
const router = express.Router();
const { changePassword } = require("../controllers/changePassword.controller");
const { jwtAuthMiddleware } = require('../jwt');


/**
 * @swagger
 * /api/change-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Change user password
 *     description: Change user password by providing old and new password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized, invalid token
 *       '404':
 *         description: User not found
 */

router.post("/change-password", jwtAuthMiddleware ,changePassword);

module.exports = router;
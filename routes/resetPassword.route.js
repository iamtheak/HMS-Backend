const express = require("express");
const router = express.Router();
const { resetPassword } = require("../controllers/resetPassword.controller");

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset user password
 *     description: Reset user password without email verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset successful
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: User not found
 */

router.post("/reset-password", resetPassword);

module.exports = router;
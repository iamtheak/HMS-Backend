const express = require("express");
const router = express.Router();
const { login } = require("../controllers/login.controller");


/**
 * @swagger

 * /api/login:
 *   post:
 *      tags:
 *        - Auth
 *      summary: Login user
 *      description:  Login for new user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/Login'
 *      responses:
 *          '201':
 *              description: User Logged in successfully
 *          '400':
 *              description: Bad request
 */


router.post("/login", login);
module.exports = router;
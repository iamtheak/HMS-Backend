const express = require("express");
const router = express.Router();
const { login } = require("../controllers/loginAuth");


/**
 * @swagger

 * /api/login:
 *   post:
 *      tags:
 *        - UserLogin
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
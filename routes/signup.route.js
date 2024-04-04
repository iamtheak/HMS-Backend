const express = require('express');
const router = express.Router();
// const { getUsers, createUser } = require('../controllers/auth.controller'); // GET
const { createUserValidator } = require('../validators/signup.validator');
const { createUser } = require('../controllers/signup.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       $ref: '#/components/schemas/User'
 *
 * /signup:
 *   post:
 *      tags:
 *        - UserSignup
 *      summary: Create a new user
 *      description: Endpoint to create a new user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/User'
 *      responses:
 *          '201':
 *              description: User created successfully
 *          '400':
 *              description: Bad request
 */

// router.get('/', getUsers);

// POST route for user signup
router.post('/signup', createUserValidator, createUser);

module.exports = router;
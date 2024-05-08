const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const feedbackValidator = require('../validators/feedback.validator');
const { jwtAuthMiddleware } = require('../jwt');

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: API endpoints for feedback
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: Feedback message.
 */


/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved feedback
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get('/feedback', jwtAuthMiddleware, feedbackController.getAllFeedback);

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Submit feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       '201':
 *         description: Feedback submitted successfully
 *       '400':
 *         description: Bad request
 */
router.post('/feedback', jwtAuthMiddleware, feedbackValidator.validateFeedback, feedbackController.createFeedback);

/**
 * @swagger
 * /api/feedback/respond:
 *   post:
 *     summary: Respond to feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the feedback to respond to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *                 description: Admin response to the feedback.
 *     responses:
 *       '200':
 *         description: Response added successfully
 *       '400':
 *         description: Bad request
 *       '403':
 *         description: Unauthorized
 *       '404':
 *         description: Feedback not found
 *       '500':
 *         description: Internal server error
 */

router.post('/feedback/respond', jwtAuthMiddleware, feedbackController.respondToFeedback);

module.exports = router;
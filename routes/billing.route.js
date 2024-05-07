const express = require('express');
const router = express.Router();

const { jwtAuthMiddleware } = require("../jwt");

const billingController = require('../controllers/billing.controller');
const { rentPaymentValidator, salaryPaymentValidator } = require('../validators/updatePaymentStatus.validator');

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: API endpoints for managing billing
 */

// GET route to get rent payment details
/**
 * @swagger
 * /api/billing/rent:
 *   get:
 *     summary: Retrieve rent payment details
 *     tags: [Billing]
 *     responses:
 *       '200':
 *         description: Rent Payment Details
 *       '500':
 *         description: Internal server error
 */

router.get('/billing/rent', jwtAuthMiddleware, billingController.getRentPayments);

// GET route to get salary payment details
/**
 * @swagger
 * /api/billing/salary:
 *   get:
 *     summary: Retrieve salary payment details
 *     tags: [Billing]
 *     responses:
 *       '200':
 *         description: Salary Payment Details
 *       '500':
 *         description: Internal server error
 */

router.get('/billing/salary', jwtAuthMiddleware, billingController.getSalaryPayments);

// POST route to update rent payment status
/**
 * @swagger
 * /api/billing/rent:
 *   post:
 *     summary: Update rent payment status
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user whose payment status needs to be updated
 *               newStatus:
 *                 type: string
 *                 description: The new payment status ('Pending', 'Up-to-date')
 *     responses:
 *       '200':
 *         description: Payment status updated successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

router.post('/billing/rent', jwtAuthMiddleware, rentPaymentValidator, billingController.postRentPaymentStatus);

// POST route to update salary payment status
/**
 * @swagger
 * /api/billing/salary:
 *   post:
 *     summary: Update salary payment status
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               staffId:
 *                 type: number
 *                 description: The staff ID of the user whose payment status needs to be updated
 *               newStatus:
 *                 type: string
 *                 description: The new payment status ('Pending', 'Up-to-date')
 *     responses:
 *       '200':
 *         description: Payment status updated successfully
 *       '404':
 *         description: Staff not found
 *       '500':
 *         description: Internal server error
 */


router.post('/billing/salary', jwtAuthMiddleware, salaryPaymentValidator, billingController.postSalaryPaymentStatus);

module.exports = router;

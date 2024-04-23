const express = require('express');
const router = express.Router();

const billingController = require('../controllers/billing.controller');

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

router.get('/billing/rent', billingController.getRentPayments);

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

router.get('/billing/salary', billingController.getSalaryPayments);

module.exports = router;

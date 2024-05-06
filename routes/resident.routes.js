const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");
const residentController = require('../controllers/resident.controller');

/**
 * @swagger
 * tags:
 *   name: Resident
 *   description: API endpoints for managing resident information
 */

/**
 * @swagger
 * /api/resident:
 *   get:
 *     summary: Get all resident information or information of a specific resident
 *     tags: [Resident]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: false
 *         description: Username of the resident whose information is to be retrieved. If not provided, information of all residents will be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '404':
 *         description: Allocation or user not found
 *       '500':
 *         description: Internal server error
 */
router.get("/resident", jwtAuthMiddleware, residentController.getResidentInfo);

module.exports = router;
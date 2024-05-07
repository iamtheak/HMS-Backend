const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");
const residentController = require('../controllers/residentInfo.controller');

/**
 * @swagger
 * tags:
 *   name: Information
 *   description: API endpoints for managing residentInfo and staff information
 */

/**
 * @swagger
 * /api/residentInfo:
 *   get:
 *     summary: Get all residentInfo information or information of a specific resident
 *     tags: [Information]
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

router.get("/residentInfo", jwtAuthMiddleware, residentController.getResidentInfo);

module.exports = router;
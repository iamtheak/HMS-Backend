const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');

// Swagger documentation for the /api/dashboard endpoint
/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Fetch dashboard contents
 *     description: Fetches total number of residents, staffs, and rooms.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Dahboard displayed successfully
 *         schema:
 *           type: object
 *           properties:
 *             totalResidents:
 *               type: integer
 *               description: Total number of residents
 *             totalStaff:
 *               type: integer
 *               description: Total number of staff
 *             totalRooms:
 *               type: integer
 *               description: Total number of rooms
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */


// GET route for dashboard contents
router.get('/dashboard', dashboardController.fetchDashboardContents);

module.exports = router;
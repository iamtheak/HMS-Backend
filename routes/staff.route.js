const express = require("express");
const router = express.Router();

const staffController = require('../controllers/staff.controller');

/**
 * @swagger
 * tags:
 *   name: Staffs
 *   description: API endpoints for managing staffs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       required:
 *         - username
 *         - staffId
 *         - role
 *         - firstName
 *         - middleName
 *         - lastName
 *         - email
 *         - phone
 *         - citizenshipNo
 *         - password 
 *       properties:
 *         username:
 *           type: string
 *           description: Staff's username
 *         staffId:
 *           type: integer
 *           description: Unique identifier for the Staff.
 *         role:
 *           type: string
 *           description: Staff's role
 *         firstName:
 *           type: string
 *           description: Staff's first name
 *         middleName:
 *           type: string
 *           description: Staff's middle name
 *         lastName:
 *           type: string
 *           description: Staff's last name
 *         email:
 *           type: string
 *           description: Staff's email address
 *         phone:
 *           type: number
 *           description: Staff's phone number
 *         citizenshipNo:
 *           type: string
 *           description: Staff's citizenship number
 *         password:
 *           type: string
 *           description: Staff's password
 */

/**
 * @swagger
 * /api/staffs:
 *   get:
 *     summary: Retrieve all staffs
 *     tags: [Staffs]
 *     responses:
 *       '200':
 *         description: A list of Staffs
 *       '500':
 *         description: Internal server error
 */
router.get("/staffs", staffController.getAllStaffs);

/**
 * @swagger
 * /api/staffs/{staffId}:
 *   get:
 *     summary: Retrieve a single staff by ID
 *     tags: [Staffs]
 *     parameters:
 *       - in: path
 *         name: staffId
 *         description: ID of the staff to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A single Staff
 *       '404':
 *         description: Staff not found
 *       '500':
 *         description: Internal server error
 */
router.get("/staffs/:staffId", staffController.getOneStaff);


/**
 * @swagger
 * /api/staffs:
 *   post:
 *     summary: Add a new staff
 *     tags: [Staffs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       '201':
 *         description: Staff added successfully
 *       '400':
 *         description: Bad request
 */
router.post("/staffs", staffController.addStaff);

/**
 * @swagger
 * /api/staffs/{staffId}:
 *   put:
 *     summary: Update a staff
 *     tags: [Staffs]
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         description: ID of the staff to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       '200':
 *         description: Staff updated successfully
 *       '404':
 *         description: Staff not found
 *       '400':
 *         description: Bad request
 */
router.put("/staffs/:staffId", staffController.updateStaff);

/**
 * @swagger
 * /api/staffs/{staffId}:
 *   delete:
 *     summary: Delete a staff
 *     tags: [Staffs]
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         description: ID of the staff to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Staff deleted successfully
 *       '404':
 *         description: Staff not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/staffs/:staffId", staffController.deleteStaff);

module.exports = router;
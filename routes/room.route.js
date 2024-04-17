const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");
const roomController = require('../controllers/room.Controller');
const roomValidator = require('../validators/addroom.validator');
const updateRoomValidator = require('../validators/updateRoom.validator');

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: API endpoints for managing rooms
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - price
 *         - occupancy
 *       properties:
 *         price:
 *           type: number
 *           description: Price of the room.
 *         occupancy:
 *           type: integer
 *           description: Number of people that can occupy the room.
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Retrieve all rooms or a single room by roomId
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: integer
 *         description: Optional. ID of the room to retrieve.
 *     responses:
 *       '200':
 *         description: Room data retrieved successfully
 *       '404':
 *         description: Room not found
 *       '500':
 *         description: Internal server error
 */
router.get("/rooms", roomController.getAllRooms);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       '201':
 *         description: Room created successfully
 *       '400':
 *         description: Bad request
 */
router.post("/rooms", jwtAuthMiddleware, roomValidator.validateCreateRoom, roomController.createRoom);

/**
 * @swagger
 * /api/rooms/{roomId}:
 *   put:
 *     summary: Update a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: ID of the room to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       '200':
 *         description: Room updated successfully
 *       '404':
 *         description: Room not found
 *       '400':
 *         description: Bad request
 */
router.put("/rooms/:roomId", jwtAuthMiddleware, updateRoomValidator.validateUpdateRoom, roomController.updateRoom);

/**
 * @swagger
 * /api/rooms/{roomId}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: ID of the room to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Room deleted successfully
 *       '404':
 *         description: Room not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/rooms/:roomId", jwtAuthMiddleware, roomController.deleteRoom);

module.exports = router;
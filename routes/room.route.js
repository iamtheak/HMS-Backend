const express = require("express");
const router = express.Router();

const roomController = require('../controllers/room.controller');

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
 *         - roomId
 *         - price
 *         - occupancy
 *       properties:
 *         roomId:
 *           type: integer
 *           description: Unique identifier for the room.
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
 *     summary: Retrieve all rooms
 *     tags: [Rooms]
 *     responses:
 *       '200':
 *         description: A list of rooms
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
router.post("/rooms", roomController.createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the room to update
 *         schema:
 *           type: string
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
router.put("/rooms/:id", roomController.updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the room to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Room deleted successfully
 *       '404':
 *         description: Room not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/rooms/:id", roomController.deleteRoom);

module.exports = router;
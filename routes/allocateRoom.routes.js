const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");
const allocateRoomController = require('../controllers/allocateRoom.controller');

/**
 * @swagger
 * tags:
 *   name: RoomAllocation
 *   description: API endpoints for allocating rooms to users
 */


/**
 * @swagger
 * /api/allocated-rooms:
 *   get:
 *     summary: Get allocated rooms based on username or roomId
 *     tags: [RoomAllocation]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: false
 *         description: Username of the user whose allocation is to be retrieved
 *         schema:
 *           type: string
 *       - in: query    
 *         name: roomId
 *         required: false
 *         description: Room ID for which allocations are to be retrieved
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '404':
 *         description: No allocations found
 *       '500':
 *         description: Internal server error
 */

router.get("/allocated-rooms", jwtAuthMiddleware , allocateRoomController.getAllAllocatedRooms);

/**
 * @swagger
 * /api/allocate-room:
 *   post:
 *     summary: Allocate a room to a user
 *     tags: [RoomAllocation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               roomId:
 *                 type: number
 *             example:
 *               username: user123
 *               roomId: 1
 *     responses:
 *       '201':
 *         description: Room allocated successfully
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: User or room not found
 *       '500':
 *         description: Internal server error
 */
router.post("/allocate-room", jwtAuthMiddleware ,allocateRoomController.allocateRoom);

/**
 * @swagger
 * /api/allocate-room/{username}:
 *   put:
 *     summary: Update the room allocated to a user
 *     tags: [RoomAllocation]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user whose room is to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: number
 *             example:
 *               roomId: 2
 *     responses:
 *       '200':
 *         description: Room reallocated successfully
 *       '404':
 *         description: Allocation not found for the user
 *       '500':
 *         description: Internal server error
 */
router.put("/allocate-room/:username", jwtAuthMiddleware , allocateRoomController.updateAllocateRoom);

/**
 * @swagger
 * /api/allocate-room/{username}:
 *   delete:
 *     summary: Delete the allocation for a user
 *     tags: [RoomAllocation]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user whose allocation is to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Allocation deleted successfully
 *       '500':
 *         description: Internal server error
 */
router.delete("/allocate-room/:username", jwtAuthMiddleware, allocateRoomController.deleteAllocateRoom);

module.exports = router;
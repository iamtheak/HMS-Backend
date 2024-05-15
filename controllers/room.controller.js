const Room = require('../models/rooms');
const Allocation = require('../models/allocateRoom.model');

// Controller actions
exports.getAllRooms = async (req, res) => {
    try {
        if (req.query.roomId) {
            // If roomId is provided, retrieve a single room by roomId
            const room = await Room.findOne({ roomId: req.query.roomId });
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }
            res.json({ message: 'Room details retrieved successfully', room });
        } else {
            // If no roomId is provided, retrieve all rooms
            const rooms = await Room.find();
            res.json({ message: 'All rooms', rooms });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRoom = async (req, res) => {
    const { roomId, price, occupancy } = req.body;

    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
        }

        let newRoomId;

        if (!roomId) {
            // If roomId is not provided, get the next available roomId
            const nextRoomId = await Room.getNextRoomId();
            newRoomId = nextRoomId;
        } else {
            // If roomId is provided, check if it already exists
            const existingRoom = await Room.findOne({ roomId });
            
            if (existingRoom) {
                return res.status(400).json({ message: 'Room ID already taken. Please select another room ID.' });
            }
            newRoomId = roomId;
        }

        // Create a new room
        const room = new Room({
            roomId: newRoomId,
            price,
            occupancy
        });

        const newRoom = await room.save();
        res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
        }

        const room = await Room.findOne({ roomId: req.params.roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if room details are not changed
        if (
            req.body.roomId === room.roomId &&
            req.body.price === room.price &&
            req.body.occupancy === room.occupancy
        ) {
            return res.status(400).json({ message: 'No changes in the room details' });
        }

        // Update room details
        if (req.body.price != null) {
            room.price = req.body.price;
        }

        if (req.body.occupancy != null) {
            room.occupancy = req.body.occupancy;
        }

        const updatedRoom = await room.save();
        res.json({ message: 'Room updated successfully', updatedRoom });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
        }

        const room = await Room.findOne({ roomId: req.params.roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Delete allocations associated with the room
        await Allocation.deleteMany({ roomId: room.roomId });

        // Delete the room
        await Room.deleteOne({ roomId: req.params.roomId });

        res.json({ message: 'Room and associated allocations deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
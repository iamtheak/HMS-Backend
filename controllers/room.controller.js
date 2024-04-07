const Room = require('../models/rooms');
const jwt = require('../jwt')

// Controller actions
exports.getAllRooms = async (req, res) => {
    try {

        
        
        const rooms = await Room.find();
        res.json({ message: "All Rooms", rooms: rooms });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRoom = async (req, res) => {
    const { roomId, price, occupancy } = req.body;

    try {
        let newRoomId;

        if (!roomId) {
            // If roomId is not provided, get the next available roomId
            const nextRoomId = await Room.getNextRoomId();
            newRoomId = nextRoomId;
        } else {
            // If roomId is provided, check if it already exists
            const existingRoom = await Room.findOne({ roomId });
            console.log(existingRoom);
            
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
        const room = await Room.findById(req.params.id);
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
        if (req.body.roomId != null) {
            room.roomId = req.body.roomId;
        }

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
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: 'Room deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
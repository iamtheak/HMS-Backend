const Allocation = require('../models/allocateRoom.model');
const Room = require('../models/rooms');
const User = require('../models/users');

// Controller actions
exports.getAllAllocatedRooms = async (req, res) => {
    try {
        if (req.query.username) {
            // If username is provided, retrieve a single allocation by username
            const allocation = await Allocation.findOne({ username: req.query.username });
            if (!allocation) {
                return res.status(404).json({ message: 'Allocation not found for the user' });
            }
            res.json({ message: 'Allocation details retrieved successfully', allocation });
        } else if (req.query.roomId) {
            // If roomId is provided, retrieve all allocations for the room
            const allocations = await Allocation.find({ roomId: req.query.roomId });
            if (allocations.length === 0) {
                return res.status(404).json({ message: 'No allocations found for the room' });
            }
            res.json({ message: 'Allocations for the room retrieved successfully', allocations });
        } else {
            // If no username or roomId is provided, retrieve all allocations
            const allocations = await Allocation.find();
            res.json({ message: 'All allocations', allocations });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.allocateRoom = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
        }

        const { username, roomId } = req.body;

        // Check if user and room exist
        const user = await User.findOne({ username });
        const roomExists = await Room.findOne({ roomId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!roomExists) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if the user is already allocated to a room
        const existingAllocation = await Allocation.findOne({ username });

        if (existingAllocation) {
            return res.status(400).json({
                message: `User already allocated to room ${existingAllocation.roomId}`,
            });
        }

        // Check if user role is 'Resident'
        if (user.role !== 'Resident') {
            return res.status(400).json({ message: 'Only Resident can be allocated to a room' });
        }

        // Allocate the room to the user
        const allocation = new Allocation({ username, roomId });
        await allocation.save();

        // Update the user's billing amount with the room price
        user.billing.amount = roomExists.price;
        await user.save();

        res.status(201).json({ message: 'Room allocated successfully', allocation });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateAllocateRoom = async (req, res) => {
    try {
        const { username } = req.params;
        const { roomId } = req.body;
        
        // Find existing allocation
        const existingAllocation = await Allocation.findOne({ username });
        if (!existingAllocation) {
            return res.status(404).json({ message: 'Allocation not found for the user' });
        }

        // Check user role
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
        }

        // Check if new room exists
        const roomExists = await Room.findOne({ roomId });
        if (!roomExists) {
            return res.status(404).json({ message: 'New room not found' });
        }

        // Check if user role is 'Resident'
        const user = await User.findOne({ username });
        if (user.role !== 'Resident') {
            return res.status(400).json({ message: 'Only Resident can be allocated to a room'});
        }

        // Check room occupancy
        const allocatedRoomsCount = await Allocation.countDocuments({ roomId });
        const roomOccupancy = roomExists.occupancy;

        if (allocatedRoomsCount >= roomOccupancy) {
            return res.status(400).json({
                message: `Room occupancy reached its limit. Cannot reallocate user to this room.`,
            });
        }

        // Retrieve the amount related to the new room
        const roomAmount = roomExists.price;

        // Update room for the existing allocation
        existingAllocation.roomId = roomId;
        await existingAllocation.save();

        // Update the user's amount field within the billing object with the new room amount
        user.billing.amount = roomAmount;
        await user.save();

        res.status(200).json({ message: 'Room reallocated successfully', allocation: existingAllocation });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAllocateRoom = async (req, res) => {
    try {
        const { username } = req.params;
        
        // Check if user is allocated to a room
        const allocation = await Allocation.findOne({ username });

        if (!allocation) {
            return res.status(400).json({ message: 'User is not allocated to any room. No action taken.' });
        }
        
        // Retrieve the room price before deleting
        const user = await User.findOne({ username });
        const roomPrice = user.billing.amount;

        // Delete allocation for the user
        await Allocation.deleteOne({ username });

        // Reset the user's amount field within the billing object to its default value
        user.billing.amount = null;
        await user.save();

        // Reset the room price to null
        const room = await Room.findOneAndUpdate({ roomId: allocation.roomId }, { price: null });

        res.status(200).json({ message: 'Allocation deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
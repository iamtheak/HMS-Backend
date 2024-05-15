const Feedback = require('../models/feedback');
const Allocation = require('../models/allocateRoom.model');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../jwt');

exports.getAllResidentInfo = async (req, res) => {
    try {
        // Check if the user is authorized to perform this action
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
        }

        const query = { role: "Resident" }; // Filter to get only residents

        const users = await User.find(query);
        if (users.length === 0) {
            return res.status(404).json({ message: 'No residents found' });
        }

        const residentInfo = [];
        for (const user of users) {
            const allocation = await Allocation.findOne({ username: user.username });
            if (allocation) {
                residentInfo.push({
                    username: user.username,
                    phone: user.phone,
                    citizenshipNo: user.citizenshipNo,
                    roomId: allocation.roomId,
                    firstName: user.firstName,
                    middleName : user.middleName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth,
                    email: user.email
                });
            } else {
                residentInfo.push({
                    username: user.username,
                    phone: user.phone,
                    citizenshipNo: user.citizenshipNo,
                    roomId: 'Not allocated',
                    firstName: user.firstName,
                    middleName : user.middleName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth,
                    email: user.email
                });
            }
        }

        res.json({ message: 'Resident information retrieved successfully', residentInfo });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSingleResidentInfo = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username, role: 'Resident' });
        if (!user) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        const allocation = await Allocation.findOne({ username });
        const residentInfo = {
            username: user.username,
            phone: user.phone,
            citizenshipNo: user.citizenshipNo,
            roomId: allocation ? allocation.roomId : 'Not allocated',
            firstName: user.firstName,
            middleName : user.middleName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            email: user.email
        };

        res.json({ message: 'Resident information retrieved successfully', residentInfo });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateResident = async (req, res) => {
    try {
        if (req.user.role !== 'Resident') {
            return res.status(403).json({ message: 'Unauthorized. Only Resident can perform this action' });
        }

        // Extract username from URL parameters
        const { username } = req.params;

        // Find the resident by username
        const resident = await User.findOne({ username });
        if (!resident) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        // Update resident details if provided in the request body
        const { firstName, middleName, lastName, email, phone, citizenshipNo, dateOfBirth, newUsername } = req.body;

        // Check if all fields are empty
        if (
            !firstName &&
            middleName === undefined &&
            !lastName &&
            !email &&
            !phone &&
            !citizenshipNo &&
            !dateOfBirth &&
            newUsername === undefined
        ) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        let newToken;

        if (firstName !== undefined) {
            resident.firstName = firstName;
        }
        if (middleName !== undefined) {
            resident.middleName = middleName;
        }
        if (lastName !== undefined) {
            resident.lastName = lastName;
        }
        if (email !== undefined) {
            resident.email = email;
        }
        if (phone !== undefined) {
            resident.phone = phone;
        }
        if (citizenshipNo !== undefined) {
            resident.citizenshipNo = citizenshipNo;
        }
        if (dateOfBirth !== undefined) {
            resident.dateOfBirth = dateOfBirth;
        }
        if (newUsername !== undefined && newUsername !== resident.username) {
            // Check if the new username is available
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already in use' });
            }
            resident.username = newUsername;

            // Generate a new token with updated user information
            newToken = generateToken({
                username: newUsername,
                role: req.user.role,
                email: req.user.email,
            });
        }

        // Save the updated resident
        await resident.save();

        // Send the response with or without new token
        if (newToken) {
            res.json({ message: 'Resident updated successfully', newToken });
        } else {
            res.json({ message: 'Resident updated successfully' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteResident = async (req, res) => {
    try {
        // Check if the user is authorized to perform this action
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
        }

        // Extract username from URL parameters
        const { username } = req.params;

        // Check if a resident with the provided username exists
        const resident = await User.findOne({ username, role: 'Resident' });
        if (!resident) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        // Delete the resident user
        await User.findOneAndDelete({ username, role: 'Resident' });

        // Delete allocated rooms for the deleted resident
        await Allocation.deleteMany({ username });

        // Delete feedback sent by the deleted resident
        await Feedback.deleteMany({ residentUsername: username });

        // Return success message
        res.json({ message: 'Resident deleted successfully'});
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};
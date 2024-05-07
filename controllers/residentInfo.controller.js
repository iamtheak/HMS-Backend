const Allocation = require('../models/allocateRoom.model');
const User = require('../models/users');

// Controller action to get resident information along with allocated room details
exports.getResidentInfo = async (req, res) => {
    try {

        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
        }

        const { username } = req.query;

        let query = { role: "Resident" }; // Filter to get only residents
        // If a username is provided, add it to the query
        if (username) {
            query.username = username;
        }
        // Find the user details
        const users = await User.find(query);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare resident information with allocated room details or 'Not allocated' if no allocation exists
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
                    lastName: user.lastName,
                    dateOfBirth : user.dateOfBirth
                });
            } else {
                residentInfo.push({
                    username: user.username,
                    phone: user.phone,
                    citizenshipNo: user.citizenshipNo,
                    roomId: 'Not allocated',
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth : user.dateOfBirth
                });
            }
        }

        res.json({ message: 'Resident information retrieved successfully', residentInfo });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller action to update resident details
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

        // Check if any fields are provided in the request body
        const { firstName, middleName, lastName, email, phone, citizenshipNo, dateOfBirth, newUsername } = req.body;
        if (!firstName && middleName === undefined && !lastName && !email && !phone && !citizenshipNo && !dateOfBirth && newUsername === undefined) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        // Check if the provided values are the same as the current values in the database
        if (
            firstName === resident.firstName &&
            middleName === resident.middleName &&
            newUsername === resident.username &&
            lastName === resident.lastName &&
            email === resident.email &&
            phone === resident.phone &&
            citizenshipNo === resident.citizenshipNo &&
            dateOfBirth === resident.dateOfBirth
        ) {
            return res.status(400).json({ message: 'No changes detected' });
        }

        // Check if newUsername is the same as the username parameter
        if (newUsername !== undefined && newUsername === username) {
            return res.status(400).json({ message: 'Username is the same as the existing username. No update needed.' });
        }

        // Update resident details if provided in the request body
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
        }

        // Save the updated resident
        const updatedResident = await resident.save();
        res.json({ message: 'Resident updated successfully' });
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

        // Return success message
        res.json({ message: 'Resident deleted successfully' });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};
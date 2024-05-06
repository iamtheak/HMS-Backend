const Allocation = require('../models/allocateRoom.model');
const User = require('../models/users');

// Controller action to get resident information along with allocated room details
exports.getResidentInfo = async (req, res) => {
    try {
        const { username } = req.query;

        let query = { role: "Resident" }; // Filter to get only residents

        // If a username is provided, add it to the query
        if (username) {
            query.username = username;
        }

        // Find the user details
        const users = await User.find(query);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User(s) not found' });
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
                    roomId: allocation.roomId
                });
            } else {
                residentInfo.push({
                    username: user.username,
                    phone: user.phone,
                    citizenshipNo: user.citizenshipNo,
                    roomId: 'Not allocated'
                });
            }
        }

        res.json({ message: 'Resident information retrieved successfully', residentInfo });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
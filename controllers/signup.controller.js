const User = require('../models/users');

exports.createUser = async (req, res) => {
    try {
        // extract user data from the request body
        const { username, firstName, middleName,lastName, email, phone, citizenshipNo, password, dateOfBirth,staffId } = req.body;

        // calculate the nextPayDate as joinedDate + 1 month
        const joinedDate = new Date(); // current date
        const nextPayDate = new Date(joinedDate.getFullYear(), joinedDate.getMonth() + 1, joinedDate.getDate());

        // create a new user instance using the User model
        const newUser = new User({
            username,
            role: "Resident",
            firstName,
            middleName,
            lastName,
            email,
            phone,
            citizenshipNo,
            password,
            dateOfBirth,
            staffId,
            joinedDate,
            billing: {
                nextPayDate, // set the nextPayDate as calculated
                status: "Pending" // set status as Pending by default
            }
        });

        // save the new user to the database
        const savedUser = await newUser.save();

        // send a success response
        res.status(201).json({ message: 'User signed up successfully', user: savedUser });
    } catch (error) {
        console.error('Error creating user:', error);
        // send an error response
        res.status(500).json({ error: 'Server error' });
    }
};

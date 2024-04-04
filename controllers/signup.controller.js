const User = require('../models/users');

exports.createUser = async (req, res) => {
    try {
        // extract user data from the request body
        const { username, role, firstName, middleName,lastName, email, phone, citizenshipNo, password, dateOfBirth } = req.body;

        // create a new user instance using the User model
        const newUser = new User({
            username,
            role,
            firstName,
            middleName,
            lastName,
            email,
            phone,
            citizenshipNo,
            password,
            dateOfBirth
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

// // Create using POSTMAN
// exports.createUser = async (req, res) => {
//     const user = new User(req.body);
//     const result = await user.save();
//     res.status(200).json({
//         user: result
//     });
// };

// GET
// exports.getUsers = (req, res) => {
//     User.find() // Use the User model to find all users
//         // .select("_id title body")
//         .then(users => {
//             res.status(200).json({ users: users }); // Send the found users as JSON response
//         })
//         .catch(err => {
//             console.error(err); // Log any errors that occur
//             res.status(500).json({ error: 'Server error' }); // Respond with a 500 status for server errors
//         });
// };

const { generateToken } = require("../jwt");
const User = require("../models/login");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Login not successful",
                error: "User not found",
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Login not successful",
                error: "Incorrect password",
            });
        }

        // If email and password match, generate a JWT token
        const tokenPayload = {
            email: user.email,
            username: user.username,
            role: user.role,
            staffId: user.staffId 
        };
        const token = generateToken(tokenPayload);

        // Send the token in response
        res.status(200).json({
            message: "Login successful",
            token: token
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};
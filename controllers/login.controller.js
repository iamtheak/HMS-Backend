const User = require("../models/login");
const { generateToken } = require("../jwt"); // Import generateToken function

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
        const token = generateToken({ email: user.email });

        // Send the token in response
        res.status(200).json({
            message: "Login successful",
            token: token // Send the generated token in the response
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};

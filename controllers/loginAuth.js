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

      res.status(200).json({
        message: "Login successful",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({
        message: "An error occurred",
        error: error.message,
      });
    }
};
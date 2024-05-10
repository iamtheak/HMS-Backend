const User = require("../models/login");

exports.changePassword = async (req, res) => {
  try {
    const { username } = req.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check if the old password matches
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from the old password"});
    }

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match"});
    }

    // Validate the new password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,30}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "Password must be between 8 to 30 characters with at least one letter and one number"});
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found"});
    }

    // Check if the old password matches
    if (oldPassword !== user.password) {
      return res.status(400).json({ message: "Old password is incorrect"});
    }

    // Update user's password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "An error occurred", error: error.message });
  }
};
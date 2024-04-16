const Feedback = require('../models/feedback');

exports.createFeedback = async (req, res) => {
    try {

        if (req.user.role !== 'Resident') {
            return res.status(403).json({ success: false, message: 'Unauthorized. Resident access required.' });
        }

        const { message } = req.body;
        const residentUsername = req.user.username;
        
        // Check if the same feedback message exists for the same resident username
        const existingFeedback = await Feedback.findOne({ residentUsername, message });
        if (existingFeedback) {
            return res.status(400).json({ success: false, message: 'Feedback message already exists' });
        }

        const feedback = new Feedback({
            residentUsername,
            message
        });

        const newFeedback = await feedback.save();
        res.status(201).json({ success: true, message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to submit feedback', error: error.message });
    }
};

exports.getAllFeedback = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized. Admin access required.' });
        }

        const feedbacks = await Feedback.find();
        res.status(200).json({ success: true, feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch feedback', error: error.message });
    }
};
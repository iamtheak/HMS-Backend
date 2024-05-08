const Feedback = require('../models/feedback');

exports.getAllFeedback = async (req, res) => {
    try {
        if (req.user.role === 'Admin') {
            const feedbacks = await Feedback.find();
            res.status(200).json({ success: true, feedbacks });
        } else if (req.user.role === 'Resident') {
            const residentUsername = req.user.username;
            const feedbacks = await Feedback.find({ residentUsername });
            if (feedbacks.length === 0) {
                res.status(200).json({ success: true, message: 'No feedback available for the user' });
            } else {
                res.status(200).json({ success: true, feedbacks });
            }
        } else {
            res.status(403).json({ success: false, message: 'Unauthorized access' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch feedback', error: error.message });
    }
};

exports.createFeedback = async (req, res) => {
    try {
        if (req.user.role !== 'Resident') {
            return res.status(403).json({ success: false, message: 'Unauthorized. Resident access required.' });
        }

        const { message } = req.body;
        const residentUsername = req.user.username;

        // Generate the next auto-incremented feedback ID
        const feedbackId = await Feedback.getNextFeedbackId();
        
        const feedback = new Feedback({
            feedbackId,
            residentUsername,
            message
        });

        const newFeedback = await feedback.save();
        res.status(201).json({ success: true, message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to submit feedback', error: error.message });
    }
};

exports.respondToFeedback = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized. Admin access required.' });
        }

        const { feedbackId } = req.query;
        const { response } = req.body;

        if (!feedbackId) {
            return res.status(400).json({ success: false, message: 'feedbackId must be provided' });
        }

        const feedback = await Feedback.findOne({ feedbackId });

        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        feedback.adminResponse = response;
        await feedback.save();

        res.status(200).json({ success: true, message: 'Response added successfully', feedback });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to add response', error: error.message });
    }
};
exports.validateFeedback = (req, res, next) => {
    const { message } = req.body;

    // Check if message is empty
    if (!message || message.trim().length === 0) {
        return res.status(400).json({ message: 'Feedback message cannot be empty' });
    }

    // Check if message exceeds 1000 words
    const wordCount = message.trim().split(/\s+/).length;
    if (wordCount > 100) {
        return res.status(400).json({ message: 'Feedback message cannot exceed 100 words' });
    }

    next();
};

exports.validateAdminResponse = (req, res, next) => {
    const { response } = req.body;

    // Check if response is empty
    if (!response || response.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Response message cannot be empty' });
    }

    next();
};
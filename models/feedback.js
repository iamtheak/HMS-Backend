const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    feedbackId: {
        type: Number,
        unique: true,
        required: true
    },
    residentUsername: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    adminResponse: {
        type: String, 
        default: null
    }
}, { collection: "Feedbacks" });

// Custom function to generate auto-incremented feedbackId
feedbackSchema.statics.getNextFeedbackId = async function () {
    const lastFeedback = await this.findOne({}, {}, { sort: { 'feedbackId': -1 } });
    if (lastFeedback) {
        return lastFeedback.feedbackId + 1;
    } else {
        return 1; // Starting from 1 if no feedbacks exist yet
    }
};

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
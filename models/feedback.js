const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    residentUsername: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { collection: "Feedbacks" });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
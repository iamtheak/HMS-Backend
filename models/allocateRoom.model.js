const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    roomId: {
        type: Number,
        required: true
    }
},
{collection:"Allocations"}
);

const Allocation = mongoose.model('Allocation', allocationSchema);

module.exports = Allocation;
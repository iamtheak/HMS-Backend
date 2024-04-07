const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: Number,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    occupancy: {
        type: Number,
        required: true
    }    
},
{collection:"Rooms"}
);


// Custom function to generate auto-incremented roomId
roomSchema.statics.getNextRoomId = async function () {
    const lastRoom = await this.findOne({}, {}, { sort: { 'roomId': -1 } });
    if (lastRoom) {
        return lastRoom.roomId + 1;
    } else {
        return 1; // Starting from 1 if no rooms exist yet
    }
};

const Room = mongoose.model('Rooms', roomSchema);

module.exports = Room;
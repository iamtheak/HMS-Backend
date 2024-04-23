const mongoose = require('mongoose');

// define Maintenance schema
const maintenanceSchema = new mongoose.Schema({
    maintenanceId: {
        type: Number,
        required: true
    },
    staffId: {
        type: Number,
        required: true
    },
    staffName: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    jobStatus: {
        type: String,
        required: true,
        default: "Pending"
    }
}, { collection: "Maintenance" });

// custom function to generate auto-incremented maintenanceId
maintenanceSchema.statics.getNextMaintenanceId = async function () {
    try {
        const lastMaintenance = await this.findOne({}, {}, { sort: { 'maintenanceId': -1 } });
        if (lastMaintenance && lastMaintenance.maintenanceId) {
            return lastMaintenance.maintenanceId + 1;
        } else {
            return 1; // starting from 1 if no maintenance exists yet
        }
    } catch (error) {
        throw new Error('Failed to generate next maintenance ID');
    }
};

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
const Maintenance = require('../models/maintenance');
const Staff = require('../models/staffs');

// Controller function to fetch assigned maintenance tasks details
exports.getAllMaintenance = async (req, res) => {
    try {
      // fetch all assigned maintenance tasks from the database
      const maintenanceDetails = await Maintenance.find({}, 'maintenanceId staffId staffName task jobStatus');

      res.status(200).json({ maintenanceDetails });
    } catch (error) {
      console.error('Error fetching maintenance task details:', error);
      res.status(500).json({ error: 'Server error' });
    }
};

// Controller action to retrieve a single maintenance by maintenanceID
exports.getOneStaff = async (req, res) => {
    try {
        const maintenanceId = req.params.maintenanceId;

        // check if maintenanceId is entered
        if (!maintenanceId) {
            return res.status(400).json({ message: 'Maintenance ID is required' });
        }

        // check if maintenanceId is a valid number
        if (isNaN(parseInt(maintenanceId))) {
            return res.status(400).json({ message: 'Invalid Maintenance ID' });
        }

        // retrieve a single maintenance task by ID
        const maintenance = await Maintenance.findOne({ maintenanceId: parseInt(maintenanceId) });

        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance task not found' });
        }

        return res.json({ message: 'Maintenance task details retrieved successfully', maintenance });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Controller function to assign a new maintenance task
exports.assignMaintenance = async (req, res) => {
    const { maintenanceId, staffId, task } = req.body;

    try {
        let newMaintenanceId;

        if (!maintenanceId) {
            const nextMaintenanceId = await Maintenance.getNextMaintenanceId();
            newMaintenanceId = nextMaintenanceId;
        } else {
            newMaintenanceId = parseInt(maintenanceId);
        }

        // fetch staff details by staffId
        const staff = await Staff.findOne({ staffId });

        // check if staff with the provided staffId exists
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found with the provided staffId' });
        }

        const staffName = `${staff.firstName} ${staff.lastName}`;

        // create a new maintenance task
        const maintenance = new Maintenance({
            maintenanceId: newMaintenanceId,
            staffId,
            staffName, 
            task,
            jobStatus: "Pending"
        });

        const newMaintenance = await maintenance.save();
        res.status(201).json({ message: 'Maintenance task assigned successfully', maintenance: newMaintenance });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to reassign maintenance task details
exports.reassignMaintenance = async (req, res) => {
    try {
        const maintenanceId = req.params.maintenanceId;

        // check if maintenanceId is entered
        if (!maintenanceId) {
            return res.status(400).json({ message: 'Maintenance ID is required' });
        }

        // check if maintenanceId is a valid number
        if (isNaN(parseInt(maintenanceId))) {
            return res.status(400).json({ message: 'Invalid Maintenance ID' });
        }

        // find the maintenance by maintenanceId
        const maintenance = await Maintenance.findOne({ maintenanceId: parseInt(maintenanceId) });
        if (!maintenanceId) {
            return res.status(404).json({ message: 'Maintenance Task not found' });
        }

        // update maintenance task details
        if (req.body.staffId != null) {
            maintenance.staffId = req.body.staffId;

            // fetch staff details by staffId
            const staff = await Staff.findOne({ staffId: req.body.staffId });
            if (!staff) {
                return res.status(404).json({ message: 'Staff not found with the provided staffId' });
            }
            // update staffName based on the fetched staff details
            maintenance.staffName = `${staff.firstName} ${staff.lastName}`;
        }
        if (req.body.task != null) {
            maintenance.task = req.body.task;
        }

        // Save the updated maintenance task
        const updatedMaintenance = await maintenance.save();
        res.json({ message: 'Maintenance Task updated successfully', maintenance: updatedMaintenance });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to delete assigned maintenance task
exports.deleteMaintenance = async (req, res) => {
    try {
        const maintenanceId = req.params.maintenanceId;

        // check if maintenanceId is entered
        if (!maintenanceId) {
            return res.status(400).json({ message: 'Maintenance ID is required' });
        }

        // check if maintenanceId is a valid number
        if (isNaN(parseInt(maintenanceId))) {
            return res.status(400).json({ message: 'Invalid Maintenance ID' });
        }

        // find the maintenance by maintenanceId
        const maintenance = await Maintenance.findOne({ maintenanceId: parseInt(maintenanceId) });
        if (!maintenanceId) {
            return res.status(404).json({ message: 'Maintenance Task not found' });
        }

        // delete the assigned maintenance task
        const result = await Maintenance.deleteOne({ maintenanceId: parseInt(maintenanceId) });
        if (result.deletedCount === 1) {
            return res.json({ message: 'Maintenance task deleted successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to delete assigned maintenance task' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
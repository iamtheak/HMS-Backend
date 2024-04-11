const Staff = require('../models/staffs');
const jwt = require('../jwt')

// Controller action to retrieve all staffs
exports.getAllStaffs = async (req, res) => {
    try {
        const staffs = await Staff.find({ role: "Staff" });
        res.json({ message: "All Staffs", staffs: staffs });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Controller action to retrieve a single staff by staffID
exports.getOneStaff = async (req, res) => {
    try {
        const staffId = req.params.staffId;

        // check if staffId is entered
        if (!staffId) {
            return res.status(400).json({ message: 'Staff ID is required' });
        }

        // check if staffId is a valid number
        if (isNaN(parseInt(staffId))) {
            return res.status(400).json({ message: 'Invalid Staff ID' });
        }

        // retrieve a single staff by ID
        const staff = await Staff.findOne({ staffId: parseInt(staffId) });

        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        return res.json({ message: 'Staff details retrieved successfully', staff });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


// Controller action to add new staff
exports.addStaff = async (req, res) => {
    const { username, staffId, firstName, middleName, lastName, email, phone, citizenshipNo, password } = req.body;

    try {
        let newStaffId;

        if (!staffId) {
            // If staffId is not provided, get the next available staffId
            const nextStaffId = await Staff.getNextStaffId();
            newStaffId = nextStaffId;
        } else {
            // If staffId is provided, check if it already exists
            const existingStaff = await Staff.findOne({ staffId });
            console.log(existingStaff);
            
            if (existingStaff) {
                return res.status(400).json({ message: 'Staff ID already taken. Please select another staff ID.' });
            }
            newStaffId = staffId;
        }

        // Create a new staff
        const staff = new Staff({
            username,
            staffId: newStaffId,
            role: "Staff", 
            firstName, 
            middleName, 
            lastName, 
            email, 
            phone, 
            citizenshipNo, 
            password
        });

        const newStaff = await staff.save();
        res.status(201).json({ message: 'Staff added successfully', staff: newStaff });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Controller action to update staff details
exports.updateStaff = async (req, res) => {
    try {
        const staffId = req.params.staffId;

        // check if staffId is entered
        if (!staffId) {
            return res.status(400).json({ message: 'Staff ID is required' });
        }

        // check if staffId is a valid number
        if (isNaN(parseInt(staffId))) {
            return res.status(400).json({ message: 'Invalid Staff ID' });
        }

        // find the staff by staffId
        const staff = await Staff.findOne({ staffId: parseInt(staffId) });
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        // update staff details
        if (req.body.username != null) {
            staff.username = req.body.username;
        }
        if (req.body.firstName != null) {
            staff.firstName = req.body.firstName;
        }
        if (req.body.middleName != null) {
            staff.middleName = req.body.middleName;
        }
        if (req.body.lastName != null) {
            staff.lastName = req.body.lastName;
        }
        if (req.body.email != null) {
            staff.email = req.body.email;
        }
        if (req.body.phone != null) {
            staff.phone = req.body.phone;
        }
        if (req.body.citizenshipNo != null) {
            staff.citizenshipNo = req.body.citizenshipNo;
        }
        if (req.body.password != null) {
            staff.password = req.body.password;
        }

        // Save the updated staff
        const updatedStaff = await staff.save();
        res.json({ message: 'Staff updated successfully', staff: updatedStaff });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Controller action to delete a staff by staffID
exports.deleteStaff = async (req, res) => {
    try {
        const staffId = req.params.staffId;

        // check if staffId is entered
        if (!staffId) {
            return res.status(400).json({ message: 'Staff ID is required' });
        }

        // check if staffId is a valid number
        if (isNaN(parseInt(staffId))) {
            return res.status(400).json({ message: 'Invalid Staff ID' });
        }

        // find the staff by staffId
        const staff = await Staff.findOne({ staffId: parseInt(staffId) });
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        // delete the staff
        const result = await Staff.deleteOne({ staffId: parseInt(staffId) });
        if (result.deletedCount === 1) {
            return res.json({ message: 'Staff deleted successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to delete staff' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const users = require('../models/users');
const rooms = require('../models/rooms');

// function to fetch dashboard contents
exports.fetchDashboardContents = async (req, res) => {
  try {
    // fetch total number of residents
    const totalResidents = await users.countDocuments({ role: 'Resident' });

    // fetch total number of staff
    const totalStaffs = await users.countDocuments({ role: 'Staff' });

    // fetch total number of rooms
    const totalRooms = await rooms.countDocuments();

    // send the dashboard contents as response
    res.json({
      totalResidents,
      totalStaffs,
      totalRooms
    });
  } catch (err) {
    // handle errors
    console.error('Error fetching dashboard contents:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

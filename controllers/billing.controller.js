const User = require('../models/users');
const Staff = require('../models/staffs');

// Controller function to fetch rent payment details
exports.getRentPayments = async (req, res) => {
  try {
    // check if the user is an Admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
    }

    // find all users with role 'Resident' and populate the billing field
    const users = await User.find({ role: 'Resident' }).populate('billing');

    // extract rent payment details from the users
    const rentPayments = users.map(user => {
      const { username, firstName, lastName, billing } = user;
      const { amount, nextPayDate, status, pastBills } = billing;

      return {
        username: username,
        residentName: `${firstName} ${lastName}`,
        amount,
        nextPayDate: formatDate(nextPayDate),
        status,
        pastBills
      };
    });

    res.status(200).json({ rentPayments });
  } catch (error) {
    console.error('Error fetching rent payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller function to fetch rent payment details of a single user by username
exports.getOneRentPayment = async (req, res) => {
  try {
    // check if the user is an Admin or Resident
    if (req.user.role !== 'Admin' && req.user.role !== 'Resident') {
      return res.status(403).json({ message: 'Unauthorized. Only Admin and Resident can perform this action' });
    }

    const enteredUsername = req.params.username;
      
    // check if username is entered
    if (!enteredUsername) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // check if username is a string
    if (typeof enteredUsername !== 'string') {
      return res.status(400).json({ message: 'Username must be a string' });
    }

    // retrieve a user by username and populate the billing field
    const user = await User.findOne({ username: enteredUsername }).populate('billing');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // extract rent payment details from the user
    const { username, firstName, lastName, billing } = user;
    const { amount, nextPayDate, status, pastBills } = billing;

    const rentPaymentDetails = {
      username: username,
      residentName: `${firstName} ${lastName}`,
      amount,
      nextPayDate: formatDate(nextPayDate),
      status,
      pastBills
    };

    res.status(200).json({ rentPaymentDetails });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Controller function to fetch salary payment details
exports.getSalaryPayments = async (req, res) => {
    try {
      // check if the user is an Admin
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
      }

      // find all users with role 'Staff' and populate the billing field
      const users = await User.find({ role: 'Staff' }).populate('billing');
  
      // extract salary payment details from the users
      const salaryPayments = users.map(user => {
        const { staffId, firstName, lastName, billing } = user;
        const { amount, nextPayDate, status, pastBills } = billing;
  
        return {
          staffId: staffId,
          staffName: `${firstName} ${lastName}`,
          amount,
          nextPayDate: formatDate(nextPayDate),
          status,
          pastBills
        };
      });
  
      res.status(200).json({ salaryPayments });
    } catch (error) {
      console.error('Error fetching salary payments:', error);
      res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to fetch salary payment details of a single staff by staffId
exports.getOneSalaryPayment = async (req, res) => {
  try {
    // check if the user is an Admin or Staff
    if (req.user.role !== 'Admin' && req.user.role !== 'Staff') {
      return res.status(403).json({ message: 'Unauthorized. Only Admin and Staff can perform this action' });
    }

    const enteredStaffId = req.params.staffId;
      
    // check if staffId is entered
    if (!enteredStaffId) {
      return res.status(400).json({ message: 'Staff ID is required' });
    }

    // check if staffId is a number
    if (isNaN(enteredStaffId)) {
      return res.status(400).json({ message: 'Staff ID must be a number' });
    }

    // retrieve a staff by staffId and populate the billing field
    const staff = await Staff.findOne({ staffId: enteredStaffId }).populate('billing');

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // extract salary payment details from the staff
    const { staffId, firstName, lastName, billing } = staff;
    const { amount, nextPayDate, status, pastBills } = billing;

    const salaryPaymentDetails = {
      staffId: staffId,
      staffName: `${firstName} ${lastName}`,
      amount,
      nextPayDate: formatDate(nextPayDate),
      status,
      pastBills
    };

    res.status(200).json({ salaryPaymentDetails });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Controller function to post rent payment status by username
exports.postRentPaymentStatus = async (req, res) => {
  try {
    // check if the user is an Admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
    }

    const { username, newStatus } = req.body;

    // find the user by username
    const user = await User.findOne({username: username});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // add the amount and today's date as paidDate to pastBills
    user.billing.pastBills.push({
      amount: user.billing.amount,
      paidDate: new Date()
    });

    // update the billing status
    user.billing.status = newStatus;

    // increment nextPayDate by 1 month if the status is changed to "Up-to-date"
    if (newStatus === 'Up-to-date' && user.billing.nextPayDate) {
      const nextPayDate = new Date(user.billing.nextPayDate);
      nextPayDate.setMonth(nextPayDate.getMonth() + 1);
      user.billing.nextPayDate = nextPayDate;
    }

    // save the updated user
    await user.save();

    res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (error) {
    console.error('Error fetching salary payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller function to post salary payment status by staff ID
exports.postSalaryPaymentStatus = async (req, res) => {
  try {
    // check if the user is an Admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized. Only Admin can perform this action' });
    }

    const { staffId, newStatus } = req.body;

    // find the staff by staffId
    const staff = await Staff.findOne({staffId: staffId});

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    // add the amount and today's date as paidDate to pastBills
    staff.billing.pastBills.push({
      amount: staff.billing.amount,
      paidDate: new Date()
    });

    // update the billing status
    staff.billing.status = newStatus;

    // increment nextPayDate by 1 month if the status is changed to "Up-to-date"
    if (newStatus === 'Up-to-date' && staff.billing.nextPayDate) {
      const nextPayDate = new Date(staff.billing.nextPayDate);
      nextPayDate.setMonth(nextPayDate.getMonth() + 1);
      staff.billing.nextPayDate = nextPayDate;
    }
    
    // save the updated staff
    await staff.save();

    res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (error) {
    console.error('Error fetching salary payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// function to format date as "YYYY-MM-DD"
function formatDate(date) {
  if (!date) return '-';
  return date.toISOString().split('T')[0];
}

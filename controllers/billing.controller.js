const User = require('../models/users');
const Staff = require('../models/staffs');

// Controller function to fetch rent payment details
exports.getRentPayments = async (req, res) => {
  try {
    // find all users and populate the billing field
    const users = await User.find({ role: 'Resident' }).populate('billing');

    // extract rent payment details from the users
    const rentPayments = users.map(user => {
      const { firstName, lastName, billing } = user;
      const { amount, nextPayDate, pastBills } = billing;
      
      // extracting past bill details
      const lastPaid = pastBills.length > 0 ? pastBills[pastBills.length - 1].billDate : null;
      const status = calculateStatus(nextPayDate);

      return {
        residentName: `${firstName} ${lastName}`,
        amount,
        dueDate: formatDate(nextPayDate),
        lastPaid: formatDate(lastPaid),
        status
      };
    });

    res.status(200).json({ rentPayments });
  } catch (error) {
    console.error('Error fetching rent payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller function to fetch salary payment details
exports.getSalaryPayments = async (req, res) => {
    try {
      // find all users and populate the billing field
      const users = await User.find({ role: 'Staff' }).populate('billing');
  
      // extract salary payment details from the users
      const salaryPayments = users.map(user => {
        const { staffId, firstName, lastName, billing } = user;
        const { amount, nextPayDate, pastBills } = billing;
        
        // extracting past bill details
        const lastPaid = pastBills.length > 0 ? pastBills[pastBills.length - 1].billDate : null;
        const status = calculateStatus(nextPayDate);
  
        return {
          staffId: staffId,
          staffName: `${firstName} ${lastName}`,
          amount,
          dueDate: formatDate(nextPayDate),
          lastPaid: formatDate(lastPaid),
          status
        };
      });
  
      res.status(200).json({ salaryPayments });
    } catch (error) {
      console.error('Error fetching salary payments:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

// function to calculate the status based on the due date
function calculateStatus(nextPayDate) {
    if (!nextPayDate) {
        return null; // Return null if nextPayDate is null
    }

    const currentDate = new Date();
    if (nextPayDate <= currentDate) {
        return 'Overdue';
    } else {
        return 'Up to date';
    }
}

// function to format date as "YYYY-MM-DD"
function formatDate(date) {
  if (!date) return '-';
  return date.toISOString().split('T')[0];
}

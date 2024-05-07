const User = require('./models/users');
const Staff = require('./models/staffs');

async function updatePaymentStatus() {
    // set timeout to check for payment status update every 24 hours (86400 seconds)
    setTimeout(async () => {
        try {
            // get the current date
            const currentDate = new Date();
            
            // find users whose next payment date is in the past (before today)
            // $lt is less than
            const usersToUpdate = await User.find({ 'billing.nextPayDate': { $lt: currentDate } });
            
            // update payment status for each user
            for (const user of usersToUpdate) {
                // set status to "Pending" if nextPayDate is in the past
                user.billing.status = "Pending";
                
                // save the updated user
                await user.save();
            }
            
            console.log("Payment status updated for", usersToUpdate.length, "users.");
            
            // find staffs whose next payment date is in the past (before today)
            const staffToUpdate = await Staff.find({ 'billing.nextPayDate': { $lt: currentDate } });
            
            // update payment status for each staff
            for (const staff of staffToUpdate) {
                // Set status to "Pending" if nextPayDate is in the past
                staff.billing.status = "Pending";
                
                // save the updated staff
                await staff.save();
            }
            
            console.log("Payment status updated for", staffToUpdate.length, "staffs.");

            // call the function recursively to set the timer for the next day
            updatePaymentStatus();
        } catch (error) {
            console.error("Error updating payment status:", error);
        }
    }, 86400 * 1000); // 86400 seconds = 24 hours is the delay of the timeout
}

module.exports = updatePaymentStatus;

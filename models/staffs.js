const mongoose = require('mongoose');

// define Staff schema
const staffSchema = new mongoose.Schema({
    // Personal information
    username: { 
      type: String, 
      required: true, 
      unique: true
    },
    staffId: {
        type: Number,
        required: true
    },
    role: {
      type: String,
      required: true,
      default: "Staff"
    },
    firstName: {
      type: String,
      required: true,
      maxlength: 20
    },
    middleName: {
      type: String,
      default: null,
      maxlength: 20
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 20
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50
    },
    phone: {
      type: Number,
      required: true,
      min: 9700000000,
      max: 9899999999
    },
    citizenshipNo: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20
    },
    password: {
      type: String,
      required: true,
      maxlength: 255
    },
    joinedDate: {
      type: Date,
      required: true
    },
    
    // Billing information
    billing: {
      nextPayDate: {
        type: Date,
        default: null
      },
      amount: {
        type: Number,
        default: null
      },
      pastBills: [{
        billDate: {
          type: Date,
          default: null
        },
        amount: {
          type: Number,
          default: null
        }
      }]
    } 
  },
{collection:"Users"}
);

// custom function to generate auto-incremented staffId
staffSchema.statics.getNextStaffId = async function () {
    const lastStaffId = await this.findOne({}, {}, { sort: { 'staffId': -1 } });
    if (lastStaffId) {
        return lastStaffId.staffId + 1;
    } else {
        return 1; // starting from 1 if no rooms exist yet
    }
};

const Staff = mongoose.model('Staffs', staffSchema);

module.exports = Staff;
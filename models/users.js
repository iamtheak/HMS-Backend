const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - role
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - citizenshipNo
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: User's username
 *           default: christie19
 *         role:
 *           type: string
 *           description: User's role
 *           default: Resident
 *         firstName:
 *           type: string
 *           description: User's first name
 *           default: Christie
 *         middleName:
 *           type: string
 *           description: User's middle name
 *           default: Jane
 *         lastName:
 *           type: string
 *           description: User's last name
 *           default: Smith
 *         email:
 *           type: string
 *           description: User's email address
 *           default: jsmith@gmail.com
 *         phone:
 *           type: number
 *           description: User's phone number
 *           default: 982345678
 *         citizenshipNo:
 *           type: string
 *           description: User's citizenship number
 *           default: 12-122-23456
 *         password:
 *           type: string
 *           description: User's password
 *           default: Ajahdfjhgd@123
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *           default: 2002-01-11
 */

// define User schema
const userSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true
  },
  role: {
    type: String,
    required: true,
    default: "Resident"
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
  dateOfBirth: {
    type: Date,
    default: null
  },  
},
{collection:"Users"}
);

// create and export User model based on the schema
const User = mongoose.model('User', userSchema);
module.exports = User;
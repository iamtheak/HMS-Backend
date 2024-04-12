const { checkSchema, validationResult } = require('express-validator');
const Staff = require('../models/staffs');

// define validation schema using checkSchema()
const createStaffSchema = checkSchema({
  username: {
    notEmpty: {
      errorMessage: 'Username is required',
    },
    isLength: {
      options: { min: 4, max: 20 },
      errorMessage: 'Username must be between 4 to 20 characters',
    },
    // allows lowercase letters, numbers, underscores, and periods
    matches: {
      options: [/^[a-z0-9._]+$/],
      errorMessage: 'Username must not have capital letters or spaces, can only have small letters, numbers, underscore, and fullstop',
    },
    custom: {
      options: (value, { req }) => {
        return Staff.findOne({ username: value }).then(staff => {
          if (staff) {
            return Promise.reject('Username already exists');
          }
        });
      },
    },
  },
  firstName: {
    notEmpty: {
      errorMessage: 'First name is required',
    },
    // starts with a capital letter followed by lowercase letters
    matches: {
      options: [/^[A-Z][a-z]+$/],
      errorMessage: 'First name must start with a capital letter followed by small letters',
    },
    isLength: {
      options: { max: 20 },
      errorMessage: 'First name must not be longer than 20 characters',
    },
  },
  middleName: {
    optional: { options: { nullable: true } },
    // Optional, starts with a capital letter followed by lowercase letters
    matches: {
        options: [/^[A-Z][a-z]*$/],
        errorMessage: 'Middle name must start with a capital letter followed by small letters',
    },
    isLength: {
      options: { max: 20 },
      errorMessage: 'Middle name must not be longer than 20 characters',
    },
    trim: true,
  },
  lastName: {
    notEmpty: {
      errorMessage: 'Last name is required',
    },
    // starts with a capital letter followed by lowercase letters
    matches: {
      options: [/^[A-Z][a-z]+$/],
      errorMessage: 'Last name must start with a capital letter followed by small letters',
    },
    isLength: {
      options: { max: 20 },
      errorMessage: 'Last name must not be longer than 20 characters',
    },
  },
  email: {
    notEmpty: {
      errorMessage: 'Email is required',
    },
    // standard email pattern
    isEmail: {
      errorMessage: 'Invalid email address',
    },
    custom: {
      options: (value, { req }) => {
        return Staff.findOne({ email: value }).then(staff => {
          if (staff) {
            return Promise.reject('Email already exists');
          }
        });
      },
    },
  },
  phone: {
    notEmpty: {
      errorMessage: 'Phone number is required',
    },
    // Phone number format: 10 digits starts with 98 or 97 followed by 8 digits
    matches: {
      options: [/^(98|97)[0-9]{8}$/],
      errorMessage: 'Phone number must start with 98 or 97 followed by 8 digits',
    },
  },
  citizenshipNo: {
    notEmpty: {
      errorMessage: 'Citizenship number is required',
    },
    // Citizenship number format: XX-XX-XX-XXXXX
    matches: {
      options: [/^\d{2}-\d{2}-\d{2}-\d{5}$/],
      errorMessage: 'Citizenship number must be in the format 00-00-00-00000',
    },
    custom: {
      options: (value, { req }) => {
        return Staff.findOne({ citizenshipNo: value }).then(staff => {
          if (staff) {
            return Promise.reject('Citizenship number already exists');
          }
        });
      },
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is required',
    },
    // At least one letter and one number, 8 or more characters 
    // and may include special characters like !@#$%^&*()_+-=[]{}|;:\'",.<>/?'
    matches: {
        options: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,30}$/],
        errorMessage: 'Password must be between 8 to 30 characters with at least one letter and one number',
    },
  },
});

// Validation middleware using the created schema
exports.createStaffValidator = [
    createStaffSchema,
  (req, res, next) => {
    // check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // extract the first error message for each field
      const errorMessages = {};
      errors.array().forEach(error => {
        const field = error.param;
        if (!errorMessages[field]) {
          errorMessages[field] = error.msg;
        }
      });
      return res.status(400).json({ errors: errorMessages });
    }
    next(); // no validation errors, proceed to the next middleware
  }
];

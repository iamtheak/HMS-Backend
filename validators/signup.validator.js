const { checkSchema, validationResult } = require('express-validator');
const User = require('../models/users'); // Import your User model

// define validation schema using checkSchema()
const createUserSchema = checkSchema({
  username: {
    notEmpty: {
      errorMessage: 'Username is required',
    },
    isLength: {
      options: { min: 4, max: 20 },
      errorMessage: 'Username must be between 4 to 20 characters',
    },
    custom: {
      options: (value, { req }) => {
        return User.findOne({ username: value }).then(user => {
          if (user) {
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
  },
  lastName: {
    notEmpty: {
      errorMessage: 'Last name is required',
    },
  },
  email: {
    notEmpty: {
      errorMessage: 'Email is required',
    },
    isEmail: {
      errorMessage: 'Invalid email address',
    },
    custom: {
      options: (value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
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
    isNumeric: {
      errorMessage: 'Phone number must be numeric',
    },
  },
  citizenshipNo: {
    notEmpty: {
      errorMessage: 'Citizenship number is required',
    },
    isLength: {
      options: { max: 20 },
      errorMessage: 'Citizenship number must be at most 20 characters',
    },
    custom: {
      options: (value, { req }) => {
        return User.findOne({ citizenshipNo: value }).then(user => {
          if (user) {
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
    isLength: {
      options: { min: 8, max: 255 },
      errorMessage: 'Password must be between 8 to 255 characters',
    },
  },
  dateOfBirth: {
    optional: true, // This field is optional
    isISO8601: {
      errorMessage: 'Invalid date format (YYYY-MM-DD)',
    },
  },
});

// Validation middleware using the created schema
exports.createUserValidator = [
  createUserSchema,
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

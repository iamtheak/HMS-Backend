const { checkSchema, validationResult } = require('express-validator');
const User = require('../models/users');
const Staff = require('../models/staffs');

// define validation schema using checkSchema()
const rentPaymentSchema = checkSchema({
    username: {
        notEmpty: {
            errorMessage: 'Username is required',
        },
        isString: {
            errorMessage: 'Username must be a string',
        },
        custom: {
            options: async (value, { req }) => {
                try {
                    const user = await User.findOne({ username: value });
                    if (!user) {
                        return Promise.reject("User with the provided username doesn't exist");
                    }
                } catch (error) {
                    return Promise.reject('Failed to validate username');
                }
            },
        },
    },
    newStatus: {
        notEmpty: {
            errorMessage: 'New status is required',
        },
        isString: {
            errorMessage: 'New status must be a string',
        },
        isIn: {
            options: [['Pending', 'Up-to-date']],
            errorMessage: 'New status must be either "Pending" or "Up-to-date"',
        },
        custom: {
            options: async (value, { req }) => {
                try {
                    const user = await User.findOne({ username: req.body.username });
                    if (user && user.billing.status === value) {
                        return Promise.reject("New status must be different from the current status");
                    }
                } catch (error) {
                    return Promise.reject('Failed to validate new status');
                }
            },
        },
    },
});

// validation middleware using the created schema
exports.rentPaymentValidator = [
    rentPaymentSchema,
    async (req, res, next) => {
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


// define validation schema using checkSchema()
const salaryPaymentSchema = checkSchema({
    staffId: {
        notEmpty: {
            errorMessage: 'Staff ID is required',
        },
        isNumeric: {
            errorMessage: 'Staff ID must be a number',
        },
        custom: {
            options: async (value, { req }) => {
                try {
                    const staff = await Staff.findOne({ staffId: value });
                    if (!staff) {
                        return Promise.reject("Staff with the provided ID doesn't exist");
                    }
                } catch (error) {
                    return Promise.reject('Failed to validate Staff ID');
                }
            },
        },
    },
    newStatus: {
        notEmpty: {
            errorMessage: 'New status is required',
        },
        isString: {
            errorMessage: 'New status must be a string',
        },
        isIn: {
            options: [['Pending', 'Up-to-date']],
            errorMessage: 'New status must be either "Pending" or "Up-to-date"',
        },
        custom: {
            options: async (value, { req }) => {
                try {
                    const staff = await Staff.findOne({ staffId: req.body.staffId });
                    if (staff && staff.billing.status === value) {
                        return Promise.reject("New status must be different from the current status");
                    }
                } catch (error) {
                    return Promise.reject('Failed to validate new status');
                }
            },
        },
    },
});

// validation middleware using the created schema
exports.salaryPaymentValidator = [
    salaryPaymentSchema,
    async (req, res, next) => {
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
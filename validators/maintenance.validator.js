const { checkSchema, validationResult } = require('express-validator');
const Staff = require('../models/staffs');

// define validation schema using checkSchema()
const maintenanceSchema = checkSchema({
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
    task: {
        notEmpty: {
            errorMessage: 'Task description is required',
        },
        isString: {
            errorMessage: 'Task description must be a string',
        },
    },
});

// Validation middleware using the created schema
exports.maintenanceValidator = [
    maintenanceSchema,
    async (req, res, next) => {
        // check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // cxtract the first error message for each field
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

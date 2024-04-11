const { checkSchema, validationResult } = require('express-validator');
const Staff = require('../models/staffs');

const updateStaffSchema = checkSchema({
    username: {
        optional: true,
        isLength: {
            options: { min: 4, max: 20 },
            errorMessage: 'Username must be between 4 to 20 characters',
        },
        // Username regex: small letters, numbers, underscore, and full stop
        matches: {
            options: [/^[a-z0-9._]+$/],
            errorMessage: 'Username must contain only small letters, numbers, underscore, and full stop with no spaces in between',
        },
        custom: {
            options: async (value, { req }) => {
                const existingUser = await Staff.findOne({ username: value, staffId: { $ne: req.params.staffId } });
                if (existingUser) {
                    throw new Error('Username already in use');
                }
                return true;
            },
        },
    },
    firstName: {
        optional: true,
        // First letter capital, others small
        matches: {
            options: [/^[A-Z][a-z]*$/],
            errorMessage: 'First name must start with a capital letter and all other letters must be small',
        },
        isLength: {
            options: { max: 20 },
            errorMessage: 'First name must not be longer than 20 characters',
        },
    },
    middleName: {
        optional: true,
        // First letter capital, others small
        matches: {
            options: [/^[A-Z][a-z]*$/],
            errorMessage: 'Middle name must start with a capital letter and all other letters must be small',
        },
        isLength: {
            options: { max: 20 },
            errorMessage: 'Middle name must not be longer than 20 characters',
        },
    },
    lastName: {
        optional: true,
        // First letter capital, others small
        matches: {
            options: [/^[A-Z][a-z]*$/],
            errorMessage: 'Last name must start with a capital letter and all other letters must be small',
        },
        isLength: {
            options: { max: 20 },
            errorMessage: 'Last name must not be longer than 20 characters',
        },
    },
    email: {
        optional: true,
        isEmail: {
            errorMessage: 'Invalid email address',
        },
        // Standard email regex
        matches: {
            options: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
            errorMessage: 'Email must be in a valid format',
        },
        custom: {
            options: async (value, { req }) => {
                const existingEmail = await Staff.findOne({ email: value, staffId: { $ne: req.params.staffId } });
                if (existingEmail) {
                    throw new Error('Email already in use');
                }
                return true;
            },
        },
    },
    phone: {
        optional: true,
        // Phone number format: 10 digits starts with 98 or 97 followed by 8 digits
        matches: {
            options: [/^(98|97)\d{8}$/],
            errorMessage: 'Phone number must start with 98 or 97 followed by 8 digits',
        },
    },
    citizenshipNo: {
        optional: true,
        // Citizenship number format
        matches: {
            options: [/^\d{2}-\d{2}-\d{2}-\d{5}$/],
            errorMessage: 'Citizenship number must be in the format 00-00-00-00000',
        },
        custom: {
            options: async (value, { req }) => {
                const existingCitizenshipNo = await Staff.findOne({ citizenshipNo: value, StaffId: { $ne: req.params.staffId } });
                if (existingCitizenshipNo) {
                    throw new Error('Citizenship number already in use');
                }
                return true;
            },
        },
    },
    password: {
        optional: true,
        isLength: {
            options: { min: 8, max: 255 },
            errorMessage: 'Password must be between 8 to 255 characters',
        },
        matches: {
            // Password: At least one letter and one number.
            options: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/],
            errorMessage: 'Password must contain at least one letter and one number',
        },
    },
});

// validation middleware using the updated schema
exports.updateStaffValidator = [
    updateStaffSchema,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = {};
            errors.array().forEach(error => {
                const field = error.param;
                if (!errorMessages[field]) {
                    errorMessages[field] = error.msg;
                }
            });
            return res.status(400).json({ errors: errorMessages });
        }
        next();
    }
];

const { checkSchema, validationResult } = require('express-validator');
const Staff = require('../models/staffs');

const updateStaffSchema = checkSchema({
    username: {
        optional: true,
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
        // starts with a capital letter followed by lowercase letters
        matches: {
            options: [/^[A-Z][a-z]*$/],
            errorMessage: 'First name must start with a capital letter followed by small letters',
        },
        isLength: {
            options: { max: 20 },
            errorMessage: 'First name must not be longer than 20 characters',
        },
    },
    middleName: {
        optional: true,
        // starts with a capital letter followed by lowercase letters
        matches: {
            options: [/^[A-Z][a-z]*$/],
            errorMessage: 'Middle name must start with a capital letter followed by small letters',
        },
        isLength: {
            options: { max: 20 },
            errorMessage: 'Middle name must not be longer than 20 characters',
        },
    },
    lastName: {
        optional: true,
        // starts with a capital letter followed by lowercase letters
        matches: {
            options: [/^[A-Z][a-z]*$/],
            errorMessage: 'Last name must start with a capital letter followed by small letters',
        },
        isLength: {
            options: { max: 20 },
            errorMessage: 'Last name must not be longer than 20 characters',
        },
    },
    email: {
        optional: true,
        // standard email pattern
        isEmail: {
            errorMessage: 'Invalid email address',
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
        // Citizenship number format: XX-XX-XX-XXXXX
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
        // At least one letter and one number, 8 or more characters 
        // and may include special characters like !@#$%^&*()_+-=[]{}|;:\'",.<>/?'
        matches: {
            options: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,30}$/],
            errorMessage: 'Password must be between 8 to 30 characters with at least one letter and one number',
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

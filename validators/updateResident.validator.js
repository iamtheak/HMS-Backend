const { checkSchema, validationResult } = require('express-validator');
const User = require('../models/users');

const updateResidentSchema = checkSchema({
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
        custom: {
            options: (value) => {
                if (value) {
                    if (!/^[A-Z][a-z]*$/.test(value)) {
                        throw new Error('Middle name must start with a capital letter followed by small letters');
                    }
                    if (value.length > 20) {
                        throw new Error('Middle name must not be longer than 20 characters');
                    }
                }
                return true;
            },
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
                const existingEmail = await User.findOne({ email: value, role: 'Resident', username: { $ne: req.params.username } });
                if (existingEmail) {
                    throw new Error('Email already in use');
                }
                return true;
            },
        },
    },

    newUsername: {
        optional: true,
        // username format restrictions
        matches: {
            options: /^[a-zA-Z0-9_]*$/,
            errorMessage: 'Username must contain only letters, numbers, or underscores',
        },
        isLength: {
            options: { min: 5, max: 20 },
            errorMessage: 'Username must be between 5 and 20 characters long',
        },
        custom: {
            options: async (value, { req }) => {
                if (value && value !== req.params.username) {
                    const existingUser = await User.findOne({ username: value });
                    if (existingUser && existingUser.username !== req.params.username) {
                        throw new Error('Username already in use');
                    }
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
                try {
                    const existingCitizenshipNo = await User.findOne({ citizenshipNo: value, role: 'Resident', username: { $ne: req.params.username } });
                    if (existingCitizenshipNo) {
                        throw new Error('Citizenship number already in use');
                    }
                    return true;
                } catch (error) {
                    throw new Error('Failed to validate citizenship number');
                }
            },
        },
    },
    dateOfBirth: {
        optional: true,
        // Date of birth format: YYYY-MM-DD
        isDate: {
            errorMessage: 'Invalid date format. Use YYYY-MM-DD',
        },
    },
});

// Validation middleware using the updated schema
exports.updateResidentValidator = [
    updateResidentSchema,
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
// room.validator.js

exports.validateRoom = (req, res, next) => {
    const {price, occupancy } = req.body;

    // Check if all required fields are present
    if (!price || !occupancy) {
        return res.status(400).json({ message: 'Price and Occupancy fields are required' });
    }

    // Validate price
    if (typeof price !== 'number') {
        return res.status(400).json({ message: 'Price must be a number' });
    }
    if (price <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
    }
    if (price > 10000) {
        return res.status(400).json({ message: 'Price must not be greater than 10000' });
    }

    // Validate occupancy
    if (typeof occupancy !== 'number') {
        return res.status(400).json({ message: 'Occupancy must be a number' });
    }
    if (occupancy <= 0) {
        return res.status(400).json({ message: 'Occupancy must be a positive number' });
    }
    if (occupancy > 2) {
        return res.status(400).json({ message: 'Occupancy must not be more than 2' });
    }

    next();
};

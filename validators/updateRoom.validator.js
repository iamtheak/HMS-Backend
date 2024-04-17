exports.validateUpdateRoom = (req, res, next) => {
    const { roomId, price, occupancy } = req.body;

    // Check if at least one field is provided for update
    if (!roomId && !price && !occupancy) {
        return res.status(400).json({ message: 'At least one field is required for updating the room' });
    }

    // Validate roomId
    if (roomId !== undefined && typeof roomId !== 'number') {
        return res.status(400).json({ message: 'Room ID must be a number' });
    }

    // Validate price
    if (price !== undefined && typeof price !== 'number') {
        return res.status(400).json({ message: 'Price must be a number' });
    }
    if (price !== undefined && price <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
    }
    if (price !== undefined && price > 10000) {
        return res.status(400).json({ message: 'Price must not be greater than 10000' });
    }

    // Validate occupancy
    if (occupancy !== undefined && typeof occupancy !== 'number') {
        return res.status(400).json({ message: 'Occupancy must be a number' });
    }
    if (occupancy !== undefined && occupancy <= 0) {
        return res.status(400).json({ message: 'Occupancy must be a positive number' });
    }

    next();
};
const { ProviderLocation, Booking, ServiceProvider } = require('../models');

exports.updateLocation = async (req, res) => {
    try {
        const { booking_id, latitude, longitude } = req.body;
        const spid = req.user.id;

        if (req.user.role !== 'ServiceProvider') {
            return res.status(403).json({ message: 'Only providers can update location' });
        }

        // Verify booking belongs to provider
        const booking = await Booking.findOne({ where: { booking_id, spid } });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or unauthorized' });
        }

        if (booking.status !== 'Accepted') {
            return res.status(400).json({ message: 'Can only track active bookings' });
        }

        const location = await ProviderLocation.create({
            booking_id,
            spid,
            latitude,
            longitude
        });

        res.json(location);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLocation = async (req, res) => {
    try {
        const { booking_id } = req.params;

        // Auth check: User who booked or Admin or the Provider themselves
        const booking = await Booking.findByPk(booking_id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (req.user.role === 'User' && booking.uid !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
        if (req.user.role === 'ServiceProvider' && booking.spid !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        const location = await ProviderLocation.findOne({
            where: { booking_id },
            order: [['createdAt', 'DESC']]
        });

        res.json(location);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

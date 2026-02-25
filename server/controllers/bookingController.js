const { Booking, Service, User, ServiceProvider, ProviderLocation } = require('../models');
const { Op } = require('sequelize');

exports.createBooking = async (req, res) => {
    try {
        const { service_id, booking_date, booking_time } = req.body;
        const uid = req.user.id; // User ID from auth

        if (req.user.role !== 'User') {
            return res.status(403).json({ message: 'Only Users can book services' });
        }

        const service = await Service.findByPk(service_id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Check availability
        const existingBooking = await Booking.findOne({
            where: {
                service_id,
                booking_date,
                booking_time,
                status: { [Op.notIn]: ['Cancelled', 'Rejected'] }
            }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        const booking = await Booking.create({
            uid,
            spid: service.spid,
            service_id,
            booking_date,
            booking_time,
            status: 'Pending'
        });

        // Create Notification for Service Provider
        const user = await User.findByPk(uid);
        await Notification.create({
            uid: service.spid,
            user_role: 'ServiceProvider',
            message: `New booking request from ${user.ufname} for "${service.service_name}" on ${booking_date}`,
            type: 'booking',
            related_id: booking.booking_id,
            related_role: 'User'
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const { role, id } = req.user;
        let whereClause = {};

        if (role === 'User') {
            whereClause = { uid: id };
        } else if (role === 'ServiceProvider') {
            whereClause = { spid: id };
        } else if (role === 'Admin') {
            // Admin sees all, or filter via query
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const bookings = await Booking.findAll({
            where: whereClause,
            include: [
                { model: Service, attributes: ['service_name', 'price'] },
                { model: User, attributes: ['ufname', 'ulname', 'email', 'phone_number', 'address'] }, // For Provider to see who booked
                { model: ServiceProvider, attributes: ['sname', 'phone', 'email'] } // For User to see who they booked
            ],
            order: [['booking_date', 'DESC'], ['booking_time', 'DESC']]
        });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        // Include Service to ensure we have the service_name for notifications
        const booking = await Booking.findByPk(req.params.id, {
            include: [{ model: Service }]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === status) {
            return res.status(400).json({ message: `Booking already ${status}` });
        }

        // Authorization check
        if (req.user.role === 'ServiceProvider') {
            if (booking.spid !== req.user.id) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            // Provider can Accept, Reject, Complete
            if (!['Accepted', 'Rejected', 'Completed'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status update for Provider' });
            }
        } else if (req.user.role === 'User') {
            if (booking.uid !== req.user.id) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            // User can Cancel
            if (status !== 'Cancelled') {
                return res.status(400).json({ message: 'Users can only Cancel bookings' });
            }
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await booking.update({ status });

        // Add Notification
        if (req.user.role === 'ServiceProvider') {
            // Notify User about status update
            await Notification.create({
                uid: booking.uid,
                user_role: 'User',
                message: `Your booking for "${booking.Service.service_name}" has been ${status}.`,
                type: 'booking',
                related_id: booking.booking_id,
                related_role: 'ServiceProvider'
            });
        } else if (req.user.role === 'User' && status === 'Cancelled') {
            // Notify Provider about cancellation
            const user = await User.findByPk(req.user.id);
            await Notification.create({
                uid: booking.spid,
                user_role: 'ServiceProvider',
                message: `${user.ufname} has cancelled their booking for "${booking.Service.service_name}".`,
                type: 'booking',
                related_id: booking.booking_id,
                related_role: 'User'
            });
        }

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                { model: Service },
                { model: User, attributes: ['ufname', 'ulname'] },
                { model: ServiceProvider, attributes: ['sname'] }
            ]
        });

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Access control
        if (req.user.role === 'User' && booking.uid !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
        if (req.user.role === 'ServiceProvider' && booking.spid !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

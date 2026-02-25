const { Review, Booking, ServiceProvider, Notification, User } = require('../models');
const aiSpamCheck = require('../utils/aiSpamCheck');

exports.createReview = async (req, res) => {
    try {
        const { booking_id, rating, comment, image } = req.body;
        const uid = req.user.id;

        const booking = await Booking.findByPk(booking_id, {
            include: [{ model: ServiceProvider }]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.uid !== uid) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (booking.status !== 'Completed') {
            return res.status(400).json({ message: 'Can only review completed bookings' });
        }

        const spamCheck = await aiSpamCheck(comment || '');
        if (spamCheck.isSpam) {
            return res.status(400).json({
                message: 'Review rejected by AI safety layer.',
                reason: spamCheck.reason
            });
        }

        const review = await Review.create({
            uid,
            spid: booking.spid,
            booking_id,
            rating,
            comments: comment,
            is_spam: false, // We reject in line 35 if it's spam
            image: image || null
        });

        // Create Notification for Provider
        const reviewer = await User.findByPk(uid);
        await Notification.create({
            uid: booking.spid,
            user_role: 'ServiceProvider',
            message: `${reviewer.ufname} left a ${rating}-star review for your service.`,
            type: 'review',
            related_id: booking.service_id,
            related_role: 'User'
        });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getReviewsByProvider = async (req, res) => {
    try {
        const { spid } = req.params;
        const reviews = await Review.findAll({
            where: { spid },
            include: ['User'] // Assumes association alias or model name
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

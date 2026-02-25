const { ServiceProvider, LocalResident, User, Booking, Review, Admin, Notification } = require('../models');

exports.verifyProvider = async (req, res) => {
    try {
        const { spid } = req.body;
        const provider = await ServiceProvider.findByPk(spid);

        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        await provider.update({ is_verified: true });

        // Add Notification
        await Notification.create({
            uid: spid,
            user_role: 'ServiceProvider',
            message: 'Your profile has been verified by the Admin. You can now accept bookings and list more services!',
            type: 'system',
            related_role: 'Admin'
        });

        res.json({ message: 'Provider verified successfully', provider });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyLocalResident = async (req, res) => {
    try {
        const { lrid } = req.body;
        const resident = await LocalResident.findByPk(lrid);

        if (!resident) {
            return res.status(404).json({ message: 'Local Resident not found' });
        }

        await resident.update({
            is_verified: true,
            residence_status: 'Verified',
            badge: 'Trusted Resident'
        });

        // Add Notification
        await Notification.create({
            uid: lrid,
            user_role: 'LocalResident',
            message: 'Congratulations! Your residence has been verified and you have earned the "Trusted Resident" badge.',
            related_role: 'Admin'
        });

        res.json({ message: 'Local Resident verified successfully and badge awarded', resident });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalProviders = await ServiceProvider.count();
        const totalBookings = await Booking.count();
        const totalReviews = await Review.count();
        const spamReviews = await Review.count({ where: { is_spam: true } });
        const pendingProviders = await ServiceProvider.count({ where: { is_verified: false } });

        res.json({
            totalUsers,
            totalProviders,
            totalBookings,
            totalReviews,
            spamReviews,
            pendingProviders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllProviders = async (req, res) => {
    try {
        const providers = await ServiceProvider.findAll();
        res.json(providers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getAllResidents = async (req, res) => {
    try {
        const residents = await LocalResident.findAll();
        res.json(residents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

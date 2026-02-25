
const { Notification } = require('../models');

exports.getUserNotifications = async (req, res) => {
    try {
        const uid = req.user.id;
        const user_role = req.user.role;

        const { Op } = require('sequelize');

        const notifications = await Notification.findAll({
            where: {
                uid,
                user_role,
                type: { [Op.ne]: 'chat' } // Exclude chat notifications from global list
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByPk(id);

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        // Ensure user owns notification
        if (notification.uid !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        notification.is_read = true;
        await notification.save();
        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const uid = req.user.id;
        const user_role = req.user.role;

        const { Op } = require('sequelize');

        await Notification.update(
            { is_read: true },
            {
                where: {
                    uid,
                    user_role,
                    is_read: false,
                    type: { [Op.ne]: 'chat' } // Only mark non-chat notifications as read
                }
            }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

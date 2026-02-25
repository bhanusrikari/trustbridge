const { Message, User, ServiceProvider, LocalResident, Notification, Admin } = require('../models');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
    try {
        const { receiver_id, receiver_role, content } = req.body;
        const sender_id = req.user.id;
        const sender_role = req.user.role;

        const message = await Message.create({
            sender_id,
            sender_role,
            receiver_id,
            receiver_role,
            content
        });

        // Fetch sender name
        let senderName = 'Someone';
        if (sender_role === 'User') {
            const user = await User.findByPk(sender_id);
            senderName = user ? `${user.ufname}` : 'A user';
        } else if (sender_role === 'ServiceProvider') {
            const sp = await ServiceProvider.findByPk(sender_id);
            senderName = sp ? sp.sname : 'A provider';
        } else if (sender_role === 'LocalResident') {
            const lr = await LocalResident.findByPk(sender_id);
            senderName = lr ? `${lr.fname}` : 'A resident';
        } else if (sender_role === 'Admin') {
            const admin = await Admin.findByPk(sender_id);
            senderName = admin ? admin.username : 'Admin';
        }

        // Create Notification for Receiver - REMOVED (Requirement: chat notifications only on Chat link)
        /*
        await Notification.create({
            uid: receiver_id,
            user_role: receiver_role,
            message: `New message from ${senderName}: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
            type: 'chat',
            related_id: sender_id,
            related_role: sender_role
        });
        */

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { other_id, other_role } = req.query;
        const my_id = req.user.id;
        const my_role = req.user.role;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: my_id, sender_role: my_role, receiver_id: other_id, receiver_role: other_role },
                    { sender_id: other_id, sender_role: other_role, receiver_id: my_id, receiver_role: my_role }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        // Mark messages as read
        await Message.update({ is_read: true }, {
            where: {
                receiver_id: my_id,
                receiver_role: my_role,
                sender_id: other_id,
                sender_role: other_role,
                is_read: false
            }
        });

        // Mark corresponding notifications as read - REMOVED (Requirement: chat notifications only on Chat link)
        /*
        await Notification.update({ is_read: true }, {
            where: {
                uid: my_id,
                user_role: my_role,
                type: 'chat',
                related_id: other_id,
                related_role: other_role,
                is_read: false
            }
        });
        */

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const my_id = req.user.id;
        const my_role = req.user.role;

        // Find all messages involving me
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: my_id, sender_role: my_role },
                    { receiver_id: my_id, receiver_role: my_role }
                ]
            },
            order: [['createdAt', 'DESC']]
        });

        const conversations = {};

        for (const msg of messages) {
            const isSender = msg.sender_id === my_id && msg.sender_role === my_role;
            const otherId = isSender ? msg.receiver_id : msg.sender_id;
            const otherRole = isSender ? msg.receiver_role : msg.sender_role;
            const key = `${otherRole}_${otherId}`;

            if (!conversations[key]) {
                let name = 'Unknown';
                // Fetch name based on role
                if (otherRole === 'User') {
                    const user = await User.findByPk(otherId);
                    name = user ? `${user.ufname} ${user.ulname}` : 'Unknown User';
                } else if (otherRole === 'ServiceProvider') {
                    const sp = await ServiceProvider.findByPk(otherId);
                    name = sp ? sp.sname : 'Unknown Provider';
                } else if (otherRole === 'LocalResident') {
                    const lr = await LocalResident.findByPk(otherId);
                    name = lr ? `${lr.fname} ${lr.lname}` : 'Unknown Resident';
                } else if (otherRole === 'Admin') {
                    const admin = await Admin.findByPk(otherId);
                    name = admin ? admin.username : 'Admin';
                }

                const unread_count = await Message.count({
                    where: {
                        receiver_id: my_id,
                        receiver_role: my_role,
                        sender_id: otherId,
                        sender_role: otherRole,
                        is_read: false
                    }
                });

                conversations[key] = {
                    other_id: otherId,
                    other_role: otherRole,
                    name,
                    last_message: msg.content,
                    time: msg.createdAt,
                    unread_count
                };
            }
        }

        res.json(Object.values(conversations));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUnreadCounts = async (req, res) => {
    try {
        const my_id = req.user.id;
        const my_role = req.user.role;

        const unreadMessages = await Message.count({
            where: {
                receiver_id: my_id,
                receiver_role: my_role,
                is_read: false
            }
        });

        const unreadNotifications = await Notification.count({
            where: {
                uid: my_id,
                user_role: my_role,
                is_read: false
            }
        });

        res.json({ unreadMessages, unreadNotifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const { LocalResident, CommunityForum, LocalGuidanceChat, User } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
    try {
        const lrid = req.user.id; // From authMiddleware

        // 1. Get Resident data
        const resident = await LocalResident.findByPk(lrid);
        if (!resident) return res.status(404).json({ message: 'Resident not found' });

        // 2. Count Forum Likes (total likes on all posts by this resident)
        const forumPosts = await CommunityForum.findAll({
            where: { uid: lrid, user_role: 'LocalResident' }
        });
        const totalLikes = forumPosts.reduce((acc, post) => acc + (post.likes || 0), 0);

        // 3. Count Newcomers Helped (distinct User IDs in LocalGuidanceChat)
        const helpedCount = await LocalGuidanceChat.count({
            distinct: true,
            col: 'uid',
            where: { lrid: lrid }
        });

        res.json({
            trustRating: resident.trust_rating,
            badge: resident.badge,
            residenceStatus: resident.residence_status,
            totalLikes,
            helpedCount,
            city: resident.city,
            area: resident.area
        });
    } catch (error) {
        console.error('getDashboardStats Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getGuidanceRequests = async (req, res) => {
    try {
        const lrid = req.user.id;

        // Fetch recent chats for this resident, including newcomer info
        const chats = await LocalGuidanceChat.findAll({
            where: { lrid: lrid },
            include: [{ model: User, attributes: ['uid', 'ufname', 'ulname'] }],
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        res.json(chats);
    } catch (error) {
        console.error('getGuidanceRequests Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

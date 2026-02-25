const { CommunityForum, User, ForumComment, Notification, LocalResident, ServiceProvider, Admin } = require('../models');
const aiSpamCheck = require('../utils/aiSpamCheck');

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const uid = req.user.id;

        // AI Spam Check
        const spamCheck = await aiSpamCheck(`${title} ${content}`);
        if (spamCheck.isSpam) {
            return res.status(400).json({
                message: 'Post rejected by AI safety layer.',
                reason: spamCheck.reason
            });
        }

        const newPost = await CommunityForum.create({
            uid,
            user_role: req.user.role,
            title,
            content
        });

        // Fetch with user details for immediate display
        const postWithUser = await CommunityForum.findByPk(newPost.post_id, {
            include: [
                { model: User, attributes: ['ufname', 'ulname'] },
                { model: LocalResident, attributes: ['fname', 'lname'] },
                { model: ServiceProvider, attributes: ['sname'] },
                { model: Admin, attributes: ['username'] }
            ]
        });

        res.status(201).json(postWithUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await CommunityForum.findAll({
            include: [
                { model: User, attributes: ['ufname', 'ulname'] },
                { model: LocalResident, attributes: ['fname', 'lname'] },
                { model: ServiceProvider, attributes: ['sname'] },
                { model: Admin, attributes: ['username'] },
                {
                    model: ForumComment,
                    include: [
                        { model: User, attributes: ['ufname', 'ulname'] },
                        { model: LocalResident, attributes: ['fname', 'lname'] },
                        { model: ServiceProvider, attributes: ['sname'] },
                        { model: Admin, attributes: ['username'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await CommunityForum.findByPk(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.likes += 1;
        await post.save();

        // Create Notification for Author (unless author liked their own post)
        if (post.uid !== req.user.id || post.user_role !== req.user.role) {
            let likerName = 'Someone';
            if (req.user.role === 'User') {
                const user = await User.findByPk(req.user.id);
                likerName = user ? user.ufname : 'A user';
            } else if (req.user.role === 'ServiceProvider') {
                const sp = await ServiceProvider.findByPk(req.user.id);
                likerName = sp ? sp.sname : 'A provider';
            } else if (req.user.role === 'LocalResident') {
                const lr = await LocalResident.findByPk(req.user.id);
                likerName = lr ? lr.fname : 'A resident';
            } else if (req.user.role === 'Admin') {
                likerName = 'Admin';
            }

            await Notification.create({
                uid: post.uid,
                user_role: post.user_role,
                message: `${likerName} liked your post: "${post.title}"`,
                type: 'like',
                related_id: id, // post_id
                related_role: req.user.role
            });
        }

        res.json({ message: 'Post liked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const uid = req.user.id;

        // AI Spam Check
        const spamCheck = await aiSpamCheck(comment);
        if (spamCheck.isSpam) {
            return res.status(400).json({
                message: 'Comment rejected by AI safety layer.',
                reason: spamCheck.reason
            });
        }

        const newComment = await ForumComment.create({
            post_id: id,
            uid,
            user_role: req.user.role,
            comment
        });

        const post = await CommunityForum.findByPk(id);

        // Create Notification for Author (unless author commented on their own post)
        if (post.uid !== uid || post.user_role !== req.user.role) {
            let commenterName = 'Someone';
            if (req.user.role === 'User') {
                const user = await User.findByPk(uid);
                commenterName = user ? user.ufname : 'A user';
            } else if (req.user.role === 'ServiceProvider') {
                const sp = await ServiceProvider.findByPk(uid);
                commenterName = sp ? sp.sname : 'A provider';
            } else if (req.user.role === 'LocalResident') {
                const lr = await LocalResident.findByPk(uid);
                commenterName = lr ? lr.fname : 'A resident';
            } else if (req.user.role === 'Admin') {
                commenterName = 'Admin';
            }

            await Notification.create({
                uid: post.uid,
                user_role: post.user_role,
                message: `${commenterName} commented on your post: "${post.title}"`,
                type: 'comment',
                related_id: id, // post_id
                related_role: req.user.role
            });
        }

        const commentWithUser = await ForumComment.findByPk(newComment.comment_id, {
            include: [
                { model: User, attributes: ['ufname', 'ulname'] },
                { model: LocalResident, attributes: ['fname', 'lname'] },
                { model: ServiceProvider, attributes: ['sname'] },
                { model: Admin, attributes: ['username'] }
            ]
        });

        res.status(201).json(commentWithUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await CommunityForum.findByPk(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.likes += 1;
        await post.save();
        res.json(post);
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

        const newComment = await ForumComment.create({
            post_id: id,
            uid,
            comment
        });

        const commentWithUser = await ForumComment.findByPk(newComment.comment_id, {
            include: [{ model: User, attributes: ['ufname', 'ulname'] }]
        });

        res.status(201).json(commentWithUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

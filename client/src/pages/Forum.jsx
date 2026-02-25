import { useState, useEffect } from 'react';
import api from '../services/api';

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/forum');
            setPosts(res.data);
        } catch (error) {
            console.error("Error loading posts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/forum', newPost);
            setPosts([res.data, ...posts]);
            setNewPost({ title: '', content: '' });
        } catch (error) {
            alert('Failed to create post');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Community Forum</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Create Post */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            Start a Discussion
                        </h3>
                        <form onSubmit={handleCreatePost}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm border p-3 transition duration-200"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                    required
                                    placeholder="What's on your mind?"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Content</label>
                                <textarea
                                    className="w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm border p-3 h-32 transition duration-200 resize-none"
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                    required
                                    placeholder="Share your experience or ask a question..."
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md font-semibold transform hover:-translate-y-0.5">Post Discussion</button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Posts List */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-gray-200">
                            <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                            </div>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No discussions yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Be the first to start a conversation in your community.</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostItem key={post.post_id} post={post} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const PostItem = ({ post }) => {
    const [likes, setLikes] = useState(post.likes || 0);
    const [comments, setComments] = useState(post.ForumComments || []);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleLike = async () => {
        try {
            await api.put(`/forum/${post.post_id}/like`);
            setLikes(likes + 1);
        } catch (error) {
            console.error("Error liking post", error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/forum/${post.post_id}/comment`, { comment: newComment });
            setComments([...comments, res.data]);
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    const getAuthorName = (p) => {
        if (p.user_role === 'User' && p.User) return `${p.User.ufname} ${p.User.ulname || ''}`;
        if (p.user_role === 'LocalResident' && p.LocalResident) return `${p.LocalResident.fname} ${p.LocalResident.lname || ''}`;
        if (p.user_role === 'ServiceProvider' && p.ServiceProvider) return p.ServiceProvider.sname;
        if (p.user_role === 'Admin' && p.Admin) return p.Admin.username;

        // Fallback for cases where join might be missing but role is known
        if (p.User) return `${p.User.ufname} ${p.User.ulname || ''}`;
        if (p.LocalResident) return `${p.LocalResident.fname} ${p.LocalResident.lname || ''}`;
        if (p.ServiceProvider) return p.ServiceProvider.sname;
        if (p.Admin) return p.Admin.username;

        return 'Anonymous';
    };

    const getAvatarText = (p) => {
        const name = getAuthorName(p);
        return name.charAt(0);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
            <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold shadow-sm">
                    {getAvatarText(post)}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-bold text-gray-900">
                        {getAuthorName(post)}
                        <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] uppercase tracking-tighter">
                            {post.user_role}
                        </span>
                    </p>
                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{post.title}</h3>
            <p className="text-gray-600 leading-relaxed">{post.content}</p>

            <div className="mt-6 flex items-center text-sm text-gray-500 space-x-6 border-t border-gray-100 pt-4">
                <button onClick={handleLike} className="flex items-center hover:text-blue-600 transition group">
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    Like ({likes})
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center hover:text-blue-600 transition group">
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    Comment ({comments.length})
                </button>
            </div>

            {showComments && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                        {comments.map(comment => (
                            <div key={comment.comment_id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <span className="text-xs font-bold text-gray-800 mr-2">{getAuthorName(comment)}</span>
                                    <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded uppercase">{comment.user_role}</span>
                                </div>
                                <p className="text-sm text-gray-600">{comment.comment}</p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleComment} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Post</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Forum;

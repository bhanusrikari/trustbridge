import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ResidentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [guidanceRequests, setGuidanceRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, guidanceRes] = await Promise.all([
                    api.get('/resident/stats'),
                    api.get('/resident/guidance-requests')
                ]);
                setStats(statsRes.data);
                setGuidanceRequests(guidanceRes.data);
            } catch (error) {
                console.error("Error fetching resident dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Resident Dashboard</h2>
                    <p className="text-slate-500 mt-1">Community Leader: <span className="font-semibold text-slate-700">{stats?.city}, {stats?.area}</span></p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-sm ${stats?.residenceStatus === 'Verified' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04Store 0 00-2.433 3.328 11.955 11.955 0 005.106 8.35c.148.102.29.213.425.332a.5.5 0 00.686 0 11.979 11.979 0 00.425-.332 11.955 11.955 0 005.106-8.35 1.002 1.002 0 00-2.433-3.328z" />
                        </svg>
                        {stats?.residenceStatus || 'Pending'} Resident
                    </div>
                    {stats?.badge && stats?.badge !== 'None' && (
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-md">
                            <span className="mr-2">🏆</span>
                            {stats.badge}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="text-3xl font-black text-indigo-600 mb-1">{stats?.trustRating?.toFixed(1) || '0.0'}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trust Rating</div>
                    <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${(stats?.trustRating || 0) * 20}%` }}></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="text-3xl font-black text-rose-500 mb-1">{stats?.totalLikes || 0}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Forum Impact</div>
                    <div className="text-[10px] text-slate-500 mt-1">Total Likes Received</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="text-3xl font-black text-emerald-500 mb-1">{stats?.helpedCount || 0}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Guidance Provided</div>
                    <div className="text-[10px] text-slate-500 mt-1">Unique Neighbors Helped</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-md flex flex-col justify-center items-center text-center text-white">
                    <div className="text-sm font-bold opacity-80 mb-2 uppercase tracking-widest">Growth Phase</div>
                    <div className="text-xl font-black">Community Pillar</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Guidance Requests */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center">
                                <span className="mr-2">🤝</span> Guidance Center
                            </h3>
                            <span className="text-xs font-bold text-slate-500">{guidanceRequests.length} Active Conversations</span>
                        </div>

                        {guidanceRequests.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                <div className="text-4xl mb-4">🏠</div>
                                <p className="font-medium">No guidance requests yet.</p>
                                <p className="text-sm">Newcomers from your area will appear here when they seek guidance.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {guidanceRequests.map((req) => (
                                    <div key={req.chat_id} className="p-4 hover:bg-slate-50 transition flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-4">
                                                {req.User?.ufname?.[0]}{req.User?.ulname?.[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{req.User?.ufname} {req.User?.ulname}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-1">{req.message}</p>
                                            </div>
                                        </div>
                                        <Link to="/chat" className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm shadow-indigo-200">
                                            Reply
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions & Tips */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                            <span className="mr-2">⚡</span> Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <Link to="/forum" className="w-full flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition group">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mr-3 group-hover:scale-110 transition">📢</div>
                                <span className="text-sm font-semibold text-slate-700">New Forum Post</span>
                            </Link>
                            <Link to="/chat" className="w-full flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition group">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3 group-hover:scale-110 transition">💬</div>
                                <span className="text-sm font-semibold text-slate-700">Open Inbox</span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <h4 className="text-indigo-800 font-bold text-sm mb-2">💡 Leader Tip</h4>
                        <p className="text-indigo-600 text-xs leading-relaxed">
                            Helping newcomers with local directions or trusted service recommendations builds your Trust Rating and earns you higher badges!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResidentDashboard;

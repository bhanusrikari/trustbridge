
import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProviders: 0,
        totalBookings: 0,
        pendingProviders: 0
    });
    const [providers, setProviders] = useState([]);
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('providers'); // 'providers', 'residents'

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const statsRes = await api.get('/admin/stats');
            setStats(statsRes.data);

            const providersRes = await api.get('/admin/providers');
            setProviders(providersRes.data);

            const residentsRes = await api.get('/admin/residents');
            setResidents(residentsRes.data);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching admin data", error);
            setLoading(false);
        }
    };

    const handleVerifyProvider = async (spid) => {
        try {
            await api.put('/admin/verify/provider', { spid });
            fetchDashboardData();
        } catch (error) {
            console.error("Error verifying provider", error);
            alert("Failed to verify provider");
        }
    };

    const handleVerifyResident = async (lrid) => {
        try {
            await api.put('/admin/verify/resident', { lrid });
            fetchDashboardData();
        } catch (error) {
            console.error("Error verifying resident", error);
            alert("Failed to verify resident");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    const unverifiedProviders = providers.filter(p => !p.is_verified);
    const unverifiedResidents = residents.filter(r => !r.is_verified);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Stats Cards ... (keep existing) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Providers</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalProviders}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingProviders}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('providers')}
                    className={`pb-2 px-4 font-bold text-sm transition-all ${activeTab === 'providers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Service Providers ({unverifiedProviders.length})
                </button>
                <button
                    onClick={() => setActiveTab('residents')}
                    className={`pb-2 px-4 font-bold text-sm transition-all ${activeTab === 'residents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Local Residents ({unverifiedResidents.length})
                </button>
            </div>

            {/* Verification Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-10">
                {activeTab === 'providers' ? (
                    <>
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">Pending Provider Verifications</h3>
                        </div>
                        {unverifiedProviders.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No pending verifications.</div>
                        ) : (
                            <VerificationTable
                                data={unverifiedProviders}
                                type="provider"
                                onVerify={handleVerifyProvider}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">Pending Resident Verifications</h3>
                        </div>
                        {unverifiedResidents.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No pending verifications.</div>
                        ) : (
                            <VerificationTable
                                data={unverifiedResidents}
                                type="resident"
                                onVerify={handleVerifyResident}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const VerificationTable = ({ data, type, onVerify }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location/Address</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map(item => (
                    <tr key={type === 'provider' ? item.spid : item.lrid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {(item.sname || item.fname || 'U').charAt(0)}
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{item.sname || `${item.fname} ${item.lname || ''}`}</div>
                                    <div className="text-sm text-gray-500">ID: {item.spid || item.lrid}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.email}</div>
                            <div className="text-sm text-gray-500">{item.phone || item.phone_number || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.address || `${item.area || ''}, ${item.city || ''}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => onVerify(type === 'provider' ? item.spid : item.lrid)}
                                className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition"
                            >
                                Verify
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default AdminDashboard;

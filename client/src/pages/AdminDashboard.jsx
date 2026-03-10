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
    const [pendingServices, setPendingServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('services'); // 'services', 'providers', 'residents'
    const [isImporting, setIsImporting] = useState(false);
    const [importCategory, setImportCategory] = useState('Plumbing');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, providersRes, residentsRes, servicesRes] = await Promise.all([
                api.get('/admin/dashboard-stats'),
                api.get('/admin/providers'),
                api.get('/admin/residents'),
                api.get('/admin/pending-services')
            ]);

            setStats(statsRes.data);
            setProviders(providersRes.data);
            setResidents(residentsRes.data);
            setPendingServices(servicesRes.data);

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
        }
    };

    const handleVerifyResident = async (lrid) => {
        try {
            await api.put('/admin/verify/resident', { lrid });
            fetchDashboardData();
        } catch (error) {
            console.error("Error verifying resident", error);
        }
    };

    const handleApproveService = async (serviceId) => {
        try {
            await api.post(`/admin/approve-service/${serviceId}`);
            fetchDashboardData();
        } catch (error) {
            console.error("Error approving service", error);
        }
    };

    const handleRejectService = async (serviceId) => {
        const reason = prompt("Enter rejection reason:");
        if (reason === null) return;
        try {
            await api.post(`/admin/reject-service/${serviceId}`, { reason });
            fetchDashboardData();
        } catch (error) {
            console.error("Error rejecting service", error);
        }
    };

    const handleImportServices = async () => {
        setIsImporting(true);
        try {
            const res = await api.post('/admin/import-google-services', { categoryName: importCategory, count: 5 });
            alert(res.data.message);
            fetchDashboardData();
        } catch (error) {
            alert("Import failed");
        } finally {
            setIsImporting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600"></div></div>;

    const unverifiedProviders = providers.filter(p => !p.is_verified);
    const unverifiedResidents = residents.filter(r => !r.is_verified);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-surface-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-surface-500 font-medium">Manage users, providers, and services.</p>
                </div>
                <button onClick={fetchDashboardData} className="btn-premium bg-surface-100 text-surface-700 hover:bg-surface-200 px-6 py-2.5 text-xs">
                    REFRESH DATA
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'blue' },
                    { label: 'Providers', value: stats.totalProviders, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'green' },
                    { label: 'Bookings', value: stats.totalBookings, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'purple' },
                    { label: 'Pending Services', value: stats.pendingProviders, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'yellow' }
                ].map((stat, i) => (
                    <div key={i} className="glass p-8 rounded-[32px] border border-surface-100/50 flex items-center gap-6">
                        <div className={`p-4 rounded-2xl bg-${stat.color}-100 text-${stat.color}-600`}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-black text-surface-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-surface-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Google Intelligence Section */}
            <div className="glass p-10 rounded-[48px] border border-primary-100 bg-primary-50/20 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex gap-6 items-center">
                    <div className="p-5 bg-primary-500 text-white rounded-[24px] shadow-premium">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-surface-900 tracking-tight">Google Intelligence</h3>
                        <p className="text-surface-500 font-medium">Bulk import real world services and businesses into TrustBridge.</p>
                    </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select 
                        className="bg-white border-2 border-primary-100 rounded-2xl px-6 py-4 font-bold text-surface-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all min-w-[200px]"
                        value={importCategory}
                        onChange={(e) => setImportCategory(e.target.value)}
                    >
                        <option value="Plumbing">Plumbing</option>
                        <option value="House Cleaning">House Cleaning</option>
                        <option value="Electrical">Electrical</option>
                        <option value="AC Repair">AC Repair</option>
                    </select>
                    <button 
                        onClick={handleImportServices}
                        disabled={isImporting}
                        className="btn-premium bg-primary-600 text-white hover:bg-primary-700 px-10 py-4 flex items-center gap-3 shadow-xl"
                    >
                        {isImporting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        )}
                        <span className="text-xs font-black tracking-widest uppercase">{isImporting ? 'IMPORTING...' : 'IMPORT NOW'}</span>
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="glass p-2 rounded-[24px] inline-flex gap-2 mb-10">
                {[
                    { id: 'services', label: 'Pending Services', count: pendingServices.length },
                    { id: 'providers', label: 'Providers', count: unverifiedProviders.length },
                    { id: 'residents', label: 'Residents', count: unverifiedResidents.length }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-3.5 rounded-2xl text-xs font-black tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-premium' : 'text-surface-500 hover:text-surface-900'}`}
                    >
                        {tab.label.toUpperCase()} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="card-premium rounded-[40px] overflow-hidden border border-surface-100">
                {activeTab === 'services' && (
                    <>
                        <div className="px-10 py-8 border-b border-surface-100 bg-surface-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-surface-900">New Service Requests</h3>
                                <p className="text-sm text-surface-500 font-medium">Services awaiting verification.</p>
                            </div>
                        </div>
                        {pendingServices.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-surface-400 font-bold uppercase tracking-widest text-sm">Clear Queue</p>
                            </div>
                        ) : (
                            <ServicesApprovalTable 
                                services={pendingServices} 
                                onApprove={handleApproveService}
                                onReject={handleRejectService}
                            />
                        )}
                    </>
                )}

                {activeTab === 'providers' && (
                    <>
                        <div className="px-10 py-8 border-b border-surface-100 bg-surface-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-surface-900">Provider Verification</h3>
                                <p className="text-sm text-surface-500 font-medium">Review provider identity and documents.</p>
                            </div>
                        </div>
                        {unverifiedProviders.length === 0 ? (
                            <div className="p-20 text-center text-surface-400 font-bold uppercase tracking-widest text-sm">All identity checks completed</div>
                        ) : (
                            <VerificationTable
                                data={unverifiedProviders}
                                type="provider"
                                onVerify={handleVerifyProvider}
                            />
                        )}
                    </>
                )}

                {activeTab === 'residents' && (
                    <>
                        <div className="px-10 py-8 border-b border-surface-100 bg-surface-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-surface-900">Resident Verification</h3>
                                <p className="text-sm text-surface-500 font-medium">Confirm resident addresses.</p>
                            </div>
                        </div>
                        {unverifiedResidents.length === 0 ? (
                            <div className="p-20 text-center text-surface-400 font-bold uppercase tracking-widest text-sm">Resident registry is up to date</div>
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

const ServicesApprovalTable = ({ services, onApprove, onReject }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full">
            <thead className="bg-surface-50">
                <tr>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Service Details</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Provider</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Price</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
                {services.map(service => (
                    <tr key={service.service_id} className="hover:bg-surface-50/30 transition-colors">
                        <td className="px-10 py-8">
                            <div className="flex items-center gap-5">
                                <img src={service.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                                <div>
                                    <div className="text-base font-bold text-surface-900">{service.service_name}</div>
                                    <div className="text-xs text-surface-500 font-medium mt-1 line-clamp-1">{service.description}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-10 py-8">
                            <div className="text-sm font-bold text-surface-700">{service.ServiceProvider?.User?.fname} {service.ServiceProvider?.User?.lname}</div>
                            <div className="text-xs text-surface-400 font-medium">{service.ServiceProvider?.User?.email}</div>
                        </td>
                        <td className="px-10 py-8">
                            <div className="text-lg font-black text-surface-900">₹{service.price}</div>
                        </td>
                        <td className="px-10 py-8 text-right space-x-3">
                            <button
                                onClick={() => onReject(service.service_id)}
                                className="px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest text-accent-600 hover:bg-accent-50 transition-all border border-accent-100"
                            >
                                REJECT
                            </button>
                            <button
                                onClick={() => onApprove(service.service_id)}
                                className="px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest bg-primary-600 text-white hover:bg-primary-700 shadow-premium transition-all"
                            >
                                APPROVE
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const VerificationTable = ({ data, type, onVerify }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full">
            <thead className="bg-surface-50">
                <tr>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Vendor/User</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Contact Info</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Address</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
                {data.map(item => (
                    <tr key={type === 'provider' ? item.spid : item.lrid} className="hover:bg-surface-50/30 transition-colors">
                        <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center text-surface-900 font-black text-lg">
                                    {(item.sname || item.fname || 'U').charAt(0)}
                                </div>
                                <div>
                                    <div className="text-base font-bold text-surface-900">{item.sname || `${item.fname} ${item.lname || ''}`}</div>
                                    <div className="text-xs text-surface-400 font-medium">SEC-ID: {item.spid || item.lrid}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-10 py-8">
                            <div className="text-sm font-bold text-surface-700">{item.email}</div>
                            <div className="text-xs text-surface-400 font-medium">{item.phone || item.phone_number || 'STATION UNKNOWN'}</div>
                        </td>
                        <td className="px-10 py-8">
                            <div className="text-sm font-medium text-surface-500 leading-relaxed max-w-xs capitalize">
                                {item.address || `${item.area || ''}, ${item.city || ''}`}
                            </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                            <button
                                onClick={() => onVerify(type === 'provider' ? item.spid : item.lrid)}
                                className="px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest bg-surface-900 text-white hover:bg-primary-600 shadow-premium transition-all"
                            >
                                VERIFY
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default AdminDashboard;

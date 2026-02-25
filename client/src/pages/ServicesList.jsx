import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BookingModal from '../components/BookingModal';
import MapComponent from '../components/MapComponent'; // Import MapComponent

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/services');
                setServices(res.data);
            } catch (error) {
                console.error("Error loading services", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const openBookingModal = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const filteredServices = services.filter(service =>
        service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === '' || service.Category?.cat_name === selectedCategory)
    );

    const categories = [...new Set(services.map(s => s.Category?.cat_name).filter(Boolean))];

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Find Services in Hyderabad</h2>

                {/* View Toggle */}
                <div className="bg-gray-100 p-1 rounded-lg flex space-x-1 mt-4 md:mt-0">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        List View
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Map View
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full md:w-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search for services, providers..."
                        className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-2 border"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="block w-full md:w-1/4 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-2 border px-3"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            {/* Content Area */}
            {viewMode === 'list' ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map(service => (
                            <div
                                key={service.service_id}
                                className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col border border-slate-100"
                            >
                                {/* Image Section */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={service.image || "https://images.unsplash.com/photo-1581578731522-9945ff16a042?auto=format&fit=crop&w=800&q=80"}
                                        alt={service.service_name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                                            {service.Category?.cat_name || 'Service'}
                                        </span>
                                    </div>
                                    {service.ServiceProvider?.is_verified && (
                                        <div className="absolute top-4 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">
                                        {service.service_name}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                                        {service.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Starts at</span>
                                            <span className="text-2xl font-black text-slate-900">₹{service.price}</span>
                                        </div>
                                        <Link
                                            to={`/service/${service.service_id}`}
                                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
                                        >
                                            VIEW DETAILS
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredServices.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            <p className="text-slate-500 text-xl font-black">No services found matching your criteria.</p>
                        </div>
                    )}
                </>
            ) : (
                <MapComponent services={filteredServices} />
            )}
        </div>
    );
};

export default ServicesList;

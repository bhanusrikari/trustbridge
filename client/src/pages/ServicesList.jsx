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
    const [selectedLocation, setSelectedLocation] = useState('');
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const locationsList = [
        "Gachibowli", "Hitech City", "Kondapur", "Madhapur", "Kukatpally", 
        "Bachupally", "Secunderabad", "Miyapur"
    ];

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

    const handleDetectLocation = () => {
        setDetectingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        // Reverse geocoding could be done here if needed
                        console.log("Detected location:", latitude, longitude);
                        // For now, let's just simulate detecting a nearby area or just toast success
                        alert(`Location detected! Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. Searching nearby...`);
                    } catch (error) {
                        console.error("Error with geocoding", error);
                    } finally {
                        setDetectingLocation(false);
                    }
                },
                (error) => {
                    console.error("Error detecting location", error);
                    alert("Unable to detect location. Please check browser permissions.");
                    setDetectingLocation(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setDetectingLocation(false);
        }
    };

    const filteredServices = services.filter(service =>
        (service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         service.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory === '' || service.Category?.cat_name === selectedCategory) &&
        (selectedLocation === '' || service.address?.includes(selectedLocation))
    );

    const categories = [...new Set(services.map(s => s.Category?.cat_name).filter(Boolean))];

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-surface-900 tracking-tight">Verified Services</h2>
                    <p className="text-surface-500 font-medium">Find the most trusted professionals in your neighborhood.</p>
                </div>

                {/* View Toggle */}
                <div className="glass p-1.5 rounded-2xl flex space-x-1">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-primary-600 text-white shadow-lg' : 'text-surface-500 hover:text-surface-700'}`}
                    >
                        LIST VIEW
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-primary-600 text-white shadow-lg' : 'text-surface-500 hover:text-surface-700'}`}
                    >
                        MAP VIEW
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="glass p-6 rounded-[32px] mb-12 flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-grow w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-surface-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="What are you looking for?"
                        className="pl-12 block w-full bg-surface-50 border-transparent rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 font-medium transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <select
                        className="block w-full sm:w-48 bg-surface-50 border-transparent rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-4 font-medium transition-all"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <select
                        className="block w-full sm:w-48 bg-surface-50 border-transparent rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-4 font-medium transition-all"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                        <option value="">Local Areas</option>
                        {locationsList.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>

                    <button
                        onClick={handleDetectLocation}
                        disabled={detectingLocation}
                        className={`flex items-center justify-center gap-2 btn-premium ${detectingLocation ? 'bg-surface-200' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'} px-6 py-4`}
                    >
                        {detectingLocation ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-700"></div>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        )}
                        <span className="text-xs uppercase tracking-widest font-black">Detect My Location</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'list' ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredServices.map(service => (
                            <div
                                key={service.service_id}
                                className="card-premium group flex flex-col hover:-translate-y-2"
                            >
                                {/* Image Section */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={service.image || "https://images.unsplash.com/photo-1581578731522-9945ff16a042?auto=format&fit=crop&w=800&q=80"}
                                        alt={service.service_name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-transparent"></div>
                                    <div className="absolute top-6 left-6">
                                        <span className="glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-surface-900">
                                            {service.Category?.cat_name || 'General'}
                                        </span>
                                    </div>
                                    {service.ServiceProvider?.is_verified && (
                                        <div className="absolute top-6 right-6 bg-primary-500 text-white p-2.5 rounded-full shadow-premium">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        </div>
                                    )}
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center text-white/90 text-xs font-bold gap-2">
                                            <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                            {service.address || "Hyderabad"}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-bold text-surface-900 mb-3 leading-snug">
                                        {service.service_name}
                                    </h3>
                                    <p className="text-surface-500 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                                        {service.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-surface-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-1">Pricing From</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-surface-900">₹{service.price}</span>
                                                <span className="text-xs text-surface-400 font-bold">/visit</span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/service/${service.service_id}`}
                                            className="btn-premium bg-surface-900 text-white hover:bg-primary-600 px-8 py-3 text-xs tracking-widest"
                                        >
                                            DETAILS
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredServices.length === 0 && (
                        <div className="text-center py-32 glass rounded-[48px] border-2 border-dashed border-surface-200">
                            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-surface-900 mb-2">No matching services</h3>
                            <p className="text-surface-500 font-medium">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="rounded-[40px] overflow-hidden shadow-premium border border-surface-100">
                    <MapComponent services={filteredServices} />
                </div>
            )}
        </div>
    );
};

export default ServicesList;

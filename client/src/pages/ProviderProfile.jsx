import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BookingModal from '../components/BookingModal';

const ProviderProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/services/provider/${id}/profile`);
                setProvider(res.data.provider);
                setServices(res.data.services);
                setReviews(res.data.reviews);
            } catch (err) {
                console.error("Error fetching profile", err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const openBookingModal = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
    if (!provider) return <div className="text-center mt-10">Provider not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-blue-600 h-32 md:h-48"></div>
                <div className="px-6 py-4 md:flex md:items-end -mt-16 relative z-10">
                    <div className="bg-white p-2 rounded-full shadow-md">
                        <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-500 font-bold border-4 border-white">
                            {provider.sname.charAt(0)}
                        </div>
                    </div>
                    <div className="md:ml-6 mt-4 md:mt-0 pb-4">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            {provider.sname}
                            {provider.Category && (
                                <span className="ml-3 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md border border-blue-100 uppercase tracking-wider">
                                    {provider.Category.cat_name}
                                </span>
                            )}
                            {provider.is_verified && (
                                <svg className="w-6 h-6 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            )}
                        </h1>
                        <p className="text-gray-600 flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {provider.address || 'Hyderabad, India'}
                        </p>
                        <div className="mt-3 flex space-x-3">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address || 'Hyderabad')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                <svg className="w-5 h-5 mr-2 -ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                                Get Directions
                            </a>
                            <button
                                onClick={() => navigate(`/chat?providerId=${provider.spid}&role=ServiceProvider`)}
                                className="inline-flex items-center px-4 py-2 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                            >
                                <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                Message
                            </button>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">About</h3>
                    <p className="mt-2 text-gray-600">
                        {provider.description || `Professional service provider in Hyderabad offering high-quality services. Verified by TrustBridge AI.`}
                    </p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            {provider.email}
                        </div>
                        {provider.phone && (
                            <div className="flex items-center text-gray-600">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                {provider.phone}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Services List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Services Offered</h2>
                    {services.length === 0 ? (
                        <p className="text-gray-500">No services listed yet.</p>
                    ) : (
                        services.map(service => (
                            <div key={service.service_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-between items-center transition hover:shadow-md">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{service.service_name}</h3>
                                    <p className="text-gray-600 mb-2">{service.description}</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {service.Category?.cat_name}
                                    </span>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-gray-900 mb-3">₹{service.price}</div>
                                    <button
                                        onClick={() => openBookingModal(service)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Reviews Sidebar */}
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500 italic">No reviews yet.</p>
                        ) : (
                            reviews.map(review => (
                                <div key={review.review_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-semibold text-gray-900">{review.User?.ufname} {review.User?.ulname}</div>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceId={selectedService?.service_id}
                serviceName={selectedService?.service_name}
            />
        </div>
    );
};

export default ProviderProfile;

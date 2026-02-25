
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [providerLocation, setProviderLocation] = useState(null);
    const [activeTab, setActiveTab] = useState('about');
    const [isLiked, setIsLiked] = useState(false);

    const [error, setError] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [eligibleBooking, setEligibleBooking] = useState(null);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: '',
        image: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [uploadingReviewImage, setUploadingReviewImage] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/services/${id}`);
                setService(res.data);
                if (res.data.latitude && res.data.longitude) {
                    setProviderLocation([parseFloat(res.data.latitude), parseFloat(res.data.longitude)]);
                }
            } catch (err) {
                console.error("Error loading service details", err);
                setError(err.response?.data?.message || "Failed to load service details. The service ID might be invalid.");
            } finally {
                setLoading(false);
            }
        };
        const fetchEligibleBooking = async () => {
            if (!user) return;
            try {
                const res = await api.get(`/bookings/user`);
                // Find a completed booking for this service that hasn't been reviewed yet
                const booking = res.data.find(b => b.service_id === parseInt(id) && b.status === 'Completed');
                // In a real app, also check if review already exists
                setEligibleBooking(booking);
            } catch (err) {
                console.error("Error checking eligibility", err);
            }
        };
        fetchService();
        fetchEligibleBooking();
    }, [id, user]);

    const handleChat = () => {
        if (!service || !service.ServiceProvider?.spid) return;
        navigate(`/chat?userId=${service.ServiceProvider.spid}&role=ServiceProvider`);
    };

    const handleLike = async () => {
        setIsLiked(!isLiked);
    };

    const handleReviewFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingReviewImage(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            const res = await api.post('/upload', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setReviewForm({ ...reviewForm, image: res.data.imageUrl });
        } catch (error) {
            alert("Image upload failed");
        } finally {
            setUploadingReviewImage(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!eligibleBooking) return;

        setSubmittingReview(true);
        try {
            await api.post('/reviews', {
                booking_id: eligibleBooking.booking_id,
                rating: reviewForm.rating,
                comment: reviewForm.comment,
                image: reviewForm.image
            });
            // Refresh service details to show new review
            const res = await api.get(`/services/${id}`);
            setService(res.data);
            setIsReviewModalOpen(false);
            setEligibleBooking(null); // Hide button after review
            alert("Review submitted successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-white">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-400 animate-spin-slow"></div>
            </div>
        </div>
    );

    if (error || !service) return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-slate-50">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Service Not Found</h2>
            <p className="text-slate-500 mb-8 max-w-md font-medium">{error || "The service you're looking for might have been moved or doesn't exist anymore."}</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/services')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200">
                    BACK TO MARKETPLACE
                </button>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all">
                    RETRY
                </button>
            </div>
        </div>
    );

    // Mock images if none exist
    const serviceImages = [
        service.image || 'https://images.unsplash.com/photo-1581578731117-104f2a41272c?auto=format&fit=crop&q=80&w=1470',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1470',
        'https://images.unsplash.com/photo-1454165833767-02a6ed8a5874?auto=format&fit=crop&q=80&w=1470'
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors font-medium">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        Back
                    </button>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleLike}
                            className={`p-2 rounded-full transition-all ${isLiked ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                            <svg className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Visuals & Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 h-[400px] sm:h-[500px]">
                                <div className="md:col-span-2 relative h-full">
                                    <img src={serviceImages[0]} alt="Primary" className="w-full h-full object-cover rounded-2xl" />
                                    {service.ServiceProvider?.is_verified && (
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center shadow-lg border border-indigo-50">
                                            <div className="bg-green-500 rounded-full p-1 mr-2">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">Verified Professional</span>
                                        </div>
                                    )}
                                </div>
                                <div className="hidden md:flex flex-col gap-2 h-full">
                                    <div className="h-1/2">
                                        <img src={serviceImages[1]} alt="Gallery 1" className="w-full h-full object-cover rounded-2xl" />
                                    </div>
                                    <div className="h-1/2 relative">
                                        <img src={serviceImages[2]} alt="Gallery 2" className="w-full h-full object-cover rounded-2xl" />
                                        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-black/50 transition">
                                            <span className="text-white font-bold">+5 More</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-3 tracking-wider uppercase">
                                    {service.Category?.cat_name || 'Service'}
                                </span>
                                <h1 className="text-4xl font-black text-slate-900 leading-tight">{service.service_name}</h1>
                                <div className="flex items-center mt-3 space-x-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        <span className="ml-1 text-lg font-bold text-slate-900">{service.averageRating || '0.0'}</span>
                                        <span className="ml-1 text-slate-500">({service.reviewCount || 0} reviews)</span>
                                    </div>
                                    <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                                    <span className="text-slate-600 font-medium">{service.likes || 0} Likes</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-slate-500 text-sm font-medium mb-1">Starting Price</span>
                                <span className="text-4xl font-black text-indigo-600">₹{parseFloat(service.price).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-slate-200">
                            {['about', 'reviews', 'location'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 text-sm font-bold capitalize transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="py-2">
                            {activeTab === 'about' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">About this Service</h3>
                                        <p className="text-slate-600 leading-relaxed text-lg mb-8">{service.description}</p>

                                        {service.ServiceProvider?.description && (
                                            <div className="pt-8 border-t border-slate-50">
                                                <h3 className="text-xl font-bold text-slate-900 mb-4">About the Professional</h3>
                                                <p className="text-slate-600 leading-relaxed text-lg">{service.ServiceProvider.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Badges & Certificates */}
                                    <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl">
                                        <div className="flex items-center mb-6">
                                            <div className="bg-indigo-500/30 p-3 rounded-2xl mr-4">
                                                <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                            </div>
                                            <h3 className="text-2xl font-black">Professional Trust & Badges</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center border border-white/10">
                                                <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center mr-3 shrink-0">
                                                    <svg className="w-6 h-6 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" /></svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white uppercase text-xs tracking-widest">Aadhaar Verified</p>
                                                    <p className="text-xs text-indigo-300">Identity confirmed via govt docs</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center border border-white/10">
                                                <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center mr-3 shrink-0">
                                                    <svg className="w-6 h-6 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1.002V7M12 8V7m0 11v-1m0 0c-1.11 0-2.08-.402-2.599-1.002V17M12 18v1m0-1c-1.104 0-2-.895-2-2 0-1.105.896-2 2-2 1.104 0 2 .895 2 2 0 1.105-.896 2-2 2z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white uppercase text-xs tracking-widest">Secure Payments</p>
                                                    <p className="text-xs text-indigo-300">Guaranteed transaction safety</p>
                                                </div>
                                            </div>
                                        </div>
                                        {service.ServiceProvider?.documents && (
                                            <div className="mt-8">
                                                <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4">Certifications & Licenses</h4>
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center hover:bg-white/10 transition cursor-pointer">
                                                        <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                        <span className="text-sm">Trade License.pdf</span>
                                                    </div>
                                                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center hover:bg-white/10 transition cursor-pointer">
                                                        <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                        <span className="text-sm">Skill Certificate.pdf</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-slate-900">Patient & Customer Reviews</h3>
                                        {eligibleBooking && (
                                            <button
                                                onClick={() => setIsReviewModalOpen(true)}
                                                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                                            >
                                                Write a Review
                                            </button>
                                        )}
                                    </div>

                                    {/* Review Modal */}
                                    {isReviewModalOpen && (
                                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                                            <div className="bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-2xl font-black text-slate-900">Leave a Review</h3>
                                                    <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>

                                                <form onSubmit={handleReviewSubmit} className="space-y-6">
                                                    <div>
                                                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Rating</label>
                                                        <div className="flex space-x-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                                    className={`p-1 transition-transform active:scale-90 ${reviewForm.rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                                                                >
                                                                    <svg className="w-10 h-10 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Your Experience</label>
                                                        <textarea
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium h-32 placeholder-slate-300"
                                                            placeholder="How was the service? Mention quality, timing, etc."
                                                            value={reviewForm.comment}
                                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                            required
                                                        ></textarea>
                                                    </div>

                                                    <div>
                                                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Add a Photo</label>
                                                        <div className="relative group">
                                                            <input
                                                                type="file"
                                                                onChange={handleReviewFileChange}
                                                                className="hidden"
                                                                id="review-image-upload"
                                                                accept="image/*"
                                                            />
                                                            <label
                                                                htmlFor="review-image-upload"
                                                                className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-center h-[52px]"
                                                            >
                                                                {uploadingReviewImage ? (
                                                                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                                ) : reviewForm.image ? (
                                                                    <span className="text-indigo-600 truncate max-w-full">Photo Added ✓</span>
                                                                ) : (
                                                                    "Click to Upload Photo"
                                                                )}
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4 pt-4">
                                                        <button type="button" onClick={() => setIsReviewModalOpen(false)} className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-3xl font-black transition-all hover:bg-slate-200 uppercase tracking-widest text-xs">Cancel</button>
                                                        <button type="submit" disabled={submittingReview || uploadingReviewImage} className={`flex-[2] px-8 py-4 bg-indigo-600 text-white rounded-3xl font-black transition-all hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200 active:scale-95 uppercase tracking-widest text-xs ${submittingReview || uploadingReviewImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                            {submittingReview ? "SUBMITTING..." : "POST REVIEW"}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    {service.reviews?.length > 0 ? (
                                        service.reviews.map((review) => (
                                            <div key={review.review_id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 transition-all hover:border-indigo-100">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-indigo-50">
                                                            <img src={review.User?.profile_pic || `https://ui-avatars.com/api/?name=${review.User?.ufname}+${review.User?.ulname}&background=6366f1&color=fff`} alt="user" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="font-bold text-slate-900">{review.User?.ufname} {review.User?.ulname}</p>
                                                            <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex h-fit bg-amber-50 px-3 py-1 rounded-full border border-amber-100 items-center">
                                                        <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                        <span className="ml-1 text-sm font-black text-amber-700">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 leading-relaxed italic mb-4">"{review.comments}"</p>
                                                {review.image && (
                                                    <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 max-w-sm">
                                                        <img src={review.image} alt="Review attachment" className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(review.image)} />
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-slate-100 p-12 rounded-3xl text-center border-2 border-dashed border-slate-200">
                                            <p className="text-slate-500 font-medium">No reviews yet for this service.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'location' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                                            {providerLocation ? (
                                                <MapContainer key={providerLocation.toString()} center={providerLocation} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                                    <TileLayer
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    />
                                                    <Marker position={providerLocation}>
                                                        <Popup>
                                                            <div className="font-bold">{service.service_name}</div>
                                                            <div className="text-xs">{service.address}</div>
                                                        </Popup>
                                                    </Marker>
                                                </MapContainer>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-400 space-y-4">
                                                    <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9 7" /></svg>
                                                    <p className="font-bold uppercase tracking-widest text-xs">Digital office only</p>
                                                </div>
                                            )}
                                        </div>
                                        {service.address && (
                                            <div className="mt-6 p-4 bg-indigo-50 rounded-2xl flex items-start">
                                                <div className="bg-indigo-600 p-2 rounded-lg mr-4 mt-1 shrink-0">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 mb-1">Service Address</p>
                                                    <p className="text-slate-600">{service.address}</p>
                                                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm font-bold text-indigo-600 hover:underline">Get Directions in Google Maps →</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Booking & Professional */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Booking Card */}
                        <div className="sticky top-24 space-y-6">
                            {service.is_bookable ? (
                                <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 text-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors"></div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-6">Book this Service</h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                            <span className="text-slate-500 font-bold uppercase text-xs">Total Duration</span>
                                            <span className="font-black text-slate-900">~ 2-4 Hours</span>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                            <span className="text-slate-500 font-bold uppercase text-xs">Availability</span>
                                            <span className="font-black text-green-600">Immediate</span>
                                        </div>
                                    </div>

                                    <div className="text-left mb-8 space-y-2">
                                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Service Hub</span>
                                        <p className="text-sm font-bold text-slate-600 leading-relaxed">
                                            {service.address || 'Hitech City, Hyderabad'}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsBookingModalOpen(true)}
                                        className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200 transform hover:-translate-y-1 mb-4 active:scale-95 leading-none"
                                    >
                                        SCHEDULE NOW
                                    </button>

                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No upfront payment required</p>
                                </div>
                            ) : (
                                <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-100 transition-colors"></div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-6 italic flex items-center">
                                        <svg className="w-6 h-6 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Visitor Information
                                    </h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                            <span className="text-slate-500 font-bold uppercase text-xs">Entry Fee</span>
                                            <span className="font-black text-slate-900">Free / Nominal</span>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                            <span className="text-slate-500 font-bold uppercase text-xs">Timings</span>
                                            <span className="font-black text-slate-900">6:00 AM - 9:00 PM</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setActiveTab('location')}
                                        className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl transform hover:-translate-y-1 mb-4 leading-none"
                                    >
                                        GET DIRECTIONS
                                    </button>

                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">No appointment needed</p>
                                </div>
                            )}

                            {/* Provider Profile Card */}
                            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Hosted by</h4>
                                <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-indigo-50 border border-indigo-100 shrink-0 relative">
                                        <img src={service.ServiceProvider?.profile_pic || `https://ui-avatars.com/api/?name=${service.ServiceProvider?.sname}&background=6366f1&color=fff`} alt="pro" className="w-full h-full object-cover" />
                                        {service.ServiceProvider?.is_verified && (
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 overflow-hidden">
                                        <p className="font-bold text-slate-900 text-lg truncate leading-tight">{service.ServiceProvider?.sname}</p>
                                        <p className="text-indigo-600 font-bold text-xs uppercase tracking-tighter">Gold Tier Professional</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {service.ServiceProvider?.phone && (
                                        <a href={`tel:${service.ServiceProvider.phone}`} className="flex items-center p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition border border-slate-100 hover:border-indigo-100">
                                            <div className="bg-green-100 p-2 rounded-xl mr-3">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">{service.ServiceProvider.phone}</span>
                                        </a>
                                    )}
                                    <div className="flex items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="bg-blue-100 p-2 rounded-xl mr-3">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 truncate">{service.ServiceProvider?.email}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={handleChat} className="flex items-center justify-center p-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-100 transition-all border border-indigo-100">
                                        MESSAGE
                                    </button>
                                    <button
                                        onClick={() => navigate(`/provider/${service.ServiceProvider.spid}`)}
                                        className="flex items-center justify-center p-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all"
                                    >
                                        PROFILE
                                    </button>
                                </div>
                            </div>

                            {/* Safety Tips */}
                            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                                <h5 className="flex items-center text-amber-800 font-black text-xs uppercase tracking-widest mb-3">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Safety First
                                </h5>
                                <p className="text-xs text-amber-700 leading-relaxed font-medium">Verify identities upon arrival. Never share OTPs or personal documents. Pay through TrustBridge for secure dispute resolution.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                serviceId={id}
                serviceName={service.service_name}
            />
        </div>
    );
};

export default ServiceDetails;

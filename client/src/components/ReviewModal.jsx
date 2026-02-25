import { useState } from 'react';
import api from '../services/api';

const ReviewModal = ({ isOpen, onClose, bookingId, serviceName }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/reviews', { booking_id: bookingId, rating, comment });
            alert('Review submitted successfully!');
            onClose();
            window.location.reload(); // Simple reload to update state
        } catch (error) {
            alert('Failed to submit review: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative p-6 border w-full max-w-md shadow-lg rounded-xl bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Review Service</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <p className="text-gray-600 mb-6">Service: <span className="font-semibold text-gray-900">{serviceName}</span></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Comment</label>
                        <textarea
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition h-32 resize-none"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;

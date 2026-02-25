import { useState } from 'react';
import api from '../services/api';

const BookingModal = ({ isOpen, onClose, serviceId, serviceName }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/bookings', { service_id: serviceId, booking_date: date, booking_time: time });
            alert('Booking created successfully! You can view it in your dashboard.');
            onClose();
        } catch (error) {
            alert('Booking failed: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative p-6 border w-full max-w-md shadow-lg rounded-xl bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Book Service</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <p className="text-gray-600 mb-6">Booking: <span className="font-semibold text-gray-900">{serviceName}</span></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
                        <input
                            type="time"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;

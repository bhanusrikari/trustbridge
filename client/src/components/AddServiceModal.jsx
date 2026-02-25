import { useState, useEffect } from 'react';
import api from '../services/api';

const AddServiceModal = ({ isOpen, onClose, onServiceAdded }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        service_name: '',
        cat_id: '',
        description: '',
        price: '',
        image: '',
        address: '',
        latitude: '',
        longitude: ''
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/services/categories');
                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            const res = await api.post('/upload', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, image: res.data.imageUrl });
        } catch (error) {
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/services', formData);
            onServiceAdded();
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add service');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative p-8 border-0 w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[40px] bg-white animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">Add New Service</h3>
                        <p className="text-slate-500 text-sm font-medium">List your professional expertise</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Service Name</label>
                            <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold placeholder-slate-300" placeholder="e.g. Deep Home Cleaning" value={formData.service_name} onChange={e => setFormData({ ...formData, service_name: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Category</label>
                            <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold appearance-none cursor-pointer" value={formData.cat_id} onChange={e => setFormData({ ...formData, cat_id: e.target.value })} required>
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Price (₹)</label>
                            <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Cover Image</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="service-image-add"
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="service-image-add"
                                    className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-center h-[52px]"
                                >
                                    {uploading ? (
                                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                    ) : formData.image ? (
                                        <span className="text-indigo-600 truncate max-w-full">Image Selected ✓</span>
                                    ) : (
                                        "Click to Upload"
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Service Address</label>
                        <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold placeholder-slate-300" placeholder="e.g. Plot 12, Hitech City, Hyderabad" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Latitude (Map)</label>
                            <input type="number" step="any" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold" placeholder="17.44xxx" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Longitude (Map)</label>
                            <input type="number" step="any" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold" placeholder="78.37xxx" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })} required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Description</label>
                        <textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium h-32 placeholder-slate-300" placeholder="Describe the quality and scope of your service..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-3xl font-black transition-all hover:bg-slate-200 uppercase tracking-widest text-xs">Cancel</button>
                        <button type="submit" disabled={uploading} className={`flex-[2] px-8 py-4 bg-indigo-600 text-white rounded-3xl font-black transition-all hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200 active:scale-95 uppercase tracking-widest text-xs ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>List Service</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServiceModal;

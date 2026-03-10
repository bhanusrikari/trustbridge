import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
    const [searchParams] = useSearchParams();
    const roleFromUrl = searchParams.get('role') || 'User';

    const [formData, setFormData] = useState({
        role: roleFromUrl,
        email: '',
        password: '',
        confirmPassword: '',
        // Common fields
        phone: '',
        phone_number: '', // Handling backend inconsistency (sp uses phone, user/lr uses phone_number)
        address: '',
        // Role specific
        ufname: '', ulname: '', // User
        fname: '', lname: '', city: '', area: '', // LocalResident
        sname: '', // ServiceProvider
        cat_id: '', // Category for SP
    });
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/services/categories');
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }, [roleFromUrl]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        // Prepare payload based on role
        const payload = { role: formData.role, email: formData.email, password: formData.password };

        if (formData.role === 'User') {
            payload.ufname = formData.ufname;
            payload.ulname = formData.ulname;
            payload.phone_number = formData.phone_number;
            payload.address = formData.address;
        } else if (formData.role === 'LocalResident') {
            payload.fname = formData.fname;
            payload.lname = formData.lname;
            payload.city = formData.city;
            payload.area = formData.area;
            payload.phone_number = formData.phone_number;
        } else if (formData.role === 'ServiceProvider') {
            payload.sname = formData.sname;
            payload.phone = formData.phone; // Backend expects 'phone' for SP
            payload.address = formData.address;
            payload.cat_id = formData.cat_id;
            payload.description = formData.description;
            payload.documents = formData.documents;
        }

        try {
            await register(payload);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-surface-50 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-100/20 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-accent-100/20 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-10 relative z-10 text-center">
                <h2 className="text-4xl font-extrabold text-surface-900 tracking-tight">
                    Join TrustBridge
                </h2>
                <p className="mt-3 text-surface-500 font-medium tracking-tight">
                    Already part of the bridge? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold decoration-primary-200 underline-offset-4 hover:underline transition-all">Sign in</Link>
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
                <div className="card-premium p-8 sm:p-12">
                    <div className="glass p-1.5 rounded-2xl flex gap-1 mb-12">
                        {['User', 'LocalResident', 'ServiceProvider'].map((role) => (
                            <Link
                                key={role}
                                to={`?role=${role}`}
                                className={`flex-1 text-center py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${formData.role === role
                                    ? 'bg-primary-600 text-white shadow-premium'
                                    : 'text-surface-500 hover:text-surface-900'
                                    }`}
                            >
                                {role === 'User' ? 'USER' : role.replace(/([A-Z])/g, ' $1').toUpperCase().trim()}
                            </Link>
                        ))}
                    </div>

                    {error && (
                        <div className="bg-accent-50/50 border border-accent-100 p-4 rounded-2xl mb-8 animate-shake">
                            <div className="flex items-center gap-3">
                                <svg className="h-5 w-5 text-accent-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-accent-700 font-bold">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Personal Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="h-[1px] flex-grow bg-surface-100"></div>
                                <span className="text-[10px] font-black text-surface-300 uppercase tracking-[0.3em]">Personal Information</span>
                                <div className="h-[1px] flex-grow bg-surface-100"></div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" placeholder="your@email.com" />
                                </div>

                                {formData.role === 'User' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">First Name</label>
                                            <input type="text" name="ufname" value={formData.ufname} onChange={handleChange} required className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Last Name</label>
                                            <input type="text" name="ulname" value={formData.ulname} onChange={handleChange} required className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" />
                                        </div>
                                    </div>
                                )}

                                {formData.role === 'LocalResident' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">First Name</label>
                                            <input type="text" name="fname" value={formData.fname} onChange={handleChange} required className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Last Name</label>
                                            <input type="text" name="lname" value={formData.lname} onChange={handleChange} required className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" />
                                        </div>
                                    </div>
                                )}

                                {formData.role === 'ServiceProvider' && (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Business Name</label>
                                                <input type="text" name="sname" value={formData.sname} onChange={handleChange} required className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" placeholder="Business Name" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Service Category</label>
                                                <select name="cat_id" value={formData.cat_id} onChange={handleChange} required className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm cursor-pointer appearance-none">
                                                    <option value="">Choose category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Verification Documents</label>
                                            <input type="text" name="documents" value={formData.documents || ''} onChange={handleChange} className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" placeholder="Paste link for verification" />
                                            <p className="text-[10px] text-accent-500 font-bold ml-1 tracking-tight italic">Documents will be reviewed after submission.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Account Security */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="h-[1px] flex-grow bg-surface-100"></div>
                                <span className="text-[10px] font-black text-surface-300 uppercase tracking-[0.3em]">Account Security</span>
                                <div className="h-[1px] flex-grow bg-surface-100"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input
                                            type="text"
                                            name={formData.role === 'ServiceProvider' ? "phone" : "phone_number"}
                                            value={formData.role === 'ServiceProvider' ? formData.phone : formData.phone_number}
                                            onChange={handleChange}
                                            placeholder="+91"
                                            className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm"
                                        />
                                    </div>
                                    {(formData.role === 'User' || formData.role === 'ServiceProvider') && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Home Address</label>
                                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" />
                                        </div>
                                    )}
                                    {formData.role === 'LocalResident' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Target Area</label>
                                            <input type="text" name="area" value={formData.area} onChange={handleChange} className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" placeholder="e.g. Miyapur" />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-surface-50">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Password</label>
                                        <input type="password" name="password" value={formData.password} onChange={handleChange} required className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="block w-full bg-surface-50/50 border-surface-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white py-4 px-5 font-bold text-surface-900 transition-all shadow-sm" placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="btn-premium w-full bg-surface-900 text-white hover:bg-primary-600 py-5 flex items-center justify-center gap-4 shadow-xl"
                            >
                                <span className="text-xs font-black tracking-[0.3em]">CREATE ACCOUNT</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Register;

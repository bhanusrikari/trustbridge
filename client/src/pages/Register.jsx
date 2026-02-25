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
        <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10">
                    <div className="flex justify-center space-x-2 mb-8 bg-gray-100 p-1 rounded-lg">
                        {['User', 'LocalResident', 'ServiceProvider'].map((role) => (
                            <Link
                                key={role}
                                to={`?role=${role}`}
                                className={`flex-1 text-center px-4 py-2 rounded-md text-sm font-medium transition-all ${formData.role === role
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {role === 'User' ? 'Newcomer' : role.replace(/([A-Z])/g, ' $1').trim()}
                            </Link>
                        ))}
                    </div>

                    {error && (
                        <div className="bg-red-50 border-1 border-red-500 text-red-700 p-3 rounded mb-6 text-sm flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1" />
                        </div>

                        {formData.role === 'User' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input type="text" name="ufname" value={formData.ufname} onChange={handleChange} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input type="text" name="ulname" value={formData.ulname} onChange={handleChange} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1" />
                                </div>
                            </div>
                        )}

                        {formData.role === 'LocalResident' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input type="text" name="fname" value={formData.fname} onChange={handleChange} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input type="text" name="lname" value={formData.lname} onChange={handleChange} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1" />
                                </div>
                            </div>
                        )}

                        {formData.role === 'ServiceProvider' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider text-[10px] font-black mb-1">Service/Business Name</label>
                                        <input type="text" name="sname" value={formData.sname} onChange={handleChange} required className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50" placeholder="e.g. Hyderabad Home Services" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider text-[10px] font-black mb-1">Primary Category</label>
                                        <select name="cat_id" value={formData.cat_id} onChange={handleChange} required className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 cursor-pointer">
                                            <option value="">Choose a Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider text-[10px] font-black mb-1">Business Bio / Description</label>
                                    <textarea name="description" value={formData.description || ''} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 h-24" placeholder="Tell us about your expertise and services..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider text-[10px] font-black mb-1">Verification Documents (JSON/Link)</label>
                                    <input type="text" name="documents" value={formData.documents || ''} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50" placeholder="Paste link to Aadhaar/License for AI Verification" />
                                    <p className="mt-1 text-[10px] text-amber-600 font-bold italic">* Documents will be scanned by our AI Safety Layer for legitimacy.</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    name={formData.role === 'ServiceProvider' ? "phone" : "phone_number"}
                                    value={formData.role === 'ServiceProvider' ? formData.phone : formData.phone_number}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
                                />
                            </div>
                            {(formData.role === 'User' || formData.role === 'ServiceProvider') && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1" />
                                </div>
                            )}
                        </div>

                        {formData.role === 'LocalResident' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Area</label>
                                    <input type="text" name="area" value={formData.area} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1" />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Register;

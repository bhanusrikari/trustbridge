import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser({ ...res.data.user, role: res.data.role });
                } catch (error) {
                    console.error('Error loading user', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password, role) => {
        const res = await api.post('/auth/login', { email, password, role });
        localStorage.setItem('token', res.data.token);
        setUser({ ...res.data.user, role: res.data.role });
        return res.data;
    };

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        localStorage.setItem('token', res.data.token);
        setUser({ ...res.data.user, role: res.data.role });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

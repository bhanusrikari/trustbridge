import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ServicesList from './pages/ServicesList';
import ServiceDetails from './pages/ServiceDetails'; // Import ServiceDetails
import FloatingAIChat from './components/FloatingAIChat';
import Forum from './pages/Forum';
import Chat from './pages/Chat';
import ProviderProfile from './pages/ProviderProfile';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import { AuthProvider } from './context/AuthContext';

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-surface-50 flex flex-col font-jakarta">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/services" element={<ProtectedRoute><ServicesList /></ProtectedRoute>} />
                            <Route path="/service/:id" element={<ProtectedRoute><ServiceDetails /></ProtectedRoute>} />
                            <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
                            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                            <Route path="/provider/:id" element={<ProtectedRoute><ProviderProfile /></ProtectedRoute>} />
                            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

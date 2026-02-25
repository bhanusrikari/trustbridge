import { useAuth } from '../context/AuthContext';
import UserDashboard from './UserDashboard';
import ProviderDashboard from './ProviderDashboard';
import AdminDashboard from './AdminDashboard';
import ResidentDashboard from './ResidentDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="text-center mt-10 text-slate-500">Please login to view dashboard.</div>;
    }

    return (
        <div className="container mx-auto">
            {user.role === 'User' && <UserDashboard />}
            {user.role === 'ServiceProvider' && <ProviderDashboard />}
            {user.role === 'Admin' && <AdminDashboard />}
            {user.role === 'LocalResident' && <ResidentDashboard />}
        </div>
    );
};

export default Dashboard;

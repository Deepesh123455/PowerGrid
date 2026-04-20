import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { Navbar } from './Navbar';

export default function ProtectedRoute() {
    const accessToken = useAuthStore((state) => state.accessToken);

    // If there is no access token, redirect to the login page immediately.
    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    // If authenticated, render the child routes securely with a top Navbar layout
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    );
}

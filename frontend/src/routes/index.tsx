import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ApplianceSessionsPage from '../pages/ApplianceSessionsPage';
import ProtectedRoute from '../components/ProtectedRoute';
import RootErrorBoundary from '../components/RootErrorBoundary';
import ProfilePage from '../pages/ProfilePage';
import BillsPage from '../pages/BillsPage.tsx';
import AlertsPage from '../pages/AlertsPage';
import ComingSoonPage from '../pages/ComingSoonPage';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <RootErrorBoundary />,
        children: [
            // Public Route
            {
                index: true,
                element: <LoginPage />,
            },
            // Protected Routes
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'dashboard',
                        element: <DashboardPage />,
                    },
                    {
                        path: 'sessions',
                        element: <ApplianceSessionsPage />
                    },
                    {
                        path: 'insights/:applianceType',
                        element: <ApplianceSessionsPage />
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage />
                    },
                    {
                        path: 'bills',
                        element: <BillsPage />
                    },
                    {
                        path: 'alerts',
                        element: <AlertsPage />
                    },
                    {
                        path: 'p2p',
                        element: <ComingSoonPage />
                    },
                    {
                        path: 'save',
                        element: <ComingSoonPage />
                    },
                    {
                        path: 'analytics',
                        element: <ComingSoonPage />
                    }
                ]
            }
        ],
    },
]);

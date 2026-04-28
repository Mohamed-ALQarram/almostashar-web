import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import LawyerRegisterPage from '../pages/LawyerRegisterPage';
import HomePage from '../pages/HomePage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminVerificationPage from '../pages/AdminVerificationPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '../features/auth/store/authStore';

// Error pages
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import NotFoundPage from '../pages/errors/NotFoundPage';
import BadRequestPage from '../pages/errors/BadRequestPage';
import NetworkErrorPage from '../pages/errors/NetworkErrorPage';
import ServerErrorPage from '../pages/errors/ServerErrorPage';
import GuestPage from '../pages/GuestPage';

const RootRedirect = () => {
    const { isAuthenticated, user } = useAuthStore();
    // Not logged in → show guest landing page
    if (!isAuthenticated) {
        return <GuestPage />;
    }
    // Admin → admin dashboard
    if (user?.role === 'Admin') {
        return <Navigate to="/admin" replace />;
    }
    // Other authenticated users → home
    return <HomePage />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute allowedRoles={['Client', 'Lawyer', 'Admin']}>
                        <RootRedirect />
                    </ProtectedRoute>
                }
            />
            <Route path="/guest" element={<GuestPage />} />
            <Route path="/lawyer-dashboard" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/verification" element={<ProtectedRoute allowedRoles={['Admin']}><AdminVerificationPage /></ProtectedRoute>} />
            <Route path="/lawyer-register" element={<LawyerRegisterPage />} />

            {/* Error pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/bad-request" element={<BadRequestPage />} />
            <Route path="/network-error" element={<NetworkErrorPage />} />
            <Route path="/server-error" element={<ServerErrorPage />} />

            {/* Catch-all → 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;

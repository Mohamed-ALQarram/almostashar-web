import { Routes, Route, Navigate } from 'react-router-dom';
import {
    LoginPage,
    LawyerRegisterPage,
    AdminDashboardPage,
    LawyerDashboardPage,
    LawyerProfilePage,
    LawyerChatsPage,
    LawyerServicesPage,
    LawyerRequestsPage,
    LawyerTendersPage,
    AdminVerificationPage,
    GuestPage,
    ServiceDetailPage,
    LawyersListPage,
    UnauthorizedPage,
    NotFoundPage,
    BadRequestPage,
    NetworkErrorPage,
    ServerErrorPage
} from '../pages';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '../features/auth/store/authStore';

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
    // Lawyer → lawyer dashboard
    if (user?.role === 'Lawyer') {
        return <Navigate to="/lawyer-dashboard" replace />;
    }
    // Other authenticated users → home
    return <GuestPage />;
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
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/lawyers" element={<LawyersListPage />} />
            <Route path="/lawyer-dashboard" element={<ProtectedRoute allowedRoles={['Lawyer']}><LawyerDashboardPage /></ProtectedRoute>} />
            <Route path="/lawyer-dashboard/profile" element={<ProtectedRoute allowedRoles={['Lawyer']}><LawyerProfilePage /></ProtectedRoute>} />
            <Route path="/lawyer-dashboard/chats" element={<ProtectedRoute allowedRoles={['Lawyer']}><LawyerChatsPage /></ProtectedRoute>} />
            <Route path="/lawyer-dashboard/services" element={<ProtectedRoute allowedRoles={['Lawyer']}><LawyerServicesPage /></ProtectedRoute>} />
            <Route path="/lawyer-dashboard/requests" element={<ProtectedRoute allowedRoles={['Lawyer']}><LawyerRequestsPage /></ProtectedRoute>} />
            <Route path="/lawyer-dashboard/tenders" element={<ProtectedRoute allowedRoles={['Lawyer']}><LawyerTendersPage /></ProtectedRoute>} />
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

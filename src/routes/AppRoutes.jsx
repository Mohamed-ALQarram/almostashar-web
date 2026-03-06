import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import LawyerRegister from '../pages/LawyerRegister';
import HomePage from '../pages/HomePage';
import ProtectedRoute from './ProtectedRoute';

// Error pages
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import NotFoundPage from '../pages/errors/NotFoundPage';
import BadRequestPage from '../pages/errors/BadRequestPage';
import NetworkErrorPage from '../pages/errors/NetworkErrorPage';
import ServerErrorPage from '../pages/errors/ServerErrorPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute allowedRoles={['client']}>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lawyer-register" element={<LawyerRegister />} />

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

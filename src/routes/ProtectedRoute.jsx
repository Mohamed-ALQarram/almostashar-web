import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * Props:
 *  - children:       the page to render if authorized
 *  - allowedRoles:   (optional) array of roles that can access this route
 *                    e.g. ['Lawyer', 'Admin']. If omitted, any authenticated user can access.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    // Not logged in → redirect to login, preserve attempted URL
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in but role not allowed → show unauthorized
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;

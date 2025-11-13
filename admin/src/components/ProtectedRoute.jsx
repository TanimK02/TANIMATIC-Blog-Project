import { Navigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        // Redirect to access denied if admin required but user is not admin
        return <Navigate to="/access" replace />;
    }

    return children;
}

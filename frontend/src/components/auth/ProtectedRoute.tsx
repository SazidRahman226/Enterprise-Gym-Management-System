import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to their dashboard if unauthorized for this route
        return <Navigate to={`/dashboard/${user.role}`} replace />;
    }

    return <Outlet />;
}

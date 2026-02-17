import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { getHomeRouteByRole } from "../config/roleRoutes";

const AuthLayout = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!isAuthReady) {
    return null;
  }

  if (user) {
    return <Navigate to={getHomeRouteByRole(user.role)} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

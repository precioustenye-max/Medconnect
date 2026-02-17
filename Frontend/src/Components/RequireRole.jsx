import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { getHomeRouteByRole } from "../config/roleRoutes";

const RequireRole = ({ role, children }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!isAuthReady) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = Array.isArray(role) ? role : [role];

  if (role && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRouteByRole(user.role)} replace />;
  }

  return children;
};

export default RequireRole;

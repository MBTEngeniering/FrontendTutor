import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/UseAuth.jsx';
import { ADMIN } from "../util/mapping.js";

const ProtectedRoute = ({ element, roles }) => {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return null;
  }

  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = roles ?? [];
  const hasRequiredRole =
    user.userRoleIds?.includes(ADMIN) ||
    allowedRoles.includes(user.selectedUserRoleId);

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;

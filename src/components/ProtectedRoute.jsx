import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/UseAuth.jsx';
import { ADMIN } from "../util/mapping.js";

const ProtectedRoute = ({ element, roles }) => {
  const { user } = useAuth();

  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (roles && (user.userRoleIds.includes(ADMIN) || roles.includes(user.selectedUserRoleId))) {
    return element;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;

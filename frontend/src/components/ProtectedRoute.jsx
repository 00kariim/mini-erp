import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { token, roles: userRoles } = useSelector((state) => state.auth);

  const hasAccess =
    token &&
    userRoles &&
    roles.some((r) => userRoles.includes(r));

  if (!hasAccess) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;

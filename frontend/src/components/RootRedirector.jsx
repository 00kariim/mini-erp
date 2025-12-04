import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RootRedirector = () => {
  const { token, roles } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;

  const role = roles[0];

  const redirects = {
    Admin: "/admin/dashboard",
    Supervisor: "/supervisor/dashboard",
    Operator: "/operator/dashboard",
    Client: "/client/dashboard",
  };

  return <Navigate to={redirects[role] || "/login"} replace />;
};

export default RootRedirector;

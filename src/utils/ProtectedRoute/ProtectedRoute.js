import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ sessionKey }) => {
  const isVerified = sessionStorage.getItem(sessionKey) === "true";

  return isVerified ? <Outlet /> : <Navigate to="/no-access" />;
};

export default ProtectedRoute;

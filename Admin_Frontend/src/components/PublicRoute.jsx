import React from "react";
import { Navigate, Outlet, useLocation} from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
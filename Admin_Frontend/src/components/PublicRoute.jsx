import React from "react";
import { Navigate, Outlet, useLocation} from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  // const location = useLocation();

  // // Allow reset password page even if the user is logged in or out
  // if (location.pathname.includes("/reset_password/")) {
  //   return <Outlet />;
  // }

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
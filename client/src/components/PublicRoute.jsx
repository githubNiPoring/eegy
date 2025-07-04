import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({ children }) => {
  const token = Cookies.get("token");
  if (token) {
    return <Navigate to="/homepage" replace />;
  }
  return children;
};

export default PublicRoute;

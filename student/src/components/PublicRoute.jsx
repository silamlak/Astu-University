// src/components/PublicRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.user);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;

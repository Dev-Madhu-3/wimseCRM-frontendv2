// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Layout from "../layout/Layout";


const ProtectedRoute = () => {

  const isAuthenticated = Cookies.get("token");

  return isAuthenticated ? <Layout /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

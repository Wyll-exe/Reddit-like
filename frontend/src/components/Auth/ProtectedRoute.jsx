// filepath: c:\Users\laure\Desktop\Reddit-like\frontend\reddit-like\src\components\ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import getCookie from "../Auth/Cookie";

function ProtectedRoute({ children }) {
  const token = getCookie("jwtToken");

  if (!token) {
    return <Navigate to="/login" />;

  }

  return children;
}

export default ProtectedRoute;
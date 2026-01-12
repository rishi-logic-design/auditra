import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRoles = ["admin", "superadmin"],
}) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "superadmin") {
      return <Navigate to="/superadmin/dashboard" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      sessionStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  }

  // Check if user is active
  if (user.isActive === false) {
    sessionStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

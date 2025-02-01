// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useSessionContext } from "../Context/SessionContext";

// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { authToken, userRole } = useSessionContext();

//   console.log("ProtectedRoute - authToken:", authToken);
//   console.log("ProtectedRoute - userRole:", userRole);
//   console.log("ProtectedRoute - requiredRole:", requiredRole);

//   if (!authToken) {
//     console.log("No authToken found, redirecting to login");
//     return <Navigate to="/login" />;
//   }

//   if (userRole !== requiredRole) {
//     console.log(`User role (${userRole}) does not match required role (${requiredRole}), redirecting to login`);
//     return <Navigate to="/login" />;
//   }

//   console.log("Access granted to protected route");
//   return children;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { useSessionContext } from "../Context/SessionContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { accessToken, role } = useSessionContext();

  // If there's no accessToken, the user is not logged in, redirect to login page
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If a requiredRole is provided and the user's role doesn't match, redirect to dashboard (or any other default page)
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the protected route
  return children;
};

export default ProtectedRoute;

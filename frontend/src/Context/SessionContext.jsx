// import React, { createContext, useState, useEffect, useContext } from 'react';
// import {jwtDecode} from 'jwt-decode';  // For decoding the JWT and checking the expiration

// const SessionContext = createContext();

// export const SessionProvider = ({ children }) => {
//   const [userRole, setUserRole] = useState("");
//   const [username, setUsername] = useState("");
//   const [authToken, setAuthToken] = useState(null);
//   const [user, setUser] = useState(null);

//   // Function to decode and check if the token is valid
//   const isTokenValid = (token) => {
//     if (!token) {
//       console.log("No token found");
//       return false;
//     }
//     try {
//       const decodedToken = jwtDecode(token);
//       const currentTime = Date.now() / 1000;
//       console.log("Token expiry:", decodedToken.exp);
//       console.log("Current time:", currentTime);
  
//       if (decodedToken.exp > currentTime) {
//         console.log("Token is valid");
//         return true;
//       } else {
//         console.log("Token has expired");
//         return false;
//       }
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return false;
//     }
//   };

//   useEffect(() => {
//     // Get token from sessionStorage or localStorage
//     const tokenFromSession = sessionStorage.getItem('authToken');
//     const tokenFromLocal = localStorage.getItem('authToken');
//     const storedToken = tokenFromSession || tokenFromLocal;

//     if (isTokenValid(storedToken)) {
//       // If token is valid, set the token and user data
//       setAuthToken(storedToken);
//       const decoded = jwtDecode(storedToken);
//       setUser({ username: decoded.username, role: decoded.role });
//       setUsername(decoded.username);
//       setUserRole(decoded.role);
//     } else {
//       // If no valid token, clear user data
//       setAuthToken(null);
//       setUser(null);
//       setUsername("");
//       setUserRole("");
//     }
//   }, []);  // Only run once on mount

//   // Logout function
//   const logout = () => {
//     // Clear the token and user data
//     localStorage.removeItem('authToken');
//     sessionStorage.removeItem('authToken');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('username');
//     sessionStorage.removeItem('userRole');
//     sessionStorage.removeItem('username');
    
//     setAuthToken(null);
//     setUser(null);
//     setUsername("");
//     setUserRole("");
//   };

//   // Function to handle login, storing the token in sessionStorage and localStorage
//   const login = (token, role, username) => {
//     console.log("Storing token:", token);
//     console.log("Storing role:", role);
//     console.log("Storing username:", username);
  
//     sessionStorage.setItem("authToken", token);
//     localStorage.setItem("authToken", token);
//     sessionStorage.setItem("userRole", role);
//     localStorage.setItem("userRole", role);
//     sessionStorage.setItem("username", username);
//     localStorage.setItem("username", username);
  
//     setAuthToken(token);
//     setUser({ username, role });
//     setUsername(username);
//     setUserRole(role);
//   };
  
//   useEffect(() => {
//     const tokenFromSession = sessionStorage.getItem("authToken");
//     const tokenFromLocal = localStorage.getItem("authToken");
//     const storedToken = tokenFromSession || tokenFromLocal;
  
//     console.log("Retrieved token:", storedToken);
  
//     if (isTokenValid(storedToken)) {
//       const decoded = jwtDecode(storedToken);
//       console.log("Decoded token:", decoded);
  
//       setAuthToken(storedToken);
//       setUser({ username: decoded.username, role: decoded.role });
//       setUsername(decoded.username);
//       setUserRole(decoded.role);
//     } else {
//       console.log("Token is invalid or expired");
//       logout();
//     }
//   }, []);

//   return (
//     <SessionContext.Provider value={{ authToken, user, userRole, username, logout, login }}>
//       {children}
//     </SessionContext.Provider>
//   );
// };

// // Custom hook to access the context
// export const useSessionContext = () => {
//   return useContext(SessionContext);
// };

// export default SessionContext;




import React, { createContext, useContext, useState } from "react";

const SessionContext = createContext();

export const useSessionContext = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const login = (access, refresh, role, username) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setRole(role);
    setUsername(username);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
    setUsername(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };

  return (
    <SessionContext.Provider value={{ accessToken, refreshToken, role, username, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

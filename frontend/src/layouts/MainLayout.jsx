import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Navbar/Sidebar";
import { useSessionContext } from "../Context/SessionContext";  // Import the useSessionContext hook

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const { userRole } = useSessionContext();  // Get userRole from context

  useEffect(() => {
    // No need to fetch from localStorage/sessionStorage, since it's already managed in the context
    console.log("User role:", userRole);  // Optionally log the role if needed
  }, [userRole]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userRole={userRole}  // Pass userRole from context to Sidebar
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-hidden">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          userRole={userRole}  // Pass userRole from context to Navbar
        />
        <div
          className={`flex-1 h-[calc(250vh-4rem)] bg-gray-50 p-2 sm:p-4 transition-all duration-300 overflow-auto ${
            isSidebarOpen
              ? "ml-64"  // Sidebar open for larger screens
              : "ml-16 lg:ml-64"  // Sidebar closed on smaller screens
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

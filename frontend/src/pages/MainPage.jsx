import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../components/Dashboard/Dashboard";
import { useSessionContext } from "../Context/SessionContext"; // Import the useSessionContext hook
import Sidebar from "../components/Navbar/Sidebar";
import EmployeeList from "../components/admin/EmployeeList";

const MainPage = () => {
  const { userRole } = useSessionContext();
  const [activeView, setActiveView] = useState("dashboard"); // Default to dashboard view

  useEffect(() => {
    console.log("User role:", userRole);
  }, [userRole]);

  return (
    <MainLayout>
      <Sidebar setActiveView={setActiveView} />{" "}
      {/* Pass setActiveView to Sidebar */}
      <div className="">
        {/* Conditional rendering based on activeView */}
        {activeView === "dashboard" && <Dashboard userRole={userRole} />}
        {activeView === "employees" && <EmployeeList userRole={userRole} />}
      </div>
    </MainLayout>
  );
};

export default MainPage;

import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../components/Dashboard/Dashboard";
import { useSessionContext } from "../Context/SessionContext"; // Import the useSessionContext hook
import Sidebar from "../components/Navbar/Sidebar";
import EmployeeList from "../components/admin/EmployeeList";
import ReportGenerator from "../components/admin/ReportGenerator";
import Axios from "axios";

const MainPage = () => {
  const { accessToken, userRole, role } = useSessionContext();
  const [activeView, setActiveView] = useState("dashboard"); // Default to dashboard view
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState("");
  const [taskMetrics, setTaskMetrics] = useState({
    totalTasks: 0,
    totalSubtasks: 0,
    pendingSubtasks: 0,
    completedSubtasks: 0,
    dailyTasksTotal: 0,
    dailyTasksCompleted: 0,
  });

  const today = new Date().toISOString().split("T")[0];

  const getUniqueEmployees = (tasks) => {
    return [...new Set(tasks.map((task) => task.assignee_username))];
  };

  //metrics calculation with fixed daily tasks tracking
  const updateMetrics = (currentTasks) => {
    const metrics = {
      totalTasks: currentTasks.length,
      totalSubtasks: 0,
      completedSubtasks: 0,
      dailyTasksTotal: 0,
      dailyTasksCompleted: 0,
    };

    currentTasks.forEach((task) => {
      // Calculating daily tasks
      const todayCompletions = task.dailyCompletions?.[today] || {};
      // Each task has 3 possible completions per day (posts, reels, mockups)
      metrics.dailyTasksTotal += 3;

      // Count today's completed tasks
      const todayCompleted =
        Object.values(todayCompletions).filter(Boolean).length;
      metrics.dailyTasksCompleted += todayCompleted;

      // Calculate total and completed subtasks for overall progress
      const packageRequirements = {
        Starter: { posts: 12, reels: 5, mockups: 12 },
        Premium: { posts: 21, reels: 10, mockups: 18 },
        "Super Pro": { posts: 30, reels: 20, mockups: 30 },
      };

      const requirements = packageRequirements[task.package] || {
        posts: 0,
        reels: 0,
        mockups: 0,
      };
      metrics.totalSubtasks += Object.values(requirements).reduce(
        (a, b) => a + b,
        0
      );

      // Calculate completed subtasks
      Object.values(task.dailyCompletions || {}).forEach((dayCompletions) => {
        if (dayCompletions.posts) metrics.completedSubtasks++;
        if (dayCompletions.reels) metrics.completedSubtasks++;
        if (dayCompletions.mockups) metrics.completedSubtasks++;
      });
    });

    metrics.pendingSubtasks = metrics.totalSubtasks - metrics.completedSubtasks;
    setTaskMetrics(metrics);
  };

  useEffect(() => {
    const usernameFromSession = sessionStorage.getItem("username");
    const usernameFromLocal = localStorage.getItem("username");
    setUsername(usernameFromSession || usernameFromLocal || "");

    const fetchTasks = async () => {
      try {
        const endpoint =
          role === "admin"
            ? "http://localhost:5000/tasks"
            : `http://localhost:5000/tasks/employee/${username}`;

        const response = await Axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const processedTasks = response.data.tasks.map((task) => ({
          ...task,
          dailyCompletions: task.dailyCompletions ||
            task.daily_completions || {
              [today]: {
                posts: false,
                reels: false,
                mockups: false,
              },
            },
        }));

        setTasks(processedTasks);
        updateMetrics(processedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error.response?.status === 403) {
          console.log("Authorization error. Please check your permissions.");
        }
      }
    };

    if (accessToken && (username || role === "admin")) {
      fetchTasks();
    }
  }, [accessToken, role, username]);

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

        {activeView === "report" && (
          <ReportGenerator
            userRole={userRole}
            tasks={tasks}
            employees={getUniqueEmployees(tasks)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default MainPage;

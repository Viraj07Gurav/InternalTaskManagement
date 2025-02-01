import React, { useState, useEffect } from "react";
import { Clock, CheckSquare, AlertTriangle, List } from "lucide-react";
import DashboardTable from "./DashboardTable";
import ConnectedTaskTables from "./ConnectedTaskTables";
import Axios from "axios";
import { useSessionContext } from "../../Context/SessionContext";
import { calculateTimeLeftUntilEndOfDay } from "../../utils/timeUtils";

// TaskCard Component
const TaskCard = ({ icon, title, count, color }) => (
  <div className={`p-4 bg-white rounded-xl shadow-md flex items-center space-x-4 ${color}`}>
    {icon}
    <div>
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  </div>
);

//Dashboard Component
const Dashboard = () => {
  const { accessToken, role } = useSessionContext();
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeftUntilEndOfDay());
  const [taskMetrics, setTaskMetrics] = useState({
    totalTasks: 0,
    totalSubtasks: 0,
    pendingSubtasks: 0,
    completedSubtasks: 0,
    dailyTasksTotal: 0,
    dailyTasksCompleted: 0
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeftUntilEndOfDay());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  //metrics calculation with fixed daily tasks tracking
  const updateMetrics = (currentTasks) => {
    const metrics = {
      totalTasks: currentTasks.length,
      totalSubtasks: 0,
      completedSubtasks: 0,
      dailyTasksTotal: 0,
      dailyTasksCompleted: 0
    };

    currentTasks.forEach((task) => {
      // Calculating daily tasks
      const todayCompletions = task.dailyCompletions?.[today] || {};
      // Each task has 3 possible completions per day (posts, reels, mockups)
      metrics.dailyTasksTotal += 3;
      
      // Count today's completed tasks
      const todayCompleted = Object.values(todayCompletions).filter(Boolean).length;
      metrics.dailyTasksCompleted += todayCompleted;

      // Calculate total and completed subtasks for overall progress
      const packageRequirements = {
        Starter: { posts: 12, reels: 5, mockups: 12 },
        Premium: { posts: 21, reels: 10, mockups: 18 },
        "Super Pro": { posts: 30, reels: 20, mockups: 30 }
      };

      const requirements = packageRequirements[task.package] || { posts: 0, reels: 0, mockups: 0 };
      metrics.totalSubtasks += Object.values(requirements).reduce((a, b) => a + b, 0);

      // Calculate completed subtasks
      Object.values(task.dailyCompletions || {}).forEach(dayCompletions => {
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
        const endpoint = role === "admin"
          ? "http://localhost:5000/tasks"
          : `http://localhost:5000/tasks/employee/${username}`;

        const response = await Axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const processedTasks = response.data.tasks.map(task => ({
          ...task,
          dailyCompletions: task.dailyCompletions || task.daily_completions || {
            [today]: {
              posts: false,
              reels: false,
              mockups: false,
            }
          }
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

  const calculatePendingDailyTasks = () => {
    return taskMetrics.dailyTasksTotal - taskMetrics.dailyTasksCompleted;
  };

  // Handle task completion
  const handleTaskCompletion = async (taskId, taskType) => {
    try {
      await Axios.put(
        `http://localhost:5000/tasks/${taskId}/complete`,
        { taskType },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update local state
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const updatedDailyCompletions = {
            ...task.dailyCompletions,
            [today]: {
              ...(task.dailyCompletions[today] || {}),
              [taskType]: !task.dailyCompletions[today]?.[taskType],
            },
          };
          return {
            ...task,
            dailyCompletions: updatedDailyCompletions,
          };
        }
        return task;
      });

      setTasks(updatedTasks);
      updateMetrics(updatedTasks); // Update metrics after task completion
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  return (
    <div className="py-2 sm:py-6 px-2 sm:px-4 min-h-screen bg-blue-50 rounded-xl w-full">
      {username && (
        <h1 className="text-2xl sm:text-3xl font-bold sm:font-medium px-3 sm:px-0 text-center sm:text-left text-gray-800 mb-6">
          Welcome, {username}!
        </h1>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-[1.5rem] sm:mb-[3rem]">
        {role === "admin" ? (
          <>
            <TaskCard
              icon={<List className="text-blue-500" />}
              title="Total Clients"
              count={taskMetrics.totalTasks}
              color="border-l-4 border-blue-500"
            />
            <TaskCard
              icon={<List className="text-purple-500" />}
              title="Total Tasks"
              count={taskMetrics.totalSubtasks}
              color="border-l-4 border-purple-500"
            />
            <TaskCard
              icon={<AlertTriangle className="text-yellow-500" />}
              title="Pending Tasks"
              count={taskMetrics.pendingSubtasks}
              color="border-l-4 border-yellow-500"
            />
            <TaskCard
              icon={<CheckSquare className="text-green-500" />}
              title="Completed Tasks"
              count={taskMetrics.completedSubtasks}
              color="border-l-4 border-green-500"
            />
          </>
        ) : (
          <>
            <TaskCard
              icon={<List className="text-blue-500" />}
              title="Today's Total Tasks"
              count={taskMetrics.dailyTasksTotal}
              color="border-l-4 border-blue-500"
            />
            <TaskCard
              icon={<AlertTriangle className="text-yellow-500" />}
              title="Today's Pending Tasks"
              count={calculatePendingDailyTasks()}
              color="border-l-4 border-yellow-500"
            />
            <TaskCard
              icon={<CheckSquare className="text-green-500" />}
              title="Today's Completed Tasks"
              count={taskMetrics.dailyTasksCompleted}
              color="border-l-4 border-green-500"
            />
            <div className="p-4 bg-white rounded-xl shadow-md flex items-center space-x-4 border-l-4 border-red-400">
              <Clock className="text-red-400" />
              <div>
                <h3 className="text-gray-500">Time Left Today</h3>
                <p className="text-xl font-bold">
                  {new Date().toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600">
                  Pending Tasks: <span className="text-green-800 font-semibold">{calculateTimeLeftUntilEndOfDay()}</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {role === "admin" ? (
        <DashboardTable tasks={tasks} setTasks={setTasks} />
      ) : (
        <ConnectedTaskTables
          tasks={tasks}
          onTaskCompletion={handleTaskCompletion}
        />
      )}
    </div>
  );
};

export default Dashboard;
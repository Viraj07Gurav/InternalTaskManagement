import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, X, Edit2, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "../Common/Card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../Common/AlertDialog";
import { format, differenceInDays } from "date-fns";
import { useSessionContext } from "../../Context/SessionContext";
import { ToastContainer, toast } from "react-toastify";

const Input = (props) => (
  <input
    className="bg-white border border-gray-300 rounded-md px-4 py-2 w-full"
    {...props}
  />
);

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block mb-1">
    {children}
  </label>
);

const Select = ({ children, ...props }) => (
  <div className="relative">
    <select
      className="bg-white border border-gray-300 rounded-md px-4 py-2 w-full appearance-none"
      {...props}
    >
      {children}
    </select>
  </div>
);

const DashboardTable = ({ tasks, setTasks }) => {
  const { accessToken, role } = useSessionContext(); // Access accessToken and role from context
  const [taskToDelete, setTaskToDelete] = useState(null);

  const packageDetails = {
    Starter: { days: 12, posts: 12, reels: 5, mockups: 12 },
    Premium: { days: 21, posts: 21, reels: 10, mockups: 18 },
    "Super Pro": { days: 30, posts: 30, reels: 20, mockups: 30 },
  };

  const calculateTotalSubtasks = (packageType) => {
    const details = packageDetails[packageType];
    return details.posts + details.reels + details.mockups;
  };

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    assignee_id: "",
    assignee_username: "",
    client: "",
    package: "",
    start_date: "",
    status: "Pending",
    completed_subtasks: 0,
    total_subtasks: 0,
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState(""); // Add error state

  // Format date for backend
  const formatFromDateInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use accessToken from context
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to fetch tasks. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle adding a new task
  const handleAddTask = async () => {
    try {
      if (!newTask.start_date) {
        setError("Please select a start date");
        return;
      }

      const taskData = {
        assignee_username: newTask.assignee_username,
        client: newTask.client,
        package: newTask.package,
        start_date: formatFromDateInput(newTask.start_date),
        total_subtasks: calculateTotalSubtasks(newTask.package),
      };

      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use accessToken from context
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add task");
      }

      // Success handling
      fetchTasks(); // Refresh the task list
      setShowModal(false);
      setNewTask({
        assignee_username: "",
        client: "",
        package: "",
        start_date: "",
        status: "Pending",
        completed_subtasks: 0,
        total_subtasks: 0,
      });

      toast.success("Client added successfully!");
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
      toast.error(`Error: ${err.message}`);
    }
  };

  // Handle editing a task
  const handleEditTask = async () => {
    const totalSubtasks = calculateTotalSubtasks(newTask.package);
    const taskData = {
      client: newTask.client,
      package: newTask.package,
      start_date: newTask.start_date,
      total_subtasks: totalSubtasks,
      status: newTask.status,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/tasks/${newTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Use accessToken from context
          },
          body: JSON.stringify(taskData),
        }
      );

      if (response.ok) {
        fetchTasks();
        setShowModal(false);
        toast.success("Task updated successfully!");
      } else {
        const data = await response.json();
        setError(data.message);
        toast.error(data.message || "Failed to update task");
      }
    } catch (err) {
      setError("Failed to update task");
      console.error("Error:", err);
      toast.error(`Error: Failed to update task ${err.message}`);
    }
  };

  // Handle deleting a task
  const handleRemoveTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        fetchTasks();
        setTaskToDelete(null); // Clear the taskToDelete state
        toast.success("Task deleted successfully!");
      } else {
        const data = await response.json();
        setError(data.message);
        toast.error(data.message || "Failed to delete task");
      }
    } catch (err) {
      setError("Failed to delete task");
      console.error("Error:", err);
      toast.error("Error: Failed to delete task");
    }
  };

  const handleEditButton = (index) => {
    setEditingIndex(index);
    setNewTask(tasks[index]);
    setShowModal(true);
  };

  const calculateDaysLeft = (startDate, packageType) => {
    if (!startDate) {
      console.error("Start date is undefined or invalid:", startDate);
      return 0;
    }

    const [day, month, year] = startDate
      .split("-")
      .map((num) => parseInt(num, 10));
    const start = new Date(year, month - 1, day);
    const duration = packageDetails[packageType]?.days || 0;
    const end = new Date(start);
    end.setDate(start.getDate() + duration);
    return differenceInDays(end, new Date());
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <Button onClick={() => setShowModal(true)}>
          <PlusCircle className="mr-1 w-4 sm:w-5 h-4 sm:h-5" />
          Add Client
        </Button>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
        {/* Display error message */}
        <div className="overflow-x-auto rounded-tl-lg rounded-tr-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-700 text-sm">
                <th className="px-4 py-2 text-left bg-gray-100 border-b-2 border-gray-300 font-medium whitespace-nowrap">
                  Assignee
                </th>
                <th className="px-4 py-2 text-left bg-gray-100 border-b-2 border-gray-300 font-medium whitespace-nowrap">
                  Client
                </th>
                <th className="px-4 py-2 text-left bg-gray-100 border-b-2 border-gray-300 font-medium whitespace-nowrap">
                  Package
                </th>
                <th className="px-4 py-2 text-left bg-gray-100 border-b-2 border-gray-300 font-medium whitespace-nowrap">
                  Start Date
                </th>
                <th className="px-4 py-2 text-left bg-gray-100 border-b-2 border-gray-300 font-medium whitespace-nowrap">
                  Time Left
                </th>
                <th className="px-4 py-2 text-left bg-gray-100 border-b-2 border-gray-300 font-medium whitespace-nowrap">
                  Progress
                </th>
                <th className="px-4 py-2 text-left bg-gray-100 border-b-2 border-gray-300 font-medium whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-2 text-left bg-gray-100 border-b-2 border-gray-300 font-medium whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task, index) => {
                const daysLeft = calculateDaysLeft(
                  task.start_date,
                  task.package
                );
                const isExpired = daysLeft < 0;
                const progress =
                  (task.completed_subtasks / task.total_subtasks) * 100;
                const rowClass =
                  daysLeft <= 7 && daysLeft >= 0 ? "bg-red-100" : "";

                return (
                  <tr
                    key={index}
                    className={`hover:bg-blue-100 transition-colors duration-200 text-[13px] text-gray-700 ${rowClass}`}
                  >
                    <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                      {task.assignee_username}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                      {task.client}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                      {task.package}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                      {task.start_date}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                      {isExpired ? (
                        <span className="text-red-500">Expired</span>
                      ) : (
                        `${daysLeft} days`
                      )}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            progress === 100 ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="block text-center text-xs">
                        {task.completed_subtasks}/{task.total_subtasks}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === "Pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                      {/* <button
                        onClick={() => handleEditButton(index)}
                        className="text-blue-500 hover:text-blue-600 cursor-pointer"
                      >
                        <Edit2 size={16} />
                      </button> */}
                      <button
                        onClick={() => setTaskToDelete(task)}
                        className="text-red-500 hover:text-red-600 cursor-pointer ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-all duration-300"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-8 m-[1.5rem] sm:m-0 w-full max-w-md shadow-2xl transform transition-all animate-in fade-in-0 zoom-in-95 duration-200 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {editingIndex !== null ? "Edit Task" : "Add New Client"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingIndex !== null) {
                  handleEditTask();
                } else {
                  handleAddTask();
                }
              }}
              className="space-y-2"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="assignee"
                  className="text-sm font-semibold text-gray-700"
                >
                  Assignee
                </Label>
                <Input
                  id="assignee"
                  value={newTask.assignee_username}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      assignee_username: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter assignee name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="client"
                  className="text-sm font-semibold text-gray-700"
                >
                  Client
                </Label>
                <Input
                  id="client"
                  value={newTask.client}
                  onChange={(e) =>
                    setNewTask({ ...newTask, client: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="package"
                  className="text-sm font-semibold text-gray-700 "
                >
                  Package
                </Label>
                <Select
                  id="package"
                  value={newTask.package}
                  onChange={(e) =>
                    setNewTask({ ...newTask, package: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select a package</option>
                  <option value="Starter">Starter</option>
                  <option value="Premium">Premium</option>
                  <option value="Super Pro">Super Pro</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-sm font-semibold text-gray-700"
                >
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newTask.start_date} // Keep as YYYY-MM-DD for input
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      start_date: e.target.value, // Store as YYYY-MM-DD
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700  bg-gray-100  hover:bg-gray-200  rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer"
                >
                  {editingIndex !== null ? "Save Changes" : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertDialog
        open={taskToDelete !== null}
        onOpenChange={() => setTaskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirm Task Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Are you sure you want to delete the task for client{" "}
              <span className="font-bold text-red-800">
                {taskToDelete?.client}
              </span>{" "}
              from the system?
              <p className="mt-2 text-gray-800 text-xs">
                This action cannot be undone. All associated task data will be
                permanently deleted.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleRemoveTask(taskToDelete.id);
              }}
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ToastContainer />
    </Card>
  );
};

export default DashboardTable;

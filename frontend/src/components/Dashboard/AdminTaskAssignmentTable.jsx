import React, { useState } from "react";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";

// Utility function to calculate the time remaining
const calculateTimeLeft = (deadline) => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const timeDiff = deadlineDate - now;

  if (timeDiff <= 0) return "Deadline passed";

  const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return `${daysLeft} day(s), ${hoursLeft} hour(s), ${minutesLeft} minute(s) left`;
};

const AdminTaskAssignmentTable = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      employee: "John Doe",
      client: "Goldmines",
      deadline: "2025-02-01T12:00:00", // Example deadline
      postTasks: [
        { id: 1, description: "Create social media post about product launch", status: "Pending" },
        { id: 2, description: "Design infographic for monthly report", status: "Pending" }
      ],
      reelsTasks: [
        { id: 1, description: "Record short product demo video", status: "Pending" }
      ],
      mockupTasks: [
        { id: 1, description: "Create product mockup image", status: "Pending" }
      ]
    },
    {
      id: 2,
      employee: "Jane Smith",
      client: "Money Mining",
      deadline: "2025-01-30T12:00:00", // Example deadline
      postTasks: [
        { id: 1, description: "Develop content strategy", status: "Pending" }
      ],
      reelsTasks: [
        { id: 1, description: "Shoot behind-the-scenes reel", status: "Pending" }
      ],
      mockupTasks: [
        { id: 1, description: "Design brand style mockup", status: "Pending" }
      ]
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleAddTask = () => {
    setCurrentTask({
      employee: "",
      client: "",
      deadline: "",
      postTasks: [{ description: "", status: "Pending" }],
      reelsTasks: [{ description: "", status: "Pending" }],
      mockupTasks: [{ description: "", status: "Pending" }]
    });
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask({ ...task });
    setShowModal(true);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSaveTask = () => {
    if (currentTask.id) {
      // Update existing task
      setTasks(tasks.map((task) => (task.id === currentTask.id ? currentTask : task)));
    } else {
      // Add new task
      setTasks([...tasks, { ...currentTask, id: tasks.length + 1 }]);
    }
    setShowModal(false);
  };

  const addSubTask = (taskType) => {
    setCurrentTask((prev) => ({
      ...prev,
      [`${taskType}Tasks`]: [
        ...prev[`${taskType}Tasks`],
        { id: prev[`${taskType}Tasks`].length + 1, description: "", status: "Pending" }
      ]
    }));
  };

  const handleStatusChange = (taskType, index, status) => {
    const updatedTasks = [...currentTask[`${taskType}Tasks`]];
    updatedTasks[index].status = status;

    if (status === "Completed") {
      updatedTasks.splice(index, 1);
    }

    setCurrentTask((prev) => ({
      ...prev,
      [`${taskType}Tasks`]: updatedTasks
    }));
  };

  return (
    <div className="p-3 sm:p-6 bg-white shadow-lg rounded-lg mt-[1.5rem] sm:mt-[3rem]">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Task Assignments</h2>
        <button
          onClick={handleAddTask}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium text-sm"
        >
          <PlusCircle className="mr-1 h-5 w-5" /> Add Task Assignment
        </button>
      </div>

      <div className="overflow-x-auto rounded-tr-lg rounded-tl-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-700">
              <th className="p-3 text-left whitespace-nowrap">Employee</th>
              <th className="p-3 text-left whitespace-nowrap">Client</th>
              <th className="p-3 text-left whitespace-nowrap">Posts</th>
              <th className="p-3 text-left whitespace-nowrap">Reels</th>
              <th className="p-3 text-left whitespace-nowrap">Mockups</th>
              <th className="p-3 text-left whitespace-nowrap">Deadline</th>
              <th className="p-3 text-left whitespace-nowrap">Time Left</th>
              <th className="p-3 text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-gray-300 hover:bg-blue-50 text-sm text-gray-800">
                <td className="px-3 py-2 whitespace-nowrap">{task.employee}</td>
                <td className="px-3 py-2 whitespace-nowrap">{task.client}</td>
                <td className="px-3 py-2 whitespace-nowrap">{task.postTasks.length} task(s)</td>
                <td className="px-3 py-2 whitespace-nowrap">{task.reelsTasks.length} task(s)</td>
                <td className="px-3 py-2 whitespace-nowrap">{task.mockupTasks.length} task(s)</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {task.deadline ? calculateTimeLeft(task.deadline) : "No deadline"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-blue-500 hover:text-blue-600 cursor-pointer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 space-y-2 h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b-2 border-gray-200 pb-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {currentTask.id ? "Edit" : "Add"} Task Assignment
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Employee</label>
                  <input
                    type="text"
                    value={currentTask.employee}
                    onChange={(e) => setCurrentTask((prev) => ({ ...prev, employee: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Client</label>
                  <input
                    type="text"
                    value={currentTask.client}
                    onChange={(e) => setCurrentTask((prev) => ({ ...prev, client: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Deadline</label>
                  <input
                    type="datetime-local"
                    value={currentTask.deadline}
                    onChange={(e) => setCurrentTask((prev) => ({ ...prev, deadline: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {["post", "reels", "mockup"].map((type) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold capitalize text-gray-800 dark:text-gray-100">
                      {type} Tasks
                    </h3>
                    <button
                      onClick={() => addSubTask(type)}
                      className="text-blue-600 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded-full"
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {currentTask[`${type}Tasks`].map((subTask, index) => (
                      <div key={subTask.id} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={subTask.description}
                          onChange={(e) => {
                            const newTasks = [...currentTask[`${type}Tasks`]];
                            newTasks[index].description = e.target.value;
                            setCurrentTask((prev) => ({ ...prev, [`${type}Tasks`]: newTasks }));
                          }}
                          className="flex-grow border border-gray-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                          placeholder={`${type} task description`}
                        />
                        <select
                          value={subTask.status}
                          onChange={(e) => handleStatusChange(type, index, e.target.value)}
                          className="border border-gray-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end items-center gap-3 pt-4 border-t-2 border-gray-300">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTaskAssignmentTable;

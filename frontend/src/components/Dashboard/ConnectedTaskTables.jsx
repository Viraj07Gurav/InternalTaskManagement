import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, CheckCircle, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import * as XLSX from "xlsx";
import { useSessionContext } from "../../Context/SessionContext";
import { calculateTimeLeftUntilEndOfDay } from "../../utils/timeUtils";

const ConnectedTaskTables = () => {
  const { accessToken, username, role } = useSessionContext();
  const [completedTasks, setCompletedTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeftUntilEndOfDay());
  const [tasks, setTasks] = useState([]);
  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");

  //time left for today task to end
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeftUntilEndOfDay());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const packageRequirements = {
    Starter: {
      duration: 12,
      dailyTasks: {
        posts: 1,
        reels: 1,
        mockups: 1,
      },
      total: {
        posts: 12,
        reels: 5,
        mockups: 12,
      },
    },
    Premium: {
      duration: 21,
      dailyTasks: {
        posts: 1,
        reels: 1,
        mockups: 1,
      },
      total: {
        posts: 21,
        reels: 10,
        mockups: 18,
      },
    },
    "Super Pro": {
      duration: 30,
      dailyTasks: {
        posts: 1,
        reels: 1,
        mockups: 1,
      },
      total: {
        posts: 30,
        reels: 20,
        mockups: 30,
      },
    },
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/tasks/employee/${username}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          const updatedTasks = data.tasks.map((task) => ({
            ...task,
            dailyCompletions: task.daily_completions || {},
          }));
          setTasks(updatedTasks);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [accessToken, username]);

  const handleTaskCompletion = async (task, taskType) => {
    try {
      // Create a copy of today's completions or initialize it if it doesn't exist
      const updatedCompletions = {
        ...task.dailyCompletions?.[formattedToday],
        [taskType]: !task.dailyCompletions?.[formattedToday]?.[taskType],
      };

      // Send the entire updated completions object for the date
      const response = await fetch(
        `http://localhost:5000/tasks/${task.id}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            completedTasks: updatedCompletions, // Send the entire object
            date: formattedToday,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      // Update the local state with the new completions
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id
            ? {
                ...t,
                dailyCompletions: {
                  ...t.dailyCompletions,
                  [formattedToday]: updatedCompletions,
                },
              }
            : t
        )
      );
    } catch (err) {
      console.error("Error updating task completion:", err);
    }
  };

  const isTodayCompleted = (task) => {
    const todayCompletions = task.dailyCompletions?.[formattedToday];
    return (
      todayCompletions?.posts &&
      todayCompletions?.reels &&
      todayCompletions?.mockups
    );
  };

  const calculateTotalCompleted = (task, taskType) => {
    return Object.values(task.dailyCompletions || {}).filter(
      (day) => day[taskType]
    ).length;
  };

  // Time left calculation
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const [countdown, setCountdown] = useState("");


  const isTimeLeftLessThanSixHours = () => {
    const timeLeft = endOfDay - new Date();
    return timeLeft < 6 * 60 * 60 * 1000;
  };

  const handleCompleteTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: "Completed" } : task
      )
    );
  };

  const getActiveTasks = () => {
    return tasks.filter((task) => {
      const startDate = new Date(task.startDate);
      const daysPassed = differenceInDays(new Date(), startDate);
      const packageDuration = packageRequirements[task.package].duration;
      return daysPassed >= 0 && daysPassed < packageDuration;
    });
  };

  const getIncompleteTasks = (task) => {
    const todayCompletions = task.dailyCompletions?.[formattedToday] || {};
    const incompleteTasks = [];

    if (!todayCompletions.posts) {
      incompleteTasks.push("posts");
    }
    if (!todayCompletions.reels) {
      incompleteTasks.push("reels");
    }
    if (!todayCompletions.mockups) {
      incompleteTasks.push("mockups");
    }

    return incompleteTasks;
  };

  const getOverdueTasks = () => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.start_date).toISOString().split("T")[0];
      return taskDate === selectedDate && !isTodayCompleted(task);
    });
  };

  return (
    <div className="mb-8">
      {/* Today's Task Table */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 mt-[3rem]">
        Daily Task Completion Record
      </h2>
      <div className="overflow-x-auto rounded-tl-lg rounded-tr-lg mb-4 shadow-md">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-300 text-gray-700 text-sm font-medium">
              <th className="px-4 py-2 text-left whitespace-nowrap">Client</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Package</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Today's Tasks</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Overall Progress
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Time Left</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const packageInfo = packageRequirements[task.package];
              return (
                <tr key={task.id} className="border-b border-gray-300 text-sm">
                  <td className="px-4 py-2">{task.client}</td>
                  <td className="px-4 py-2">{task.package}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col space-y-2">
                      {Object.entries(packageInfo.dailyTasks).map(([type]) => (
                        <div key={type} className="flex items-center space-x-4">
                          <span className="w-20 capitalize">{type}:</span>
                          <button
                            onClick={() => handleTaskCompletion(task, type)}
                            className="flex items-center space-x-2"
                            disabled={false} // Remove any previous disabling logic
                          >
                            {task.dailyCompletions?.[formattedToday]?.[type] ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col space-y-2">
                      {Object.entries(packageInfo.total).map(
                        ([type, total]) => (
                          <div
                            key={type}
                            className="flex items-center space-x-2"
                          >
                            <span className="w-20 capitalize">{type}:</span>
                            <span>
                              {calculateTotalCompleted(task, type)}/{total}
                            </span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 rounded-full h-2"
                                style={{
                                  width: `${
                                    (calculateTotalCompleted(task, type) /
                                      total) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </td>
                  <td
                    className={`px-4 py-2 text-sm font-medium ${
                      isTodayCompleted(task)
                        ? "text-green-500"
                        : isTimeLeftLessThanSixHours()
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {isTodayCompleted(task)
                      ? "Today's Tasks Completed 😊"
                      : timeLeft}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      

      {/* Overdue Tasks Table */}
      <div className="flex flex-col  mt-[2rem]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-700 mb-6 mt-8">
            Overdue Tasks
          </h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 h-11 text-base font-medium text-gray-700 border-2 border-gray-300 rounded-lg bg-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 w-36"
          />
        </div>

        {getOverdueTasks().map((task) => (
          <div key={task.id}>{task.client}</div>
        ))}

        <div
          className={`overflow-x-auto overflow-y-auto rounded-tl-lg rounded-tr-lg shadow-md mb-[2.5rem] ${
            getOverdueTasks().length === 0 ? "h-[6.3rem]" : "h-[20rem]"
          }`}
        >
          <table className="w-full border-collapse bg-white shadow-lg ">
            <thead>
              <tr className="bg-red-100 text-gray-700 text-sm font-medium">
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Package</th>
                <th className="p-4 text-left">Tasks</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* No rows initially, will be populated when the day ends */}
              {getOverdueTasks().length === 0 ? (
                <tr className="text-center">
                  <td colSpan="4" className="px-4 py-3 text-gray-500">
                    No overdue tasks for {selectedDate}
                  </td>
                </tr>
              ) : (
                getOverdueTasks().map((task) => {
                  const incompleteTasks = getIncompleteTasks(task);
                  const isAllCompleted = incompleteTasks.length === 0;

                  return (
                    <tr
                      key={`overdue-${task.id}`}
                      className="border-b border-gray-300 text-sm hover:bg-red-50 "
                    >
                      <td className="px-4 py-2">{task.client}</td>
                      <td className="px-4 py-2">{task.package}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col space-y-2">
                          {Object.entries(
                            packageRequirements[task.package].dailyTasks
                          ).map(([type, count]) => (
                            <div
                              key={type}
                              className="flex items-center space-x-4"
                            >
                              <span className="w-20 capitalize">{type}:</span>
                              <button
                                onClick={() =>
                                  handleTaskCompletion(task.id, type)
                                }
                                className="flex items-center space-x-2"
                              >
                                {task.dailyCompletions[today]?.[type] ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td
                        className={`px-4 py-2 font-medium ${
                          isTodayCompleted(task)
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {isTodayCompleted(task) ? "Completed 😊" : "Overdue 😔"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overall Tasks Table */}
      <h2 className="text-2xl sm:text-3xl font-bold p-2 text-center text-gray-800 mb-3">
        Overall Tasks Record
      </h2>
      <div className="overflow-x-auto rounded-tl-lg rounded-tr-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-300  text-gray-800 text-sm">
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                Client
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                Package
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                Start Date
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                Time Left
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                Progress
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const packageDuration =
                packageRequirements[task.package].duration;
              const endDate = new Date(task.start_date);
              if (isNaN(endDate)) {
                console.error("Invalid start date for task:", task.start_date);
                return null; // Skip rendering this task if the date is invalid
              }
              endDate.setDate(endDate.getDate() + packageDuration);

              const daysLeft = isNaN(endDate)
                ? 0
                : differenceInDays(endDate, new Date());
              const isExpired = daysLeft < 0;
              const progress =
                (task.completed_subtasks / task.total_subtasks) * 100;

              return (
                <tr
                  key={task.id}
                  style={{
                    backgroundColor:
                      daysLeft < 7 && daysLeft >= 0 ? "#F76A6A" : "",
                    color: daysLeft < 7 && daysLeft >= 0 ? "#ffffff" : "",
                  }}
                  className="hover:bg-blue-100 bg-white  transition-colors duration-200 border-b border-gray-300 text-[14px] shadow-lg"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{task.client}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {task.package}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {format(new Date(task.start_date), "MM/dd/yyyy")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {isExpired ? (
                      <span className="text-red-500">Expired</span>
                    ) : (
                      `${daysLeft} days`
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="w-full bg-blue-200 rounded-full h-2 ">
                      <div
                        className={`h-2 rounded-full ${
                          progress === 100 ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="block text-center text-sm">
                      {task.completed_subtasks}/{task.total_subtasks}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        task.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {task.status === "Pending" && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-1 rounded-md flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteTask(task.id);
                        }}
                      >
                        <CheckCircle className="mr-2 w-4 h-4" />
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConnectedTaskTables;











// // Temporary testing: Simulate end of day
// const getOverdueTasks = () => {
//   const now = new Date();
//   now.setHours(23, 59, 59, 999); // Set to end of the day for testing

//   if (now.getHours() === 23 && now.getMinutes() === 59) {
//     // Simulate check at the end of the day
//     return getActiveTasks().filter((task) => {
//       const todayCompletions = task.dailyCompletions[today] || {};
//       return (
//         !todayCompletions.posts ||
//         !todayCompletions.reels ||
//         !todayCompletions.mockups
//       );
//     });
//   }
//   return [];
// };

// const packageRequirements = {
//   Starter: {
//     duration: 12,
//     dailyTasks: { posts: 1, reels: 1, mockups: 1 },
//     total: { posts: 12, reels: 5, mockups: 12 },
//   },
//   Premium: {
//     duration: 21,
//     dailyTasks: { posts: 1, reels: 1, mockups: 1 },
//     total: { posts: 21, reels: 10, mockups: 18 },
//   },
//   "Super Pro": {
//     duration: 30,
//     dailyTasks: { posts: 1, reels: 1, mockups: 1 },
//     total: { posts: 30, reels: 20, mockups: 30 },
//   },
// };







{/* Download Report Button */}
      {/* <div className="mb-[2rem] flex justify-center sm:justify-end">
        <button
          onClick={generateExcelReport}
          className="bg-blue-500 text-white px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Download Today's Task Report
        </button>
      </div> */}


       // Utility function to handle Excel report generation
  // const generateExcelReport = () => {
  //   const groupedTasks = tasks.reduce((acc, task) => {
  //     const clientPackageKey = `${task.client} - ${task.package}`;
  //     if (!acc[clientPackageKey]) {
  //       acc[clientPackageKey] = [];
  //     }

  //     const startDate = new Date(task.startDate);
  //     const todayDate = new Date(today);
  //     const dailyCompletionData = [];

  //     // Loop through the days from start date to today
  //     for (
  //       let currentDate = new Date(startDate);
  //       currentDate <= todayDate;
  //       currentDate.setDate(currentDate.getDate() + 1)
  //     ) {
  //       const formattedDate = format(currentDate, "yyyy-MM-dd");
  //       const taskCompletion = task.dailyCompletions[formattedDate] || {};

  //       const isAnyTaskCompleted =
  //         taskCompletion.posts ||
  //         taskCompletion.reels ||
  //         taskCompletion.mockups;

  //       dailyCompletionData.push({
  //         Client: task.client,
  //         Package: task.package,
  //         Date: formattedDate,
  //         Posts: taskCompletion.posts ? "Completed" : "Not Completed",
  //         Reels: taskCompletion.reels ? "Completed" : "Not Completed",
  //         Mockups: taskCompletion.mockups ? "Completed" : "Not Completed",
  //         "Completed At": isAnyTaskCompleted
  //           ? format(new Date(), "HH:mm:ss")
  //           : "Not Completed",
  //       });
  //     }

  //     acc[clientPackageKey] = acc[clientPackageKey].concat(dailyCompletionData);
  //     return acc;
  //   }, {});

  //   // Create a new workbook
  //   const wb = XLSX.utils.book_new();

  //   // Define column widths
  //   const columnWidths = [
  //     { wch: 15 }, // Client
  //     { wch: 12 }, // Package
  //     { wch: 12 }, // Date
  //     { wch: 15 }, // Posts
  //     { wch: 15 }, // Reels
  //     { wch: 15 }, // Mockups
  //     { wch: 15 }, // Completed At
  //   ];

  //   // For each client-package group, create a sheet
  //   Object.entries(groupedTasks).forEach(([clientPackage, taskReport]) => {
  //     const ws = XLSX.utils.json_to_sheet(taskReport, {
  //       header: [
  //         "Client",
  //         "Package",
  //         "Date",
  //         "Posts",
  //         "Reels",
  //         "Mockups",
  //         "Completed At",
  //       ],
  //     });

  //     // Apply column widths
  //     ws["!cols"] = columnWidths;

  //     // Add this worksheet to the workbook
  //     XLSX.utils.book_append_sheet(wb, ws, clientPackage);
  //   });

  //   // Write the workbook to a file
  //   XLSX.writeFile(wb, "Daily_Task_Report.xlsx");
  // };
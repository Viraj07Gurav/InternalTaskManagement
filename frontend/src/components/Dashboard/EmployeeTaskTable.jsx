// import React, { useState } from "react";
// import { CheckCircle, AlertCircle } from "lucide-react";
// import { format, differenceInDays } from "date-fns";
// import EmployeeTaskModal from "./EmployeeTaskModal";

// const EmployeeTasksTable = () => {
//   // Helper function to get the duration based on package type
//   const getPackageDuration = (packageType) => {
//     switch (packageType) {
//       case "Starter":
//         return 12; // 12 days for Starter package
//       case "Premium":
//         return 21; // 21 days for Premium package
//       case "Super Pro":
//         return 30; // 30 days for Super Pro package
//       default:
//         return 0;
//     }
//   };

//   const createSubtasks = (packageType) => {
//     let subtasks = [];
//     switch (packageType) {
//       case "Starter":
//         subtasks = [
//           ...Array(12)
//             .fill()
//             .map((_, i) => ({ id: i + 1, name: `Post ${i + 1}` })),
//           ...Array(5)
//             .fill()
//             .map((_, i) => ({ id: 13 + i, name: `Reel ${i + 1}` })),
//           ...Array(12)
//             .fill()
//             .map((_, i) => ({ id: 18 + i, name: `Mockup Image ${i + 1}` })),
//         ];
//         break;
//       case "Premium":
//         subtasks = [
//           ...Array(21)
//             .fill()
//             .map((_, i) => ({ id: i + 1, name: `Post ${i + 1}` })),
//           ...Array(10)
//             .fill()
//             .map((_, i) => ({ id: 22 + i, name: `Reel ${i + 1}` })),
//           ...Array(18)
//             .fill()
//             .map((_, i) => ({ id: 32 + i, name: `Mockup Image ${i + 1}` })),
//         ];
//         break;
//       case "Super Pro":
//         subtasks = [
//           ...Array(30)
//             .fill()
//             .map((_, i) => ({ id: i + 1, name: `Post ${i + 1}` })),
//           ...Array(20)
//             .fill()
//             .map((_, i) => ({ id: 31 + i, name: `Reel ${i + 1}` })),
//           ...Array(30)
//             .fill()
//             .map((_, i) => ({ id: 51 + i, name: `Mockup Image ${i + 1}` })),
//         ];
//         break;
//       default:
//         subtasks = [];
//     }
//     return subtasks;
//   };

//   const [tasks, setTasks] = useState([
//     {
//       id: 1,
//       client: "Goldmines",
//       package: "Starter",
//       startDate: "2025-01-22",
//       status: "Pending",
//       completedSubtasks: 0,
//       totalSubtasks: 29,
//       subtasks: createSubtasks("Starter"),
//     },
//     {
//       id: 2,
//       client: "Money Mining",
//       package: "Premium",
//       startDate: "2025-01-22",
//       status: "Pending",
//       completedSubtasks: 0,
//       totalSubtasks: 49,
//       subtasks: createSubtasks("Premium"),
//     },
//     {
//       id: 3,
//       client: "Billion Bucks",
//       package: "Super Pro",
//       startDate: "2025-01-22",
//       status: "Pending",
//       completedSubtasks: 0,
//       totalSubtasks: 80,
//       subtasks: createSubtasks("Super Pro"),
//     },
//   ]);

//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const handleCompleteTask = (id) => {
//     const updatedTasks = tasks.map((task) =>
//       task.id === id ? { ...task, status: "Completed" } : task
//     );
//     setTasks(updatedTasks);
//   };

//   const handleViewTask = (task) => {
//     setSelectedTask(task);
//     setShowModal(true);
//   };

//   const handleModalComplete = (updatedSubtasks) => {
//     const updatedTasks = tasks.map((task) =>
//       task.id === selectedTask.id
//         ? {
//             ...task,
//             subtasks: task.subtasks.map((subtask) =>
//               updatedSubtasks.some((id) => id === subtask.id)
//                 ? { ...subtask, status: "Completed" }
//                 : { ...subtask, status: "Pending" }
//             ),
//             completedSubtasks: updatedSubtasks.length,
//           }
//         : task
//     );
//     setTasks(updatedTasks);
//   };

//   return (
//     <>
//       <h2 className="text-3xl font-bold p-2 text-center text-gray-800 mb-3">
//         Overall Tasks Record
//       </h2>
//       <div className="overflow-x-auto  rounded-tl-lg rounded-tr-lg">
//         <table className="w-full border-collapse ">
//           <thead>
//             <tr className="bg-gray-300 dark:bg-gray-700 text-gray-800">
//               <th className="p-4 text-left font-medium whitespace-nowrap">
//                 Client
//               </th>
//               <th className="p-4 text-left font-medium whitespace-nowrap">
//                 Package
//               </th>
//               <th className="p-4 text-left font-medium whitespace-nowrap">
//                 Start Date
//               </th>
//               <th className="p-4 text-left font-medium whitespace-nowrap">
//                 Time Left
//               </th>
//               <th className="p-4 text-left font-medium whitespace-nowrap">
//                 Progress
//               </th>
//               <th className="p-4 text-left font-medium whitespace-nowrap">
//                 Status
//               </th>
//               <th className="p-4 text-left font-medium whitespace-nowrap">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//   {tasks.map((task) => {
//     const packageDuration = getPackageDuration(task.package);

//     // Calculate the end date by adding the package duration
//     const endDate = new Date(task.startDate);
//     endDate.setDate(endDate.getDate() + packageDuration);

//     const daysLeft = differenceInDays(endDate, new Date());
//     const isExpired = daysLeft < 0;

//     console.log(`Task ID: ${task.id}, Days Left: ${daysLeft}`); // Debugging log

//     const progress =
//       (task.completedSubtasks / task.totalSubtasks) * 100;

//     return (
//       <tr
//   key={task.id}
//   style={{ backgroundColor: daysLeft < 7 && daysLeft >= 0 ? "#F76A6A" : "",  color: daysLeft < 7 && daysLeft >= 0 ? "#ffffff" : ""}}
//   className="hover:bg-blue-100 bg-white dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-300 cursor-pointer text-[14px] shadow-lg"
//   onClick={() => handleViewTask(task)}
// >
//   <td className="px-4 py-3 whitespace-nowrap">{task.client}</td>
//   <td className="px-4 py-3 whitespace-nowrap">{task.package}</td>
//   <td className="px-4 py-3 whitespace-nowrap">
//     {format(new Date(task.startDate), "MM/dd/yyyy")}
//   </td>
//   <td className="px-4 py-3 whitespace-nowrap">
//     {isExpired ? (
//       <span className="text-red-500">Expired</span>
//     ) : (
//       `${daysLeft} days`
//     )}
//   </td>
//   <td className="px-4 py-3 whitespace-nowrap">
//     <div className="w-full bg-blue-200 rounded-full h-2.5 dark:bg-gray-700">
//       <div
//         className={`h-2.5 rounded-full ${progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
//         style={{ width: `${progress}%` }}
//       />
//     </div>
//     <span className="block text-center text-sm mt-2">
//       {task.completedSubtasks}/{task.totalSubtasks}
//     </span>
//   </td>
//   <td className="px-4 py-3 whitespace-nowrap">
//     <span
//       className={`px-2 py-1 rounded-full text-sm font-medium ${
//         task.status === "Pending"
//           ? "bg-yellow-200 text-yellow-800"
//           : "bg-green-200 text-green-800"
//       }`}
//     >
//       {task.status}
//     </span>
//   </td>
//   <td className="px-4 py-3 whitespace-nowrap">
//     {task.status === "Pending" && (
//       <button
//         className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center"
//         onClick={(e) => {
//           e.stopPropagation();
//           handleCompleteTask(task.id);
//         }}
//       >
//         <CheckCircle className="mr-2 w-4 h-4" />
//         Complete
//       </button>
//     )}
//   </td>
// </tr>


//     );
//   })}
// </tbody>

//         </table>
//       </div>

//       {showModal && selectedTask && (
//         <EmployeeTaskModal
//           task={selectedTask}
//           package={selectedTask.package}
//           onClose={() => setShowModal(false)}
//           onComplete={handleModalComplete}
//         />
//       )}
//     </>
//   );
// };

// export default EmployeeTasksTable;






import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";


const EmployeeTasksTable = () => {
  // Helper function to get the duration based on package type
  const getPackageDuration = (packageType) => {
    switch (packageType) {
      case "Starter":
        return 12; // 12 days for Starter package
      case "Premium":
        return 21; // 21 days for Premium package
      case "Super Pro":
        return 30; // 30 days for Super Pro package
      default:
        return 0;
    }
  };

  const createSubtasks = (packageType) => {
    let subtasks = [];
    switch (packageType) {
      case "Starter":
        subtasks = [
          ...Array(12)
            .fill()
            .map((_, i) => ({ id: i + 1, name: `Post ${i + 1}` })),
          ...Array(5)
            .fill()
            .map((_, i) => ({ id: 13 + i, name: `Reel ${i + 1}` })),
          ...Array(12)
            .fill()
            .map((_, i) => ({ id: 18 + i, name: `Mockup Image ${i + 1}` })),
        ];
        break;
      case "Premium":
        subtasks = [
          ...Array(21)
            .fill()
            .map((_, i) => ({ id: i + 1, name: `Post ${i + 1}` })),
          ...Array(10)
            .fill()
            .map((_, i) => ({ id: 22 + i, name: `Reel ${i + 1}` })),
          ...Array(18)
            .fill()
            .map((_, i) => ({ id: 32 + i, name: `Mockup Image ${i + 1}` })),
        ];
        break;
      case "Super Pro":
        subtasks = [
          ...Array(30)
            .fill()
            .map((_, i) => ({ id: i + 1, name: `Post ${i + 1}` })),
          ...Array(20)
            .fill()
            .map((_, i) => ({ id: 31 + i, name: `Reel ${i + 1}` })),
          ...Array(30)
            .fill()
            .map((_, i) => ({ id: 51 + i, name: `Mockup Image ${i + 1}` })),
        ];
        break;
      default:
        subtasks = [];
    }
    return subtasks;
  };

  const [tasks, setTasks] = useState([
    {
      id: 1,
      client: "Goldmines",
      package: "Starter",
      startDate: "2025-01-22",
      status: "Pending",
      completedSubtasks: 0,
      totalSubtasks: 29,
      subtasks: createSubtasks("Starter"),
    },
    {
      id: 2,
      client: "Money Mining",
      package: "Premium",
      startDate: "2025-01-22",
      status: "Pending",
      completedSubtasks: 0,
      totalSubtasks: 49,
      subtasks: createSubtasks("Premium"),
    },
    {
      id: 3,
      client: "Billion Bucks",
      package: "Super Pro",
      startDate: "2025-01-22",
      status: "Pending",
      completedSubtasks: 0,
      totalSubtasks: 80,
      subtasks: createSubtasks("Super Pro"),
    },
  ]);

  const handleCompleteTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: "Completed" } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <>
      <h2 className="text-3xl font-bold p-2 text-center text-gray-800 mb-3">
        Overall Tasks Record
      </h2>
      <div className="overflow-x-auto rounded-tl-lg rounded-tr-lg">
        <table className="w-full border-collapse ">
          <thead>
            <tr className="bg-gray-300 dark:bg-gray-700 text-gray-800">
              <th className="px-4 py-2 text-left font-medium whitespace-nowrap">
                Client
              </th>
              <th className="px-4 py-2 text-left font-medium whitespace-nowrap">
                Package
              </th>
              <th className="px-4 py-2 text-left font-medium whitespace-nowrap">
                Start Date
              </th>
              <th className="px-4 py-2 text-left font-medium whitespace-nowrap">
                Time Left
              </th>
              <th className="px-4 py-2 text-left font-medium whitespace-nowrap">
                Progress
              </th>
              <th className="px-4 py-2 text-left font-medium whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-2 text-left font-medium whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const packageDuration = getPackageDuration(task.package);

              // Calculate the end date by adding the package duration
              const endDate = new Date(task.startDate);
              endDate.setDate(endDate.getDate() + packageDuration);

              const daysLeft = differenceInDays(endDate, new Date());
              const isExpired = daysLeft < 0;

              const progress =
                (task.completedSubtasks / task.totalSubtasks) * 100;

              return (
                <tr
                  key={task.id}
                  style={{
                    backgroundColor: daysLeft < 7 && daysLeft >= 0 ? "#F76A6A" : "",
                    color: daysLeft < 7 && daysLeft >= 0 ? "#ffffff" : "",
                  }}
                  className="hover:bg-blue-100 bg-white dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-300 cursor-pointer text-[14px] shadow-lg"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{task.client}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{task.package}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {format(new Date(task.startDate), "MM/dd/yyyy")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {isExpired ? (
                      <span className="text-red-500">Expired</span>
                    ) : (
                      `${daysLeft} days`
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="w-full bg-blue-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className={`h-2.5 rounded-full ${
                          progress === 100 ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="block text-center text-sm">
                      {task.completedSubtasks}/{task.totalSubtasks}
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
    </>
  );
};

export default EmployeeTasksTable;

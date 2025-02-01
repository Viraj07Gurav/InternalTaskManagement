import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { differenceInDays } from "date-fns";

const EmployeeTaskModal = ({
  task,
  package: packageType,
  onClose,
  onComplete,
}) => {
  const [checkedTasks, setCheckedTasks] = useState(
    task.subtasks
      .filter((subtask) => subtask.status === "Completed")
      .map((subtask) => subtask.id)
  );

  // Define package-specific total counts
  const packageTotals = {
    Starter: { Post: 12, Reel: 5, Mockup: 12 },
    Premium: { Post: 21, Reel: 10, Mockup: 18 },
    "Super Pro": { Post: 30, Reel: 20, Mockup: 30 },
  };

  // Get total counts based on package type
  const totalPosts = packageType
    ? packageTotals[packageType].Post
    : task.subtasks.filter((subtask) => subtask.type === "Post").length;
  const totalReels = packageType
    ? packageTotals[packageType].Reel
    : task.subtasks.filter((subtask) => subtask.type === "Reel").length;
  const totalMockups = packageType
    ? packageTotals[packageType].Mockup
    : task.subtasks.filter((subtask) => subtask.type === "Mockup").length;

  // Calculate the number of completed posts, reels, and mockups dynamically based on checked tasks
  const completedPosts = task.subtasks.filter(
    (subtask) => subtask.type === "Post" && checkedTasks.includes(subtask.id)
  ).length;
  const completedReels = task.subtasks.filter(
    (subtask) => subtask.type === "Reel" && checkedTasks.includes(subtask.id)
  ).length;
  const completedMockups = task.subtasks.filter(
    (subtask) => subtask.type === "Mockup" && checkedTasks.includes(subtask.id)
  ).length;

  const handleTaskComplete = (taskId) => {
    const subtask = task.subtasks.find((st) => st.id === taskId);
    const isCompleting = !checkedTasks.includes(taskId);

    if (subtask) {
      setCheckedTasks((prev) =>
        isCompleting ? [...prev, taskId] : prev.filter((id) => id !== taskId)
      );
    }
  };

  const handleSaveChanges = () => {
    onComplete(checkedTasks);
    onClose();
  };

  const isNearDeadline =
    differenceInDays(new Date(task.endDate), new Date()) <= 7;

  let progressDisplay;
  let maxSubtasks;
  switch (packageType) {
    case "Starter":
      progressDisplay = `${task.completedSubtasks}/29`;
      maxSubtasks = 29;
      break;
    case "Premium":
      progressDisplay = `${task.completedSubtasks}/49`;
      maxSubtasks = 49;
      break;
    case "Super Pro":
      progressDisplay = `${task.completedSubtasks}/80`;
      maxSubtasks = 80;
      break;
    default:
      progressDisplay = `${task.completedSubtasks}/${task.totalSubtasks}`;
      maxSubtasks = task.totalSubtasks;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 my-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all"
        onClick={onClose}
      />
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl w-full max-w-3xl m-4 p-4 sm:p-6 relative z-10 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 overflow-hidden">
        <div className="flex items-center justify-between border-b mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Task Details
          </h2>
          <div className=" text-lg font-semibold text-blue-700 dark:text-blue-400">
            Posts: {completedPosts}/{totalPosts}, Reels: {completedReels}/
            {totalReels}, Mockups: {completedMockups}/{totalMockups}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[400px] mb-3 rounded-xl shadow-inner bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 sticky top-0 z-10">
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  Task
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {task.subtasks.slice(0, maxSubtasks).map((subtask) => (
                <tr
                  key={subtask.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <td className="px-4 text-[13px] whitespace-nowrap">
                    {subtask.name}
                  </td>
                  <td className="px-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        checkedTasks.includes(subtask.id)
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {checkedTasks.includes(subtask.id) ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </>
                      ) : (
                        "Pending"
                      )}
                    </span>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <button
                      className={`px-4 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        checkedTasks.includes(subtask.id)
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                          : "bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md"
                      }`}
                      onClick={() => handleTaskComplete(subtask.id)}
                    >
                      {checkedTasks.includes(subtask.id) ? "Undo" : "Complete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 sm:px-5 py-1 sm:py-2 rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={handleSaveChanges}
            >
              <CheckCircle className="w-4 h-4" />
              Save Changes
            </button>
            <button
              className="hidden sm:block px-4 sm:px-6 py-1 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>

          {isNearDeadline && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              This task is due in 7 days or less.
            </div>
          )}

          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-400">
            Progress: {progressDisplay}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTaskModal;




// import React, { useState } from 'react';
// import { CheckCircle, AlertCircle } from 'lucide-react';
// import { format, differenceInDays } from 'date-fns';

// const EmployeeTaskModal = ({ task, package: packageType, onClose, onComplete }) => {
//   const [checkedTasks, setCheckedTasks] = useState(task.subtasks.filter(subtask => subtask.status === 'Completed').map(subtask => subtask.id));

//   const handleTaskComplete = (taskId) => {
//     if (checkedTasks.includes(taskId)) {
//       setCheckedTasks(checkedTasks.filter((id) => id !== taskId));
//     } else {
//       setCheckedTasks([...checkedTasks, taskId]);
//     }
//   };

//   const handleSaveChanges = () => {
//     onComplete(checkedTasks);
//     onClose();
//   };

//   const isNearDeadline = differenceInDays(new Date(task.endDate), new Date()) <= 7;

//   let postDisplay, reelsDisplay, mockupDisplay, maxSubtasks;
//   switch (packageType) {
//     case 'Starter':
//       postDisplay = '12 Post Monthly';
//       reelsDisplay = '5 Short Videos';
//       mockupDisplay = '12 Mockup Images & Videos';
//       maxSubtasks = 12;
//       break;
//     case 'Premium':
//       postDisplay = '21 Post Monthly';
//       reelsDisplay = '10 Short Videos';
//       mockupDisplay = '18 Mockup Images & Videos';
//       maxSubtasks = 21;
//       break;
//     case 'Super Pro':
//       postDisplay = '30 Post Monthly';
//       reelsDisplay = '20 Short Videos';
//       mockupDisplay = '30 Mockup Images & Videos';
//       maxSubtasks = 30;
//       break;
//     default:
//       postDisplay = `${task.completedSubtasks}/${task.totalSubtasks}`;
//       reelsDisplay = `${task.completedSubtasks}/${task.totalSubtasks}`;
//       mockupDisplay = `${task.completedSubtasks}/${task.totalSubtasks}`;
//       maxSubtasks = task.totalSubtasks;
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4">Task Details</h2>
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100 dark:bg-gray-700">
//               <th className="p-4 text-left font-medium">Content Type</th>
//               <th className="p-4 text-left font-medium">Quantity</th>
//               <th className="p-4 text-left font-medium">Status</th>
//               <th className="p-4 text-left font-medium">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="p-4">Posts</td>
//               <td className="p-4">{postDisplay}</td>
//               <td className="p-4">
//                 <span
//                   className={`px-2 py-1 rounded-full text-sm font-medium ${checkedTasks.length === maxSubtasks ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}
//                 >
//                   {checkedTasks.length === maxSubtasks ? 'Completed' : 'Pending'}
//                 </span>
//               </td>
//               <td className="p-4">
//                 <button
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${checkedTasks.length === maxSubtasks ? 'bg-gray-300 hover:bg-gray-400 text-gray-700' : 'bg-green-500 hover:bg-green-600 text-white'}`}
//                   onClick={() => handleTaskComplete(task.subtasks[0].id)}
//                 >
//                   {checkedTasks.length === maxSubtasks ? 'Undo' : 'Complete'}
//                 </button>
//               </td>
//             </tr>
//             <tr>
//               <td className="p-4">Reels</td>
//               <td className="p-4">{reelsDisplay}</td>
//               <td className="p-4">
//                 <span
//                   className={`px-2 py-1 rounded-full text-sm font-medium ${checkedTasks.length === maxSubtasks ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}
//                 >
//                   {checkedTasks.length === maxSubtasks ? 'Completed' : 'Pending'}
//                 </span>
//               </td>
//               <td className="p-4">
//                 <button
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${checkedTasks.length === maxSubtasks ? 'bg-gray-300 hover:bg-gray-400 text-gray-700' : 'bg-green-500 hover:bg-green-600 text-white'}`}
//                   onClick={() => handleTaskComplete(task.subtasks[1].id)}
//                 >
//                   {checkedTasks.length === maxSubtasks ? 'Undo' : 'Complete'}
//                 </button>
//               </td>
//             </tr>
//             <tr>
//               <td className="p-4">Mockup</td>
//               <td className="p-4">{mockupDisplay}</td>
//               <td className="p-4">
//                 <span
//                   className={`px-2 py-1 rounded-full text-sm font-medium ${checkedTasks.length === maxSubtasks ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}
//                 >
//                   {checkedTasks.length === maxSubtasks ? 'Completed' : 'Pending'}
//                 </span>
//               </td>
//               <td className="p-4">
//                 <button
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${checkedTasks.length === maxSubtasks ? 'bg-gray-300 hover:bg-gray-400 text-gray-700' : 'bg-green-500 hover:bg-green-600 text-white'}`}
//                   onClick={() => handleTaskComplete(task.subtasks[2].id)}
//                 >
//                   {checkedTasks.length === maxSubtasks ? 'Undo' : 'Complete'}
//                 </button>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//         <div className="flex justify-end mt-4">
//           <button
//             className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mr-2 flex items-center"
//             onClick={handleSaveChanges}
//           >
//             <CheckCircle className="mr-2" />
//             Save Changes
//           </button>
//           <button
//             className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//         </div>
//         {isNearDeadline && (
//           <div className="mt-4 text-red-500 flex items-center">
//             <AlertCircle className="mr-2" />
//             This task is due in 7 days or less.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeTaskModal;

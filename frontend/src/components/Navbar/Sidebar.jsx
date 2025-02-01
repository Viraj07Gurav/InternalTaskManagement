// import React from "react";
// import { Menu } from "lucide-react";
// import { ImCross } from "react-icons/im";
// import { AiOutlineDashboard, AiOutlinePlus } from "react-icons/ai";
// import { IoSettings } from "react-icons/io5";
// import { BiTask } from "react-icons/bi";

// const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
//   return (
//     <div
//       className={`fixed top-0 left-0 h-full bg-blue-200 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 shadow-md ${
//         isSidebarOpen ? "w-64" : "w-16"
//       }`}
//     >
//       <div className="flex items-center justify-between h-16 px-4 border-b-4 border-gray-200 dark:border-gray-700">
//         <div className="flex items-center">
//           <BiTask
//             className={`w-8 h-8 text-blue-500 dark:text-blue-400 transition-all duration-300 ${
//               isSidebarOpen ? "block" : "hidden"
//             }`}
//           />
//           {isSidebarOpen && (
//             <h1 className="ml-2 text-xl font-semibold text-gray-700 text-blue-600 dark:text-blue-400">
//               TaskFlow
//             </h1>
//           )}
//         </div>
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle the sidebar state
//           className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
//         >
//           {isSidebarOpen ? <ImCross /> : <Menu />}
//         </button>
//       </div>
//       <div className="mt-4 space-y-4">
//         <a
//           href="/"
//           className="flex items-center gap-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
//         >
//           <AiOutlineDashboard className="w-6 h-6" />
//           {isSidebarOpen && <span>Dashboard</span>}
//         </a>
//         {/* <a
//           href="/create-task"
//           className="flex items-center gap-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
//         >
//           <AiOutlinePlus className="w-6 h-6" />
//           {isSidebarOpen && <span>Create Task</span>}
//         </a> */}
//         <a
//           href="/settings"
//           className="flex items-center gap-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
//         >
//           <IoSettings className="w-6 h-6" />
//           {isSidebarOpen && <span>Settings</span>}
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



// import React from "react";
// import { Menu } from "lucide-react";
// import { ImCross } from "react-icons/im";
// import { AiOutlineDashboard, AiOutlinePlus } from "react-icons/ai";
// import { IoSettings } from "react-icons/io5";
// import { BiTask } from "react-icons/bi";

// const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
//   return (
//     <div
//       className={`fixed top-0 left-0 h-full bg-blue-200 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 shadow-md ${
//         isSidebarOpen
//           ? "w-64 lg:w-64" // Open on larger screens
//           : "w-16 lg:w-64" // Closed on smaller screens, open on lg and above
//       }`}
//     >
//       <div className="flex items-center justify-between h-16 px-4 border-b-4 border-gray-200 dark:border-gray-700">
//         <div className="flex items-center">
//           <BiTask
//             className="block w-8 h-8 text-blue-500 dark:text-blue-400 transition-all duration-300"
             
//           />
        
//             <h1 className="hidden lg:block ml-2 text-xl font-semibold text-gray-700 text-blue-600 dark:text-blue-400">
//               TaskFlow
//             </h1>
        
//         </div>
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle the sidebar state
//           className="hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
//         >
//           {isSidebarOpen ? <ImCross /> : <Menu />}
//         </button>
//       </div>
//       <div className="mt-4 space-y-4">
//         <a
//           href="/"
//           className="flex items-center gap-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
//         >
//           <AiOutlineDashboard className=" w-6 h-6" />
//            <span className="hidden lg:block">Dashboard</span>
//         </a>
//         {/* <a
//           href="/create-task"
//           className="flex items-center gap-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
//         >
//           <AiOutlinePlus className="w-6 h-6" />
//           {isSidebarOpen && <span>Create Task</span>}
//         </a> */}
//         <a
//           href="/settings"
//           className="flex items-center gap-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
//         >
//           <IoSettings className="w-6 h-6" />
//         <span className="hidden lg:block">Settings</span>
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



import React, { useState, useEffect } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { BiTask } from "react-icons/bi";
import { useSessionContext } from "../../Context/SessionContext"; 
import { IoIosPeople } from "react-icons/io";
import { TbReport } from "react-icons/tb";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, setActiveView }) => {
  const { role } = useSessionContext();  // Get the role from context
  const [userRole, setUserRole] = useState(role || ""); // Use the role from context, fallback to empty string if not available

  useEffect(() => {
    // Updating the role when it changes in context
    setUserRole(role);
  }, [role]);  // Only run the effect when the role changes

  const menuItems = [
    {
      icon: <AiOutlineDashboard className="w-6 h-6" />,
      label: "Dashboard",
      href: "/",
      roles: ["admin", "employee"],
      view: "dashboard", 
    },
    {
      icon: <IoIosPeople className="w-6 h-6" />,
      label: "Employee List",
      href: "/employees",
      roles: ["admin"],
      view: "employees", 
    },
    {
      icon: <TbReport className="w-6 h-6" />,
      label: "Report",
      href: "/report",
      roles: ["admin"],
      view: "report"
    },
    {
      icon: <IoSettings className="w-6 h-6" />,
      label: "Settings",
      href: "/settings",
      roles: ["admin"],
    },
   
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 transition-all duration-300 shadow-md ${
        isSidebarOpen ? "w-64 lg:w-64" : "w-16 lg:w-64"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          <BiTask className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          <h1 className="hidden lg:block ml-2 text-xl font-bold text-gray-800 dark:text-blue-400">
            TaskFlow
          </h1>
        </div>
      </div>

      <nav className="mt-6  px-1">
        {menuItems
          .filter((item) => item.roles.includes(userRole))  // Filter based on the userRole
          .map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                if (item.view) setActiveView(item.view); // Set active view on click
              }}
              className="relative flex items-center gap-4 px-3 lg:px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all group"
            >
              <span className="flex-shrink-0 group-hover:scale-110">{item.icon}</span>
              <span className="hidden lg:block font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.label}
              </span>
              <span className="block lg:hidden absolute top-1 left-[5.5rem] transform -translate-x-1/2 mb-10 text-xs text-white bg-gray-700 dark:bg-gray-800 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.label}
              </span>
            </a>
          ))}
      </nav>
    </div>
  );
};

export default Sidebar;

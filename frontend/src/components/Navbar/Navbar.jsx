// import React, { useState, useEffect } from "react";
// import { Menu } from "lucide-react";
// import { HiSun, HiMoon } from "react-icons/hi";
// import Sidebar from "./Sidebar";
// import profileImg from "../../assets/profileImg.png";

// const NavbarWithSidebar = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle
// const [isDarkMode, setIsDarkMode] = useState(false); // Theme toggle

// // Effect to apply dark mode based on user preference or saved setting
// useEffect(() => {
//   // Check if dark mode preference exists in localStorage
//   const savedTheme = localStorage.getItem("darkMode") === "true";
//   setIsDarkMode(savedTheme);

//   // Apply dark mode class to html element
//   if (savedTheme) {
//     document.documentElement.classList.add("dark");
//   } else {
//     document.documentElement.classList.remove("dark");
//   }
// }, []);

// // Update dark mode preference and apply class when toggled
// useEffect(() => {
//   // Save the theme preference to localStorage
//   localStorage.setItem("darkMode", isDarkMode.toString());

//   // Apply dark mode class to html element
//   if (isDarkMode) {
//     document.documentElement.classList.add("dark");
//   } else {
//     document.documentElement.classList.remove("dark");
//   }
// }, [isDarkMode]);

//   return (
//     <div className="flex bg-gray-50 dark:bg-gray-900 transition-all duration-300">
//       {/* Sidebar */}
//       <Sidebar
//         isSidebarOpen={isSidebarOpen}
//         setIsSidebarOpen={setIsSidebarOpen} // Pass the correct setter
//       />

//       {/* Main Content */}
//       <div className={`flex-1 ml-${isSidebarOpen ? "64" : "16"} transition-all duration-300`}>
//         {/* Navbar */}
//         <nav className=" flex items-center justify-between h-16 px-6  shadow-md bg-blue-200 dark:bg-gray-900 border-b-4 border-gray-200 dark:border-gray-700">
//           <div className="flex items-center">
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Use setIsSidebarOpen directly
//               className="p-2 hidden rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
//             </button>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//               onClick={() => setIsDarkMode((prev) => !prev)}
//             >
//               {isDarkMode ? <HiMoon className="w-6 h-6" /> : <HiSun className="w-7 h-6" />}
//             </button>
//             <img src={profileImg} alt="profile" className="w-8 h-8" />
//           </div>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default NavbarWithSidebar;




import React, { useState, useEffect } from "react";
import { Menu, Bell } from "lucide-react";
import { HiSun, HiMoon } from "react-icons/hi";
import { TbLogout2 } from "react-icons/tb";
import { FaBell, FaTasks, FaRegCalendarCheck } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const roleFromSession = sessionStorage.getItem("userRole");
    const roleFromLocal = localStorage.getItem("userRole");
    setUserRole(roleFromSession || roleFromLocal || ""); // Default to empty string if no role is found

    const usernameFromSession = sessionStorage.getItem("username");
    const usernameFromLocal = localStorage.getItem("username");
    setUsername(usernameFromSession || usernameFromLocal || ""); // Default to empty string if no username is found
  }, []);

  
  const handleLogout = () => {
    // Clear user data from sessionStorage and localStorage
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    
    // Navigate to the login page
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleBellClick = () => {
    setIsNotificationsVisible((prev) => !prev);
  };

  const getNotifications = () => {
    if (userRole === "admin") {
      return [
        { 
          text: "New user registered", 
          icon: <FaBell className="text-blue-500" />,
          time: "2 minutes ago",
          priority: "high"
        },
        { 
          text: "System update available", 
          icon: <FaTasks className="text-yellow-500" />,
          time: "1 hour ago",
          priority: "medium"
        },
      ];
    } else if (userRole === "employee") {
      return [
        { 
          text: "New task assigned", 
          icon: <FaTasks className="text-green-500" />,
          time: "5 minutes ago",
          priority: "high"
        },
        { 
          text: "Reminder: Goldmines due in 5 days", 
          icon: <FaRegCalendarCheck className="text-orange-500" />,
          time: "3 hours ago",
          priority: "medium"
        },
      ];
    }
    return [];
  };

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          onClick={handleBellClick}
        >
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {isNotificationsVisible && (
          <div className="absolute right-[2rem] sm:right-[7rem] top-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-[12rem] sm:w-[14rem] overflow-hidden">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-white">Notifications</h3>
                <span className="text-sm text-white opacity-80">
                  {getNotifications().length} New
                </span>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {getNotifications().map((notification, index) => (
                <div 
                  key={index} 
                  className="group relative p-2 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
                      {notification.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                        {notification.text}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      notification.priority === 'high' ? 'bg-red-500' :
                      notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  </div>
                  <div className="absolute inset-0 border-l-4 border-transparent group-hover:border-blue-500 transition-all duration-200" />
                </div>
              ))}
            </div>
            
            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 text-center">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                View all notifications
              </button>
            </div>
          </div>
        )}

        {/* <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          onClick={() => setIsDarkMode((prev) => !prev)}
        >
          {isDarkMode ? (
            <HiMoon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          ) : (
            <HiSun className="w-6 h-6 text-gray-600" />
          )}
        </button> */}

        <div className="relative flex items-center space-x-2">
          <h2 className="flex flex-row items-center text-base font-bold text-[#216ac9] cursor-pointer"
            onClick={toggleDropdown}>
                {username}
                <MdOutlineKeyboardArrowDown className="w-6 h-6"/>
          </h2>

          {isDropdownOpen && (
            <div className="absolute right-1 top-9 bg-white dark:bg-gray-800 border rounded-lg shadow-lg transition-all duration-300 ease-out transform opacity-100 scale-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-2 py-2 text-left text-gray-600 hover:text-blue-500 hover:font-semibold dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ease-in-out hover:scale-105"
              >
                <TbLogout2 className="w-5 h-5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

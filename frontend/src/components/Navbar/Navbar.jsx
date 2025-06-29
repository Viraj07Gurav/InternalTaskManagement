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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSessionContext } from "../../Context/SessionContext";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  
  const { accessToken, username, role } = useSessionContext();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!username || !accessToken) {
      console.log('Missing username or accessToken', { username, hasToken: !!accessToken });
      return;
    }
  
    try {
      console.log('Fetching notifications for:', username);
      const response = await axios.get(
        `http://localhost:5000/notifications?username=${username}`,
        {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
      console.log('Notifications response:', response.data);
  
      if (response.data.success) {
        setNotifications(response.data.notifications);
        const unreadNotifications = response.data.notifications.filter(n => !n.read_status);
        setUnreadCount(unreadNotifications.length);
        setError(null);
      } else {
        console.error('Failed to fetch notifications:', response.data.message);
        setError('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error.response || error);
      setError(error.response?.data?.message || 'Error fetching notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [username, accessToken]);

  const markAsRead = async (notificationId) => {
    try {
      console.log('Marking notification as read:', notificationId);
      const response = await axios.put(
        `http://localhost:5000/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      console.log('Mark as read response:', response.data);
      
      if (response.data.message === "Notification marked as read") {
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "deadline":
        return <FaTasks className="text-yellow-500" />;
      case "overdue":
        return <FaBell className="text-red-500" />;
      case "completion":
        return <FaRegCalendarCheck className="text-green-500" />;
      case "package_end":
        return <FaRegCalendarCheck className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
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
        <div className="relative">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative cursor-pointer"
            onClick={() => setIsNotificationsVisible(!isNotificationsVisible)}
          >
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsVisible && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  <span className="text-sm text-white opacity-80">{unreadCount} Unread</span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {error ? (
                  <div className="p-4 text-center text-red-500">{error}</div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                        !notification.read_status ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center space-x-2 focus:outline-none cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="text-base font-bold text-[#216ac9]">{username}</span>
            <MdOutlineKeyboardArrowDown className="w-6 h-6" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-1 top-9 bg-white dark:bg-gray-800 border-2 border-gray-600/40 rounded-lg shadow-lg transition-all duration-300 ease-out transform opacity-100 ">
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
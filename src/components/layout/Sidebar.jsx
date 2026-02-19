import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user } = useAuthContext();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Statistics", href: "/statistics", icon: TrendingUp },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Follow-ups", href: "/followups", icon: Calendar },
  ];

  const settingsNavigation = [
    { name: "Branches", href: "/settings/branches" },
    { name: "Courses", href: "/settings/courses" },
    { name: "Employees", href: "/settings/employees" },
    { name: "Lead Sources", href: "/settings/lead-sources" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`flex flex-col ${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-white border-r border-gray-200`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {sidebarOpen && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold text-gray-800"
          >
            wimseCRM
          </motion.h1>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive(item.href)
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {item.name}
              </motion.span>
            )}
          </NavLink>
        ))}
        {(user?.role === "Admin" || user?.role === "Manager") && (
          <>
            <div
              className={`mt-6 pt-6 border-t border-gray-200 ${!sidebarOpen && "hidden"}`}
            >
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </h3>
            </div>
            {settingsNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            ))}
          </>
        )}
      </nav>
      <div
        className={`p-4 border-t border-gray-200 ${!sidebarOpen && "hidden"}`}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
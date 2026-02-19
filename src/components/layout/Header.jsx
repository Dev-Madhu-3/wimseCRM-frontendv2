import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { Search, Bell, LogOut, Menu } from "lucide-react";
import { AiOutlineLogout } from "react-icons/ai";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/leads/search?mobile=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login")
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <form
              onSubmit={handleSearch}
              className="ml-4 md:ml-6 flex-1 max-w-lg"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search leads..."
                />
              </div>
            </form>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>
            <div className="relative">
              <button
                onClick={handleLogout}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    <AiOutlineLogout />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

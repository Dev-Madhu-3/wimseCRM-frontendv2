import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, User, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";

const LeadSearch = () => {
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lead, setLead] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!mobile.trim()) {
      toast.error("Please enter a mobile number");
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setLead(null);

    try {
      const response = await api.get(`/leads/search?mobile=${mobile}`);
      setLead(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error("Failed to search for lead");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewLead = () => {
    navigate(`/leads/new?mobile=${mobile}`);
  };

  const handleViewLead = () => {
    navigate(`/leads/${lead.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-6 sm:px-0 max-w-2xl mx-auto"
    >
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Lead</h1>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter mobile number"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {notFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No lead found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No lead exists with mobile number: {mobile}
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateNewLead}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Lead
              </button>
            </div>
          </motion.div>
        )}

        {lead && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-gray-200 pt-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {lead.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {lead.name}
                </h3>
                <p className="text-sm text-gray-500">{lead.mobile}</p>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span>{lead.course}</span>
                  {lead.specialization && <span className="mx-1">•</span>}
                  <span>{lead.specialization}</span>
                  <span className="mx-1">•</span>
                  <span>{lead.branch}</span>
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    lead.leadStatus === "Converted"
                      ? "bg-green-100 text-green-800"
                      : lead.leadStatus === "Dropped"
                        ? "bg-red-100 text-red-800"
                        : lead.leadStatus === "Visit Office"
                          ? "bg-blue-100 text-blue-800"
                          : lead.leadStatus === "Not Interested"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {lead.leadStatus}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleViewLead}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View Lead Details
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LeadSearch;

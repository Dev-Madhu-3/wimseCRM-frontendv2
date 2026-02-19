import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [branches, setBranches] = useState([]);
  const [sources, setSources] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get("/leads");
        setLeads(response.data);
        setFilteredLeads(response.data);

        // Extract unique branches and sources for filters
        const uniqueBranches = [
          ...new Set(response.data.map((lead) => lead.branch)),
        ].filter(Boolean);
        const uniqueSources = [
          ...new Set(response.data.map((lead) => lead.leadSource)),
        ].filter(Boolean);

        setBranches(uniqueBranches);
        setSources(uniqueSources);
      } catch (error) {
        toast.error("Failed to fetch leads");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    let result = leads;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.mobile.includes(searchQuery) ||
          lead.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply status filter
    if (filterStatus) {
      result = result.filter((lead) => lead.leadStatus === filterStatus);
    }

    // Apply branch filter
    if (filterBranch) {
      result = result.filter((lead) => lead.branch === filterBranch);
    }

    // Apply source filter
    if (filterSource) {
      result = result.filter((lead) => lead.leadSource === filterSource);
    }

    setFilteredLeads(result);
  }, [leads, searchQuery, filterStatus, filterBranch, filterSource]);

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await api.delete(`/leads/${id}`);
        setLeads(leads.filter((lead) => lead.id !== id));
        toast.success("Lead deleted successfully");
      } catch (error) {
        toast.error("Failed to delete lead");
      }
    }
  };

  const handleExportLeads = () => {
    // This would be implemented to export leads to CSV/Excel
    toast.success("Export feature coming soon!");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 sm:px-0"
    >
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={handleExportLeads}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <Link
            to="/leads/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search by name, mobile, or email..."
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div>
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="Next Follow-up">Next Follow-up</option>
                  <option value="Visit Office">Visit Office</option>
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Converted">Converted</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="branch-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Branch
                </label>
                <select
                  id="branch-filter"
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="source-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lead Source
                </label>
                <select
                  id="source-filter"
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">All Sources</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredLeads.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <motion.li key={lead.id} variants={itemVariants}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {lead.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {lead.name}
                          </p>
                          <span
                            className={`ml-2 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
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
                        <p className="text-sm text-gray-500">
                          {lead.mobile} • {lead.email || "No email"}
                        </p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span>{lead.course}</span>
                          {lead.specialization && (
                            <span className="mx-1">•</span>
                          )}
                          <span>{lead.specialization}</span>
                          <span className="mx-1">•</span>
                          <span>{lead.branch}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/leads/${lead.id}`}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Eye className="h-5 w-5 text-gray-400" />
                      </Link>
                      <Link
                        to={`/leads/${lead.id}/edit`}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Edit className="h-5 w-5 text-gray-400" />
                      </Link>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Trash2 className="h-5 w-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No leads found</p>
            <Link
              to="/leads/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first lead
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeadList;

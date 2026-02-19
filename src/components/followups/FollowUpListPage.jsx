import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Filter, Search } from "lucide-react";
import api from "../../lib/api";
import FollowUpCard from "./FollowUpCard";

const FollowUpListPage = () => {
  const [followUps, setFollowUps] = useState([]);
  const [filteredFollowUps, setFilteredFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const response = await api.get("/followups");
        setFollowUps(response.data);
        setFilteredFollowUps(response.data);
      } catch (error) {
        console.error("Failed to fetch follow-ups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowUps();
  }, []);

  useEffect(() => {
    let result = followUps;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (followUp) =>
          followUp.lead.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          followUp.lead.mobile.includes(searchQuery) ||
          followUp.feedback.toLowerCase().includes(searchQuery.toLowerCase()) ||
          followUp.followedBy.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply status filter
    if (filterStatus) {
      result = result.filter((followUp) => followUp.status === filterStatus);
    }

    // Apply employee filter
    if (filterEmployee) {
      result = result.filter(
        (followUp) => followUp.followedBy === filterEmployee,
      );
    }

    setFilteredFollowUps(result);
  }, [followUps, searchQuery, filterStatus, filterEmployee]);

  const handleToggleCard = (id) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
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
        <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
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
                  placeholder="Search by lead name, mobile, feedback, or employee..."
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
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
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
                  htmlFor="employee-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Employee
                </label>
                <select
                  id="employee-filter"
                  value={filterEmployee}
                  onChange={(e) => setFilterEmployee(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">All Employees</option>
                  {[...new Set(followUps.map((f) => f.followedBy))].map(
                    (employee) => (
                      <option key={employee} value={employee}>
                        {employee}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-4">
        {filteredFollowUps.length > 0 ? (
          filteredFollowUps.map((followUp) => (
            <motion.div key={followUp.id} variants={itemVariants}>
              <FollowUpCard
                followUp={followUp}
                expanded={expandedCards.has(followUp.id)}
                onToggle={() => handleToggleCard(followUp.id)}
              />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No follow-ups found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || filterStatus || filterEmployee
                ? "Try adjusting your search or filter criteria"
                : "No follow-ups have been recorded yet"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FollowUpListPage;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Search, Calendar, Users, TrendingUp } from "lucide-react";
import api from "../../lib/api";

const Home = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    pendingLeads: 0,
    droppedLeads: 0,
    todayFollowUps: 0,
    overdueFollowUps: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [statsRes, leadsRes, followUpsRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/leads/recent"),
          api.get("/followups/upcoming"),
        ]);

        setStats(statsRes.data);
        setRecentLeads(leadsRes.data);
        setUpcomingFollowUps(followUpsRes.data);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/leads/new"
            className="flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Lead
          </Link>
          <Link
            to="/leads"
            className="flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md shadow-sm border border-gray-300 transition-colors"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Leads
          </Link>
          <Link
            to="/followups"
            className="flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md shadow-sm border border-gray-300 transition-colors"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Today's Follow-ups
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Leads
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalLeads}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Converted
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.convertedLeads}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.pendingLeads}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Dropped
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.droppedLeads}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Leads
            </h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead) => (
                    <li key={lead.id} className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {lead.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {lead.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {lead.mobile}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              lead.status === "Converted"
                                ? "bg-green-100 text-green-800"
                                : lead.status === "Dropped"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-4">
                    <p className="text-sm text-gray-500">No recent leads</p>
                  </li>
                )}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/leads"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all leads
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Follow-ups */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Upcoming Follow-ups
            </h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {upcomingFollowUps.length > 0 ? (
                  upcomingFollowUps.map((followUp) => (
                    <li key={followUp.id} className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {followUp.leadName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {followUp.leadName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {new Date(
                              followUp.nextFollowUpDate,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              followUp.status === "Visit Office"
                                ? "bg-blue-100 text-blue-800"
                                : followUp.status === "Interested"
                                  ? "bg-green-100 text-green-800"
                                  : followUp.status === "Not Interested"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {followUp.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-4">
                    <p className="text-sm text-gray-500">
                      No upcoming follow-ups
                    </p>
                  </li>
                )}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/followups"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all follow-ups
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;

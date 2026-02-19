import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../../lib/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    pendingLeads: 0,
    droppedLeads: 0,
  });
  const [leadsBySource, setLeadsBySource] = useState([]);
  const [leadsByBranch, setLeadsByBranch] = useState([]);
  const [followUpPerformance, setFollowUpPerformance] = useState({
    completed: 0,
    pending: 0,
  });
  const [conversionRatio, setConversionRatio] = useState({
    total: 0,
    converted: 0,
    ratio: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, sourceRes, branchRes, followUpRes, conversionRes] =
          await Promise.all([
            api.get("/dashboard/stats"),
            api.get("/dashboard/leads-by-source"),
            api.get("/dashboard/leads-by-branch"),
            api.get("/dashboard/follow-up-performance"),
            api.get("/dashboard/conversion-ratio"),
          ]);

        setStats(statsRes.data);
        setLeadsBySource(sourceRes.data);
        setLeadsByBranch(branchRes.data);
        setFollowUpPerformance(followUpRes.data);
        setConversionRatio(conversionRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-6 sm:px-0"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your leads and conversion metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
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
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Leads by Source Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Leads by Source
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadsBySource}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="leadSource" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="_count.leadSource" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Branch Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Leads by Branch
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadsByBranch}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="_count.branch"
              >
                {leadsByBranch.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Follow-up Performance Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Follow-up Performance
          </h3>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="flex justify-center space-x-8 mb-4">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {followUpPerformance.completed}
                  </div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {followUpPerformance.pending}
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Completed",
                        value: followUpPerformance.completed,
                      },
                      { name: "Pending", value: followUpPerformance.pending },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Conversion Ratio Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Conversion Ratio
          </h3>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {conversionRatio.ratio}%
              </div>
              <div className="text-sm text-gray-500 mb-4">Conversion Rate</div>
              <div className="flex justify-center space-x-8">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {conversionRatio.total}
                  </div>
                  <div className="text-xs text-gray-500">Total Leads</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-green-600">
                    {conversionRatio.converted}
                  </div>
                  <div className="text-xs text-gray-500">Converted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

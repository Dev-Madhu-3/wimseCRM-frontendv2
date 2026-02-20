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
  LineChart,
  Line,
} from "recharts";
import api from "../../lib/api";

const Statistics = () => {
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [dailyPerformance, setDailyPerformance] = useState([]);
  const [weeklyPerformance, setWeeklyPerformance] = useState([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState([]);
  const [sourcePerformance, setSourcePerformance] = useState([]);
  const [branchPerformance, setBranchPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("daily");

  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        const [
          employeeRes,
          dailyRes,
          weeklyRes,
          monthlyRes,
          sourceRes,
          branchRes,
        ] = await Promise.all([
          api.get("/dashboard/employee-performance"),
          api.get("/statistics/daily"),
          api.get("/statistics/weekly"),
          api.get("/statistics/monthly"),
          api.get("/statistics/source-wise"),
          api.get("/statistics/branch-wise"),
        ]);

        setEmployeePerformance(employeeRes.data);
        setDailyPerformance(dailyRes.data);
        setWeeklyPerformance(weeklyRes.data);
        setMonthlyPerformance(monthlyRes.data);
        setSourcePerformance(sourceRes.data);
        setBranchPerformance(branchRes.data);
      } catch (error) {
        console.error("Failed to fetch statistics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatisticsData();
  }, []);

  const getPerformanceData = () => {
    switch (timeRange) {
      case "daily":
        return dailyPerformance;
      case "weekly":
        return weeklyPerformance;
      case "monthly":
        return monthlyPerformance;
      default:
        return dailyPerformance;
    }
  };

  const calcHeight = (count, base = 300, per = 40) => {
    return Math.max(base, count * per);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-6 sm:px-0"
    >
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("daily")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === "daily"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeRange("weekly")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === "weekly"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === "monthly"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lead Performance Over Time */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Lead Performance (
            {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getPerformanceData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#3b82f6"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="converted" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Employee-wise Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Employee-wise Performance
          </h3>
          {(() => {
            const count = employeePerformance.length;
            const isVertical = count > 8; // switch to vertical bars when many employees
            const height = calcHeight(count, 300, 36);

            return (
              <ResponsiveContainer width="100%" height={height}>
                {isVertical ? (
                  <BarChart data={employeePerformance} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="leadsCount" fill="#3b82f6" name="Leads" barSize={18} />
                    <Bar dataKey="followUpsCount" fill="#10b981" name="Follow-ups" barSize={18} />
                  </BarChart>
                ) : (
                  <BarChart data={employeePerformance} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="leadsCount" fill="#3b82f6" name="Leads" />
                    <Bar dataKey="followUpsCount" fill="#10b981" name="Follow-ups" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            );
          })()}
        </div>

        {/* Source-wise Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Source-wise Performance
          </h3>
          {(() => {
            const count = sourcePerformance.length;
            const height = calcHeight(count, 300, 36);

            return (
              <ResponsiveContainer width="100%" height={height}>
                <BarChart data={sourcePerformance} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" interval={0} tick={{ angle: -45, textAnchor: 'end' }} height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                  <Bar dataKey="converted" fill="#10b981" name="Converted" />
                </BarChart>
              </ResponsiveContainer>
            );
          })()}
        </div>

        {/* Branch-wise Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Branch-wise Performance
          </h3>
          {(() => {
            const count = branchPerformance.length;
            const height = calcHeight(count, 300, 36);

            return (
              <ResponsiveContainer width="100%" height={height}>
                <BarChart data={branchPerformance} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branch" interval={0} tick={{ angle: -30, textAnchor: 'end' }} height={50} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                  <Bar dataKey="converted" fill="#10b981" name="Converted" />
                </BarChart>
              </ResponsiveContainer>
            );
          })()}
        </div>
      </div>
    </motion.div>
  );
};

export default Statistics;

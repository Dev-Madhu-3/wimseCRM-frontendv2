import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Home from "../dashboard/Home";
import Dashboard from "../dashboard/Dashboard";
import Statistics from "../dashboard/Statistics";
import LeadList from "../leads/LeadList";
import LeadDetail from "../leads/LeadDetail";
import LeadForm from "../leads/LeadForm";
import FollowUpList from "../followups/FollowUpList";
import BranchSettings from "../settings/BranchSettings";
import CourseSettings from "../settings/CourseSettings";
import EmployeeSettings from "../settings/EmployeeSettings";
import LeadSourceSettings from "../settings/LeadSourceSettings";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/leads" element={<LeadList />} />
                  <Route path="/leads/new" element={<LeadForm />} />
                  <Route path="/leads/:id" element={<LeadDetail />} />
                  <Route path="/followups" element={<FollowUpList />} />
                  <Route
                    path="/settings/branches"
                    element={<BranchSettings />}
                  />
                  <Route
                    path="/settings/courses"
                    element={<CourseSettings />}
                  />
                  <Route
                    path="/settings/employees"
                    element={<EmployeeSettings />}
                  />
                  <Route
                    path="/settings/lead-sources"
                    element={<LeadSourceSettings />}
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

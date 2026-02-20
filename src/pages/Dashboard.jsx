import { Routes, Route } from "react-router-dom";
import Home from "../components/dashboard/Home";
import { Navigate } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import Statistics from "../components/dashboard/Statistics";
import { useAuthContext } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuthContext();

  return (
    <>
      {user ? (
        <Navigate to="/" />
      ) : (
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/analytics" element={<Dashboard />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default DashboardPage;

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const { setUser, user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{setUser, user, login, logout }}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/*"
            element={<ProtectedRoute /> }
          />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;

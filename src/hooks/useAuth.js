import { useState, useEffect } from "react";
import api from "../lib/api";
import Cookies from "js-cookie";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get("token");

      if (token) {
        const response = await api.get("/auth/me");
        setUser(response.data);
      }
    } catch (error) {
      Cookies.remove("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    Cookies.set("token", response.data.token);
    await checkAuth();
    // setUser(response.data.user);

    return response.data;
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null); // 🔥 triggers redirect
  };

  return {
    user,
    setUser,
    login,
    logout,
    isLoading,
  };
};

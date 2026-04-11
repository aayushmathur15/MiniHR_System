import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "@/components/Toaster";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const hydrateUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/users/me");
      setUser(response.data.data);
    } catch (error) {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrateUser();
  }, []);

  const login = async (values) => {
    const response = await api.post("/users/login", values);
    const payload = response.data.data;
    setUser(payload.user);
    setTokens(payload.accessToken, payload.refreshToken);
    return payload.user;
  };

  const register = async (values) => {
    const response = await api.post("/users/register", values);
    const payload = response.data.data;
    return payload;
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      // ignore network cleanup errors
    }
    clearTokens();
    setUser(null);
    navigate("/login", { replace: true });
    toast({ title: "Logged out", description: "You have been signed out." });
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

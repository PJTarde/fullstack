import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../api/axios";

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Ensure token isn't expired
        if (decoded.exp * 1000 > Date.now()) {
          setAdminUser({ token, email: decoded.email || 'Admin', id: decoded.id });
        } else {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("isAdminLoggedIn");
        }
      } catch (e) {
        localStorage.removeItem("adminToken");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setAdminUser(userData);
    localStorage.setItem("adminToken", userData.token);
    localStorage.setItem("isAdminLoggedIn", "true");
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdminLoggedIn");
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, login, logout, loading }}>
      {!loading && children}
    </AdminAuthContext.Provider>
  );
};

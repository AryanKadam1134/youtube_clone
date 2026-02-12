import React, { createContext, useContext, useState } from "react";
import { apiEndpoints } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", jwt);
  };

  const logout = async () => {
    try {
      await apiEndpoints.logout();

      setUser(null);
      setToken(null);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.error("Error Logging out: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState } from "react";
import { login as loginService } from "../services/auth.services";
import { showError } from "../lib/alert";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await loginService(credentials);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error(error.response?.data?.msg || "Email atau password salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

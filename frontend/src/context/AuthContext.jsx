import { createContext, useContext, useState } from "react";
import { login as loginService } from "../services/auth.services";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await loginService(credentials);
      setUser(result.user);
      return result;
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

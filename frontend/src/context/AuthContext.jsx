import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
} from "../services/auth.services";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ambil user dari session laravel
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCurrentUser();
      setUser(result);
    } catch (error) {
      console.error("fetch User:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await loginService(credentials);
      localStorage.setItem("token", result.token);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error(error.response?.data?.msg || "Email atau password salah!");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

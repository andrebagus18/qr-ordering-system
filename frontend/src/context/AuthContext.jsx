import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
} from "../services/auth.services";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ambil user dari session laravel
  // const fetchUser = useCallback(async () => {
  //   try {
  //     // setLoading(true);
  //     const result = await getCurrentUser();
  //     setUser(result);
  //   } catch (error) {
  //     if (error.response?.status === 401) {
  //       setUser(null);
  //     } else {
  //       console.error("Fetch user:", error);
  //       setUser(null);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchUser();
  // }, [fetchUser]);

  useEffect(() => {
    let ignore = false;

    getCurrentUser()
      .then((result) => {
        if (!ignore) {
          setUser(result);
        }
      })
      .catch((error) => {
        if (!ignore) {
          if (error.response?.status === 401) {
            setUser(null);
          } else {
            console.error("Fetch user:", error);
            setUser(null);
          }
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (credentials) => {
    try {
      // setLoading(true);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

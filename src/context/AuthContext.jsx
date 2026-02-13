import { createContext, useContext, useMemo, useState } from "react";
import apiClient, { TOKEN_KEY } from "../api/apiClient";

const USER_KEY = "vectrahire_user";

const AuthContext = createContext(null);

const parseStoredUser = () => {
  const rawValue = localStorage.getItem(USER_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => parseStoredUser());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const persistSession = (sessionToken, sessionUser) => {
    setToken(sessionToken);
    setUser(sessionUser);
    localStorage.setItem(TOKEN_KEY, sessionToken);
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
  };

  const login = async (credentials) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/auth/login", credentials);
      const sessionToken = response?.data?.token || `mock-token-${Date.now()}`;
      const sessionUser = response?.data?.user || {
        name: credentials.email.split("@")[0],
        email: credentials.email,
      };

      persistSession(sessionToken, sessionUser);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const sessionToken = `mock-token-${Date.now()}`;
      const sessionUser = {
        name: credentials.email.split("@")[0],
        email: credentials.email,
      };

      persistSession(sessionToken, sessionUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (payload) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/auth/register", payload);
      const sessionToken = response?.data?.token || `mock-token-${Date.now()}`;
      const sessionUser = response?.data?.user || {
        name: payload.name,
        email: payload.email,
      };

      persistSession(sessionToken, sessionUser);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const sessionToken = `mock-token-${Date.now()}`;
      const sessionUser = {
        name: payload.name,
        email: payload.email,
      };

      persistSession(sessionToken, sessionUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isSubmitting,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, isSubmitting],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

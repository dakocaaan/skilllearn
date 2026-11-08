
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");

        if (token && savedUser) {
          // Verify the saved token with the backend.
          const response = await api.get("/profile");
          setUser(response.data.user);
        }
      } catch (error) {
        await AsyncStorage.multiRemove(["token", "user"]);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password
    });

    await AsyncStorage.multiSet([
      ["token", response.data.token],
      ["user", JSON.stringify(response.data.user)]
    ]);

    setUser(response.data.user);
  };

  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password
    });

    await AsyncStorage.multiSet([
      ["token", response.data.token],
      ["user", JSON.stringify(response.data.user)]
    ]);

    setUser(response.data.user);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

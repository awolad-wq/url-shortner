import { createContext, useContext, useEffect, useState } from "react";
import useAxios from "../Hooks/UseAxios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const axios = useAxios();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    try {
      const res = await axios.get("/auth/profile", {
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

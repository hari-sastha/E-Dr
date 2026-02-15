import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import api from "../api/client";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext(null);

const TOKEN_KEY = "edr_token";
const USER_KEY = "edr_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!firebaseUser) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        setLoading(false);
        return;
      }

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const persistSession = (token, profile) => {
    // Store JWT and user profile for API calls across refreshes.
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const response = await api.post("/api/auth/firebase", { idToken });
    persistSession(response.data.token, response.data.user);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      // Always clear local session even if Firebase sign-out fails.
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, loading, loginWithGoogle, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

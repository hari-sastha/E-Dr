import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import api from "../api/client";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext(null);

const TOKEN_KEY = "edr_token";
const USER_KEY = "edr_user";
const PROFILE_KEY = "edr_needs_profile";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedProfile = localStorage.getItem(PROFILE_KEY);

      if (!firebaseUser) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PROFILE_KEY);
        setUser(null);
        setNeedsProfileCompletion(false);
        setLoading(false);
        return;
      }

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setNeedsProfileCompletion(storedProfile === "true");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const persistSession = (token, profile, needsProfile) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    localStorage.setItem(PROFILE_KEY, String(Boolean(needsProfile)));
    setUser(profile);
    setNeedsProfileCompletion(Boolean(needsProfile));
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const response = await api.post("/api/auth/firebase", { idToken });
    persistSession(
      response.data.token,
      response.data.user,
      response.data.needsProfileCompletion
    );
    return response.data;
  };

  const completeProfile = async (payload) => {
    const response = await api.put("/api/auth/profile", payload);
    const nextUser = response.data.user;
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(PROFILE_KEY, "false");
    setUser(nextUser);
    setNeedsProfileCompletion(false);
    return nextUser;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(PROFILE_KEY);
      setUser(null);
      setNeedsProfileCompletion(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      needsProfileCompletion,
      loginWithGoogle,
      completeProfile,
      logout
    }),
    [user, loading, needsProfileCompletion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

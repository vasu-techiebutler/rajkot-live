"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "./types";
import { getCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout } from "./api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, username: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await apiLogin(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(
    async (name: string, username: string, email: string, password: string) => {
      const u = await apiRegister(name, username, email, password);
      setUser(u);
      return u;
    },
    []
  );

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

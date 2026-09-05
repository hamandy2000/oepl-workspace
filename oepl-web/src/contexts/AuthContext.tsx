"use client";

/** 관리자 인증 Context — 세션 확인·로그인·로그아웃 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ADMIN_IDLE_TIMEOUT_MS } from "@/lib/supabase/security";

interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      if (!res.ok) {
        setIsAuthenticated(false);
        return;
      }
      const json = (await res.json()) as { authenticated?: boolean };
      setIsAuthenticated(Boolean(json.authenticated));
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let timer: ReturnType<typeof setTimeout>;

    const resetIdleTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        void logout();
      }, ADMIN_IDLE_TIMEOUT_MS);
    };

    const onActivity = () => resetIdleTimer();
    const events = ["mousedown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((event) => window.addEventListener(event, onActivity, { passive: true }));
    resetIdleTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, onActivity));
    };
  }, [isAuthenticated, logout]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return false;
    setIsAuthenticated(true);
    return true;
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, loading, login, logout }),
    [isAuthenticated, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

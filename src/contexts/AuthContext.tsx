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
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // "Authenticated" here means "signed in AND an admin" — /api/auth/session reports
  // admin status, not merely a valid session. Anything this flag gates is UI only;
  // the API routes and RLS enforce the same rule server-side.
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      if (!res.ok) {
        setIsAuthenticated(false);
        setEmail(null);
        return;
      }
      const json = (await res.json()) as {
        authenticated?: boolean;
        email?: string | null;
      };
      setIsAuthenticated(Boolean(json.authenticated));
      setEmail(json.email ?? null);
    } catch {
      setIsAuthenticated(false);
      setEmail(null);
    }
  }, []);

  useEffect(() => {
    void refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsAuthenticated(false);
    setEmail(null);
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

  const login = useCallback(async (loginEmail: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: loginEmail, password }),
    });
    if (!res.ok) return false;
    const json = (await res.json().catch(() => null)) as { email?: string | null } | null;
    setIsAuthenticated(true);
    setEmail(json?.email ?? loginEmail);
    return true;
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, email, loading, login, logout }),
    [isAuthenticated, email, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

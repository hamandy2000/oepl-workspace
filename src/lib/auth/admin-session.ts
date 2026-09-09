/** 관리자 세션 토큰 — 서명·검증 및 쿠키 옵션 */

import crypto from "node:crypto";
import { ADMIN_IDLE_TIMEOUT_MS } from "@/lib/supabase/security";

export const ADMIN_SESSION_COOKIE = "oepl-admin-session";

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "oepl-dev-session-secret"
  );
}

export function getAdminCredentials(): { username: string; password: string } | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (username && password) {
    return { username, password };
  }
  if (process.env.NODE_ENV !== "production") {
    return { username: "admin", password: "oepl-admin" };
  }
  return null;
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function signExpiresAt(expiresAt: number): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(String(expiresAt))
    .digest("base64url");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + ADMIN_IDLE_TIMEOUT_MS;
  return `${expiresAt}.${signExpiresAt(expiresAt)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const expiresAt = Number(expStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  return timingSafeEqual(sig, signExpiresAt(expiresAt));
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expected = getAdminCredentials();
  if (!expected) return false;
  return (
    timingSafeEqual(username.trim(), expected.username) &&
    timingSafeEqual(password, expected.password)
  );
}

export const adminSessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ADMIN_IDLE_TIMEOUT_MS / 1000,
};

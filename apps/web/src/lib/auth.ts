import { cookies } from "next/headers";

export const AUTH_COOKIE = "token";

export interface CurrentUser {
  sub: string;
  email: string;
  name: string;
  role: "admin" | "teacher" | "parent" | string;
  exp?: number;
}

// Decode a JWT payload without verifying the signature. The API is the
// source of truth for verification on every write; this is only used on
// the web side to personalize the UI (name, role, avatar) and to do a
// cheap "is this token expired" check in middleware.
export function decodeToken(token: string): CurrentUser | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(normalized, "base64").toString("utf-8");
    return JSON.parse(json) as CurrentUser;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const user = decodeToken(token);
  if (!user) return null;
  if (user.exp && user.exp * 1000 <= Date.now()) return null;
  return user;
}

export function dashboardFor(role: string): string {
  if (role === "admin") return "/app/admin/dashboard";
  if (role === "teacher") return "/app/teacher/dashboard";
  if (role === "parent") return "/app/parent/dashboard";
  return "/login";
}

export function profileFor(role: string): string {
  if (role === "admin") return "/app/admin/profile";
  if (role === "teacher") return "/app/teacher/profile";
  if (role === "parent") return "/app/parent/profile";
  return "/login";
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

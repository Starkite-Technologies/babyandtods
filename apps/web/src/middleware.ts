import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

function decode(token: string): { role?: string; exp?: number } | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(normalized, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

function dashboardFor(role?: string): string {
  if (role === "admin") return "/app/admin/dashboard";
  if (role === "teacher") return "/app/teacher/dashboard";
  if (role === "parent") return "/app/parent/dashboard";
  return "/login";
}

async function liveSessionValid(token: string) {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (pathname === "/") {
    const res = NextResponse.next();
    if (token) res.cookies.delete("token");
    return res;
  }

  const payload = token ? decode(token) : null;
  const locallyValid = Boolean(payload && (!payload.exp || payload.exp * 1000 > Date.now()));
  const valid = token && locallyValid ? await liveSessionValid(token) : false;

  // Already signed in -> keep people away from the login screen
  if (pathname === "/login") {
    if (valid) {
      return NextResponse.redirect(new URL(dashboardFor(payload!.role), request.url));
    }
    const res = NextResponse.next();
    if (token) res.cookies.delete("token");
    return res;
  }

  // Everything under /app requires a valid session
  if (pathname.startsWith("/app/")) {
    if (!valid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("token");
      return res;
    }

    const role = payload!.role;
    const inWrongArea =
      (pathname.startsWith("/app/admin/") && role !== "admin") ||
      (pathname.startsWith("/app/teacher/") && role !== "teacher" && role !== "admin") ||
      (pathname.startsWith("/app/parent/") && role !== "parent" && role !== "admin");

    if (inWrongArea) {
      return NextResponse.redirect(new URL(dashboardFor(role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/app/:path*"]
};

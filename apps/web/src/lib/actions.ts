"use server";

// Server actions for the interactive features. Each posts to the NestJS API
// and degrades gracefully (returns { ok:false }) when an endpoint isn't live
// yet, so the client UI can still update optimistically.

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const AUTH_COOKIE = "token";

async function setAuthCookie(token: string, maxAge = 60 * 60 * 8) {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge
  });
}

async function post(path: string, body: unknown): Promise<{ ok: boolean; data?: unknown }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store"
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, data };
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

async function patch(path: string, body: unknown = {}): Promise<{ ok: boolean; data?: unknown }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store"
    });
    if (!res.ok) return { ok: false };
    const data = await res.json().catch(() => null);
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

async function del(path: string): Promise<{ ok: boolean; data?: unknown }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });
    if (!res.ok) return { ok: false };
    const data = await res.json().catch(() => null);
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

export async function checkInAction(input: { childId: string; status: "checked-in" | "picked-up" | "absent" }) {
  const nowIso = new Date().toISOString();
  return post("/attendance", {
    childId: input.childId,
    status: input.status,
    date: nowIso,
    checkedInAt: input.status === "checked-in" ? nowIso : null,
    checkedOutAt: input.status === "picked-up" ? nowIso : null
  });
}

export async function sendMessageAction(input: { threadId: string; body: string }) {
  return post("/messages", {
    threadId: input.threadId,
    body: input.body,
    senderId: "me",
    sentAt: new Date().toISOString()
  });
}

export async function recordPaymentAction(input: { invoiceId: string; amount: number; method: string }) {
  return post("/payments", {
    invoiceId: input.invoiceId,
    amount: input.amount,
    method: input.method,
    paidAt: new Date().toISOString()
  });
}

export async function saveReportAction(input: {
  childId: string;
  meals: string;
  nap: string;
  learningNote: string;
  status: "draft" | "ready" | "sent";
}) {
  return post("/daily-reports", { ...input, date: new Date().toISOString() });
}

export async function createStaffAccountAction(input: {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  assignedClassroomId?: string;
  employmentStatus?: string;
}) {
  return post("/admin-access/staff", input);
}

export async function sendInvitationAction(input: { userId?: string; email?: string; role?: string }) {
  return post("/admin-access/invitations/send", input);
}

export async function verifyAccountAction(userId: string) {
  return patch(`/admin-access/users/${userId}/verify`);
}

export async function suspendAccountAction(userId: string) {
  return patch(`/admin-access/users/${userId}/suspend`);
}

export async function restoreAccountAction(userId: string) {
  return patch(`/admin-access/users/${userId}/restore`);
}

export async function deleteAccountAction(userId: string) {
  return del(`/admin-access/users/${userId}`);
}

export async function cancelParentOnboardingAction(userId: string) {
  return del(`/admin-access/users/${userId}/onboarding`);
}

export async function submitAdmissionAction(formData: FormData) {
  const result = await post("/admissions", {
    parentName: String(formData.get("parentName") ?? ""),
    parentEmail: String(formData.get("parentEmail") ?? ""),
    parentPhone: String(formData.get("parentPhone") ?? ""),
    childName: String(formData.get("childName") ?? ""),
    childDateOfBirth: String(formData.get("childDateOfBirth") ?? ""),
    programme: String(formData.get("programme") ?? ""),
    preferredStart: String(formData.get("preferredStart") ?? ""),
    notes: String(formData.get("notes") ?? "")
  });
  if (result.ok) redirect("/admissions?submitted=1");
  redirect("/admissions?submitted=0");
}

export async function updateAdmissionStatusAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "");
  await patch(`/admissions/${id}/status`, { status, adminNote });
  revalidatePath("/app/admin/admissions");
}

export async function enrolAdmissionAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const classroomId = String(formData.get("classroomId") ?? "");
  const preferredStart = String(formData.get("preferredStart") ?? "");
  await patch(`/admissions/${id}/enrol`, { classroomId: classroomId || undefined, preferredStart: preferredStart || undefined });
  revalidatePath("/app/admin/admissions");
  revalidatePath("/app/admin/learners");
}

export async function deleteAdmissionAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) await del(`/admissions/${id}`);
  revalidatePath("/app/admin/admissions");
}

export async function clearAdmissionsAction() {
  await del("/admissions");
  revalidatePath("/app/admin/admissions");
}

export async function acceptInvitationAction(input: { token: string; password: string }) {
  const result = await post("/auth/accept-invitation", input);
  const data = result.data as { token?: string; maxAge?: number; user?: { role: string }; message?: string | string[] } | undefined;
  if (result.ok && data?.token) {
    await setAuthCookie(data.token, data.maxAge);
    return { ok: true, role: data.user?.role ?? "teacher" };
  }
  return { ok: false, message: firstMessage(data?.message) };
}

export async function loginAction(input: { email: string; password: string; rememberMe?: boolean }) {
  const result = await post("/auth/login", input);
  const data = result.data as { token?: string; maxAge?: number; user?: { role: string } } | undefined;
  if (result.ok && data?.token) {
    await setAuthCookie(data.token, data.maxAge);
    return { ok: true, role: data.user?.role ?? "teacher" };
  }
  return { ok: false };
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}

export async function signOutAction() {
  await logoutAction();
  redirect("/login");
}

function firstMessage(message?: string | string[]) {
  if (Array.isArray(message)) return message[0];
  return message;
}

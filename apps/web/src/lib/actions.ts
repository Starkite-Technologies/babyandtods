"use server";

// Server actions for the interactive features. Each posts to the NestJS API
// and degrades gracefully (returns { ok:false }) when an endpoint isn't live
// yet, so the client UI can still update optimistically.

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function post(path: string, body: unknown): Promise<{ ok: boolean; data?: unknown }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
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

export async function createParentAccountAction(input: {
  fullName: string;
  email: string;
  phone: string;
  relationshipToChild: string;
  linkedChildId?: string;
  pickupPermission?: boolean;
  emergencyContactStatus?: string;
}) {
  return post("/admin-access/parents", input);
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

export async function acceptInvitationAction(input: { token: string; password: string }) {
  return post("/auth/accept-invitation", input);
}

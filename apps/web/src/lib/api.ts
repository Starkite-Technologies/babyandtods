// Server-side API client for the Babies & Todd's Academy backend.
// All exported functions are usable from React Server Components.

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    next: { revalidate: 5 }
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText} on ${path}`);
  }
  return res.json() as Promise<T>;
}

/* -------- types -------- */

export type ApiUser = { id: string; name: string; email: string; role: string };

export type ApiEmailStatus = { provider: string; configured: boolean; from: string; mode: "send" | "preview" };

export type ApiAdminAccount = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastLogin?: string | null;
  invitedAt?: string | null;
  verifiedAt?: string | null;
};

export type ApiAdminStaffAccount = ApiAdminAccount & {
  assignedClassroom: string;
};

export type ApiAdminParentAccount = ApiAdminAccount & {
  relationshipToChild: string;
  linkedChild: string;
  pickupPermission: boolean;
  emergencyContactStatus: string;
};

export type ApiAdminInvitation = {
  id: string;
  email: string;
  role: string;
  status: string;
  sentAt?: string | null;
  expiresAt: string;
};

export type ApiAdminAuditLog = {
  id: string;
  actor: string;
  event: string;
  target: string;
  detail: string;
  createdAt: string;
};

export type ApiVerificationItem = {
  id: string;
  name: string;
  email: string;
  accountType: "staff" | "parent";
  checks: Array<{ label: string; value: string; status: "ready" | "missing" | "review" }>;
};

export type ApiAdminAccessSummary = {
  email: ApiEmailStatus;
  staffAccounts: ApiAdminStaffAccount[];
  parentAccounts: ApiAdminParentAccount[];
  invitations: ApiAdminInvitation[];
  verificationQueue: ApiVerificationItem[];
  auditLogs: ApiAdminAuditLog[];
  classrooms: ApiClassroom[];
  children: ApiChild[];
};

export type ApiClassroom = {
  id: string;
  name: string;
  ageGroup: string;
  leadStaff?: { id: string; roleTitle?: string; user: ApiUser } | null;
  children?: ApiChild[];
};

export type ApiChild = {
  id: string;
  name: string;
  dateOfBirth?: string;
  classroomId?: string | null;
  parentId?: string | null;
  classroom?: ApiClassroom | null;
  parent?: { id: string; phone: string; user: ApiUser } | null;
};

export type ApiAttendance = {
  id: string;
  childId: string;
  date: string;
  status: "checked-in" | "absent" | "picked-up";
  checkedInAt?: string | null;
  checkedOutAt?: string | null;
  child?: ApiChild;
};

export type ApiDailyReport = {
  id: string;
  childId: string;
  staffId?: string | null;
  date: string;
  meals: string;
  nap: string;
  learningNote: string;
  status: "draft" | "ready" | "approved" | "sent";
  child?: ApiChild;
  staff?: { id: string; user: ApiUser };
};

export type ApiAnnouncement = {
  id: string;
  title: string;
  body: string;
  audience: string;
  createdAt: string;
};

export type ApiAllergy = {
  id: string;
  childId: string;
  allergen: string;
  severity: "mild" | "moderate" | "severe";
  notes?: string | null;
  child?: ApiChild;
};

export type ApiIncident = {
  id: string;
  childId: string;
  date: string;
  summary: string;
  severity: "low" | "medium" | "high";
  child?: ApiChild;
};

export type ApiAuthorizedPickup = {
  id: string;
  childId: string;
  name: string;
  relationship: string;
  phone: string;
};

export type ApiInvoice = {
  id: string;
  parentId: string;
  amount: string | number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  parent?: { id: string; user: ApiUser };
  payments?: ApiPayment[];
};

export type ApiPayment = {
  id: string;
  invoiceId: string;
  amount: string | number;
  paidAt: string;
  method: string;
  invoice?: ApiInvoice;
};

export type ApiStaff = {
  id: string;
  userId: string;
  roleTitle: string;
  user: ApiUser;
  classrooms?: ApiClassroom[];
};

export type ApiMessage = {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  sentAt: string;
};

/* -------- endpoints -------- */

export const apiClient = {
  children: {
    list: () => api<ApiChild[]>("/children"),
    get: (id: string) => api<ApiChild & {
      attendanceRecords: ApiAttendance[];
      dailyReports: ApiDailyReport[];
      authorizedPickups: ApiAuthorizedPickup[];
      allergies: ApiAllergy[];
      incidents: ApiIncident[];
    }>(`/children/${id}`)
  },
  parents: {
    list: () => api<Array<{ id: string; phone: string; user: ApiUser; children: ApiChild[] }>>("/parents"),
    get: (id: string) => api(`/parents/${id}`)
  },
  staff: {
    list: () => api<ApiStaff[]>("/staff")
  },
  classrooms: {
    list: () => api<ApiClassroom[]>("/classrooms")
  },
  attendance: {
    today: () => api<ApiAttendance[]>("/attendance"),
    forChild: (id: string) => api<ApiAttendance[]>(`/attendance/child/${id}`)
  },
  dailyReports: {
    recent: () => api<ApiDailyReport[]>("/daily-reports"),
    forChild: (id: string) => api<ApiDailyReport[]>(`/daily-reports/child/${id}`)
  },
  announcements: {
    list: (audience?: string) =>
      api<ApiAnnouncement[]>(`/announcements${audience ? `?audience=${audience}` : ""}`)
  },
  invoices: {
    list: () => api<ApiInvoice[]>("/invoices"),
    forParent: (id: string) => api<ApiInvoice[]>(`/invoices?parentId=${id}`),
    summary: () =>
      api<{ total: number; paid: number; pending: number; overdue: number; count: number }>("/invoices/summary")
  },
  payments: {
    list: () => api<ApiPayment[]>("/payments")
  },
  allergies: {
    list: () => api<ApiAllergy[]>("/allergies")
  },
  incidents: {
    list: () => api<ApiIncident[]>("/incidents")
  },
  authorizedPickups: {
    forChild: (id: string) => api<ApiAuthorizedPickup[]>(`/authorized-pickups?childId=${id}`)
  },
  messages: {
    list: () => api<ApiMessage[]>("/messages"),
    thread: (id: string) => api<ApiMessage[]>(`/messages/${id}`)
  },
  adminAccess: {
    summary: () => api<ApiAdminAccessSummary>("/admin-access")
  }
};

/* -------- safe wrappers (fall back to empty arrays when API is unreachable) -------- */

export async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

export function formatMoney(amount: string | number) {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-NA", { style: "currency", currency: "NAD", maximumFractionDigits: 0 })
    .format(n)
    .replace("ZAR", "N$")
    .replace("NAD", "N$");
}

export function formatDate(d: string | Date | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function formatTime(d: string | Date | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function ageFrom(dob?: string | null) {
  if (!dob) return "—";
  const d = new Date(dob);
  const now = new Date();
  const months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
  if (months < 24) return `${months}m`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem ? `${years}y ${rem}m` : `${years}y`;
}

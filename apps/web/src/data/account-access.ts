import type {
  AuditLog,
  InvitationRecord,
  ParentUserAccount,
  Permission,
  StaffUserAccount,
  UserRole,
  VerificationItem
} from "@babies-tods/shared";

export const staffUserAccounts: StaffUserAccount[] = [
  {
    id: "staff-1",
    name: "Assumpta SM Gahutu",
    email: "director@babiesandtods.test",
    phone: "+264 81 555 0100",
    role: "SUPER_ADMIN",
    assignedClassroom: "All classrooms",
    employmentStatus: "permanent",
    status: "active",
    lastLogin: "Today, 08:12"
  },
  {
    id: "staff-2",
    name: "Johanna Festus",
    email: "johanna@babiesandtods.test",
    phone: "+264 81 555 0133",
    role: "TEACHER",
    assignedClassroom: "Sunshine",
    employmentStatus: "permanent",
    status: "pending_verification",
    lastLogin: "Yesterday, 16:22"
  },
  {
    id: "staff-3",
    name: "Kristina Bompastoor",
    email: "kristina@babiesandtods.test",
    phone: "+264 81 555 0160",
    role: "FINANCE",
    assignedClassroom: "Kitchen & finance",
    employmentStatus: "contract",
    status: "invited",
    lastLogin: "Never"
  }
];

export const parentUserAccounts: ParentUserAccount[] = [
  {
    id: "parent-1",
    name: "Maria Shikongo",
    email: "maria.shikongo@example.com",
    phone: "+264 81 555 0142",
    role: "PARENT",
    relationshipToChild: "Mother",
    linkedChild: "Amara Shikongo",
    pickupPermission: true,
    emergencyContactStatus: "complete",
    status: "active",
    lastLogin: "Today, 07:48"
  },
  {
    id: "parent-2",
    name: "Tate Hamutenya",
    email: "tate.hamutenya@example.com",
    phone: "+264 81 555 0199",
    role: "PARENT",
    relationshipToChild: "Father",
    linkedChild: "Liyana Hamutenya",
    pickupPermission: true,
    emergencyContactStatus: "needs_update",
    status: "pending_verification",
    lastLogin: "Never"
  },
  {
    id: "parent-3",
    name: "Ester Nambala",
    email: "ester.nambala@example.com",
    phone: "+264 81 555 0188",
    role: "PARENT",
    relationshipToChild: "Aunt",
    linkedChild: "Amara Shikongo",
    pickupPermission: true,
    emergencyContactStatus: "missing",
    status: "invited",
    lastLogin: "Never"
  }
];

export const invitations: InvitationRecord[] = [
  { id: "invite-1", userName: "Kristina Bompastoor", email: "kristina@babiesandtods.test", role: "FINANCE", sentDate: "28 Jun 2026", status: "Invitation Sent" },
  { id: "invite-2", userName: "Ester Nambala", email: "ester.nambala@example.com", role: "PARENT", sentDate: "27 Jun 2026", status: "Accepted" },
  { id: "invite-3", userName: "Selma Iyambo", email: "selma@babiesandtods.test", role: "TEACHER", sentDate: undefined, status: "Draft" },
  { id: "invite-4", userName: "Maria Shikongo", email: "maria.shikongo@example.com", role: "PARENT", sentDate: "20 Jun 2026", status: "Active" }
];

export const verificationQueue: VerificationItem[] = [
  {
    id: "verify-1",
    accountType: "staff",
    name: "Johanna Festus",
    email: "johanna@babiesandtods.test",
    role: "TEACHER",
    checks: [
      { label: "Role confirmation", value: "Lead Teacher", status: "ready" },
      { label: "Classroom assignment", value: "Sunshine", status: "ready" },
      { label: "Employment status", value: "Permanent", status: "ready" },
      { label: "Certification status", value: "First-aid renewal due", status: "review" }
    ]
  },
  {
    id: "verify-2",
    accountType: "parent",
    name: "Tate Hamutenya",
    email: "tate.hamutenya@example.com",
    linkedChild: "Liyana Hamutenya",
    checks: [
      { label: "Linked child", value: "Liyana Hamutenya", status: "ready" },
      { label: "Relationship to child", value: "Father", status: "ready" },
      { label: "Pickup permission", value: "Allowed", status: "ready" },
      { label: "Emergency contact status", value: "Needs update", status: "review" },
      { label: "Consent status", value: "Missing media consent", status: "missing" }
    ]
  }
];

export const permissionAreas: Permission[] = [
  "Dashboard",
  "Learners",
  "Staff",
  "Finance",
  "Billing",
  "Attendance",
  "Daily Reports",
  "Messages",
  "Compliance",
  "Safety",
  "Users & Access"
];

export const permissionsMatrix: Record<Exclude<UserRole, "parent" | "teacher" | "admin">, Permission[]> = {
  SUPER_ADMIN: permissionAreas,
  ADMIN: ["Dashboard", "Learners", "Staff", "Attendance", "Daily Reports", "Messages", "Compliance", "Safety", "Users & Access"],
  TEACHER: ["Dashboard", "Learners", "Attendance", "Daily Reports", "Messages", "Safety"],
  FINANCE: ["Dashboard", "Finance", "Billing", "Messages"],
  PARENT: ["Dashboard", "Billing", "Messages"]
};

export const auditLogs: AuditLog[] = [
  { id: "audit-1", actor: "Assumpta SM Gahutu", event: "Admin created staff account", target: "Johanna Festus", createdAt: "Today, 08:42", detail: "Role set to TEACHER and assigned to Sunshine." },
  { id: "audit-2", actor: "Assumpta SM Gahutu", event: "Admin sent parent invitation", target: "Ester Nambala", createdAt: "Yesterday, 15:20", detail: "Pickup permission included for Amara Shikongo." },
  { id: "audit-3", actor: "Assumpta SM Gahutu", event: "Admin verified parent account", target: "Maria Shikongo", createdAt: "20 Jun 2026, 09:10", detail: "Emergency contact and child link confirmed." },
  { id: "audit-4", actor: "System", event: "User reset password", target: "Maria Shikongo", createdAt: "19 Jun 2026, 18:44", detail: "Password reset completed by email link." },
  { id: "audit-5", actor: "Assumpta SM Gahutu", event: "Admin updated pickup permission", target: "Ester Nambala", createdAt: "18 Jun 2026, 12:05", detail: "Authorized pickup enabled after parent confirmation." },
  { id: "audit-6", actor: "Assumpta SM Gahutu", event: "Admin suspended account", target: "Temporary contractor", createdAt: "14 Jun 2026, 16:30", detail: "Access suspended after contract ended." }
];

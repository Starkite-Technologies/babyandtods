export type UserRole = "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "FINANCE" | "PARENT" | "parent" | "teacher" | "admin";
export type AccountStatus = "draft" | "invited" | "pending_verification" | "active" | "suspended" | "archived";
export type InvitationStatus = "Draft" | "Invitation Sent" | "Accepted" | "Active";
export type Permission =
  | "Dashboard"
  | "Learners"
  | "Staff"
  | "Finance"
  | "Billing"
  | "Attendance"
  | "Daily Reports"
  | "Messages"
  | "Compliance"
  | "Safety"
  | "Users & Access";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  lastLogin?: string;
}

export interface StaffUserAccount extends UserAccount {
  role: "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "FINANCE";
  assignedClassroom?: string;
  employmentStatus: "permanent" | "contract" | "probation" | "inactive";
}

export interface ParentUserAccount extends UserAccount {
  role: "PARENT";
  relationshipToChild: string;
  linkedChild: string;
  pickupPermission: boolean;
  emergencyContactStatus: "complete" | "missing" | "needs_update";
}

export interface InvitationRecord {
  id: string;
  userName: string;
  email: string;
  role: UserRole;
  sentDate?: string;
  status: InvitationStatus;
}

export interface VerificationItem {
  id: string;
  accountType: "staff" | "parent";
  name: string;
  email: string;
  role?: UserRole;
  linkedChild?: string;
  checks: Array<{ label: string; value: string; status: "ready" | "missing" | "review" }>;
}

export interface AuditLog {
  id: string;
  actor: string;
  event: string;
  target: string;
  createdAt: string;
  detail: string;
}

export type LearnerStatus = "checked-in" | "absent" | "picked-up";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Child {
  id: string;
  name: string;
  dateOfBirth?: string;
  age: string;
  classroom: string;
  parentIds: string[];
  status: LearnerStatus;
}

export type Learner = Child & {
  guardian: string;
};

export interface Parent {
  id: string;
  userId: string;
  phone: string;
  childIds: string[];
}

export interface Staff {
  id: string;
  userId: string;
  roleTitle: string;
  classroomIds: string[];
}

export interface Classroom {
  id: string;
  name: string;
  ageGroup: string;
  leadStaffId?: string;
  capacity?: number;
  enrolled?: number;
}

export interface Attendance {
  id: string;
  childId: string;
  date: string;
  status: LearnerStatus;
  checkedInAt?: string;
  checkedOutAt?: string;
}

export interface DailyReport {
  id: string;
  childId: string;
  date: string;
  meals: string;
  nap: string;
  learningNote: string;
  mood?: string;
  activity?: string;
  status: "draft" | "ready" | "approved" | "sent";
}

export interface Invoice {
  id: string;
  parentId: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paidAt: string;
  method: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  sentAt: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: string[];
  preview: string;
  lastMessageAt: string;
  unread?: number;
}

export interface Incident {
  id: string;
  childId: string;
  date: string;
  summary: string;
  severity: "low" | "medium" | "high";
}

export interface Allergy {
  id: string;
  childId: string;
  allergen: string;
  severity: "mild" | "moderate" | "severe";
  notes?: string;
}

export interface AuthorizedPickup {
  id: string;
  childId: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: UserRole | "all";
  date: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}

export interface InvoiceSummary {
  id: string;
  family: string;
  amount: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

// packages/shared/src/index.ts

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

// ── Teacher & Parent workspace types ────────────────────────────────────────

export interface LearnerSummary {
  id: string;
  name: string;
  dateOfBirth: string;
  age: string;
  classroomId: string;
  classroomName: string;
  parentName: string;
  parentPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  attendanceStatus: "present" | "absent" | "late" | "checked-out" | "not-recorded";
  checkedInAt?: string;
  hasAllergy: boolean;
  allergyNote?: string;
  hasMedicalNote: boolean;
  pickupStatus: "on-premises" | "picked-up" | "not-arrived";
}

export interface AttendanceRecord {
  id: string;
  childId: string;
  childName: string;
  classroomName: string;
  date: string;
  status: "present" | "absent" | "late" | "checked-out";
  checkedInAt?: string;
  checkedOutAt?: string;
  droppedOffBy?: string;
  pickedUpBy?: string;
  notes?: string;
}

export interface PickupPerson {
  id: string;
  childId: string;
  childName: string;
  name: string;
  relationship: string;
  phone: string;
  idNumber?: string;
  permissionStatus: "approved" | "pending" | "revoked";
  emergencyOnly: boolean;
  notes?: string;
  lastPickup?: string;
}

export interface IncidentReport {
  id: string;
  childId: string;
  childName: string;
  classroomName: string;
  date: string;
  time: string;
  incidentType: "injury" | "behavioral" | "medical" | "safety" | "other";
  severity: "low" | "medium" | "high";
  whatHappened: string;
  actionTaken: string;
  staffInvolved: string;
  parentNotified: boolean;
  parentNotifiedAt?: string;
  followUpRequired: boolean;
  status: "draft" | "submitted" | "reviewed" | "parent-notified" | "closed";
  reportedBy: string;
  notes?: string;
}

export interface HealthNote {
  id: string;
  childId: string;
  childName: string;
  classroomName: string;
  type: "allergy" | "medical" | "medication" | "other";
  description: string;
  severity: "mild" | "moderate" | "severe" | "info";
  instructions: string;
  parentContact: string;
  parentPhone: string;
  lastUpdated: string;
  activeAlert: boolean;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderName: string;
  senderRole: "parent" | "teacher" | "admin";
  body: string;
  sentAt: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  participantName: string;
  participantRole: "parent" | "teacher" | "admin";
  linkedChildName?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  audience: "all" | "parents" | "staff" | "teachers";
  createdAt: string;
  createdBy: string;
  pinned: boolean;
  status: "active" | "archived";
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  childName: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
  paymentMethod?: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: "enrollment" | "consent" | "medical" | "policy" | "statement" | "other";
  dateUploaded: string;
  status: "current" | "pending-signature" | "expired";
  url?: string;
}

export interface TeacherDashboardStats {
  classroomName: string;
  ageGroup: string;
  totalLearners: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  pickedUpToday: number;
  stillOnPremises: number;
  pendingIncidents: number;
  unreadMessages: number;
  activeHealthAlerts: number;
}

export interface ParentDashboardStats {
  childName: string;
  childAge: string;
  classroomName: string;
  teacherName: string;
  attendanceStatus: "present" | "absent" | "late" | "checked-out" | "not-recorded";
  checkedInAt?: string;
  checkedOutAt?: string;
  currentBalance: number;
  nextInvoiceAmount?: number;
  nextInvoiceDue?: string;
  unreadMessages: number;
  pendingIncidents: number;
}

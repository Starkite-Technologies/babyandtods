export type UserRole = "parent" | "teacher" | "admin";

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
  status: "draft" | "ready" | "sent";
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

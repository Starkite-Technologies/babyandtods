import { Check, Clock, Mail, Plus, ShieldAlert, ShieldCheck, UserCheck, X } from "lucide-react";
import type { ReactNode } from "react";
import { revalidatePath } from "next/cache";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import {
  createParentAccountAction,
  createStaffAccountAction,
  restoreAccountAction,
  sendInvitationAction,
  suspendAccountAction,
  verifyAccountAction
} from "@/lib/actions";
import { apiClient, safe, type ApiAdminAccessSummary } from "@/lib/api";
import {
  auditLogs as mockAuditLogs,
  invitations as mockInvitations,
  parentUserAccounts as mockParents,
  permissionAreas,
  permissionsMatrix,
  staffUserAccounts as mockStaff,
  verificationQueue as mockVerification
} from "@/data/account-access";

const sections = [
  ["Staff Accounts", "staff"],
  ["Parent/Guardian Accounts", "parents"],
  ["Invitations", "invitations"],
  ["Verification Queue", "verification"],
  ["Roles & Permissions", "roles"],
  ["Suspended/Archived Accounts", "suspended"],
  ["Audit Logs", "audit"]
] as const;

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

export const metadata = { title: "Users & Access" };
export const dynamic = "force-dynamic";

const fallbackSummary: ApiAdminAccessSummary = {
  email: { provider: "preview", configured: false, from: "not configured", mode: "preview" },
  staffAccounts: mockStaff.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    role: item.role,
    assignedClassroom: item.assignedClassroom ?? "Unassigned",
    status: item.status,
    lastLogin: item.lastLogin ?? null,
    invitedAt: null,
    verifiedAt: null
  })),
  parentAccounts: mockParents.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    role: item.role,
    relationshipToChild: item.relationshipToChild,
    linkedChild: item.linkedChild,
    pickupPermission: item.pickupPermission,
    emergencyContactStatus: item.emergencyContactStatus,
    status: item.status,
    lastLogin: item.lastLogin ?? null,
    invitedAt: null,
    verifiedAt: null
  })),
  invitations: mockInvitations.map((item) => ({
    id: item.id,
    email: item.email,
    role: item.role,
    status: item.status,
    sentAt: item.sentDate ?? null,
    expiresAt: item.sentDate ?? new Date().toISOString()
  })),
  verificationQueue: mockVerification,
  auditLogs: mockAuditLogs.map((item) => ({
    id: item.id,
    actor: item.actor,
    event: item.event,
    target: item.target,
    detail: item.detail,
    createdAt: item.createdAt
  })),
  classrooms: [],
  children: []
};

async function createStaff(formData: FormData) {
  "use server";
  await createStaffAccountAction({
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    role: String(formData.get("role") ?? "teacher"),
    assignedClassroomId: String(formData.get("assignedClassroomId") ?? "") || undefined,
    employmentStatus: String(formData.get("employmentStatus") ?? "")
  });
  revalidatePath("/app/admin/users");
}

async function createParent(formData: FormData) {
  "use server";
  await createParentAccountAction({
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    relationshipToChild: String(formData.get("relationshipToChild") ?? "Guardian"),
    linkedChildId: String(formData.get("linkedChildId") ?? "") || undefined,
    pickupPermission: formData.get("pickupPermission") === "on",
    emergencyContactStatus: String(formData.get("emergencyContactStatus") ?? "pending")
  });
  revalidatePath("/app/admin/users");
}

async function sendInvite(formData: FormData) {
  "use server";
  await sendInvitationAction({
    userId: String(formData.get("userId") ?? "") || undefined,
    email: String(formData.get("email") ?? "") || undefined,
    role: String(formData.get("role") ?? "") || undefined
  });
  revalidatePath("/app/admin/users");
}

async function verify(formData: FormData) {
  "use server";
  await verifyAccountAction(String(formData.get("userId") ?? ""));
  revalidatePath("/app/admin/users");
}

async function suspend(formData: FormData) {
  "use server";
  await suspendAccountAction(String(formData.get("userId") ?? ""));
  revalidatePath("/app/admin/users");
}

async function restore(formData: FormData) {
  "use server";
  await restoreAccountAction(String(formData.get("userId") ?? ""));
  revalidatePath("/app/admin/users");
}

export default async function UsersAccessPage() {
  const summary = await safe(apiClient.adminAccess.summary(), fallbackSummary);
  const allAccounts = [...summary.staffAccounts, ...summary.parentAccounts];
  const activeAccounts = allAccounts.filter((account) => account.status === "active").length;
  const invitedAccounts = allAccounts.filter((account) => account.status === "invited").length;
  const restrictedAccounts = allAccounts.filter((account) => account.status === "suspended" || account.status === "archived");

  return (
    <Shell
      crumbs={["Admin", "Users & Access"]}
      title="Users & Access"
      action={
        <form action={sendInvite} className="flex gap-2">
          <input name="email" type="email" placeholder="person@email.com" className="hidden h-9 rounded-full border border-white/70 bg-white/70 px-3 text-sm text-ink outline-none sm:block" />
          <Button size="sm" variant="secondary" type="submit">
            <Mail className="h-3.5 w-3.5" />
            Send invite
          </Button>
        </form>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AccessMetric label="Active accounts" value={activeAccounts} detail="Can access the portal" tone="success" />
        <AccessMetric label="Invitations" value={invitedAccounts} detail="Waiting for email acceptance" tone="warning" />
        <AccessMetric label="Verification queue" value={summary.verificationQueue.length} detail="Needs admin review" tone="info" />
        <AccessMetric label="Restricted" value={restrictedAccounts.length} detail="Suspended or archived" tone="danger" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card title="Admin-controlled account workflow" description="No public self-registration. Admin creates the account, sends the invite, verifies the user, then activates or restricts access.">
          <div className="grid gap-3 md:grid-cols-4">
            {["Create account", "Email invite", "Admin verify", "Activate access"].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/70 bg-white/65 p-4">
                <p className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-xs font-semibold text-white">{index + 1}</p>
                <p className="mt-3 font-medium text-ink">{step}</p>
                <p className="mt-1 text-sm text-muted">Controlled by admin</p>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Email invitation setup"
          description="Invitations use configured email. Preview mode means credentials are missing."
          action={<Badge tone={summary.email.configured ? "success" : "warning"}>{summary.email.mode}</Badge>}
        >
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Provider</dt>
              <dd className="font-medium text-ink">{summary.email.provider}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">From email</dt>
              <dd className="font-medium text-ink">{summary.email.from}</dd>
            </div>
            <div className="rounded-2xl bg-white/65 p-3 text-xs leading-5 text-muted">
              Configure `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `EMAIL_FROM`, and `WEB_ORIGIN` in `apps/api/.env` to send real invitation emails.
            </div>
          </dl>
        </Card>
      </div>

      <div className="sticky top-0 z-20 -mx-4 mt-6 border-y border-white/60 bg-white/70 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {sections.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-brand-blue/40 hover:text-brand-blue">
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard id="staff-form" title="Add Staff Account" action={<Badge tone="info">Creates + invites</Badge>}>
            <StaffAccountForm classrooms={summary.classrooms} />
          </SectionCard>
          <SectionCard id="parent-form" title="Add Parent/Guardian Account" action={<Badge tone="accent">Links child</Badge>}>
            <ParentAccountForm children={summary.children} />
          </SectionCard>
        </div>

        <SectionCard id="staff" title="Staff Accounts" action={<Button href="#staff-form" size="sm"><Plus className="h-3.5 w-3.5" /> Add staff</Button>}>
          <DataTable
            columns={["Staff name", "Email", "Phone", "Role", "Classroom", "Status", "Last login", "Actions"]}
            rows={summary.staffAccounts.map((account) => [
              account.name,
              account.email,
              account.phone,
              account.role,
              account.assignedClassroom,
              statusBadge(account.status),
              displayDate(account.lastLogin),
              accountActions(account.id, account.email, account.role, account.status)
            ])}
          />
        </SectionCard>

        <SectionCard id="parents" title="Parent/Guardian Accounts" action={<Button href="#parent-form" size="sm"><Plus className="h-3.5 w-3.5" /> Add guardian</Button>}>
          <DataTable
            columns={["Guardian", "Email", "Phone", "Relationship", "Linked child", "Pickup", "Emergency", "Status", "Last login", "Actions"]}
            rows={summary.parentAccounts.map((account) => [
              account.name,
              account.email,
              account.phone,
              account.relationshipToChild,
              account.linkedChild,
              account.pickupPermission ? "Allowed" : "No",
              account.emergencyContactStatus.replace("_", " "),
              statusBadge(account.status),
              displayDate(account.lastLogin),
              accountActions(account.id, account.email, account.role, account.status)
            ])}
          />
        </SectionCard>

        <SectionCard id="invitations" title="Invitations">
          <DataTable
            columns={["Email", "Role", "Sent date", "Expires", "Status", "Actions"]}
            rows={summary.invitations.map((invite) => [
              invite.email,
              invite.role,
              displayDate(invite.sentAt),
              displayDate(invite.expiresAt),
              invitationBadge(invite.status),
              actionForm(sendInvite, invite.email, invite.role)
            ])}
            empty="No invitations sent yet."
          />
        </SectionCard>

        <SectionCard id="verification" title="Verification Queue">
          <div className="grid gap-4 xl:grid-cols-2">
            {summary.verificationQueue.length === 0 && <p className="text-sm text-muted">No accounts need verification.</p>}
            {summary.verificationQueue.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/70 bg-white/65 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink">{item.name}</p>
                    <p className="text-sm text-muted">{item.email}</p>
                  </div>
                  <Badge tone={item.accountType === "staff" ? "info" : "accent"}>{item.accountType}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {item.checks.map((check) => (
                    <div key={check.label} className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2 text-sm">
                      <span className="text-ink-600">{check.label}</span>
                      <span className="flex items-center gap-2 font-medium text-ink">
                        {checkIcon(check.status)}
                        {check.value}
                      </span>
                    </div>
                  ))}
                </div>
                <form action={verify} className="mt-4">
                  <input type="hidden" name="userId" value={item.id} />
                  <Button size="sm" type="submit"><UserCheck className="h-3.5 w-3.5" /> Verify account</Button>
                </form>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard id="roles" title="Roles & Permissions">
          <div className="overflow-x-auto rounded-2xl border border-white/70">
            <table className="w-full min-w-[900px] border-collapse bg-white/75 text-sm">
              <thead className="bg-white/70 text-left text-[11px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Role</th>
                  {permissionAreas.map((area) => <th key={area} className="px-3 py-3 text-center font-medium">{area}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissionsMatrix).map(([role, permissions]) => (
                  <tr key={role} className="border-t border-line">
                    <td className="px-4 py-3 font-semibold text-ink">{role}</td>
                    {permissionAreas.map((area) => (
                      <td key={area} className="px-3 py-3 text-center">
                        {permissions.includes(area) ? <Check className="mx-auto h-4 w-4 text-brand-green" /> : <X className="mx-auto h-4 w-4 text-ink-200" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard id="suspended" title="Suspended/Archived Accounts">
          <DataTable
            columns={["Account", "Email", "Role", "Status", "Actions"]}
            rows={restrictedAccounts.map((account) => [
              account.name,
              account.email,
              account.role,
              statusBadge(account.status),
              restoreForm(account.id)
            ])}
            empty="No suspended or archived accounts."
          />
        </SectionCard>

        <SectionCard id="audit" title="Audit Logs">
          <DataTable
            columns={["Time", "Actor", "Event", "Target", "Detail"]}
            rows={summary.auditLogs.map((log) => [displayDate(log.createdAt), log.actor, log.event.replaceAll("_", " "), log.target, log.detail])}
            empty="No account events recorded yet."
          />
        </SectionCard>
      </div>
    </Shell>
  );
}

function StaffAccountForm({ classrooms }: { classrooms: Array<{ id: string; name: string }> }) {
  return (
    <form action={createStaff} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="fullName" label="Full name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="phone" label="Phone" />
        <Select name="role" label="Role" options={["teacher", "finance", "admin"]} />
        <Select name="assignedClassroomId" label="Assigned classroom" options={classrooms.map((room) => ({ label: room.name, value: room.id }))} />
        <Select name="employmentStatus" label="Employment status" options={["active", "probation", "contract", "inactive"]} />
      </div>
      <Button type="submit" size="sm"><Plus className="h-3.5 w-3.5" /> Create and invite staff</Button>
    </form>
  );
}

function ParentAccountForm({ children }: { children: Array<{ id: string; name: string }> }) {
  return (
    <form action={createParent} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="fullName" label="Full name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="phone" label="Phone" required />
        <Select name="relationshipToChild" label="Relationship to child" options={["Mother", "Father", "Guardian", "Grandparent", "Other"]} />
        <Select name="linkedChildId" label="Linked child" options={children.map((child) => ({ label: child.name, value: child.id }))} />
        <Select name="emergencyContactStatus" label="Emergency contact" options={["pending", "on_file", "not_required"]} />
      </div>
      <label className="flex items-center gap-2 rounded-2xl bg-white/65 px-3 py-2 text-sm text-ink">
        <input name="pickupPermission" type="checkbox" className="h-4 w-4 rounded border-line accent-brand-blue" />
        Allow this guardian to pick up the child
      </label>
      <Button type="submit" size="sm"><Plus className="h-3.5 w-3.5" /> Create and invite guardian</Button>
    </form>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <input name={name} type={type} required={required} className="mt-1 h-10 w-full rounded-xl border border-white/70 bg-white/75 px-3 text-sm text-ink outline-none transition focus:border-brand-blue" />
    </label>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: Array<string | { label: string; value: string }> }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <select name={name} className="mt-1 h-10 w-full rounded-xl border border-white/70 bg-white/75 px-3 text-sm text-ink outline-none transition focus:border-brand-blue">
        <option value="">Select</option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const labelText = typeof option === "string" ? option : option.label;
          return <option key={value} value={value}>{labelText}</option>;
        })}
      </select>
    </label>
  );
}

function SectionCard({ id, title, action, children }: { id: string; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <Card title={title} action={action}>{children}</Card>
    </section>
  );
}

function AccessMetric({ label, value, detail, tone }: { label: string; value: number; detail: string; tone: "success" | "warning" | "danger" | "info" }) {
  return (
    <Card className="!p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-medium text-ink">{value}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-ink-600">{detail}</p>
        <Badge tone={tone}>{tone}</Badge>
      </div>
    </Card>
  );
}

function statusBadge(status: string) {
  const tone: BadgeTone = status === "active" ? "success" : status === "suspended" || status === "archived" ? "danger" : status === "pending_verification" ? "warning" : status === "invited" ? "info" : "neutral";
  return { kind: "badge" as const, text: status.replace("_", " "), tone };
}

function invitationBadge(status: string) {
  const tone: BadgeTone = status === "active" || status === "accepted" ? "success" : status === "sent" || status === "Invitation Sent" ? "info" : status === "draft" ? "neutral" : "warning";
  return { kind: "badge" as const, text: status.replace("_", " "), tone };
}

function accountActions(userId: string, email: string, role: string, status: string) {
  return {
    kind: "raw" as const,
    node: (
      <div className="flex min-w-max flex-wrap gap-1.5">
        <form action={sendInvite}>
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="role" value={role} />
          <MiniButton>Invite</MiniButton>
        </form>
        <form action={verify}>
          <input type="hidden" name="userId" value={userId} />
          <MiniButton>Verify</MiniButton>
        </form>
        {status === "suspended" ? (
          <form action={restore}>
            <input type="hidden" name="userId" value={userId} />
            <MiniButton>Restore</MiniButton>
          </form>
        ) : (
          <form action={suspend}>
            <input type="hidden" name="userId" value={userId} />
            <MiniButton>Suspend</MiniButton>
          </form>
        )}
      </div>
    )
  };
}

function actionForm(action: (formData: FormData) => Promise<void>, email: string, role: string) {
  return {
    kind: "raw" as const,
    node: (
      <form action={action}>
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="role" value={role} />
        <MiniButton>Resend</MiniButton>
      </form>
    )
  };
}

function restoreForm(userId: string) {
  return {
    kind: "raw" as const,
    node: (
      <form action={restore}>
        <input type="hidden" name="userId" value={userId} />
        <MiniButton>Restore</MiniButton>
      </form>
    )
  };
}

function MiniButton({ children }: { children: ReactNode }) {
  return (
    <button type="submit" className="rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-xs font-medium text-ink-600 transition hover:border-brand-blue/40 hover:text-brand-blue">
      {children}
    </button>
  );
}

function checkIcon(status: "ready" | "missing" | "review") {
  if (status === "ready") return <ShieldCheck className="h-4 w-4 text-brand-green" />;
  if (status === "missing") return <ShieldAlert className="h-4 w-4 text-red-600" />;
  return <Clock className="h-4 w-4 text-brand-orange" />;
}

function displayDate(value?: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

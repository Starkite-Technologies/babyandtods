import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck, Trash2, UserCheck, UserX } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { restoreAccountAction, suspendAccountAction, verifyAccountAction, deleteAccountAction } from "@/lib/actions";
import { apiClient, safe, formatMoney, type ApiAdminUserProfile } from "@/lib/api";

export const dynamic = "force-dynamic";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

async function verify(formData: FormData) {
  "use server";
  const id = String(formData.get("userId") ?? "");
  await verifyAccountAction(id);
  revalidatePath(`/app/admin/users/${id}`);
  revalidatePath("/app/admin/users");
}

async function suspend(formData: FormData) {
  "use server";
  const id = String(formData.get("userId") ?? "");
  await suspendAccountAction(id);
  revalidatePath(`/app/admin/users/${id}`);
  revalidatePath("/app/admin/users");
}

async function restore(formData: FormData) {
  "use server";
  const id = String(formData.get("userId") ?? "");
  await restoreAccountAction(id);
  revalidatePath(`/app/admin/users/${id}`);
  revalidatePath("/app/admin/users");
}

async function deleteAccount(formData: FormData) {
  "use server";
  const id = String(formData.get("userId") ?? "");
  await deleteAccountAction(id);
  revalidatePath("/app/admin/users");
  redirect("/app/admin/users");
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await safe<ApiAdminUserProfile | null>(apiClient.adminAccess.profile(id), null);
  if (!profile) notFound();

  const isSuspended = profile.status === "suspended" || profile.status === "archived";

  return (
    <Shell
      crumbs={["Admin", "Users & Access", profile.name]}
      title="Account profile"
      action={
        <Button href="/app/admin/users" size="sm" variant="secondary">
          <ArrowLeft className="h-4 w-4" />
          Directory
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="xl:sticky xl:top-24 xl:self-start">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] border border-line bg-ink font-display text-3xl font-black text-white shadow-lift">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <Badge tone={statusTone(profile.status)}>{profile.status.replace("_", " ")}</Badge>
              {profile.protected && <Badge className="ml-2" tone="accent">protected admin</Badge>}
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">{profile.name}</h2>
              <p className="mt-1 text-sm text-muted">{profile.email}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <ProfileRow label="Type" value={profile.kind} />
            <ProfileRow label="Role" value={profile.role} />
            <ProfileRow label="Created" value={displayDate(profile.createdAt)} />
            <ProfileRow label="Invited" value={displayDate(profile.invitedAt)} />
            <ProfileRow label="Verified" value={displayDate(profile.verifiedAt)} />
            <ProfileRow label="Last login" value={displayDate(profile.lastLogin)} />
          </dl>

          {profile.protected ? (
            <div className="mt-6 rounded-2xl border border-brand-blue/30 bg-white p-4 text-sm text-ink">
              <div className="flex items-center gap-2 font-semibold">
                <LockKeyhole className="h-4 w-4 text-brand-blue" />
                Initial admin account
              </div>
              <p className="mt-2 text-muted">
                This account cannot be suspended, restored, or disabled from the admin portal.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-2">
              <form action={verify}>
                <input type="hidden" name="userId" value={profile.id} />
                <Button className="w-full" type="submit">
                  <UserCheck className="h-4 w-4" />
                  Verify account
                </Button>
              </form>
              {isSuspended ? (
                <form action={restore}>
                  <input type="hidden" name="userId" value={profile.id} />
                  <Button className="w-full" variant="accent" type="submit">
                    <ShieldCheck className="h-4 w-4" />
                    Restore access
                  </Button>
                </form>
              ) : (
                <form action={suspend}>
                  <input type="hidden" name="userId" value={profile.id} />
                  <Button className="w-full" variant="outline" type="submit">
                    <UserX className="h-4 w-4" />
                    Suspend access
                  </Button>
                </form>
              )}
              <form action={deleteAccount}>
                <input type="hidden" name="userId" value={profile.id} />
                <Button className="w-full" variant="outline" type="submit">
                  <Trash2 className="h-4 w-4" />
                  Delete account
                </Button>
              </form>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          {profile.staff && (
            <Card title="Staff details" description="Classroom responsibility and staff activity.">
              <div className="grid gap-3 sm:grid-cols-3">
                <InfoTile label="Role title" value={profile.staff.roleTitle} />
                <InfoTile label="Classrooms" value={String(profile.staff.classrooms.length)} />
                <InfoTile label="Reports" value={String(profile.staff.reports.length)} />
              </div>
              <DataTable
                columns={["Classroom", "Age group"]}
                rows={profile.staff.classrooms.map((room) => [room.name, room.ageGroup])}
                empty="No classroom assigned."
              />
            </Card>
          )}

          {profile.parent && (
            <Card title="Parent / guardian details" description="Linked learners, contact details, and billing view.">
              {profile.onboardingLocked && (
                <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  This parent has not set a password yet. You can re-send the invite, or cancel the onboarding package to remove the invite, parent account, and linked learner records.
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-3">
                <InfoTile label="Phone" value={profile.parent.phone} />
                <InfoTile label="Linked learners" value={String(profile.parent.children.length)} />
                <InfoTile label="Invoices" value={String(profile.parent.invoices.length)} />
              </div>
              <div className="mt-4 grid gap-6 xl:grid-cols-2">
                <DataTable
                  columns={["Learner", "Classroom"]}
                  rows={profile.parent.children.map((child) => [
                    child.name,
                    child.classroom?.name ?? "Unassigned"
                  ])}
                  empty="No linked learners."
                />
                <DataTable
                  columns={["Amount", "Status", "Due"]}
                  rows={profile.parent.invoices.map((invoice) => [
                    formatMoney(invoice.amount),
                    statusBadge(invoice.status),
                    displayDate(invoice.dueDate)
                  ])}
                  empty="No invoices."
                />
              </div>
            </Card>
          )}

          <Card title="Invitation history" description="Invitation emails for this person.">
            <DataTable
              columns={["Email", "Role", "Status", "Sent", "Expires"]}
              rows={profile.invitations.map((invite) => [
                invite.email,
                invite.role,
                invitationBadge(invite.status),
                displayDate(invite.sentAt),
                displayDate(invite.expiresAt)
              ])}
              empty="No invitations recorded."
            />
          </Card>

          <Card title="Profile audit log" description="Only events for this account.">
            <DataTable
              columns={["Time", "Actor", "Event", "Detail"]}
              rows={profile.auditLogs.map((log) => [
                displayDate(log.createdAt),
                log.actor,
                log.event.replaceAll("_", " "),
                log.detail
              ])}
              empty="No audit events for this profile."
            />
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-2xl border border-line bg-white px-3 py-2">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function statusTone(status: string): BadgeTone {
  if (status === "active") return "success";
  if (status === "suspended" || status === "archived") return "danger";
  if (status === "pending_verification") return "warning";
  if (status === "invited") return "info";
  return "neutral";
}

function statusBadge(status: string) {
  return { kind: "badge" as const, text: status.replace("_", " "), tone: statusTone(status) };
}

function invitationBadge(status: string) {
  const tone: BadgeTone = status === "active" || status === "accepted" ? "success" : status === "sent" ? "info" : status === "draft" ? "neutral" : "warning";
  return { kind: "badge" as const, text: status.replace("_", " "), tone };
}

function displayDate(value?: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

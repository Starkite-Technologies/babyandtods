import { ShieldCheck, Mail, BadgeCheck, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { initials, type CurrentUser } from "@/lib/auth";

const roleLabel: Record<string, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  parent: "Parent / guardian"
};

export function ProfileView({ user }: { user: CurrentUser }) {
  const expires = user.exp ? new Date(user.exp * 1000) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ink font-display text-2xl text-paper">
            {initials(user.name)}
          </span>
          <h2 className="mt-4 font-display text-2xl font-medium tracking-tight text-ink">{user.name}</h2>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
          <Badge tone="accent" className="mt-3">
            {roleLabel[user.role] ?? user.role}
          </Badge>
        </div>
      </Card>

      <Card title="Account details" description="Information tied to your portal account.">
        <dl className="divide-y divide-line">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="flex items-center gap-2 text-sm text-ink-600">
              <Mail className="h-4 w-4 text-ink-400" /> Email
            </dt>
            <dd className="text-sm font-medium text-ink">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="flex items-center gap-2 text-sm text-ink-600">
              <BadgeCheck className="h-4 w-4 text-ink-400" /> Role
            </dt>
            <dd className="text-sm font-medium text-ink">{roleLabel[user.role] ?? user.role}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="flex items-center gap-2 text-sm text-ink-600">
              <ShieldCheck className="h-4 w-4 text-ink-400" /> Account ID
            </dt>
            <dd className="text-sm font-medium text-ink">{user.sub}</dd>
          </div>
          {expires && (
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="flex items-center gap-2 text-sm text-ink-600">
                <KeyRound className="h-4 w-4 text-ink-400" /> Session expires
              </dt>
              <dd className="text-sm font-medium text-ink">
                {expires.toLocaleDateString()} {expires.toLocaleTimeString()}
              </dd>
            </div>
          )}
        </dl>
        <p className="mt-4 text-xs text-muted">
          To change your password or contact details, reach out to the academy admin.
        </p>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { UserPlus, MailCheck } from "lucide-react";
import { AddStaffModal } from "@/components/features/AddStaffModal";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { ToastStack } from "@/components/ui/Toast";

type StaffMember = {
  id: string;
  roleTitle: string;
  user: { id: string; name: string; email: string; role: string };
  classrooms?: Array<{ id: string; name: string }>;
};

type Classroom = { id: string; name: string; ageGroup: string };

type Props = {
  staff: StaffMember[];
  classrooms: Classroom[];
};

export function StaffPageClient({ staff: initialStaff, classrooms }: Props) {
  const [staff, setStaff] = useState(initialStaff);
  const [showModal, setShowModal] = useState(false);

  function handleAdded(member: { name: string; email: string; roleTitle: string }) {
    setStaff((prev) => [
      ...prev,
      {
        id: `pending-${Date.now()}`,
        roleTitle: member.roleTitle,
        user: { id: `pending-${Date.now()}`, name: member.name, email: member.email, role: "teacher" },
        classrooms: [],
      },
    ]);
    setShowModal(false);
  }

  const leadCount = staff.filter((s) => s.classrooms && s.classrooms.length > 0).length;

  return (
    <>
      <ToastStack />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Team size" value={staff.length} detail="Teachers, carers & support" />
        <StatCard label="Assigned to classrooms" value={leadCount} detail="Active classroom leads" tone="success" />
        <StatCard label="Unassigned" value={staff.length - leadCount} detail="Awaiting classroom link" tone={staff.length - leadCount > 0 ? "warning" : "neutral"} />
      </div>

      <Card
        className="mt-6"
        title="Team directory"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-accent/25 hover:opacity-90 transition"
          >
            <UserPlus className="h-4 w-4" />
            Add staff member
          </button>
        }
      >
        {staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50">
              <UserPlus className="h-6 w-6 text-muted" />
            </div>
            <p className="text-sm font-medium text-ink">No staff yet</p>
            <p className="text-xs text-muted">Click &ldquo;Add staff member&rdquo; to send the first invitation.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {staff.map((s) => {
              const isPending = s.id.startsWith("pending-");
              const classroomName = s.classrooms?.[0]?.name ?? null;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 rounded-xl border border-white/40 bg-white/50 p-3 transition-all ${isPending ? "opacity-70" : ""}`}
                >
                  <Avatar name={s.user.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink truncate">{s.user.name}</p>
                      {isPending && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-brand-blue">
                          <MailCheck className="h-3 w-3" />
                          Invite sent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate">{s.user.email}</p>
                  </div>
                  <div className="shrink-0 text-right space-y-0.5">
                    <p className="text-xs font-medium text-ink">{s.roleTitle}</p>
                    <Badge tone={classroomName ? "success" : "neutral"}>
                      {classroomName ?? "Unassigned"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {showModal && (
        <AddStaffModal
          classrooms={classrooms}
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
        />
      )}
    </>
  );
}

function Avatar({ name }: { name: string }) {
  const palettes = [
    "from-pink-400 to-purple-500",
    "from-blue-400 to-cyan-500",
    "from-green-400 to-teal-500",
    "from-orange-400 to-pink-500",
    "from-yellow-400 to-orange-500",
  ];
  const color = palettes[name.charCodeAt(0) % palettes.length];
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-sm font-bold text-white shadow-sm`}>
      {name[0]?.toUpperCase()}
    </div>
  );
}

import { adminStats, invoices, learners, parentStats, staffRows, teacherStats, timeline } from "@/data/mock-data";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";
import { DashboardLayout } from "./DashboardLayout";
import { DataTable } from "./DataTable";
import { MessageList } from "./MessageList";
import { ProfileSummary } from "./ProfileSummary";
import { StatCard } from "./StatCard";
import { Timeline } from "./Timeline";

const routeContent: Record<string, { crumb: string; title: string; role: "parent" | "teacher" | "admin"; view: string }> = {
  "/app/parent/dashboard": { crumb: "Parent / Dashboard", title: "Good morning, Mrs. Shikongo", role: "parent", view: "dashboard" },
  "/app/parent/child": { crumb: "Parent / My Child", title: "Amara Shikongo today", role: "parent", view: "child" },
  "/app/parent/learning": { crumb: "Parent / Learning", title: "Learning path", role: "parent", view: "learning" },
  "/app/parent/memories": { crumb: "Parent / Memories", title: "Photos and moments", role: "parent", view: "memories" },
  "/app/parent/messages": { crumb: "Parent / Messages", title: "Stay connected", role: "parent", view: "messages" },
  "/app/parent/check-in": { crumb: "Parent / Check-In", title: "Secure pickup and drop-off", role: "parent", view: "check-in" },
  "/app/parent/billing": { crumb: "Parent / Billing", title: "Fees and statements", role: "parent", view: "billing" },
  "/app/teacher/dashboard": { crumb: "Teacher / Dashboard", title: "Sunshine class overview", role: "teacher", view: "teacher-dashboard" },
  "/app/teacher/attendance": { crumb: "Teacher / Attendance", title: "Today's attendance", role: "teacher", view: "attendance" },
  "/app/teacher/daily-reports": { crumb: "Teacher / Daily Reports", title: "Daily report queue", role: "teacher", view: "daily-reports" },
  "/app/teacher/messages": { crumb: "Teacher / Messages", title: "Parent conversations", role: "teacher", view: "teacher-messages" },
  "/app/admin/dashboard": { crumb: "Admin / Dashboard", title: "Director dashboard", role: "admin", view: "admin-dashboard" },
  "/app/admin/learners": { crumb: "Admin / Learners", title: "Learner roster", role: "admin", view: "learners" },
  "/app/admin/staff": { crumb: "Admin / Staff", title: "Staff and payroll", role: "admin", view: "staff" },
  "/app/admin/finance": { crumb: "Admin / Finance", title: "Revenue and expenses", role: "admin", view: "finance" },
  "/app/admin/compliance": { crumb: "Admin / Compliance", title: "Licensing and documents", role: "admin", view: "compliance" },
  "/app/admin/safety": { crumb: "Admin / Safety", title: "Safety monitor", role: "admin", view: "safety" }
};

function statsFor(role: "parent" | "teacher" | "admin") {
  if (role === "teacher") return teacherStats;
  if (role === "admin") return adminStats;
  return parentStats;
}

export function RouteDashboard({ path }: { path: string }) {
  const config = routeContent[path];

  return (
    <DashboardLayout crumb={config.crumb} title={config.title}>
      <div className="mb-5 rounded-[18px] bg-gradient-to-br from-terracotta to-sunset p-6 text-white shadow-soft">
        <h2 className="text-xl font-bold">Babies &amp; Todd&apos;s Academy</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/90">
          A calm operating view for attendance, learning moments, family communication, billing, compliance, and daily care records.
        </p>
      </div>
      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsFor(config.role).map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
      <RouteBody view={config.view} />
    </DashboardLayout>
  );
}

function RouteBody({ view }: { view: string }) {
  if (view === "child") {
    return (
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card title="Today's rhythm">
          <Timeline items={timeline} />
        </Card>
        <Card title="Care profile">
          <div className="mb-4">
            <ProfileSummary learner={learners[0]} />
          </div>
          <DataTable
            columns={["Item", "Record"]}
            rows={[
              ["Classroom", "Sunshine"],
              ["Allergies", "Peanut-free kitchen note"],
              ["Approved pickup", "Daniel Shikongo"],
              ["Rest routine", "Soft music and quiet corner"]
            ]}
          />
        </Card>
      </div>
    );
  }

  if (view === "learning") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {["Language", "Movement", "Social play", "Numbers", "Creative art", "Independence"].map((area, index) => (
          <Card key={area}>
            <div className="flex h-28 flex-col justify-between rounded-xl bg-cream p-4">
              <p className="font-bold">{area}</p>
              <div>
                <div className="h-2 rounded-full bg-sand">
                  <div className="h-2 rounded-full bg-gradient-to-r from-terracotta to-sunset" style={{ width: `${62 + index * 5}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted">Mock milestone progress</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (view === "memories") {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {["Story circle", "Garden play", "Art table", "Snack time", "Music", "Blocks", "Painting", "Outdoor run"].map((label, index) => (
          <div className="flex aspect-square items-end rounded-2xl bg-gradient-to-br from-sand via-sunset/60 to-coral p-4 font-bold text-white shadow-soft" key={label}>
            {label} {index + 1}
          </div>
        ))}
      </div>
    );
  }

  if (view.includes("messages")) {
    return (
      <div className="grid min-h-[460px] overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:grid-cols-[280px_1fr]">
        <MessageList
          conversations={[
            { name: "Teacher Johanna", preview: "A lovely morning in class." },
            { name: "Front Desk", preview: "Administrative update available." },
            { name: "Director Assumpta", preview: "Family notice ready to review." }
          ]}
        />
        <div className="flex flex-col justify-between bg-[#FBF8F1] p-5">
          <div className="space-y-3">
            <p className="max-w-md rounded-2xl border border-line bg-white p-3 text-sm">Thank you for the update. We will collect at 15:30 today.</p>
            <p className="ml-auto max-w-md rounded-2xl bg-gradient-to-r from-terracotta to-sunset p-3 text-sm text-white">Noted. We will have Amara ready at reception.</p>
          </div>
          <div className="mt-5 flex gap-2">
            <input className="h-11 flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none" placeholder="Write a message" />
            <Button>Send</Button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "billing" || view === "finance") {
    return (
      <Card title={view === "finance" ? "Finance overview" : "Invoices"}>
        <DataTable
          columns={["Invoice", "Family", "Amount", "Due", "Status"]}
          rows={invoices.map((invoice) => [
            invoice.id,
            invoice.family,
            invoice.amount,
            invoice.dueDate,
            { text: invoice.status, tone: invoice.status === "paid" ? "success" : invoice.status === "pending" ? "warning" : "danger" }
          ])}
        />
      </Card>
    );
  }

  if (["learners", "attendance", "teacher-dashboard", "admin-dashboard", "dashboard"].includes(view)) {
    return (
      <Card title="Learner overview" action={<Badge tone="success">Mock data</Badge>}>
        <DataTable
          columns={["Learner", "Age", "Classroom", "Guardian", "Status"]}
          rows={learners.map((learner) => [
            learner.name,
            learner.age,
            learner.classroom,
            learner.guardian,
            { text: learner.status, tone: learner.status === "checked-in" ? "success" : learner.status === "absent" ? "warning" : "neutral" }
          ])}
        />
      </Card>
    );
  }

  if (view === "staff") {
    return (
      <Card title="Team">
        <DataTable columns={["Member", "Role", "Hours", "Compliance"]} rows={staffRows} />
      </Card>
    );
  }

  if (view === "daily-reports") {
    return (
      <Card title="Report queue">
        <DataTable
          columns={["Learner", "Meals", "Nap", "Learning note", "Status"]}
          rows={[
            ["Amara Shikongo", "Completed", "1h 10m", "Shared toys during group play", { text: "Ready", tone: "success" }],
            ["Liyana Hamutenya", "Completed", "45m", "Strong letter recognition", { text: "Draft", tone: "warning" }],
            ["Junior Hailonga", "Completed", "1h 20m", "Built a tall block tower", { text: "Ready", tone: "success" }]
          ]}
        />
      </Card>
    );
  }

  if (view === "compliance" || view === "safety" || view === "check-in") {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title={view === "check-in" ? "Pickup authorization" : "Operational records"}>
          <DataTable
            columns={["Record", "Status", "Next action"]}
            rows={[
              ["Facility permit", { text: "active", tone: "success" }, "Annual review"],
              ["First-aid certificates", { text: "renew soon", tone: "warning" }, "Book refresher"],
              ["Authorized pickups", { text: "verified", tone: "success" }, "Review monthly"],
              ["Incident register", { text: "clear", tone: "success" }, "Continue logging"]
            ]}
          />
        </Card>
        <Card title="Recent activity">
          <Timeline items={timeline} />
        </Card>
      </div>
    );
  }

  return null;
}

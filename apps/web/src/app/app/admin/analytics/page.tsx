import { Shell } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { DonutChart, AreaTrend, BarRows, Legend, chartColors } from "@/components/ui/Chart";
import { apiClient, formatMoney, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [children, attendance, invoices, payments, classrooms] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.attendance.today(), []),
    safe(apiClient.invoices.list(), []),
    safe(apiClient.payments.list(), []),
    safe(apiClient.classrooms.list(), [])
  ]);

  /* ---- attendance composition (today) ---- */
  const present = attendance.filter((a) => a.status === "checked-in").length;
  const pickedUp = attendance.filter((a) => a.status === "picked-up").length;
  const absent = attendance.filter((a) => a.status === "absent").length;
  const attendanceRate = attendance.length ? Math.round(((present + pickedUp) / attendance.length) * 100) : 0;

  /* ---- finance ---- */
  const totalBilled = invoices.reduce((s, i) => s + Number(i.amount), 0);
  const collected = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const pending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + Number(i.amount), 0);
  const overdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0);
  const collectionRate = totalBilled ? Math.round((collected / totalBilled) * 100) : 0;

  /* ---- revenue trend: last 6 months from real payments ---- */
  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en-GB", { month: "short" }), value: 0 };
  });
  for (const p of payments) {
    const d = new Date(p.paidAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.value += Number(p.amount);
  }
  const totalCollectedTrend = months.reduce((s, m) => s + m.value, 0);

  /* ---- enrollment by classroom ---- */
  const palette = [chartColors.accent, chartColors.sage, chartColors.sky, chartColors.plum, chartColors.sunset];
  const enrollment = classrooms
    .map((c, i) => ({
      label: c.name,
      sub: c.ageGroup,
      value: c.children?.length ?? 0,
      color: palette[i % palette.length]
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Shell crumbs={["Admin", "Analytics"]} title="Analytics">
      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enrolled" value={children.length} detail={`${classrooms.length} classrooms`} />
        <StatCard
          label="Attendance today"
          value={`${attendanceRate}%`}
          detail={`${present + pickedUp} of ${attendance.length} present`}
          tone={attendanceRate >= 80 ? "success" : "warning"}
        />
        <StatCard
          label="Collected"
          value={`${collectionRate}%`}
          detail={formatMoney(collected)}
          tone={collectionRate >= 80 ? "success" : collectionRate >= 60 ? "warning" : "danger"}
        />
        <StatCard label="Outstanding" value={formatMoney(pending + overdue)} detail="Pending & overdue" tone={overdue > 0 ? "danger" : "warning"} />
      </div>

      {/* Revenue trend + attendance donut */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card
          title="Revenue collected"
          description="Payments received over the last six months"
          action={
            <div className="text-right">
              <p className="font-display text-2xl font-medium tracking-tight text-ink">{formatMoney(totalCollectedTrend)}</p>
              <p className="text-xs text-muted">6-month total</p>
            </div>
          }
        >
          <AreaTrend points={months} color={chartColors.accent} formatValue={(v) => formatMoney(v)} />
        </Card>

        <Card title="Attendance today" description="Composition of today's roll">
          <div className="flex flex-col items-center gap-6 py-2 sm:flex-row sm:items-center sm:gap-8">
            <DonutChart
              segments={[
                { label: "Present", value: present, color: chartColors.sage },
                { label: "Picked up", value: pickedUp, color: chartColors.sky },
                { label: "Absent", value: absent, color: chartColors.sunset }
              ]}
              center={
                <>
                  <span className="font-display text-3xl font-medium tracking-tight text-ink">{attendanceRate}%</span>
                  <span className="text-xs text-muted">present</span>
                </>
              }
            />
            <div className="w-full sm:flex-1">
              <Legend
                items={[
                  { label: "Present", value: present, color: chartColors.sage },
                  { label: "Picked up", value: pickedUp, color: chartColors.sky },
                  { label: "Absent", value: absent, color: chartColors.sunset }
                ]}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Enrollment + invoice status */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card title="Enrolment by classroom" description="Children currently placed in each room">
          {enrollment.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No classrooms configured.</p>
          ) : (
            <BarRows data={enrollment} />
          )}
        </Card>

        <Card title="Invoice status" description="Billing across all families">
          <div className="flex flex-col items-center gap-6 py-2 sm:flex-row sm:gap-8">
            <DonutChart
              segments={[
                { label: "Paid", value: collected, color: chartColors.sage },
                { label: "Pending", value: pending, color: chartColors.sunset },
                { label: "Overdue", value: overdue, color: chartColors.terracotta }
              ]}
              center={
                <>
                  <span className="font-display text-2xl font-medium tracking-tight text-ink">{collectionRate}%</span>
                  <span className="text-xs text-muted">collected</span>
                </>
              }
            />
            <div className="w-full sm:flex-1">
              <Legend
                items={[
                  { label: "Paid", value: formatMoney(collected), color: chartColors.sage },
                  { label: "Pending", value: formatMoney(pending), color: chartColors.sunset },
                  { label: "Overdue", value: formatMoney(overdue), color: chartColors.terracotta }
                ]}
              />
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

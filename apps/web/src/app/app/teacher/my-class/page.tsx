import { Shell } from "@/components/dashboard/Shell";
import { TeacherLearnerDirectory } from "@/components/features/TeacherLearnerDirectory";
import { Button } from "@/components/ui/Button";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Class" };

export default async function TeacherMyClass() {
  const [children, attendance, healthRecords] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.attendance.today(), []),
    safe(apiClient.healthRecords.list(), [])
  ]);

  return (
    <Shell
      crumbs={["Teacher", "My Class"]}
      title="My Class"
      action={<Button href="/app/teacher/attendance" size="sm" variant="secondary">Open attendance</Button>}
    >
      <div className="mb-5 rounded-3xl border border-line bg-white p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Directory first</p>
        <h2 className="mt-1 text-2xl font-semibold text-ink">Find a learner, then open the profile layer.</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          This layout is built for large classes: search, filter, page through learners, and keep detailed records in the profile panel.
        </p>
      </div>
      <TeacherLearnerDirectory children={children} attendance={attendance} healthRecords={healthRecords} />
    </Shell>
  );
}

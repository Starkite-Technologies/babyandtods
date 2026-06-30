import { Shell } from "@/components/dashboard/Shell";
import { TeacherLearnerDirectory } from "@/components/features/TeacherLearnerDirectory";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Learner Profiles" };

export default async function TeacherLearners() {
  const [children, attendance, healthRecords] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.attendance.today(), []),
    safe(apiClient.healthRecords.list(), [])
  ]);

  return (
    <Shell crumbs={["Teacher", "Learners"]} title="Learner profiles">
      <TeacherLearnerDirectory children={children} attendance={attendance} healthRecords={healthRecords} pageSize={15} />
    </Shell>
  );
}

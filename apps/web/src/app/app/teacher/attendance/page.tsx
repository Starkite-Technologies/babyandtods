import { Shell } from "@/components/dashboard/Shell";
import { TeacherAttendanceBoard } from "@/components/features/TeacherAttendanceBoard";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Attendance" };

export default async function TeacherAttendance() {
  const [children, attendance] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.attendance.today(), [])
  ]);

  return (
    <Shell crumbs={["Teacher", "Attendance"]} title="Attendance">
      <TeacherAttendanceBoard children={children} attendance={attendance} />
    </Shell>
  );
}

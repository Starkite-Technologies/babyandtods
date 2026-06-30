import { Shell } from "@/components/dashboard/Shell";
import { StaffPageClient } from "./StaffPageClient";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const [staff, classrooms] = await Promise.all([
    safe(apiClient.staff.list(), []),
    safe(apiClient.classrooms.list(), []),
  ]);

  return (
    <Shell crumbs={["Admin", "Staff"]} title={`Staff · ${staff.length} members`}>
      <StaffPageClient staff={staff} classrooms={classrooms} />
    </Shell>
  );
}

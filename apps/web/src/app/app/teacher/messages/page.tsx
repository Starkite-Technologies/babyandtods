import { Shell } from "@/components/dashboard/Shell";
import { TeacherCommsHub } from "@/components/features/TeacherCommsHub";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Communication" };

export default async function TeacherMessages() {
  const [messages, announcements] = await Promise.all([
    safe(apiClient.messages.list(), []),
    safe(apiClient.announcements.list("teachers"), [])
  ]);

  return (
    <Shell crumbs={["Teacher", "Communication"]} title="Communication">
      <TeacherCommsHub messages={messages} announcements={announcements} />
    </Shell>
  );
}

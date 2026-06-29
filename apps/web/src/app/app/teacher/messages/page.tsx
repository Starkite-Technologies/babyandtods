import { Shell } from "@/components/dashboard/Shell";
import { Messenger, type Thread, type Msg } from "@/components/features/Messenger";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

const threads: Thread[] = [
  { id: "thread-sunshine", title: "Maria Shikongo", role: "Parent · Amara", preview: "Thank you, we'll collect at 5.", time: "14:05", unread: 0 },
  { id: "thread-hamutenya", title: "Tate Hamutenya", role: "Parent · Liyana", preview: "Could you check her lunch box?", time: "Yesterday", unread: 1 },
  { id: "thread-class", title: "Sunshine class group", role: "Broadcast · 18 families", preview: "Reminder: photo day Friday.", time: "Mon", unread: 0 }
];

export default async function TeacherMessagesPage() {
  const raw = await safe(apiClient.messages.thread("thread-sunshine"), []);
  const initial: Msg[] = raw.map((m, i) => ({
    id: m.id,
    body: m.body,
    fromMe: i % 2 === 0,
    at: m.sentAt,
    read: true
  }));

  return (
    <Shell crumbs={["Teacher", "Messages"]} title="Parent conversations">
      <Messenger
        threads={threads}
        initialMessages={initial}
        placeholder="Reply to Maria…"
        autoReply="Thank you — that's perfectly fine."
      />
    </Shell>
  );
}

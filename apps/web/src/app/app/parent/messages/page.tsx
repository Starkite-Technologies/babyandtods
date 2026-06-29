import { Shell } from "@/components/dashboard/Shell";
import { Messenger, type Thread, type Msg } from "@/components/features/Messenger";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

const threads: Thread[] = [
  { id: "thread-sunshine", title: "Teacher Johanna", role: "Class Teacher · Sunshine", preview: "Amara settled quickly today…", time: "14:05", unread: 0 },
  { id: "thread-reception", title: "Reception", role: "Front Office", preview: "Statement received, thank you.", time: "Yesterday", unread: 0 },
  { id: "thread-director", title: "Director Assumpta", role: "Academy Director", preview: "Family notice ready to review.", time: "Mon", unread: 1 }
];

export default async function ParentMessagesPage() {
  const raw = await safe(apiClient.messages.thread("thread-sunshine"), []);
  const initial: Msg[] = raw.map((m, i) => ({
    id: m.id,
    body: m.body,
    fromMe: i % 2 === 1,
    at: m.sentAt,
    read: true
  }));

  return (
    <Shell crumbs={["Parent", "Messages"]} title="Messages">
      <Messenger
        threads={threads}
        initialMessages={initial}
        placeholder="Message Teacher Johanna…"
        autoReply="Thanks for your message — I'll get back to you shortly."
      />
    </Shell>
  );
}

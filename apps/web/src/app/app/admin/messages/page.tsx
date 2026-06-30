import { Shell } from "@/components/dashboard/Shell";
import { Messenger, type Msg, type Thread } from "@/components/features/Messenger";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

const threads: Thread[] = [
  {
    id: "admin-frontdesk",
    title: "Front desk",
    role: "Operations team",
    preview: "Pickup lane is ready for the afternoon.",
    time: "Now",
    unread: 1
  },
  {
    id: "admin-parents",
    title: "All parents",
    role: "Broadcast list",
    preview: "School notice can be sent after review.",
    time: "12:40",
    unread: 0
  },
  {
    id: "admin-finance",
    title: "Finance follow-up",
    role: "Payment reminders",
    preview: "Two accounts need payment links.",
    time: "Yesterday",
    unread: 0
  },
  {
    id: "admin-staff",
    title: "Staff room",
    role: "Internal staff channel",
    preview: "Daily handover notes are ready.",
    time: "Mon",
    unread: 2
  }
];

export default async function AdminMessagesPage() {
  const raw = await safe(apiClient.messages.thread("admin-frontdesk"), []);
  const initial: Msg[] =
    raw.length > 0
      ? raw.map((message, index) => ({
          id: message.id,
          body: message.body,
          fromMe: index % 2 === 0,
          at: message.sentAt,
          read: true
        }))
      : [
          {
            id: "admin-m-1",
            body: "Pickup lane is ready for the afternoon. We can send the parent reminder when you approve it.",
            fromMe: false,
            at: new Date().toISOString(),
            read: true
          },
          {
            id: "admin-m-2",
            body: "Good. Keep the message short and send it to all active parent accounts.",
            fromMe: true,
            at: new Date().toISOString(),
            read: true
          }
        ];

  return (
    <Shell crumbs={["Admin", "Messages"]} title="Messages">
      <Messenger
        threads={threads}
        initialMessages={initial}
        placeholder="Write an admin message..."
        autoReply="Received. I will keep this thread updated."
      />
    </Shell>
  );
}

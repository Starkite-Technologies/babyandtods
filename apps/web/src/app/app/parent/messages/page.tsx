import { Bell, MessageCircle, Send } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { apiClient, formatDate, formatTime, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Communication" };

export default async function ParentMessages() {
  const [messages, announcements] = await Promise.all([
    safe(apiClient.messages.list(), []),
    safe(apiClient.announcements.list("parents"), [])
  ]);

  const grouped = Array.from(
    messages.reduce((map, message) => {
      const items = map.get(message.threadId) ?? [];
      items.push(message);
      map.set(message.threadId, items);
      return map;
    }, new Map<string, typeof messages>())
  ).map(([threadId, items]) => ({
    threadId,
    items: items.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()),
    latest: items.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0]
  }));

  const active = grouped[0] ?? null;

  return (
    <Shell
      crumbs={["Parent", "Communication"]}
      title="Communication"
      action={<Button size="sm"><Send className="h-4 w-4" /> New message</Button>}
    >
      <section className="relative overflow-hidden rounded-3xl border border-ink/20 bg-white shadow-soft">
        <div className="absolute inset-x-0 top-0 h-2 bg-ink" aria-hidden />
        <div className="absolute inset-x-10 top-2 h-1 rounded-b-full bg-rainbow" aria-hidden />
        <div className="grid gap-0 pt-3 lg:grid-cols-[340px_1fr]">
          <aside className="border-b border-line bg-paper/70 p-4 lg:border-b-0 lg:border-r">
            <div className="rounded-2xl border border-line bg-white p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Conversations</p>
                <Badge tone="info">{grouped.length}</Badge>
              </div>
              <div className="mt-3 space-y-2">
                {grouped.map((thread, index) => (
                  <div
                    key={thread.threadId}
                    className={`rounded-2xl border p-3 ${index === 0 ? "border-brand-blue/50 bg-sky-50" : "border-line bg-white"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
                        <MessageCircle className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">Thread {thread.threadId.slice(0, 8)}</p>
                        <p className="mt-1 truncate text-xs text-muted">{thread.latest?.body ?? "No messages yet"}</p>
                        <p className="mt-1 text-xs text-muted">{formatTime(thread.latest?.sentAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {grouped.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-line bg-white p-4 text-sm text-muted">
                    No live message threads yet.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-white p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Notifications</p>
                <Badge tone="accent">{announcements.length}</Badge>
              </div>
              <div className="mt-3 space-y-2">
                {announcements.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-line bg-paper p-3">
                    <div className="flex items-start gap-3">
                      <Bell className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" />
                      <div>
                        <p className="text-sm font-semibold text-ink">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{item.body}</p>
                        <p className="mt-1 text-xs text-muted">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-line bg-paper p-4 text-sm text-muted">
                    No live notifications yet.
                  </p>
                )}
              </div>
            </div>
          </aside>

          <main className="flex min-h-[520px] flex-col bg-white">
            <div className="border-b border-line px-5 py-4">
              <p className="font-semibold text-ink">{active ? `Thread ${active.threadId.slice(0, 8)}` : "School communication"}</p>
              <p className="text-sm text-muted">Messages and notifications are now kept together.</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {active?.items.map((message) => (
                <div key={message.id} className="max-w-2xl rounded-2xl border border-line bg-paper p-4">
                  <p className="text-sm leading-6 text-ink">{message.body}</p>
                  <p className="mt-2 text-xs text-muted">{formatDate(message.sentAt)} at {formatTime(message.sentAt)}</p>
                </div>
              ))}
              {!active && (
                <div className="rounded-2xl border border-dashed border-line p-8 text-center">
                  <MessageCircle className="mx-auto h-8 w-8 text-muted" />
                  <p className="mt-3 font-semibold text-ink">No conversation selected</p>
                  <p className="mt-1 text-sm text-muted">When the school sends a live message, it will appear here.</p>
                </div>
              )}
            </div>

            <div className="border-t border-line p-4">
              <div className="flex items-end gap-3 rounded-2xl border border-line bg-paper p-2">
                <textarea rows={2} placeholder="Write to the academy..." className="min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none" />
                <Button size="sm"><Send className="h-4 w-4" /> Send</Button>
              </div>
            </div>
          </main>
        </div>
      </section>
    </Shell>
  );
}

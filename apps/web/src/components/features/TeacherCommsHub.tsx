"use client";

import { useMemo, useState } from "react";
import { Megaphone, MessageCircle, Search, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ApiAnnouncement, ApiMessage } from "@/lib/api";

type Mode = "messages" | "announcements";

export function TeacherCommsHub({ messages, announcements }: { messages: ApiMessage[]; announcements: ApiAnnouncement[] }) {
  const [mode, setMode] = useState<Mode>("messages");
  const [query, setQuery] = useState("");

  const threads = useMemo(() => {
    const map = new Map<string, ApiMessage[]>();
    for (const message of messages) map.set(message.threadId, [...(map.get(message.threadId) ?? []), message]);
    return [...map.entries()].map(([threadId, items]) => ({
      threadId,
      items: items.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()),
      last: items[items.length - 1]
    }));
  }, [messages]);

  const active = threads[0];
  const visibleAnnouncements = announcements.filter((item) => `${item.title} ${item.body}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="rounded-3xl border border-line bg-white shadow-soft">
      <div className="border-b border-line p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex rounded-full border border-line bg-paper p-1">
            <button onClick={() => setMode("messages")} className={`rounded-full px-4 py-2 text-sm font-medium ${mode === "messages" ? "bg-ink text-white" : "text-ink"}`}>
              <MessageCircle className="mr-1 inline h-4 w-4" />
              Messages
            </button>
            <button onClick={() => setMode("announcements")} className={`rounded-full px-4 py-2 text-sm font-medium ${mode === "announcements" ? "bg-ink text-white" : "text-ink"}`}>
              <Megaphone className="mr-1 inline h-4 w-4" />
              Announcements
            </button>
          </div>
          <label className="relative block lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search communication"
              className="h-11 w-full rounded-full border border-line bg-white pl-9 pr-4 text-sm outline-none focus:border-brand-blue"
            />
          </label>
        </div>
      </div>

      {mode === "messages" ? (
        <div className="grid min-h-[620px] lg:grid-cols-[320px_1fr]">
          <aside className="border-b border-line lg:border-b-0 lg:border-r">
            {threads.length === 0 ? (
              <p className="p-5 text-sm text-muted">No messages yet.</p>
            ) : (
              threads.map((thread) => (
                <button key={thread.threadId} className="block w-full border-b border-line p-4 text-left transition hover:bg-ink-50">
                  <p className="font-semibold text-ink">Thread {thread.threadId.slice(0, 6)}</p>
                  <p className="mt-1 truncate text-sm text-muted">{thread.last?.body}</p>
                  <p className="mt-1 text-xs text-muted">{thread.last ? new Date(thread.last.sentAt).toLocaleString("en-GB") : ""}</p>
                </button>
              ))
            )}
          </aside>
          <section className="flex min-h-0 flex-col">
            <div className="border-b border-line p-4">
              <p className="font-semibold text-ink">{active ? `Thread ${active.threadId.slice(0, 6)}` : "No active thread"}</p>
              <p className="text-sm text-muted">Messages and school announcements now live in one communication area.</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {(active?.items ?? []).map((message) => (
                <div key={message.id} className="max-w-2xl rounded-2xl border border-line bg-paper p-4">
                  <p className="text-sm leading-6 text-ink">{message.body}</p>
                  <p className="mt-2 text-xs text-muted">{new Date(message.sentAt).toLocaleString("en-GB")}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-line p-4">
              <div className="flex gap-2 rounded-2xl border border-line bg-paper p-2">
                <input className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" placeholder="Write a reply..." />
                <Button size="sm"><Send className="h-4 w-4" /> Send</Button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="grid gap-3 p-4 md:grid-cols-2">
          {visibleAnnouncements.map((item) => (
            <article key={item.id} className="rounded-2xl border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <Badge tone={item.audience === "all" ? "neutral" : "info"}>{item.audience}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              <p className="mt-3 text-xs text-muted">{new Date(item.createdAt).toLocaleDateString("en-GB")}</p>
            </article>
          ))}
          {visibleAnnouncements.length === 0 && <p className="p-5 text-sm text-muted">No announcements match this search.</p>}
        </div>
      )}
    </div>
  );
}

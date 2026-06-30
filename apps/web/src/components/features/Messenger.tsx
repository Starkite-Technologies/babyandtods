"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { CheckCheck, MessageSquarePlus, Search, Send } from "lucide-react";
import { sendMessageAction } from "@/lib/actions";
import { Badge } from "@/components/ui/Badge";

export type Thread = {
  id: string;
  title: string;
  role: string;
  preview: string;
  time: string;
  unread: number;
};

export type Msg = { id: string; body: string; fromMe: boolean; at: string; read?: boolean };

export function Messenger({
  threads,
  initialMessages,
  placeholder,
  autoReply
}: {
  threads: Thread[];
  initialMessages: Msg[];
  placeholder: string;
  autoReply?: string;
}) {
  const [activeId, setActiveId] = useState(threads[0]?.id ?? "");
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [typing, setTyping] = useState(false);
  const [, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredThreads = useMemo(
    () => threads.filter((thread) => `${thread.title} ${thread.role}`.toLowerCase().includes(query.toLowerCase())),
    [query, threads]
  );
  const active = threads.find((thread) => thread.id === activeId) ?? threads[0];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(event: React.FormEvent) {
    event.preventDefault();
    const body = text.trim();
    if (!body || !activeId) return;
    const id = `m-${Date.now()}`;
    setMessages((prev) => [...prev, { id, body, fromMe: true, at: new Date().toISOString(), read: false }]);
    setText("");

    startTransition(async () => {
      await sendMessageAction({ threadId: activeId, body });
      setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, read: true } : message)));
    });

    if (autoReply) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `r-${Date.now()}`, body: autoReply, fromMe: false, at: new Date().toISOString() }
        ]);
      }, 900);
    }
  }

  return (
    <div className="grid min-h-[680px] overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-soft lg:grid-cols-[340px_1fr]">
      <aside className="border-b border-line bg-ink-50/40 lg:border-b-0 lg:border-r">
        <div className="border-b border-line bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Inbox</p>
              <h2 className="mt-1 text-xl font-semibold text-ink">Messages</h2>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white shadow-soft" aria-label="New message">
              <MessageSquarePlus className="h-4 w-4" />
            </button>
          </div>
          <label className="relative mt-4 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations"
              className="h-11 w-full rounded-full border border-line bg-white pl-9 pr-4 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
            />
          </label>
        </div>

        <div className="max-h-[560px] overflow-y-auto p-2">
          {filteredThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setActiveId(thread.id)}
              className={`mb-2 flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                thread.id === activeId ? "border-line bg-white shadow-soft ring-1 ring-brand-blue/20" : "border-transparent hover:border-line hover:bg-white"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-white font-display text-sm font-black text-ink shadow-sm">
                {thread.title[0]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-ink">{thread.title}</span>
                  <span className="shrink-0 text-[11px] text-muted">{thread.time}</span>
                </span>
                <span className="mt-0.5 block text-[11px] text-muted">{thread.role}</span>
                <span className="mt-1 block truncate text-xs text-ink-500">{thread.preview}</span>
              </span>
              {thread.unread > 0 && <Badge tone="accent">{thread.unread}</Badge>}
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-h-0 flex-col bg-white">
        <header className="flex items-center justify-between gap-4 border-b border-line bg-white p-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-ink">{active?.title}</h3>
            </div>
            <p className="text-sm text-muted">{active?.role}</p>
          </div>
          <Badge tone="success">
            <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-brand-green text-brand-green" />
            Online
          </Badge>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.fromMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`animate-rise max-w-[72%] rounded-[1.15rem] px-4 py-3 text-sm leading-relaxed shadow-soft ${
                  message.fromMe
                    ? "rounded-br-sm bg-brand-blue text-white"
                    : "rounded-bl-sm border border-line bg-white text-ink"
                }`}
              >
                <p>{message.body}</p>
                <p className={`mt-2 flex items-center justify-end gap-1 text-[10px] ${message.fromMe ? "text-white/70" : "text-muted"}`}>
                  {new Date(message.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  {message.fromMe && <CheckCheck className={`h-3 w-3 ${message.read ? "text-white" : "text-white/45"}`} />}
                </p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-line bg-white p-3 shadow-soft">
                {[0, 150, 300].map((delay) => (
                  <span key={delay} className="h-2 w-2 animate-bounce rounded-full bg-ink-300" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={send} className="border-t border-line bg-ink-50/40 p-4">
          <div className="flex gap-2 rounded-full border border-line bg-white p-1 shadow-soft">
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="h-11 flex-1 rounded-full bg-transparent px-4 text-sm outline-none"
              placeholder={placeholder}
            />
            <button type="submit" className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition hover:bg-ink-700" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

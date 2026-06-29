"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Send, CheckCheck } from "lucide-react";
import { sendMessageAction } from "@/lib/actions";

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
  const [typing, setTyping] = useState(false);
  const [, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    const id = `m-${Date.now()}`;
    setMessages((prev) => [...prev, { id, body, fromMe: true, at: new Date().toISOString(), read: false }]);
    setText("");

    startTransition(async () => {
      await sendMessageAction({ threadId: activeId, body });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    });

    if (autoReply) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `r-${Date.now()}`, body: autoReply, fromMe: false, at: new Date().toISOString() }
        ]);
      }, 1800);
    }
  }

  return (
    <div className="glass grid min-h-[620px] overflow-hidden rounded-2xl md:grid-cols-[300px_1fr]">
      {/* Threads */}
      <aside className="border-b border-white/40 md:border-b-0 md:border-r">
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Conversations</p>
        </div>
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`flex w-full items-start gap-3 border-t border-white/40 p-4 text-left transition ${
              t.id === activeId ? "bg-white/60" : "hover:bg-white/40"
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs text-paper">
              {t.title[0]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-semibold text-ink">{t.title}</p>
                <span className="shrink-0 text-[11px] text-muted">{t.time}</span>
              </div>
              <p className="text-[11px] text-muted">{t.role}</p>
              <p className="mt-0.5 truncate text-xs text-muted">{t.preview}</p>
            </div>
            {t.unread > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">
                {t.unread}
              </span>
            )}
          </button>
        ))}
      </aside>

      {/* Chat */}
      <section className="flex min-h-0 flex-col">
        <header className="flex items-center justify-between border-b border-white/40 p-4">
          <div>
            <p className="font-display text-base font-semibold text-ink">{active?.title}</p>
            <p className="text-xs text-muted">{active?.role}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200/60">
            <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 text-emerald-500" />
            Online
          </span>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`animate-rise max-w-sm rounded-2xl p-3 text-sm leading-relaxed ${
                  m.fromMe ? "rounded-br-md bg-ink text-paper" : "rounded-bl-md bg-white/70 text-ink ring-1 ring-inset ring-white/60"
                }`}
              >
                <p>{m.body}</p>
                <p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${m.fromMe ? "text-paper/60" : "text-muted"}`}>
                  {new Date(m.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  {m.fromMe && <CheckCheck className={`h-3 w-3 ${m.read ? "text-blue-300" : "text-paper/40"}`} />}
                </p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white/70 p-3 ring-1 ring-inset ring-white/60">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="h-2 w-2 animate-bounce rounded-full bg-ink-300"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={send} className="border-t border-white/40 p-3">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-11 flex-1 rounded-full border border-white/60 bg-white/60 px-4 text-sm outline-none backdrop-blur focus:border-accent"
              placeholder={placeholder}
            />
            <button
              type="submit"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-600"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

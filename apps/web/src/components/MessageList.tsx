export function MessageList({
  conversations
}: {
  conversations: Array<{
    name: string;
    preview: string;
    meta?: string;
    unread?: number;
  }>;
}) {
  return (
    <div className="border-b border-line md:border-b-0 md:border-r">
      {conversations.map((conversation, index) => (
        <div className={`border-b border-line p-4 ${index === 0 ? "bg-cream/70" : "bg-white"}`} key={conversation.name}>
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold">{conversation.name}</p>
            {conversation.meta ? <span className="text-[11px] font-semibold text-muted">{conversation.meta}</span> : null}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-sm text-muted">{conversation.preview}</p>
            {conversation.unread ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[11px] font-bold text-white">
                {conversation.unread}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

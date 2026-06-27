export function MessageList({
  conversations
}: {
  conversations: Array<{
    name: string;
    preview: string;
  }>;
}) {
  return (
    <div className="border-r border-line">
      {conversations.map((conversation) => (
        <div className="border-b border-line p-4" key={conversation.name}>
          <p className="font-bold">{conversation.name}</p>
          <p className="mt-1 text-sm text-muted">{conversation.preview}</p>
        </div>
      ))}
    </div>
  );
}

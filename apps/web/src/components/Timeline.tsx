export function Timeline({
  items
}: {
  items: Array<{
    time: string;
    title: string;
    detail: string;
  }>;
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div className="border-l-2 border-terracotta pl-4" key={`${item.time}-${item.title}`}>
          <p className="text-xs font-bold uppercase text-muted">{item.time}</p>
          <p className="font-bold">{item.title}</p>
          <p className="text-sm leading-6 text-muted">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

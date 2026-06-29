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
    <div className="relative space-y-4 pl-5 before:absolute before:bottom-2 before:left-1.5 before:top-2 before:w-px before:bg-line">
      {items.map((item) => (
        <div className="relative pl-4" key={`${item.time}-${item.title}`}>
          <span className="absolute -left-[1.13rem] top-1.5 h-3 w-3 rounded-full border-2 border-terracotta bg-white" />
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{item.time}</p>
          <p className="font-bold">{item.title}</p>
          <p className="text-sm leading-6 text-muted">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

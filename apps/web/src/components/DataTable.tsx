import { Badge } from "./Badge";

export function DataTable({
  columns,
  rows
}: {
  columns: string[];
  rows: Array<Array<string | { text: string; tone: "neutral" | "success" | "warning" | "danger" }>>;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[640px] border-collapse bg-white text-left text-sm">
        <thead className="bg-cream/80 text-[11px] uppercase tracking-wide text-muted">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3 font-bold" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr className="border-t border-line/80 transition hover:bg-cream/45" key={`${row[0]}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td className="px-4 py-3 text-deep" key={`${cellIndex}-${typeof cell === "string" ? cell : cell.text}`}>
                  {typeof cell === "string" ? cell : <Badge tone={cell.tone}>{cell.text}</Badge>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

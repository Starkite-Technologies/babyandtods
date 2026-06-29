import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "./Badge";
import { cn } from "@/lib/cn";

type Cell =
  | string
  | number
  | ReactNode
  | { kind: "badge"; text: string; tone: "neutral" | "success" | "warning" | "danger" | "info" | "accent" }
  | { kind: "link"; text: string; href: string }
  | { kind: "raw"; node: ReactNode };

function renderCell(cell: Cell) {
  if (cell && typeof cell === "object" && "kind" in cell) {
    if (cell.kind === "badge") return <Badge tone={cell.tone}>{cell.text}</Badge>;
    if (cell.kind === "link")
      return (
        <Link className="link-underline font-medium text-ink" href={cell.href}>
          {cell.text}
        </Link>
      );
    if (cell.kind === "raw") return cell.node;
  }
  return cell as ReactNode;
}

export function DataTable({
  columns,
  rows,
  rowHref,
  empty = "No records yet."
}: {
  columns: string[];
  rows: Cell[][];
  rowHref?: (rowIndex: number) => string | undefined;
  empty?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-paper p-8 text-center text-sm text-muted">
        {empty}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[640px] border-collapse bg-surface text-left text-sm">
        <thead className="bg-ink-50/50 text-[11px] uppercase tracking-wider text-muted">
          <tr>
            {columns.map((col) => (
              <th className="px-4 py-3 font-medium" key={col}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const href = rowHref?.(rowIndex);
            const cells = row.map((cell, cellIndex) => (
              <td className="px-4 py-3.5 align-middle text-ink" key={cellIndex}>
                {renderCell(cell)}
              </td>
            ));
            return (
              <tr
                key={rowIndex}
                className={cn(
                  "border-t border-line/80 transition",
                  href && "cursor-pointer hover:bg-ink-50/40"
                )}
              >
                {href ? (
                  <>
                    {cells.map((cell, i) =>
                      i === 0 ? (
                        <td className="p-0 align-middle" key={i}>
                          <Link className="block px-4 py-3.5 font-medium text-ink" href={href}>
                            {row[0] as ReactNode}
                          </Link>
                        </td>
                      ) : (
                        cell
                      )
                    )}
                  </>
                ) : (
                  cells
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

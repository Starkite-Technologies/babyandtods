import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Lightweight, dependency-free SVG charts.
 * All components render server-side (no client JS, no hooks).
 * Palette draws from the "Dare to Dream" rainbow brand tokens.
 * ------------------------------------------------------------------ */

export const chartColors = {
  ink: "#141627",
  accent: "#2D8CE0", // brand blue
  sage: "#3DAE3A", // brand green
  sky: "#5CB8EA", // brand sky
  sunset: "#F7931E", // brand orange
  terracotta: "#E63329", // brand red
  plum: "#8E44AD", // brand purple
  pink: "#E8308C", // brand pink
  yellow: "#FFC524", // brand yellow
  track: "#ECE7F2"
};

type Segment = { label: string; value: number; color: string };

/* ----------------------------- Donut ------------------------------ */

export function DonutChart({
  segments,
  size = 168,
  thickness = 22,
  center
}: {
  segments: Segment[];
  size?: number;
  thickness?: number;
  center?: ReactNode;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={chartColors.track} strokeWidth={thickness} />
          {total > 0 &&
            segments.map((s, i) => {
              const frac = s.value / total;
              const dash = frac * c;
              const el = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${dash} ${c - dash}`}
                  strokeDashoffset={-acc}
                />
              );
              acc += dash;
              return el;
            })}
        </g>
      </svg>
      {center && <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{center}</div>}
    </div>
  );
}

/* ----------------------------- Legend ----------------------------- */

export function Legend({ items }: { items: { label: string; value: ReactNode; color: string }[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it.label} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm text-ink-600">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: it.color }} />
            {it.label}
          </span>
          <span className="font-mono text-sm tabular-nums text-ink">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------- Area trend ---------------------------- */

export function AreaTrend({
  points,
  color = chartColors.accent,
  formatValue = (v) => String(v),
  height = 220,
  width = 640
}: {
  points: { label: string; value: number }[];
  color?: string;
  formatValue?: (v: number) => string;
  height?: number;
  width?: number;
}) {
  const pad = { t: 18, r: 14, b: 30, l: 14 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const max = Math.max(...points.map((p) => p.value), 1);
  const niceMax = max <= 0 ? 1 : max * 1.15;

  const stepX = points.length > 1 ? innerW / (points.length - 1) : innerW;
  const x = (i: number) => pad.l + (points.length > 1 ? i * stepX : innerW / 2);
  const y = (v: number) => pad.t + innerH - (v / niceMax) * innerH;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(points.length - 1).toFixed(1)} ${(pad.t + innerH).toFixed(1)} L ${x(0).toFixed(1)} ${(pad.t + innerH).toFixed(1)} Z`;
  const gid = `grad-${color.replace("#", "")}`;
  const grid = [0.5, 0.75, 1].map((f) => pad.t + innerH - f * innerH);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {grid.map((gy, i) => (
        <line key={i} x1={pad.l} y1={gy} x2={width - pad.r} y2={gy} stroke={chartColors.track} strokeWidth={1} />
      ))}

      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value)} r={3.5} fill="#fff" stroke={color} strokeWidth={2} />
          <text x={x(i)} y={height - 10} textAnchor="middle" fontSize={11} fill="#6C7088" fontFamily="var(--font-sans)">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* -------------------------- Bar rows ------------------------------ */

export function BarRows({
  data,
  formatValue = (v) => String(v)
}: {
  data: { label: string; sub?: string; value: number; color?: string }[];
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-4">
            <span className="truncate text-sm font-medium text-ink">
              {d.label}
              {d.sub && <span className="ml-2 text-xs font-normal text-muted">{d.sub}</span>}
            </span>
            <span className="font-mono text-sm tabular-nums text-ink">{formatValue(d.value)}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color ?? chartColors.accent }} />
          </div>
        </div>
      ))}
    </div>
  );
}

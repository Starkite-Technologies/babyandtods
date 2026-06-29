export function ProgressBar({
  value,
  label,
  detail,
  showValue = true
}: {
  value: number;
  label?: string;
  detail?: string;
  showValue?: boolean;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          {label && <p className="font-medium text-ink">{label}</p>}
          {showValue && <p className="font-mono text-xs text-muted">{v}%</p>}
        </div>
      )}
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-ink transition-all duration-700 ease-out"
          style={{ width: `${v}%` }}
        />
      </div>
      {detail && <p className="mt-1.5 text-xs text-muted">{detail}</p>}
    </div>
  );
}

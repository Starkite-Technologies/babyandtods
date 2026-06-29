import { Shell } from "@/components/dashboard/Shell";
import { ToastStack } from "@/components/ui/Toast";
import { CheckInBoard, type RosterChild } from "@/components/features/CheckInBoard";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CheckInPage() {
  const [attendance, children] = await Promise.all([
    safe(apiClient.attendance.today(), []),
    safe(apiClient.children.list(), [])
  ]);

  const attMap = Object.fromEntries(attendance.map((a) => [a.childId, a]));

  const roster: RosterChild[] = children.map((c) => {
    const a = attMap[c.id];
    return {
      childId: c.id,
      name: c.name,
      classroom: c.classroom?.name ?? "—",
      status: (a?.status as RosterChild["status"]) ?? "out",
      checkedInAt: a?.checkedInAt ?? null
    };
  });

  // Today's kiosk code — deterministic per day (no client randomness needed)
  const day = new Date();
  const code = String(((day.getFullYear() * 366 + day.getMonth() * 31 + day.getDate()) % 900000) + 100000);

  // Optional real QR. The import is hidden from the bundler via `new Function`
  // so a missing `qrcode` package can never break the build — it simply falls
  // back to the numeric kiosk code. Run `npm i qrcode` in apps/web to enable it.
  let qrDataUrl: string | null = null;
  try {
    const optionalImport = new Function("m", "return import(m)") as (m: string) => Promise<any>;
    const QR = await optionalImport("qrcode");
    qrDataUrl = await (QR.toDataURL ?? QR.default.toDataURL)(`https://babytodds.app/checkin?code=${code}`, {
      margin: 1,
      width: 240,
      color: { dark: "#0A0A0A", light: "#FFFFFF" }
    });
  } catch {
    qrDataUrl = null;
  }

  return (
    <Shell crumbs={["Teacher", "Check-in"]} title="Live check-in">
      <ToastStack />
      <CheckInBoard initial={roster} kioscoCode={code} qrDataUrl={qrDataUrl} />
    </Shell>
  );
}

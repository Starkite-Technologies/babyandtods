import { Shell } from "@/components/dashboard/Shell";
import { ToastStack } from "@/components/ui/Toast";
import { JourneyBoard } from "@/components/features/JourneyBoard";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ParentJourneyPage() {
  const children = await safe(apiClient.children.list(), []);
  const child = children[0];

  const reports = child ? await safe(apiClient.dailyReports.forChild(child.id), []) : [];

  const moments = [...reports]
    .filter((r) => r.learningNote?.trim())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)
    .map((r) => ({ id: r.id, note: r.learningNote, date: r.date, liked: false }));

  if (!child) {
    return (
      <Shell crumbs={["Parent", "Journey"]} title="Journey">
        <div className="glass flex h-64 items-center justify-center rounded-2xl">
          <p className="text-sm text-muted">No child profile found. Please contact the academy.</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell crumbs={["Parent", "Journey"]} title={`${child.name.split(" ")[0]}'s journey`}>
      <ToastStack />
      <JourneyBoard childName={child.name} moments={moments} />
    </Shell>
  );
}

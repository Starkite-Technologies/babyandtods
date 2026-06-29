import { Shell } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { apiClient, formatDate, safe } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function createAnnouncement(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const audience = formData.get("audience") as string;

  if (!title?.trim() || !body?.trim()) return;

  try {
    await fetch(`${BASE}/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, audience: audience || "all" })
    });
    revalidatePath("/app/admin/announcements");
  } catch {
    // silently handle
  }
}

export default async function AdminAnnouncementsPage() {
  const announcements = await safe(apiClient.announcements.list(), []);

  const sorted = [...announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const audienceTone = (audience: string): "success" | "info" | "warning" | "neutral" => {
    if (audience === "parents") return "success";
    if (audience === "staff") return "info";
    if (audience === "all") return "warning";
    return "neutral";
  };

  return (
    <Shell crumbs={["Admin", "Announcements"]} title="Announcements">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Announcements list */}
        <div>
          {sorted.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-line">
              <p className="text-sm text-muted">No announcements yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map((ann) => (
                <div
                  key={ann.id}
                  className="rounded-2xl border border-line bg-surface p-5 transition hover:border-ink-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-ink">{ann.title}</h3>
                      <p className="mt-1.5 text-sm text-muted leading-relaxed">{ann.body}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Badge tone={audienceTone(ann.audience)}>
                        {ann.audience === "all" ? "Everyone" : ann.audience}
                      </Badge>
                      <span className="text-[11px] text-muted">{formatDate(ann.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create form */}
        <Card title="Post announcement">
          <form action={createAnnouncement} className="space-y-4">
            <Input label="Title" name="title" placeholder="e.g. Photo day reminder" required />
            <Textarea
              label="Message"
              name="body"
              placeholder="Write your announcement here…"
              rows={5}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Audience</label>
              <select
                name="audience"
                className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:border-ink focus:outline-none"
              >
                <option value="all">Everyone</option>
                <option value="parents">Parents only</option>
                <option value="staff">Staff only</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Post announcement
            </Button>
          </form>
        </Card>
      </div>
    </Shell>
  );
}

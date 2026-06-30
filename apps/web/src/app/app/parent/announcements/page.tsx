import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ParentAnnouncementsRedirect() {
  redirect("/app/parent/messages");
}

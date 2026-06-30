import { redirect } from "next/navigation";
import { Shell } from "@/components/dashboard/Shell";
import { ProfileView } from "@/components/dashboard/ProfileView";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "My profile" };
export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <Shell crumbs={["Admin", "Profile"]} title="My profile">
      <ProfileView user={user} />
    </Shell>
  );
}

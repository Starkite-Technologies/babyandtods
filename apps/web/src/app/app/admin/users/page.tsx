import { Shell } from "@/components/dashboard/Shell";
import { UsersAccessWorkspace } from "./users-access-workspace";

export const metadata = { title: "Users & Access" };

export default function UsersAccessPage() {
  return (
    <Shell
      crumbs={["Admin", "Users & Access"]}
      title="Users & Access"
    >
      <UsersAccessWorkspace />
    </Shell>
  );
}

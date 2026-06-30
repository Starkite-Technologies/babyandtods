import { getCurrentUser } from "@/lib/auth";
import { apiClient, safe } from "@/lib/api";

export async function getCurrentParent() {
  const user = await getCurrentUser();
  const parents = await safe(apiClient.parents.list(), []);
  const parent = parents.find((item) => item.user.email.toLowerCase() === user?.email?.toLowerCase()) ?? null;
  return { user, parent, children: parent?.children ?? [] };
}

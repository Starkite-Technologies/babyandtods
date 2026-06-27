import type { Learner } from "@babies-tods/shared";
import { Badge } from "./Badge";

export function ProfileSummary({ learner }: { learner: Learner }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-cream p-4 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-coral to-sunset text-xl font-black text-white">
        {learner.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold">{learner.name}</p>
        <p className="text-sm text-muted">
          {learner.age} / {learner.classroom} / Guardian: {learner.guardian}
        </p>
      </div>
      <Badge tone={learner.status === "checked-in" ? "success" : learner.status === "absent" ? "warning" : "neutral"}>
        {learner.status}
      </Badge>
    </div>
  );
}

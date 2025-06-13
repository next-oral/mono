import { format } from "date-fns";

import { CheckCircle2 } from "@repo/design/icons";
import { cn } from "@repo/design/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

export interface Activity {
  id: string;
  type: string;
  title: string;
  time: number;
  name: string;
  avatar?: string;
  timeStart?: string;
  timeEnd?: string;
  status?: string;
  email?: string;
  details?: string;
  badge?: string;
}

export const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex cursor-pointer flex-col items-start gap-2 border-b p-4 text-sm leading-tight last:border-b-0">
      <div className="flex w-full items-center gap-2">
        <span className="font-medium">{activity.title}</span>
        <span className="ml-auto text-xs">
          {format(activity.time, "MMM d, yyyy")}
        </span>
      </div>
      {/* Content by type */}
      {activity.type === "appointment" && (
        <div className="flex w-full items-center gap-2">
          <Avatar className="size-7">
            <AvatarImage src={activity.avatar ?? ""} alt={activity.name} />
            <AvatarFallback className="capitalize">
              {activity.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{activity.name}</div>
            <div className="text-xs text-gray-500">
              {activity.timeStart} <span className="mx-1">→</span>{" "}
              {activity.timeEnd}
            </div>
          </div>
        </div>
      )}
      {activity.type === "new_patient" && (
        <div>
          <div className="font-medium">{activity.name}</div>
          {activity.email && (
            <div className="text-xs text-gray-500">{activity.email}</div>
          )}
        </div>
      )}
      {activity.type === "treatment_completed" && (
        <div>
          <div className="font-medium">{activity.details}</div>
        </div>
      )}
      {activity.type === "status_change" && (
        <div className="flex w-full flex-col gap-2">
          <div
            className={cn("flex items-center gap-2 p-4", {
              "border-l-4 border-slate-700 bg-slate-100 text-slate-700":
                activity.badge === "confirmed",
              "border-l-4 border-green-500 bg-green-50 text-slate-900":
                activity.badge === "completed",
              "border-l-4 border-red-700 bg-red-50 text-red-700":
                activity.badge === "cancelled",
            })}
          >
            <div className="flex-1">
              <div className="font-medium">{activity.name}</div>
              <div className="text-xs text-gray-500">
                {activity.timeStart} <span className="mx-1">→</span>{" "}
                {activity.timeEnd}
              </div>
            </div>
            <Avatar className="h-7 w-7">
              <AvatarImage
                src={activity.avatar ?? undefined}
                alt={activity.name}
              />
              <AvatarFallback>
                {activity.name
                  ? activity.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : ""}
              </AvatarFallback>
            </Avatar>
          </div>
          {activity.badge === "confirmed" && (
            <Badge
              variant="outline"
              className="border-slate-200 bg-slate-100 text-slate-700"
            >
              Confirmed
            </Badge>
          )}
          {activity.badge === "completed" && (
            <Badge
              variant="outline"
              className="border-green-100 bg-green-100 font-medium text-green-700"
            >
              <CheckCircle2 className="size-12 fill-green-700 text-green-100" />
              Completed
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

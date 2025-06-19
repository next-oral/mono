import { Loader2 } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/components/ui/avatar";
import { Badge } from "@repo/design/components/ui/badge";
import { Card } from "@repo/design/components/ui/card";

interface AppointmentCardProps {
  date: Date | string;
  name: string;
  imageUrl?: string;
  timeStart: string;
  timeEnd: string;
  status: "In Progress" | "Completed" | "Cancelled" | "";
}

export function AppointmentCard({
  date,
  name,
  imageUrl,
  timeStart,
  timeEnd,
  status,
}: AppointmentCardProps) {
  // Format date
  const d = typeof date === "string" ? new Date(date) : date;
  const month = d.toLocaleString("default", { month: "short" }).toUpperCase();
  const day = d.getDate();

  // Status color and icon (customize as needed)
  const statusColor =
    status === "In Progress"
      ? "text-sky-900 border-sky-200 bg-sky-100"
      : status === "Completed"
        ? "text-green-600 border-green-200 bg-green-50"
        : status === "Cancelled"
          ? "text-red-600 border-red-200 bg-red-50"
          : "text-gray-600 border-gray-200 bg-gray-50";

  return (
    <Card className="flex flex-col p-4 shadow-none">
      <div className="flex items-center gap-4">
        {/* Date */}
        <div className="flex flex-col items-center justify-center overflow-hidden rounded-md border text-slate-500">
          <span className="bg-gray-100 px-3 py-1 text-sm font-medium">
            {month}
          </span>
          <span className="p-1 text-lg font-semibold">{day}</span>
        </div>
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{name}</span>
            <Avatar className="h-10 w-10">
              {imageUrl ? (
                <AvatarImage src={imageUrl} alt={name} />
              ) : (
                <AvatarFallback>
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {timeStart} <span className="mx-1">→</span> {timeEnd}
          </div>
          <div className="mt-2">
            <Badge
              variant="outline"
              className={`flex items-center gap-1 ${statusColor}`}
            >
              <Loader2 className="size-4" />
              {status}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { isToday } from "date-fns";

import { Clock } from "@repo/design/icons";
import { isAmPmThisHour } from "@repo/design/lib/calendar";
import { cn } from "@repo/design/lib/utils";

import { TIME_SLOT_HEIGHT } from "../constants";
import { useCalendarStore } from "../store/store";

export function CurrentTimeIndicator({
  time,
  currentDate,
}: {
  time: string;
  currentDate: Date;
}) {
  if (!isAmPmThisHour(time) || !isToday(currentDate)) return null;

  const now = new Date().getMinutes();
  const position = (now / 60) * TIME_SLOT_HEIGHT;

  return (
    <div
      className={cn(
        "border-primary/20 bg-primary/20 absolute z-90 h-[0.1px] w-screen border",
      )}
      style={{ top: `${position}px` }}
    />
  );
}

// This component shows the indicator for the present start time being dragged to.
export function DragTimeIndicator() {
  const { findActiveAppointment, newStartTime } = useCalendarStore();

  const appointment = findActiveAppointment();
  if (!appointment || !newStartTime) return null;
  return (
    <div className="pointer-events-none fixed top-24 right-6 z-[999]">
      <div className="bg-background/80 border-border text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 shadow-lg supports-[backdrop-filter]:backdrop-blur-md">
        <Clock className="text-muted-foreground size-3" />
        <span className="text-muted-foreground">Moving</span>
        <span className="font-medium">{appointment.patientName}</span>
        <span className="text-muted-foreground">to</span>
        <span className="font-semibold tabular-nums">{newStartTime}</span>
      </div>
    </div>
  );
}

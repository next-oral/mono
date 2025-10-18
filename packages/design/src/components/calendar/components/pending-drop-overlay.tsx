// PendingDropOverlay.tsx
import React from "react";

import type { Appointment } from "@repo/design/types/calendar";
import { minutesToTime } from "@repo/design/lib/calendar";
import { cn } from "@repo/design/lib/utils";

import { useCalendarStore } from "../store/store";

interface Props {
  visible: boolean;
  appointment: Appointment | null; // original appointment data or minimal shape
  dentistId: number | string;
  pendingStartMinutes: number | null;
}

export function PendingDropOverlay({
  visible,
  appointment,
  dentistId,
  pendingStartMinutes,
}: Props) {
  const {
    getAppointmentWidth,
    getAppointmentHeight,
    getAppointmentTop,
    getAppointmentLeft,
  } = useCalendarStore();

  if (!visible || !appointment || typeof pendingStartMinutes !== "number")
    return <div>dvuduyhgj vdjh buhbvjbnhv jhedvbjhbjhbv d uh</div>;

  const width = getAppointmentWidth();
  const height = getAppointmentHeight(
    /* startTime */ String(minutesToTime(pendingStartMinutes)),
    /* endTime */ String(appointment.endTime), // optionally compute by start+duration instead
  );
  const top = getAppointmentTop(minutesToTime(pendingStartMinutes)); // adapt to your util signature
  const left = getAppointmentLeft(Number(dentistId));

  return (
    <div
      // Ensure the calendar container has position: relative; this element will be absolute inside it.
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        width: typeof width === "string" ? width : `${String(width)}px`,
        height: typeof height === "string" ? height : `${height}px`,
        zIndex: 50, // above normal appointments, below confirmed modals if needed
        pointerEvents: "none", // let clicks go to dialog or underlying layer
      }}
      className="h-20 w-20 bg-red-500"
    >
      <div
        className={cn(
          "pointer-events-none flex rounded-md p-2",
          appointment.color?.stickerColor,
        )}
        style={{ width: "100%", height: "100%" }}
      >
        <div
          className={cn(
            "mt-20 mr-2 w-1 flex-shrink-0 rounded-full",
            appointment.color?.lineColor,
          )}
        />
        <div className="flex-1 overflow-hidden">
          <div className="text-xs leading-tight font-medium">
            {appointment.patientName}
          </div>
          <div className="text-xs leading-tight opacity-75">
            {minutesToTime(pendingStartMinutes)} -{" "}
            {appointment.endTime /* or recompute end */}
          </div>
        </div>
      </div>
    </div>
  );
}

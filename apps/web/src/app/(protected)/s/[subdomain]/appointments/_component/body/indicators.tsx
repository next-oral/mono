"use client";

import { useZero } from "@rocicorp/zero/react";
import { format, isSameHour, isToday } from "date-fns";

import type { Appointment, Schema } from "@repo/zero/src/schema";
import { Clock } from "@repo/design/src/icons";

import { useZeroQuery } from "~/providers/zero";
import { SLOTS_PER_DAY } from "../constants";

export function CurrentTimeIndicator({ currentTime }: { currentTime: string }) {
  if (!isToday(currentTime)) return null;

  const now = new Date();
  const position = (now.getMinutes() / 60) * SLOTS_PER_DAY;

  if (!isSameHour(now, currentTime)) return null;

  return (
    <div
      className="border-primary/20 bg-primary/20 absolute h-[0.1px] w-full min-w-screen border"
      style={{ top: `${position}px` }}
    />
  );
}

export function DragTimeIndicator({
  appointment,
}: {
  appointment: Appointment | null;
}) {
  const z = useZero<Schema>();
  const { data: patient } = useZeroQuery(
    z.query.patient.where("id", "=", appointment?.patId ?? "").one(),
  );

  if (!appointment || !patient) return null;

  return (
    <div className="pointer-events-none fixed top-24 right-6 z-[999]">
      <div className="bg-background/80 border-border text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 shadow-lg supports-[backdrop-filter]:backdrop-blur-md">
        <Clock className="text-muted-foreground size-3" />
        <span className="text-muted-foreground">Moving</span>
        <span className="font-medium">
          {patient.firstName} {patient.lastName}
        </span>
        <span className="text-muted-foreground">to</span>
        <span className="font-semibold tabular-nums">
          {format(appointment.start, "HH:mm")}
        </span>
      </div>
    </div>
  );
}

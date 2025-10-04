"use client";

import { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { addMinutes, formatISO } from "date-fns";

import type { Appointment } from "./types";
import { cn } from "~/lib/utils";
import { dentists, MINUTES_PER_SLOT, SLOT_HEIGHT_PX } from "./constants";
import { useCalendarStore } from "./store";
import { colors } from "./types";

function computePositionAndSize(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  const durationMinutes = Math.max(0, endMinutes - startMinutes);
  const topPx = (startMinutes / MINUTES_PER_SLOT) * SLOT_HEIGHT_PX;
  const heightPx = (durationMinutes / MINUTES_PER_SLOT) * SLOT_HEIGHT_PX;
  return { topPx, heightPx };
}

export function AppointmentCard({
  appointment,
  offset = 2,
}: {
  appointment: Appointment;
  offset?: number;
}) {
  const updateAppointment = useCalendarStore(
    (state) => state.updateAppointment,
  );
  const [isResizing, setIsResizing] = useState(false);

  const { attributes, listeners, setNodeRef, node, transform, isDragging } =
    useDraggable({
      id: appointment.id + (isResizing ? "-disabled" : ""),

      disabled: isResizing ? true : undefined,
    });
  const { topPx, heightPx } = computePositionAndSize(
    appointment.startTime,
    appointment.endTime,
  );
  const dentist = dentists.find((d) => d.id === appointment.dentistId);

  useEffect(() => {
    if (!node.current) return;

    let timeout: number;

    const observer = new ResizeObserver((_entries, _observer) => {
      setIsResizing(true);

      console.log("resizing");

      clearTimeout(timeout);
      timeout = window.setTimeout(() => setIsResizing(false), 250);

      const newSize = node.current?.clientHeight;
      // const newHeight = newSize - 2 * offset;
      if (!newSize) return;
      const time = addMinutes(
        new Date(appointment.startTime),
        Math.round(newSize / SLOT_HEIGHT_PX) * MINUTES_PER_SLOT,
      );
      console.log("newSize", Math.round(newSize / SLOT_HEIGHT_PX));
      updateAppointment({ ...appointment, endTime: formatISO(time) });
    });

    observer.observe(node.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [node]);

  if (!dentist) {
    return null;
  }

  const HEADER_HEIGHT = 40; // min-h-10 = 40px
  const adjustedTopPx = Math.max(HEADER_HEIGHT, topPx);

  const color = colors[appointment.color];

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "absolute z-30 flex cursor-grab resize-y gap-1 overflow-y-auto rounded border p-1 text-xs active:cursor-grabbing",
        color.bg,
      )}
      style={{
        top: `${adjustedTopPx + offset}px`,
        height: `${heightPx - 2 * offset}px`,
        left: `${offset}px`,
        right: `${offset}px`,
        maxWidth: `calc(100% - ${2 * offset}px)`, // Ensure it doesn't exceed column width
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.9 : 1,
      }}
    >
      <div className={cn("h-full w-1 rounded-full", color.accent)} />
      {appointment.description}
    </div>
  );
}

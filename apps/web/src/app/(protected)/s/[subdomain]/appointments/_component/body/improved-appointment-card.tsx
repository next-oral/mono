"use client";

import { useCallback, useState } from "react";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design/components/ui/dialog";
import { cn } from "@repo/design/lib/utils";

import { MINUTES_PER_SLOT, SLOT_HEIGHT_PX } from "../constants";
import { CustomResizeHandle, TouchResizeHandle } from "./custom-resize-handle";

interface ImprovedAppointmentCardProps {
  appointment: {
    id: string;
    start: Date;
    end: Date;
    description?: string;
    note?: string;
    colour: string;
  };
  offset?: number;
  onResize?: (appointmentId: string, newEndTime: Date) => void;
  onDrag?: (appointmentId: string, newStartTime: Date) => void;
  isDragging?: boolean;
  transform?: { x: number; y: number } | null;
  dragAttributes?: any;
  dragListeners?: any;
  setNodeRef?: (node: HTMLElement | null) => void;
}

export function ImprovedAppointmentCard({
  appointment,
  offset = 2,
  onResize,
  onDrag,
  isDragging = false,
  transform,
  dragAttributes,
  dragListeners,
  setNodeRef,
}: ImprovedAppointmentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleResize = useCallback(
    (newEndTime: Date) => {
      onResize?.(appointment.id, newEndTime);
    },
    [appointment.id, onResize],
  );

  const handleDrag = useCallback(
    (newStartTime: Date) => {
      onDrag?.(appointment.id, newStartTime);
    },
    [appointment.id, onDrag],
  );

  // Calculate position and size based on appointment times
  const startMinutes =
    appointment.start.getHours() * 60 + appointment.start.getMinutes();
  const durationMinutes =
    (appointment.end.getTime() - appointment.start.getTime()) / (1000 * 60);

  const topPx = (startMinutes / MINUTES_PER_SLOT) * SLOT_HEIGHT_PX;
  const heightPx = (durationMinutes / MINUTES_PER_SLOT) * SLOT_HEIGHT_PX;

  const HEADER_HEIGHT = 40;
  const adjustedTopPx = Math.max(HEADER_HEIGHT, topPx);

  // Color mapping (you can expand this)
  const colors = {
    blue: { bg: "bg-blue-100 border-blue-200", accent: "bg-blue-500" },
    green: { bg: "bg-green-100 border-green-200", accent: "bg-green-500" },
    red: { bg: "bg-red-100 border-red-200", accent: "bg-red-500" },
    yellow: { bg: "bg-yellow-100 border-yellow-200", accent: "bg-yellow-500" },
    purple: { bg: "bg-purple-100 border-purple-200", accent: "bg-purple-500" },
    pink: { bg: "bg-pink-100 border-pink-200", accent: "bg-pink-500" },
    orange: { bg: "bg-orange-100 border-orange-200", accent: "bg-orange-500" },
    teal: { bg: "bg-teal-100 border-teal-200", accent: "bg-teal-500" },
    indigo: { bg: "bg-indigo-100 border-indigo-200", accent: "bg-indigo-500" },
    lime: { bg: "bg-lime-100 border-lime-200", accent: "bg-lime-500" },
  };

  const color =
    colors[appointment.colour as keyof typeof colors] || colors.blue;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={setNodeRef}
          {...dragAttributes}
          {...dragListeners}
          className={cn(
            "group absolute z-10 flex cursor-pointer gap-1 overflow-hidden rounded border p-1 text-xs",
            "transition-all duration-200 hover:shadow-md",
            "active:z-20 active:cursor-grabbing",
            color.bg,
            isDragging && "opacity-90 shadow-lg",
          )}
          style={{
            top: `${adjustedTopPx + offset}px`,
            height: `${heightPx - 2 * offset}px`,
            left: `${offset}px`,
            right: `${offset}px`,
            maxWidth: `calc(100% - ${2 * offset}px)`,
            transform: transform
              ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
              : undefined,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Accent bar */}
          <div
            className={cn(
              "h-full w-1 flex-shrink-0 rounded-full",
              color.accent,
            )}
          />

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h4 className="flex items-center gap-1 text-xs font-medium">
              {format(appointment.start, "h:mm a")}{" "}
              <ArrowRight className="size-2 flex-shrink-0" />
              {format(appointment.end, "h:mm a")}
            </h4>
            <div className="truncate text-xs text-gray-600">
              {appointment.description ?? appointment.note}
            </div>
          </div>

          {/* Custom resize handle - only show on hover or when resizing */}
          {(isHovered || isDragging) && onResize && (
            <>
              <CustomResizeHandle
                appointment={appointment}
                onResize={handleResize}
              />
              <TouchResizeHandle
                appointment={appointment}
                onResize={handleResize}
              />
            </>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="p-0">
        <DialogHeader className="sr-only px-4">
          <DialogTitle className="text-left">#{appointment.id}</DialogTitle>
        </DialogHeader>
        {/* Add your appointment details component here */}
        <div className="p-4">
          <h3 className="font-semibold">Appointment Details</h3>
          <p>Start: {format(appointment.start, "h:mm a")}</p>
          <p>End: {format(appointment.end, "h:mm a")}</p>
          <p>Description: {appointment.description ?? appointment.note}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

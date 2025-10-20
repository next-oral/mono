"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addMinutes } from "date-fns";
import { GripHorizontal } from "lucide-react";

import { cn } from "@repo/design/lib/utils";

import { MINUTES_PER_SLOT, SLOT_HEIGHT_PX } from "../constants";

interface CustomResizeHandleProps {
  appointment: {
    id: string;
    start: Date;
    end: Date;
  };
  onResize: (newEndTime: Date) => void;
  className?: string;
}

export function CustomResizeHandle({
  appointment,
  onResize,
  className,
}: CustomResizeHandleProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [startEndTime, setStartEndTime] = useState<Date | null>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      setStartY(e.clientY);
      setStartHeight(handleRef.current?.parentElement?.clientHeight || 0);
      setStartEndTime(appointment.end);
    },
    [appointment.end],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !startEndTime) return;

      const deltaY = e.clientY - startY;
      const newHeight = Math.max(SLOT_HEIGHT_PX, startHeight + deltaY);

      // Snap to slot boundaries
      const slotDelta =
        Math.round(newHeight / SLOT_HEIGHT_PX) -
        Math.round(startHeight / SLOT_HEIGHT_PX);
      const newEndTime = addMinutes(startEndTime, slotDelta * MINUTES_PER_SLOT);

      onResize(newEndTime);
    },
    [isResizing, startY, startHeight, startEndTime, onResize],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setStartEndTime(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={handleRef}
      className={cn(
        "absolute right-0 bottom-0 left-0 h-2 cursor-ns-resize transition-colors group-hover:bg-black/10",
        "flex items-center justify-center",
        isResizing && "bg-blue-500/20",
        className,
      )}
      onMouseDown={handleMouseDown}
    >
      <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="h-1 w-0.5 rounded-full bg-gray-400" />
        <div className="h-1 w-0.5 rounded-full bg-gray-400" />
        <div className="h-1 w-0.5 rounded-full bg-gray-400" />
      </div>
    </div>
  );
}

// Alternative: Touch support for mobile
export function TouchResizeHandle({
  appointment,
  onResize,
  className,
}: CustomResizeHandleProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [startEndTime, setStartEndTime] = useState<Date | null>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      setIsResizing(true);
      setStartY(touch.clientY);
      setStartHeight(handleRef.current?.parentElement?.clientHeight || 0);
      setStartEndTime(appointment.end);
    },
    [appointment.end],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isResizing || !startEndTime) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - startY;
      const newHeight = Math.max(SLOT_HEIGHT_PX, startHeight + deltaY);

      // Snap to slot boundaries
      const slotDelta =
        Math.round(newHeight / SLOT_HEIGHT_PX) -
        Math.round(startHeight / SLOT_HEIGHT_PX);
      const newEndTime = addMinutes(startEndTime, slotDelta * MINUTES_PER_SLOT);

      onResize(newEndTime);
    },
    [isResizing, startY, startHeight, startEndTime, onResize],
  );

  const handleTouchEnd = useCallback(() => {
    setIsResizing(false);
    setStartEndTime(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isResizing, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={handleRef}
      className={cn(
        "absolute right-0 bottom-0 left-0 h-6 cursor-ns-resize transition-colors group-hover:bg-black/10",
        "flex items-center justify-center",
        isResizing && "bg-blue-500/20",
        className,
      )}
      onTouchStart={handleTouchStart}
    >
      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="h-2 w-1 rounded-full bg-gray-400" />
        <div className="h-2 w-1 rounded-full bg-gray-400" />
        <div className="h-2 w-1 rounded-full bg-gray-400" />
      </div>
    </div>
  );
}

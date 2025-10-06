"use client";

import { cn } from "@repo/design/src/lib/utils";

import { SLOT_HEIGHT_PX } from "../constants";

export function CalenderCellLines({
  className,
  style,
  type,
}: {
  type: "hour" | "half-hour";
  className?: string;
  style?: React.CSSProperties;
}) {
  return Array.from({ length: 24 }).map((_, hourIndex) => (
    <div
      key={`h-${hourIndex}`}
      className={cn(
        "border-b",
        type === "half-hour" && "opacity-50",
        className,
      )}
      style={{
        position: "absolute",
        top:
          type === "hour"
            ? `${hourIndex * 4 * SLOT_HEIGHT_PX}px`
            : `${hourIndex * 4 * SLOT_HEIGHT_PX + 2 * SLOT_HEIGHT_PX}px`,
        left: 0,
        right: 0,
        height: type === "hour" ? `${4 * SLOT_HEIGHT_PX}px` : undefined,
        ...style,
      }}
    />
  ));
}

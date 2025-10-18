import { useDroppable } from "@dnd-kit/core";

import { cn } from "@repo/design/lib/utils";

import { SLOT_HEIGHT } from "../constants";
import { useCalendarStore } from "../store/store";

// This component is an overlay (on top of the dentists columns) of the region an appointment can be moved to.
export function SlotDroppable({ id }: { id: string }) {
  const { isDragging } = useCalendarStore();
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      data-slot-id={id}
      className={cn(
        "border-secondary/50 w-full border-b border-dotted transition-colors last:border-b-0",
        isOver && "bg-secondary/40 border-dashed",
        !isDragging && "pointer-events-none", // Disable interactions when not dragging to allow bubbling
      )}
      style={{ height: `${SLOT_HEIGHT}px` }}
    />
  );
}

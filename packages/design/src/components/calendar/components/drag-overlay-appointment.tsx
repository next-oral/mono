import { DragOverlay } from "@dnd-kit/core";

import { cn } from "@repo/design/lib/utils";

import { useCalendarStore } from "../store/store";

export function DragOverlayAppointment() {
  const { findActiveAppointment, getAppointmentWidth, getAppointmentHeight } =
    useCalendarStore();

  return (
    <DragOverlay zIndex={3}>
      {findActiveAppointment() && (
        <div
          className={cn(
            "pointer-events-none flex rounded-md p-2",
            findActiveAppointment()?.color?.stickerColor,
          )}
          style={{
            width:
              typeof getAppointmentWidth() === "string"
                ? getAppointmentWidth()
                : `${getAppointmentWidth()}px`,
            height: getAppointmentHeight(
              String(findActiveAppointment()?.startTime),
              String(findActiveAppointment()?.endTime),
            ),
          }}
        >
          <div
            className={cn(
              "mr-2 w-1 flex-shrink-0 rounded-full",
              findActiveAppointment()?.color?.lineColor,
            )}
          />
          <div className="flex-1 overflow-hidden">
            <div className="text-xs leading-tight font-medium">
              {findActiveAppointment()?.patientName}
            </div>
            <div className="text-xs leading-tight opacity-75">
              {findActiveAppointment()?.startTime} -{" "}
              {findActiveAppointment()?.endTime}
            </div>
          </div>
        </div>
      )}
    </DragOverlay>
  );
}

import { DragOverlay } from "@dnd-kit/core";

import { cn } from "@repo/design/lib/utils";

import { useCalendarStore } from "../store/store";

export function DragOverlayAppointment() {
  const { findActiveAppointment, getAppointmentWidth, getAppointmentHeight } =
    useCalendarStore();

  const appointmentWidth = getAppointmentWidth();
  const activeAppointment = findActiveAppointment();
  return (
    <DragOverlay zIndex={3} className="cursor-grabbing" >
      {activeAppointment && (
        <div
          className={cn(
            "pointer-events-none flex rounded-md p-2",
            activeAppointment.color?.stickerColor,
          )}
          style={{
            width:
              typeof appointmentWidth === "string"
                ? appointmentWidth
                : `${appointmentWidth as string}px`,
            height: getAppointmentHeight(
              String(activeAppointment.startTime),
              String(activeAppointment.endTime),
            ),
          }}
        >
          <div
            className={cn(
              "mr-2 w-1 flex-shrink-0 rounded-full",
              activeAppointment.color?.lineColor,
            )}
          />
          <div className="flex-1 overflow-hidden">
            <div className="text-xs leading-tight font-medium">
              {activeAppointment.patientName}
            </div>
            <div className="text-xs leading-tight opacity-75">
              {activeAppointment.startTime} - {activeAppointment.endTime}
            </div>
          </div>
        </div>
      )}
    </DragOverlay>
  );
}

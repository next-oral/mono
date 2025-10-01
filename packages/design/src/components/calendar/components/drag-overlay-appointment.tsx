import { cn } from "@repo/design/lib/utils";
import { useCalendarStore } from "../store/store";
import { DragOverlay } from "@dnd-kit/core";

export function DragOverlayAppointment() {
    const { findActiveAppointment, getAppointmentWidth, getAppointmentHeight } = useCalendarStore();

    return (
        <DragOverlay zIndex={3} >
            {findActiveAppointment() && (
                <div className={cn("rounded-md p-2 flex pointer-events-none", findActiveAppointment()?.color?.stickerColor)}
                    style={{
                        width: typeof getAppointmentWidth() === "string"
                            ? getAppointmentWidth()
                            : `${getAppointmentWidth()}px`,
                        height: getAppointmentHeight(String(findActiveAppointment()?.startTime), String(findActiveAppointment()?.endTime))
                    }}>
                    <div className={cn("w-1 rounded-full mr-2 flex-shrink-0", findActiveAppointment()?.color?.lineColor)} />
                    <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-medium leading-tight">{findActiveAppointment()?.patientName}</div>
                        <div className="text-xs opacity-75 leading-tight">{findActiveAppointment()?.startTime} - {findActiveAppointment()?.endTime}</div>
                    </div>
                </div>
            )}
        </DragOverlay>
    );
}


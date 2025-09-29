import { useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from "@repo/design/lib/utils";
import type { Appointment } from "@repo/design/types/calendar";
import { useCalendarStore } from "../store/store";
import { CSS } from "@dnd-kit/utilities";

// This component is to display the appointments and allow drag/drop features on it.
export function DraggableAppointment({
    appointment,
    top,
    left,
    width,
    height,
    showFullInfo,
}: {
    appointment: Appointment
    top: number
    left: number
    width: string | number
    height: number
    showFullInfo: boolean
}) {

    const dentists = useCalendarStore(state => state.dentists);
    const activeId = useCalendarStore(state => state.activeId);

    const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
        id: appointment.id,
    })

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: appointment.id,
    })

    const setNodeRef = (node: HTMLElement | null) => {
        setDraggableRef(node)
        setDroppableRef(node)
    }

    // Hide the original while dragging
    if (isDragging || String(activeId) === String(appointment.id)) {
        return null
    }

    const transformStyle = transform ? CSS.Translate.toString(transform) : undefined;

    function handleAppointmentClick(e: React.MouseEvent) {
        console.log(e, appointment)
    }

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="absolute pointer-events-auto"
            style={{
                top: `${top}px`,
                left: `${left}px`,
                width: typeof width === "string" ? width : `${width}px`,
                height: `${height}px`,
                transform: transformStyle,
                zIndex: 2, // Above slots and highlights
            }}
            data-is-appointment="true"  // Marker for event delegation
        >
            <div
                className={cn("rounded-md p-2 cursor-move flex", appointment.color?.stickerColor)}
                style={{
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                }}
                onClick={(e) => handleAppointmentClick(e)}
            >
                <div className={cn("w-1 rounded-full mr-2 flex-shrink-0", appointment.color?.lineColor)} />
                <div className="flex-1 overflow-hidden">
                    {showFullInfo ? (
                        <>
                            <div className="text-xs font-medium leading-tight">Dr. {dentists.find((d) => d.id === appointment.dentistId)?.name.split(" ")[0]} /w {appointment.patientName}</div>
                            <div className="text-xs opacity-75 leading-tight">{appointment.startTime} - {appointment.endTime}</div>
                        </>
                    ) : (
                        <div className="text-xs font-medium leading-tight">{appointment.patientName}</div>
                    )}
                </div>
            </div>
        </div>
    )
}
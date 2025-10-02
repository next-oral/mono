"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import type { Appointment } from "@repo/design/types/calendar";
import { cn, truncateText } from "@repo/design/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { useCalendarStore } from "../store/store";
import { AppointmentDetailsBody } from "./appointment-details-body";
import { DeleteAppointmentDialog } from "./delete-appointment";
import { EditAppointmentDetails } from "./edit-appointment-details";

const patientNote =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?";

/**
 * This component is to display the appointments and allow drag/drop features on it.
 */
export function DraggableAppointment({
  appointment,
  top,
  left,
  width,
  height,
  showFullInfo,
}: {
  appointment: Appointment;
  top: number;
  left: number;
  width: string | number;
  height: number;
  showFullInfo: boolean;
}) {
  const dentists = useCalendarStore((state) => state.dentists);
  const activeId = useCalendarStore((state) => state.activeId);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: appointment.id,
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: appointment.id,
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  // Hide the original while dragging
  if (isDragging || String(activeId) === String(appointment.id)) {
    return null;
  }
  const transformStyle = transform
    ? CSS.Translate.toString(transform)
    : undefined;

  const dentistForThisAppointment = dentists.find(
    (d) => d.id === appointment.dentistId,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className="pointer-events-auto absolute"
          style={{
            top: `${top}px`,
            left: `${left}px`,
            width: typeof width === "string" ? width : `${width}px`,
            height: `${height}px`,
            transform: transformStyle,
            zIndex: 2, // Above slots and highlights
          }}
          data-is-appointment="true" // Marker for event delegation
        >
          <div
            className={cn(
              "flex cursor-move rounded-lg p-2",
              appointment.color?.stickerColor,
            )}
            style={{
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            }}
            // onClick={(e) => handleAppointmentClick(e)}
          >
            <div
              className={cn(
                "mr-2 w-1 flex-shrink-0 rounded-full",
                appointment.color?.lineColor,
              )}
            />
            <div className="flex-1 overflow-hidden">
              {showFullInfo ? (
                <>
                  <h4 className="text-xs leading-tight font-medium">
                    Dr.{" "}
                    {
                      dentists
                        .find((d) => d.id === appointment.dentistId)
                        ?.name.split(" ")[0]
                    }{" "}
                    /w {appointment.patientName}
                  </h4>
                  <p className="text-xs leading-tight opacity-75">
                    {appointment.startTime} - {appointment.endTime}
                  </p>
                </>
              ) : (
                <div className="text-xs leading-tight font-medium">
                  {truncateText(appointment.patientName, 15)}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-sm px-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Appointment on {appointment.date}</DialogTitle>
          <DialogDescription>
            Appointment of Dr. {dentistForThisAppointment?.name} with{" "}
            {appointment.patientName}
          </DialogDescription>
        </DialogHeader>

        <AppointmentDetailsBody
          appointment={appointment}
          dentistForThisAppointment={dentistForThisAppointment}
          patientNote={patientNote}
        />

        <DialogFooter className="flex flex-row flex-nowrap px-4 *:flex-1">
          <DeleteAppointmentDialog />
          <EditAppointmentDetails />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

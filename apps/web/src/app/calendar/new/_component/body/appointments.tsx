"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { addMinutes, format, formatISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/src/components/ui/avatar";
import { Button } from "@repo/design/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design/src/components/ui/dialog";
import { cn } from "@repo/design/src/lib/utils";

import type { Appointment, AppointmentGroup } from "../types";
import { dentists, MINUTES_PER_SLOT, SLOT_HEIGHT_PX } from "../constants";
import { useCalendarStore } from "../store";
import { colors } from "../types";

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

export function DayViewAppointmentCard({
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
        "absolute z-10 flex cursor-grab resize-y gap-1 overflow-y-auto rounded border p-1 text-xs active:cursor-grabbing",
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

export function WeekViewAppointmentCard({
  group,
  offset = 2,
}: {
  group: AppointmentGroup;
  offset?: number;
}) {
  const [appointmentStep, setAppointmentStep] = useState(0);
  const text = `${group.appointments.length} Scheduled Appointment${group.appointments.length > 1 ? "s" : ""}`;
  const duration = `${format(group.startTime, "hh:mm a")} - ${format(group.endTime, "hh:mm a")}`;
  const dentistsIds = group.appointments.map(
    (appointment) => appointment.dentistId,
  );
  const uniqueDentists = [...new Set(dentistsIds)];

  const { topPx, heightPx } = computePositionAndSize(
    group.startTime,
    group.endTime,
  );

  const HEADER_HEIGHT = 40; // min-h-10 = 40px
  const adjustedTopPx = Math.max(HEADER_HEIGHT, topPx);

  useLayoutEffect(() => {
    setAppointmentStep(0);
  }, []);

  function getDentistAvatar() {
    return (
      <div className="flex">
        {dentists
          .filter((dentist) => uniqueDentists.includes(dentist.id))
          .map((dentist, index) => (
            <Avatar
              key={index}
              className={`border-popover relative size-5 border-2 bg-blue-300 uppercase dark:bg-blue-700 ${index > 0 ? "-ml-2.5" : ""}`}
              style={{ zIndex: 10 - index }}
            >
              <AvatarImage src={dentist.avatar} />
              <AvatarFallback>{dentist.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))
          .slice(0, 9)}
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="pointer-events-auto absolute z-10 overflow-y-hidden"
          style={{
            top: `${adjustedTopPx + offset}px`,
            height: `${heightPx - 2 * offset}px`,
            left: `${offset}px`,
            right: `${offset}px`,
            maxWidth: `calc(100% - ${2 * offset}px)`, // Ensure it doesn't exceed column width
          }}
          // data-is-appointment="true"
        >
          <div
            className="flex cursor-pointer gap-1 rounded-lg bg-slate-50 p-2 shadow-sm dark:bg-slate-950 dark:shadow-slate-400"
            style={{
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <div className="flex flex-col gap-[0.2px]">
              {group.appointments.map((appointment, index) => (
                <span
                  key={index}
                  className={cn(
                    "w-1 flex-1 flex-shrink-0 rounded-lg",
                    colors[appointment.color].accent,
                  )}
                ></span>
              ))}
            </div>
            {/* {showFullInfo ? ( */}
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <h4 className="text-xs leading-tight font-medium">{text}</h4>
                <p className="text-[12px] leading-tight font-medium opacity-50">
                  {duration}
                </p>
              </div>

              {getDentistAvatar()}
            </div>
            {/* ) : (
              <div className="flex flex-col gap-1">
                <h4 className="text-xs leading-tight font-medium">
                  {truncateText(text, 15)}
                </h4>
                <p className="text-[12px] leading-tight font-medium opacity-50">
                  {truncateText(duration, 15)}
                </p>
              </div>
            )} */}
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="px-0">
        <DialogHeader className="px-4">
          <DialogTitle className="text-left">
            Appointment#{appointmentStep + 1}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        {/* {group.appointments[appointmentStep] ? (
          <AppointmentDetailsBody
            appointment={group.appointments[appointmentStep]}
            dentistForThisAppointment={dentistSample.find(
              (d) => d.id === group.appointments[appointmentStep]?.dentistId,
            )}
            patientNote={patientNote}
          />
        ) : (
          <div>No appointment details available.</div>
        )} */}

        <DialogFooter className="flex flex-row flex-wrap justify-between px-2 sm:px-4">
          <div className="flex items-center gap-1 text-sm">
            <Button
              variant={"outline"}
              size={"icon"}
              className="px-1 [&>svg]:size-0.5"
              onClick={() => {
                if (appointmentStep !== 0)
                  setAppointmentStep((prev) => prev - 1);
              }}
              aria-label="previous appointment"
              disabled={appointmentStep === 0}
            >
              <ChevronLeft />
            </Button>
            <span>
              {appointmentStep + 1}/{group.appointments.length}
            </span>
            <Button
              variant={"outline"}
              size={"icon"}
              className="px-1 [&>svg]:size-0.5"
              onClick={() => {
                if (appointmentStep <= group.appointments.length)
                  setAppointmentStep((prev) => prev + 1);
              }}
              aria-label="next appointment"
              disabled={appointmentStep + 1 === group.appointments.length}
            >
              <ChevronRight />
            </Button>
          </div>

          <div className="flex gap-2">
            {/* {group.appointments[appointmentStep] && <EditAppointmentDetails />} */}
            {/* <DeleteAppointmentDialog
              triggerInner={"icon"}
              triggerClassName="rounded-lg bg-destructive/20 border-none text-destructive hover:text-destructive hover:bg-destructive/40"
            /> */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

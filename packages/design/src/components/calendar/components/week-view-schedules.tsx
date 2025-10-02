"use client";

import { useLayoutEffect, useState } from "react";

import type { AppointmentGroup } from "@repo/design/types/calendar";
import { cn, truncateText } from "@repo/design/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { dentistSample } from "../dummy";

/**
 * This component is for the summary schedules within a day in the week
 */
export function WeekViewSchedules({
  group,
  top,
  left,
  width,
  height,
  showFullInfo,
}: {
  group: AppointmentGroup;
  top: number;
  left: number;
  width: string | number;
  height: number;
  showFullInfo: boolean;
}) {
  const [appointmentStep, setAppointmentStep] = useState(1);

  const text = `${group.appointments.length} Scheduled Appointment${group.appointments.length > 1 ? "s" : ""}`;
  const duration = `${group.startTime} - ${group.endTime}`;
  const dentists = group.appointments.map(
    (appointment) => appointment.dentistId,
  );

  const uniqueDentists = [...new Set(dentists)];

  useLayoutEffect(() => {
    setAppointmentStep(1);
  }, []);

  function getDentistAvatar() {
    return (
      <div className="flex">
        {dentistSample
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
          className="pointer-events-auto absolute"
          style={{
            top: `${top}px`,
            left: `${left}px`,
            width: typeof width === "string" ? width : `${width}px`,
            height: `${height}px`,
            zIndex: 2, // Above slots and highlights
          }}
          data-is-appointment="false"
        >
          <div
            className="flex gap-1 rounded-lg bg-slate-100 p-2 shadow-sm dark:bg-slate-900 dark:shadow-slate-400"
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
                    appointment.color?.lineColor,
                  )}
                ></span>
              ))}
            </div>
            {showFullInfo ? (
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs leading-tight font-medium">{text}</h4>
                  <p className="text-[12px] leading-tight font-medium opacity-50">
                    {duration}
                  </p>
                </div>

                {getDentistAvatar()}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <h4 className="text-xs leading-tight font-medium">
                  {truncateText(text, 15)}
                </h4>
                <p className="text-[12px] leading-tight font-medium opacity-50">
                  {truncateText(duration, 15)}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appointment#{appointmentStep}</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

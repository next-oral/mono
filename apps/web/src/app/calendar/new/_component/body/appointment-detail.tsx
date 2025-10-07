"use client";

import { useState } from "react";
import { format, intervalToDuration } from "date-fns";
import {
  ArrowRight,
  Maximize2,
  Minimize2,
  Notebook,
  Repeat1,
  TimerIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/components/ui/avatar";
import { Button } from "@repo/design/components/ui/button";
import { ScrollArea } from "@repo/design/components/ui/scroll-area";
import {
  convert24hTo12h,
  getScheduleDuration,
} from "@repo/design/lib/calendar";
import { cn } from "@repo/design/lib/utils";

import type { Appointment, Dentist } from "../types";

interface AppointmentDetailsBodyProps {
  appointment: Appointment;
  dentistForThisAppointment: Dentist | undefined;
  patientNote: string;
}

export function AppointmentDetailsBody({
  appointment,
  dentistForThisAppointment,
  patientNote,
}: AppointmentDetailsBodyProps) {
  const [noteExtended, setIsNoteExtended] = useState(false);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // 'Mon'
    day: "numeric", // '11'
    month: "short", // 'Jul'
    year: "numeric", // '2025'
  };

  // Parse "YYYY-MM-DD" into a UTC date to avoid local TZ shifting (e.g. negative timezones)
  const readableDate = (() => {
    if (typeof appointment.date === "string") {
      const parts = appointment.date.split("-");
      if (parts.length === 3) {
        const [y, m, d] = parts.map((p) => Number(p));
        if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
          const utc = new Date(Date.UTC(Number(y), Number(m) - 1, d));
          return utc.toLocaleDateString("en-US", options);
        }
      }
    }
    // Fallback
    return new Date(appointment.date).toLocaleDateString("en-US", options);
  })();

  const interval = intervalToDuration({
    start: appointment.startTime,
    end: appointment.endTime,
  });
  const scheduleDuration = `${interval.days ? interval.days + "D" : ""} ${interval.hours ? interval.hours + "h" : ""} ${interval.minutes ? interval.minutes + "m" : ""}`;

  return (
    <ScrollArea className="max-h-[80vh]">
      <div className="flex flex-col pt-2">
        <div className="flex flex-col px-4 py-5">
          <strong className="text-[9px] leading-4 text-slate-400 uppercase dark:text-slate-600">
            Appointment Title
          </strong>
          <div className="mt-1 flex items-end justify-between">
            <div className="flex flex-col">
              <div className="flex flex-1">
                <Avatar
                  className={
                    "border-popover relative z-10 size-10 border-2 bg-blue-300 uppercase dark:bg-blue-700"
                  }
                >
                  <AvatarImage src={dentistForThisAppointment?.avatar} />
                  <AvatarFallback>
                    {dentistForThisAppointment?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Avatar
                  className={
                    "border-popover relative -ml-4 size-10 border-2 bg-blue-300 uppercase dark:bg-blue-700"
                  }
                >
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {dentistForThisAppointment?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h2 className="max-w-[180px] text-base">
                Dr.{" "}
                <span className="capitalize">
                  {" "}
                  {dentistForThisAppointment?.name}
                </span>{" "}
                with{" "}
                <span className="capitalize">{appointment.patientName} </span>
              </h2>
            </div>

            <div className="">
              <Button variant={"outline"} className="flex-1">
                Patient Details
              </Button>
            </div>
          </div>
        </div>
        <hr />
        <div className="flex flex-col px-4 py-5">
          <strong className="text-[9px] text-slate-400 uppercase dark:text-slate-600">
            Date & Time
          </strong>
          <div className="flex justify-between">
            <h4 className="flex items-center gap-1 text-sm">
              {format(appointment.startTime, "h:mm a")}{" "}
              <ArrowRight className="size-2" />
              {format(appointment.endTime, "h:mm a")}
            </h4>

            <div className="flex items-center text-sm">
              <TimerIcon className="size-3.5" />
              {scheduleDuration}
            </div>
          </div>
          <div className="mt-1 flex justify-between">
            <h4 className="text-foreground/80 text-sm">{readableDate}</h4>

            <div className="flex items-center gap-0.5 text-[10px]">
              <Repeat1 className="size-3.5" /> One Off
            </div>
          </div>
        </div>
        <hr />
        <div className="mt-5 px-4">
          <div className="bg-secondary relative rounded-lg p-3">
            <header className="flex justify-between">
              <span className="flex items-center gap-0.5 text-sm">
                <Notebook className="size-4" /> Patient Note
              </span>

              <Button
                variant={"ghost"}
                className="[&>svg]:size-2"
                onClick={() => setIsNoteExtended((prev) => !prev)}
                aria-label={noteExtended ? "Minimize" : "Maximize"}
              >
                {noteExtended ? <Minimize2 /> : <Maximize2 />}
              </Button>
            </header>
            <p
              className={cn(
                "text-xs opacity-80 transition-all duration-700 ease-in-out",
              )}
            >
              {patientNote.slice(0, noteExtended ? patientNote.length : 220)}
            </p>
            <div
              className={cn(
                "bg-background absolute right-0 bottom-0 left-0 h-[20px] w-full opacity-75 backdrop-blur-lg transition duration-200",
                { hidden: noteExtended },
              )}
            ></div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

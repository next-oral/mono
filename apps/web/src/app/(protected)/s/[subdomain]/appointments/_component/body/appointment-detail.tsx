"use client";

import { useState } from "react";
import Link from "next/link";
import { useZero } from "@rocicorp/zero/react";
import { format, intervalToDuration } from "date-fns";
import {
  ArrowRight,
  Maximize2,
  Minimize2,
  Notebook,
  Repeat1,
  TimerIcon,
  Trash2,
} from "lucide-react";
import { createParser, useQueryState } from "nuqs";

import type { Mutators } from "@repo/zero/src/mutators";
import type { Appointment, Schema } from "@repo/zero/src/schema";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/components/ui/avatar";
import { Button } from "@repo/design/components/ui/button";
import { ScrollArea } from "@repo/design/components/ui/scroll-area";
import { cn } from "@repo/design/lib/utils";

import { useZeroQuery } from "~/providers/zero";
import { AppointmentCrudSheet } from "../header/new-appointment";

interface AppointmentDetailsBodyProps {
  appointment: Appointment;
}
const customQueryParser = createParser<"new" | "edit">({
  parse: (value): "new" | "edit" => (value === "edit" ? "edit" : "new"),
  serialize: (value) => (value === "new" ? "" : value),
});
export function AppointmentDetailsBody({
  appointment,
}: AppointmentDetailsBodyProps) {
  const [noteExtended, setIsNoteExtended] = useState(false);

  const z = useZero<Schema, Mutators>();

  const [apptType, setApptType] = useQueryState("type", customQueryParser);

  const { data: dentist } = useZeroQuery(
    z.query.dentist.where("id", "=", appointment.dentistId).one(),
  );
  const { data: patient } = useZeroQuery(
    z.query.patient.where("id", "=", appointment.patId).one(),
  );
  function deleteAppointment() {
    z.mutate.appointment.delete({
      id: appointment.id,
    });
  }

  const interval = intervalToDuration({
    start: appointment.start,
    end: appointment.end,
  });
  const scheduleDuration = `${interval.days ? interval.days + "D" : ""} ${interval.hours ? interval.hours + "h" : ""} ${interval.minutes ? interval.minutes + "m" : ""}`;

  if (!dentist || !patient) return null;

  return (
    <ScrollArea className="max-h-2xl p-2">
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
                  <AvatarImage src={dentist.lastName} />
                  <AvatarFallback>{dentist.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <Avatar className="border-popover relative -ml-4 size-10 border-2 bg-blue-300 uppercase dark:bg-blue-700">
                  <AvatarImage src="" />
                  <AvatarFallback>{dentist.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <h2 className="max-w-[180px] text-base">
                Dr.{" "}
                <span className="capitalize">
                  {" "}
                  {dentist.firstName} {dentist.lastName}
                </span>{" "}
                with{" "}
                <span className="capitalize">
                  {patient.firstName} {patient.lastName}{" "}
                </span>
              </h2>
            </div>

            <div className="">
              <Link href={`/patients/${patient.id}`}>
                <Button variant={"outline"} className="flex-1">
                  Patient Details
                </Button>
              </Link>
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
              {format(appointment.start, "h:mm a")}{" "}
              <ArrowRight className="size-2" />
              {format(appointment.end, "h:mm a")}
            </h4>

            <div className="flex items-center text-sm">
              <TimerIcon className="size-3.5" />
              {scheduleDuration}
            </div>
          </div>
          <div className="mt-1 flex justify-between">
            <h4 className="text-foreground/80 text-sm">
              {format(appointment.start, "MMM d, yyyy")}
            </h4>

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
              {appointment.description?.slice(
                0,
                noteExtended ? appointment.description.length : 120,
              )}
            </p>
            <div
              className={cn(
                "bg-background absolute right-0 bottom-0 left-0 h-[20px] w-full opacity-75 backdrop-blur-lg transition duration-200",
                { hidden: noteExtended },
              )}
            />
          </div>
        </div>
        <div className="my-2 mt-5 flex w-full gap-2 px-6">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={deleteAppointment}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
          <AppointmentCrudSheet
            type="edit"
            data={appointment}
            onClick={() => setApptType("edit")}
          />
        </div>
      </div>
    </ScrollArea>
  );
}

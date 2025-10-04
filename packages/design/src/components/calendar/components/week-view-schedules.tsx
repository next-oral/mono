"use client";

import { useLayoutEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { AppointmentGroup } from "@repo/design/types/calendar";
import { cn, truncateText } from "@repo/design/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { dentistSample } from "../dummy";
import { AppointmentDetailsBody } from "./appointment-details-body";
import { DeleteAppointmentDialog } from "./delete-appointment";
import { EditAppointmentDetails } from "./edit-appointment-details";

const patientNote =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?";

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
  const [appointmentStep, setAppointmentStep] = useState(0);

  const text = `${group.appointments.length} Scheduled Appointment${group.appointments.length > 1 ? "s" : ""}`;
  const duration = `${group.startTime} - ${group.endTime}`;
  const dentists = group.appointments.map(
    (appointment) => appointment.dentistId,
  );

  const uniqueDentists = [...new Set(dentists)];

  useLayoutEffect(() => {
    setAppointmentStep(0);
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
          data-is-appointment="true"
        >
          <div
            className="flex cursor-pointer gap-1 rounded-lg bg-slate-100 p-2 shadow-sm dark:bg-slate-900 dark:shadow-slate-400"
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

      <DialogContent className="px-0">
        <DialogHeader className="px-4">
          <DialogTitle className="text-left">
            Appointment#{appointmentStep + 1}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        {group.appointments[appointmentStep] ? (
          <AppointmentDetailsBody
            appointment={group.appointments[appointmentStep]}
            dentistForThisAppointment={dentistSample.find(
              (d) => d.id === group.appointments[appointmentStep]?.dentistId,
            )}
            patientNote={patientNote}
          />
        ) : (
          <div>No appointment details available.</div>
        )}

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
            {group.appointments[appointmentStep] && <EditAppointmentDetails />}
            <DeleteAppointmentDialog
              triggerInner={"icon"}
              triggerClassName="rounded-lg bg-destructive/20 border-none text-destructive hover:text-destructive hover:bg-destructive/40"
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

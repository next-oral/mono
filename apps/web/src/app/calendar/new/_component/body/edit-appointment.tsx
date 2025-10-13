import React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/design/src/components/ui/sheet";
import { formatPossessiveName } from "@repo/design/src/lib/utils";

import { dentists } from "../constants";
import { AppointmentForm } from "../header/appointment-form";
import { Appointment } from "../types";

interface EditAppointmentProps {
  triggerChild: React.ReactNode;
  appointment: Appointment;
}

export function EditAppointment({
  triggerChild,
  appointment,
}: EditAppointmentProps) {
  const dentist = dentists.find(({ id }) => id == appointment.dentistId);
  // const patient = patients.find(({ id }) => id == appointment.patientId);
  return (
    <Sheet>
      <SheetTrigger asChild>{triggerChild}</SheetTrigger>
      <SheetContent className="px-0 max-sm:w-full">
        <SheetHeader className="px-0">
          <div className="flex flex-col gap-1 px-2 pb-2 sm:px-4">
            <SheetTitle>Edit Appointment</SheetTitle>
            <SheetDescription>
              Dr.{" "}
              <span className="font-semibold capitalize">
                {formatPossessiveName(String(dentist?.name))}
              </span>{" "}
              appointment with{" "}
              <span className="font-semibold capitalize">
                {appointment.patientName}
              </span>
            </SheetDescription>
          </div>
          <hr />
        </SheetHeader>

        <AppointmentForm
          page="edit"
          initialValues={{
            date: appointment.date,
            dentistId: String(appointment.dentistId),
            notes: appointment.description,
            patientId: appointment.patientId,
            time: {
              from: appointment.startTime,
              to: appointment.endTime,
            },
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

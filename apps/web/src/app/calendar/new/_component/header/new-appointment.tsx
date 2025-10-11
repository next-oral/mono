import { useEffect } from "react";

import { Button } from "@repo/design/src/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/design/src/components/ui/sheet";

import { useCalendarStore } from "../store";
import { getTimeStringFromTop } from "../utils";
import { AppointmentForm } from "./appointment-form";

export function NewAppointment() {
  const highlight = useCalendarStore((state) => state.highlight);
  const showNewAppointmentDialog = useCalendarStore(
    (state) => state.showNewAppointmentDialog,
  );
  const setShowNewAppointmentDialog = useCalendarStore(
    (state) => state.setShowNewAppointmentDialog,
  );
  const clearHighlight = useCalendarStore((state) => state.clearHighlight);

  const timeString = getTimeStringFromTop(
    Number(highlight.rect?.top),
    Number(highlight.rect?.height),
    highlight.currentDate,
  );

  useEffect(() => {
    if (!showNewAppointmentDialog) clearHighlight();
  }, [showNewAppointmentDialog]);
  return (
    <Sheet
      open={showNewAppointmentDialog}
      onOpenChange={setShowNewAppointmentDialog}
    >
      <SheetTrigger asChild>
        <Button>New Appointment</Button>
      </SheetTrigger>
      <SheetContent className="px-0">
        <SheetHeader className="px-0">
          <SheetTitle className="px-2 pb-3">New Appointment</SheetTitle>
          <SheetDescription className="sr-only">
            Create a new Appointment
          </SheetDescription>
          <hr />
        </SheetHeader>

        <AppointmentForm
          initialValues={{
            dentistId: String(highlight.dentistId),
            date: highlight.currentDate.toISOString(),
            time: {
              from: timeString?.startStr,
              to: timeString?.endStr,
            },
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

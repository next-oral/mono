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

export function NewAppointment() {
  const showNewAppointmentDialog = useCalendarStore(
    (state) => state.showNewAppointmentDialog,
  );
  const setShowNewAppointmentDialog = useCalendarStore(
    (state) => state.setShowNewAppointmentDialog,
  );
  const clearHighlight = useCalendarStore((state) => state.clearHighlight);

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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Appointment</SheetTitle>
          <SheetDescription>Create a new Appointment</SheetDescription>
        </SheetHeader>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

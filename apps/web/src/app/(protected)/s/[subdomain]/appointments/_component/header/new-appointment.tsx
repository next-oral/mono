import { addMinutes, format, startOfDay } from "date-fns";

import type { Appointment } from "@repo/zero/src/schema";
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

import { AppointmentForm } from "../body/appointment-form";
import { MINUTES_PER_SLOT, SLOT_HEIGHT_PX } from "../constants";
import { useCalendarStore } from "../store";

export function getTimeStringFromTop(
  topPx: number | null,
  heightPx: number | null,
  currentDate: Date,
) {
  if (!isNaN(Number(topPx)) && !isNaN(Number(heightPx))) {
    const startMinutes = (Number(topPx) / SLOT_HEIGHT_PX) * MINUTES_PER_SLOT;
    const endMinutes =
      ((Number(topPx) + Number(heightPx)) / SLOT_HEIGHT_PX) * MINUTES_PER_SLOT;

    const dayStart = startOfDay(currentDate);
    const startDate = addMinutes(dayStart, startMinutes);
    const endDate = addMinutes(dayStart, endMinutes);

    return {
      startStr: format(startDate, "h:mm a"),
      endStr: format(endDate, "h:mm a"),
    };
  }
}

interface New {
  type: "new";
}
interface Edit {
  type: "edit";
  data: Appointment;
}
type AppointmentCrudSheet = (New | Edit) & { onClick?: () => void };

export function AppointmentCrudSheet(props: AppointmentCrudSheet) {
  const highlight = useCalendarStore((state) => state.highlight);

  const timeString = getTimeStringFromTop(
    Number(highlight.rect?.top),
    Number(highlight.rect?.height),
    highlight.currentDate,
  );

  const showAppointmentSheet = useCalendarStore(
    (state) => state.showAppointmentSheet,
  );
  const setShowAppointmentSheet = useCalendarStore(
    (state) => state.setShowAppointmentSheet,
  );

  const initialValues = {
    id: props.type === "edit" ? props.data.id : undefined,
    dentistId:
      props.type === "edit" ? props.data.dentistId : highlight.dentistId,
    patientId: props.type === "edit" ? props.data.patId : undefined,
    type: props.type === "edit" ? (props.data.type ?? undefined) : undefined,
    colour: props.type === "edit" ? props.data.colour : undefined,
    date:
      props.type === "edit"
        ? new Date(props.data.start).toISOString()
        : undefined,
    time: {
      from:
        props.type === "edit"
          ? format(props.data.start, "h:mm a")
          : timeString?.startStr,
      to:
        props.type === "edit"
          ? format(props.data.end, "h:mm a")
          : timeString?.endStr,
    },
  };

  return (
    <Sheet open={showAppointmentSheet} onOpenChange={setShowAppointmentSheet}>
      <SheetTrigger asChild>
        <Button
          onClick={props.onClick}
          className="flex-1"
          variant={props.type === "new" ? "default" : "secondary"}
        >
          {props.type === "new" ? "New Appointment" : "Edit Appointment"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {props.type === "new" ? "New Appointment" : "Edit Appointment"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {props.type === "new"
              ? "Create a new Appointment"
              : "Edit an Appointment"}
          </SheetDescription>
          <hr />
        </SheetHeader>

        <AppointmentForm
          initialValues={initialValues}
          onSubmit={() => setShowAppointmentSheet(false)}
        >
          {({ onSubmit }) => (
            <SheetFooter className="flex flex-row gap-2">
              <Button className="flex-1" onClick={onSubmit}>
                {props.type === "new"
                  ? "Create Appointment"
                  : "Update Appointment"}
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          )}
        </AppointmentForm>
      </SheetContent>
    </Sheet>
  );
}

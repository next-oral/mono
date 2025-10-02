import { Button } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";

// interface EditAppointmentDetailsProps {
//     appointment: Appointment
// }

export function EditAppointmentDetails(/*{ appointment }: EditAppointmentDetailsProps*/) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"secondary"}>Edit</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Appointment</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

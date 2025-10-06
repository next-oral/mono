import { Button } from "@repo/design/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/design/src/components/ui/sheet";

export function NewAppointment() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>New Appointment</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Appointment</SheetTitle>
          <SheetDescription>Create a new Appointment</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

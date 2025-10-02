import { Button } from "@repo/design/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/design/components/ui/dialog";

import { useCalendarStore } from "../../store/store";

export function CreateAppointmentDialog() {
  const { showNewAppointmentDialog, setShowNewAppointmentDialog } =
    useCalendarStore();
  const handleNewAppointmentDialogClose = () =>
    setShowNewAppointmentDialog(false);

  return (
    <Dialog
      open={showNewAppointmentDialog}
      onOpenChange={handleNewAppointmentDialogClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>New appointment dialog content will be implemented here.</p>
          <Button onClick={handleNewAppointmentDialogClose} className="mt-4">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@repo/design/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/design/components/ui/dialog";

import { useCalendarStore } from "../../store/store";

export function AppointmentEditDialog() {
  const {
    showEditAppointmentDialog,
    setShowEditAppointmentDialog,
    setSelectedAppointment,
  } = useCalendarStore();

  const handleEditAppointmentDialogClose = () => {
    setShowEditAppointmentDialog(false);
    setSelectedAppointment(null);
  };

  return (
    <Dialog
      open={showEditAppointmentDialog}
      onOpenChange={handleEditAppointmentDialogClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Edit appointment dialog content will be implemented here.</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => handleEditAppointmentDialogClose()}>
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => handleEditAppointmentDialogClose()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import type { ClassValue } from "class-variance-authority/types";
import { Trash2 } from "lucide-react";

import { cn } from "@repo/design/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";

interface DeleteAppointmentDialogProps {
  // appointment: Appointment,
  triggerClassName?: ClassValue;
  triggerInner?: "icon" | "text";
}

export function DeleteAppointmentDialog({
  triggerClassName = "",
  triggerInner = "text",
}: DeleteAppointmentDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className={cn(triggerClassName)}>
          {triggerInner === "text" ? "Delete" : <Trash2 />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="sr-only">
          <AlertDialogTitle>Delete This Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            Confirm Appointment delete
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mx-auto my-5 flex flex-col items-center">
          <span className="border-destructive text-destructive bg-destructive/20 shadow-accent-foreground/40 rounded-xl border-2 p-3 shadow-sm">
            <Trash2 />
          </span>

          <h2 className="mt-3 max-w-sm text-center">
            Are you sure you want to delete this appointment?
          </h2>
        </div>

        <AlertDialogFooter className="flex flex-row border-t pt-2">
          <AlertDialogAction asChild>
            <Button variant="destructive" className="flex-1">
              Yes, Delete
            </Button>
          </AlertDialogAction>

          <AlertDialogCancel asChild>
            <Button variant="secondary" className="flex-1">
              No, Cancel
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

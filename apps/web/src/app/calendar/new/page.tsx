"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";

import {
  ScrollArea,
  ScrollBar,
} from "@repo/design/src/components/ui/scroll-area";

import type { Appointment } from "./_component/types";
import { DayView } from "./_component/body/day-view";
import { TimeLabels } from "./_component/body/time-labels";
import { WeekView } from "./_component/body/week-view";
import { MINUTES_PER_SLOT, SLOT_HEIGHT_PX } from "./_component/constants";
import { CalendarHeader } from "./_component/header";
import { useCalendarStore } from "./_component/store";

function checkAppointmentOverlap(
  appointment1: Appointment,
  appointment2: Appointment,
): boolean {
  const start1 = new Date(appointment1.startTime);
  const end1 = new Date(appointment1.endTime);
  const start2 = new Date(appointment2.startTime);
  const end2 = new Date(appointment2.endTime);

  // Check if appointments overlap
  // Two appointments overlap if one starts before the other ends
  return start1 < end2 && start2 < end1;
}

function hasCollision(
  newAppointment: Appointment,
  existingAppointments: Appointment[],
): boolean {
  return existingAppointments.some((existing) => {
    // Skip the same appointment (when moving within the same dentist)
    if (existing.id === newAppointment.id) return false;

    // Only check appointments for the same dentist
    if (existing.dentistId !== newAppointment.dentistId) return false;

    return checkAppointmentOverlap(newAppointment, existing);
  });
}

export default function AppointmentPage() {
  return <Calendar />;
}

function Calendar() {
  // const [items, setItems] = useState<Appointment[]>(appointments);
  const appointments = useCalendarStore((state) => state.appointments);
  const updateAppointment = useCalendarStore(
    (state) => state.updateAppointment,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;
    if (!over) return;

    const draggedId = Number(active.id);
    const overId = String(over.id);
    const isDentistTarget = overId.startsWith("dentist-");
    const targetDentistId = isDentistTarget
      ? Number(overId.replace("dentist-", ""))
      : NaN;

    const item = appointments.find((a) => a.id === draggedId);

    if (!item) return;
    const minutesDelta =
      Math.round(delta.y / SLOT_HEIGHT_PX) * MINUTES_PER_SLOT;

    const start = new Date(item.startTime);
    const end = new Date(item.endTime);
    const newStart = new Date(start.getTime());
    const newEnd = new Date(end.getTime());
    newStart.setMinutes(start.getMinutes() + minutesDelta);
    newEnd.setMinutes(end.getMinutes() + minutesDelta);

    const newAppointment = {
      ...item,
      dentistId: Number.isNaN(targetDentistId)
        ? item.dentistId
        : targetDentistId,
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
    };

    //   // Check for collisions before updating
    if (hasCollision(newAppointment, appointments)) {
      console.warn("Cannot move appointment: time slot is already occupied");
      return;
    }

    updateAppointment(newAppointment);
  }

  return (
    <div className="h-screen w-full p-2">
      <CalendarHeader />
      <div className="border-b" />
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToFirstScrollableAncestor]}
      >
        <ScrollArea className="h-screen w-full flex-row">
          <div className="relative flex">
            <div className="bg-background sticky top-0 left-0 z-30 flex w-20 items-center justify-center">
              <TimeLabels />
            </div>
            <DayView />
            <WeekView />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DndContext>
    </div>
  );
}

"use client";

import type { DragEndEvent, DragMoveEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { useZero } from "@rocicorp/zero/react";

import type { Mutators } from "@repo/zero/src/mutators";
import type { Appointment, Schema } from "@repo/zero/src/schema";
import {
  ScrollArea,
  ScrollBar,
} from "@repo/design/src/components/ui/scroll-area";

import { authClient } from "~/auth/client";
import { useZeroQuery } from "~/providers/zero";
import { DayView } from "./_component/body/day-view";
import { DragTimeIndicator } from "./_component/body/indicators";
import { TimeLabels } from "./_component/body/time-labels";
import { WeekView } from "./_component/body/week-view";
import { MINUTES_PER_SLOT, SLOT_HEIGHT_PX } from "./_component/constants";
import { CalendarHeader } from "./_component/header";
import { buildQuery } from "./_component/query";
import { useCalendarStore } from "./_component/store";

function checkAppointmentOverlap(
  first: Appointment,
  second: Appointment,
): boolean {
  const start1 = first.start;
  const end1 = first.end;
  const start2 = second.start;
  const end2 = second.end;

  // Check if appointments overlap
  // Two appointments overlap if one starts before the other ends
  return start1 < end2 && start2 < end1;
}

function calculateAppointment(
  overId: string,
  delta: number,
  item: Appointment,
) {
  const minutesDelta = Math.round(delta / SLOT_HEIGHT_PX) * MINUTES_PER_SLOT;
  const isDentistTarget = overId.startsWith("dentist-");
  const targetDentistId = isDentistTarget ? overId.replace("dentist-", "") : "";

  const start = new Date(item.start);
  const end = new Date(item.end);
  const newStart = new Date(start.getTime());
  const newEnd = new Date(end.getTime());
  newStart.setMinutes(start.getMinutes() + minutesDelta);
  newEnd.setMinutes(end.getMinutes() + minutesDelta);

  const newAppointment = {
    ...item,
    dentistId: !targetDentistId ? item.dentistId : targetDentistId,
    start: newStart.getTime(),
    end: newEnd.getTime(),
  } satisfies Appointment;

  return newAppointment;
}

function hasCollision(
  newAppointment: Appointment,
  existingAppointments: Appointment[],
): boolean {
  return existingAppointments.some((existing) => {
    // Skip the same appointment (when moving within the same dentist)
    if (existing.id === newAppointment.id) return false;

    if (existing.dentistId !== newAppointment.dentistId) return false;

    return checkAppointmentOverlap(newAppointment, existing);
  });
}

export default function AppointmentPage() {
  return <Calendar />;
}

function Calendar() {
  const z = useZero<Schema, Mutators>();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();
  const orgId = activeOrganization?.id ?? organizations?.[0]?.id ?? "";

  const currentDate = useCalendarStore((state) => state.currentDate);

  const { data: dentists } = useZeroQuery(buildQuery(z, currentDate, orgId));

  const appointments = dentists.flatMap((dentist) => dentist.appointments);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const [activeAppointment, setActiveAppointment] =
    useState<Appointment | null>(null);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;
    if (!over) return;

    const draggedId = String(active.id);
    const overId = String(over.id);
    const targetDentistId = overId.startsWith("dentist-")
      ? overId.replace("dentist-", "")
      : "";

    const item = appointments.find((a) => a.id === draggedId);

    if (!item) return;
    const id = targetDentistId ? targetDentistId : item.dentistId;
    const newAppointment = calculateAppointment(id, delta.y, item);

    console.log("newAppointment", newAppointment);
    // return;

    // Check for collisions before updating
    if (!hasCollision(newAppointment, appointments)) {
      z.mutate.appointment.update(newAppointment);
    } else
      console.warn("Cannot move appointment: time slot is already occupied");

    setActiveAppointment(null);
  }

  function handleDragMove(event: DragMoveEvent) {
    const { delta, over, active } = event;

    if (!over) return;
    const draggedId = String(active.id);
    const overId = String(over.id);
    const targetDentistId = overId.startsWith("dentist-")
      ? overId.replace("dentist-", "")
      : "";

    const item = appointments.find((a) => a.id === draggedId);
    if (!item) return;

    const id = !targetDentistId ? item.dentistId : targetDentistId;
    const newAppointment = calculateAppointment(id, delta.y, item);

    setActiveAppointment(newAppointment);
  }

  return (
    <div className="h-screen w-full overflow-hidden py-5">
      <CalendarHeader />
      <div className="border-b" />
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
        modifiers={[restrictToFirstScrollableAncestor]}
      >
        <ScrollArea className="h-screen flex-row">
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
      <SetCalendarScrollPosition />
      <DragTimeIndicator appointment={activeAppointment} />
    </div>
  );
}

function SetCalendarScrollPosition() {
  // Scroll to 7 AM on component mount
  useEffect(() => {
    const scrollTo7AM = () => {
      // Calculate scroll position for 7 AM
      // 7 hours * 4 slots per hour * 24px per slot = 672px
      const scrollPosition = 7 * 4 * SLOT_HEIGHT_PX;

      // Find the scrollable container
      const scrollContainer = document.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) scrollContainer.scrollTop = scrollPosition;
    };

    // Small delay to ensure the DOM is fully rendered
    const timeoutId = setTimeout(scrollTo7AM, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}

"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { eachHourOfInterval, endOfDay, format, startOfToday } from "date-fns";

import { CalendarHeader } from "@repo/design/src/components/calendar/calendar";
import {
  ScrollArea,
  ScrollBar,
} from "@repo/design/src/components/ui/scroll-area";
import { cn } from "@repo/design/src/lib/utils";

import type { Appointment } from "./_component/types";
import { AppointmentCard } from "./_component/appointments";
import {
  DAY_HEIGHT_PX,
  dentists,
  MINUTES_PER_SLOT,
  SLOT_HEIGHT_PX,
} from "./_component/constants";
import { CurrentTimeIndicator } from "./_component/indicators";
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

const today = startOfToday();
const result = eachHourOfInterval({
  start: today,
  end: endOfDay(today),
});

export default function AppointmentPage() {
  return <Calendar />;
}

function TimeLabels() {
  const timeFormat = useCalendarStore((state) => state.timeFormat);

  return (
    <div className="relative h-full w-20">
      <div className="bg-background sticky top-0 left-0 z-30 flex min-h-10 items-center justify-center border-b text-end text-xs">
        Time
      </div>
      {result.map((label) => (
        <div
          key={label.toISOString()}
          className="text-md relative min-h-24 border-b"
        >
          <time
            className="text-xs"
            dateTime={format(label, "yyyy-MM-dd HH:mm")}
          >
            {format(label, timeFormat === "12h" ? "hh:mm a" : "HH:mm")}
          </time>
          <CurrentTimeIndicator currentTime={label.toISOString()} />
        </div>
      ))}
    </div>
  );
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
            <div className="bg-background sticky top-0 left-0 z-99999 flex w-20 items-center justify-center">
              <TimeLabels />
            </div>
            {dentists.map((dentist) => {
              const dentistAppointments = appointments.filter(
                (appointment) => appointment.dentistId === dentist.id,
              );

              return (
                <DroppableColumn
                  key={dentist.id}
                  dentistId={dentist.id}
                  label={dentist.name}
                >
                  <div
                    className="relative w-full"
                    style={{ height: `${DAY_HEIGHT_PX}px` }}
                  >
                    <CalenderCellLines type="hour" />
                    <CalenderCellLines type="half-hour" />

                    {dentistAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id + dentist.id}
                        appointment={appointment}
                      />
                    ))}
                  </div>
                </DroppableColumn>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DndContext>
    </div>
  );
}

function DroppableColumn({
  dentistId,
  label,
  children,
}: {
  dentistId: number;
  label: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `dentist-${dentistId}`,
  });
  return (
    <div
      ref={setNodeRef}
      className={cn("flex h-full w-full min-w-40 flex-col not-odd:border-x", {
        "bg-primary/10": isOver,
      })}
    >
      <div className="bg-background sticky top-0 z-999 flex min-h-10 items-center justify-center border-b text-xs backdrop-blur-2xl">
        {label}
      </div>
      {children}
    </div>
  );
}

function CalenderCellLines({
  className,
  style,
  type,
}: {
  type: "hour" | "half-hour";
  className?: string;
  style?: React.CSSProperties;
}) {
  return Array.from({ length: 24 }).map((_, hourIndex) => (
    <div
      key={`h-${hourIndex}`}
      className={cn(
        "border-b",
        type === "half-hour" && "opacity-50",
        className,
      )}
      style={{
        position: "absolute",
        top:
          type === "hour"
            ? `${hourIndex * 4 * SLOT_HEIGHT_PX}px`
            : `${2 * hourIndex * 4 * SLOT_HEIGHT_PX + 2 * SLOT_HEIGHT_PX}px`,
        left: 0,
        right: 0,
        height: type === "hour" ? `${4 * SLOT_HEIGHT_PX}px` : undefined,
        ...style,
      }}
    />
  ));
}

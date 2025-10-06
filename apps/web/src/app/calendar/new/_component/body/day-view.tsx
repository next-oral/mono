"use client";

import { isSameDay } from "date-fns";

import { DAY_HEIGHT_PX } from "../constants";
import { useCalendarStore } from "../store";
import { DayViewAppointmentCard } from "./appointments";
import { CalenderCellLines } from "./calender-cell-lines";
import { DroppableColumn } from "./droppable-column";

export function DayView() {
  const calendarView = useCalendarStore((state) => state.calendarView);
  const currentDate = useCalendarStore((state) => state.currentDate);
  const filteredDentists = useCalendarStore((state) => state.filteredDentists);
  const appointments = useCalendarStore((state) => state.appointments);

  if (calendarView === "week") return null;

  return filteredDentists.map((dentist) => {
    const dentistAppointments = appointments.filter(
      (appointment) =>
        appointment.dentistId === dentist.id &&
        isSameDay(currentDate, appointment.date),
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
            <DayViewAppointmentCard
              key={appointment.id + dentist.id}
              appointment={appointment}
            />
          ))}
        </div>
      </DroppableColumn>
    );
  });
}

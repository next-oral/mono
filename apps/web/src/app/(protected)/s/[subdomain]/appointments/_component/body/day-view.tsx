"use client";

import { useZero } from "@rocicorp/zero/react";

import type { Schema } from "@repo/zero/src/schema";

import { authClient } from "~/auth/client";
import { useZeroQuery } from "~/providers/zero";
import { DAY_HEIGHT_PX } from "../constants";
import { buildQuery } from "../query";
import { useCalendarStore } from "../store";
import { DayViewAppointmentCard } from "./appointments";
import { CalenderCellLines } from "./calender-cell-lines";
import { DroppableColumn } from "./droppable-column";
import { SlotHighlighter } from "./slot-highlighter";

export function DayView() {
  const zero = useZero<Schema>();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  const calendarView = useCalendarStore((state) => state.calendarView);
  const currentDate = useCalendarStore((state) => state.currentDate);

  const filteredDentists = useCalendarStore((state) => state.filteredDentists);

  const orgId = activeOrganization?.id ?? organizations?.[0]?.id ?? "";
  const { data: dentists } = useZeroQuery(buildQuery(zero, currentDate, orgId));

  if (calendarView === "week") return null;
  const dentistsToDisplay =
    filteredDentists.length === 0 ? dentists : filteredDentists;

  return dentistsToDisplay.map((dentist) => {
    return (
      <DroppableColumn
        key={dentist.id}
        dentistId={dentist.id}
        label={dentist.firstName + " " + dentist.lastName}
      >
        <div
          className="relative w-full"
          style={{ height: `${DAY_HEIGHT_PX}px` }}
        >
          <CalenderCellLines type="hour" />
          <CalenderCellLines type="half-hour" />
          {dentist.appointments.map((appointment) => (
            <DayViewAppointmentCard
              key={appointment.id + dentist.id}
              appointment={appointment}
            />
          ))}
          <SlotHighlighter
            currentDate={currentDate}
            currentDentistId={dentist.id}
          />
        </div>
      </DroppableColumn>
    );
  });
}

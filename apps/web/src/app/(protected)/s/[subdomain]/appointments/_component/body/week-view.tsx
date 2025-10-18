"use client";

import type { Row, Zero } from "@rocicorp/zero";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isToday,
  startOfWeek,
} from "date-fns";

import type { Schema } from "@repo/zero/src/schema";
import { cn } from "@repo/design/src/lib/utils";

import { DAY_HEIGHT_PX } from "../constants";
import { useCalendarStore } from "../store";
import { groupAppointmentsForDay } from "../utils";
import { WeekViewAppointmentCard } from "./appointments";
import { CalenderCellLines } from "./calender-cell-lines";

function buildQuery(zero: Zero<Schema>, currentDate: Date) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }).getTime();
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }).getTime();
  return zero.query.dentist.related("appointments", (q) =>
    q.where((ops) => {
      return ops.and(
        ops.cmp("start", ">=", weekStart),
        ops.cmp("start", "<=", weekEnd),
      );
    }),
  );
}

export type DentistsWithAppointments = Row<ReturnType<typeof buildQuery>>;

export function WeekView() {
  const appointments = useCalendarStore((state) => state.appointments);
  const currentDate = useCalendarStore((state) => state.currentDate);
  const calendarView = useCalendarStore((state) => state.calendarView);

  if (calendarView === "day") return null;

  function getWeekDates() {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // get the start of the week (Monday)
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 }); // get the end of the week.

    const week = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return week;
  }
  const weekDates = getWeekDates();

  return weekDates.map((day, index) => (
    <div
      key={index}
      className={cn("flex h-full w-full min-w-40 flex-col not-odd:border-x", {
        "bg-blue-50 dark:bg-blue-950": isToday(day),
      })}
    >
      <div
        className={cn(
          "bg-background sticky top-0 z-20 flex min-h-10 cursor-pointer flex-col items-center justify-center gap-1 border-b text-xs capitalize backdrop-blur-2xl",
          {
            "bg-blue-50 dark:bg-blue-950": isToday(day),
          },
        )}
      >
        {format(day, "EEE d")}
        {isToday(day) && (
          <div className="bg-primary h-1.5 w-1.5 rounded-sm"></div>
        )}
      </div>
      <div className="relative w-full" style={{ height: `${DAY_HEIGHT_PX}px` }}>
        <CalenderCellLines type="hour" />
        <CalenderCellLines type="half-hour" />
        {groupAppointmentsForDay(day.toISOString(), appointments).map(
          (group, index) => (
            <WeekViewAppointmentCard key={index} group={group} />
          ),
        )}
      </div>
    </div>
  ));
}

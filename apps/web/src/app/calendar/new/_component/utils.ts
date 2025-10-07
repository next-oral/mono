import {
  add,
  addMinutes,
  format,
  getHours,
  getMinutes,
  getTime,
  isSameDay,
  startOfDay,
  startOfToday,
} from "date-fns";

import type { Appointment, AppointmentGroup, HighlightRect } from "./types";
import { MINUTES_PER_SLOT } from "./constants";

/**
 * Group appointments for a single day into overlapping groups with a maximum duration cap.
 *
 * @param dayISO "YYYY-MM-DD"
 * @param appointments array of Appointment (may include other dates)
 * @param maxGroupDurationMinutes default 180 (3 hours)
 * @param treatTouchingAsOverlap default true (A.end === B.start => overlapping)
 */
export function groupAppointmentsForDay(
  dayISO: string,
  appointments: Appointment[],
  maxGroupDurationMinutes = 180,
  treatTouchingAsOverlap = true,
): AppointmentGroup[] {
  // 1. Filter by date

  const dailyAppointments = appointments.filter((a) =>
    isSameDay(a.date, dayISO),
  );
  console.log(dailyAppointments);

  if (dailyAppointments.length === 0) return [];

  // 2. Map to internal objects with minute values
  type InternalAppointment = Appointment & { startMin: number; endMin: number };
  const internal: InternalAppointment[] = dailyAppointments.map((a) => ({
    ...a,
    startMin:
      new Date(a.startTime).getMinutes() +
      new Date(a.startTime).getHours() * 60,
    endMin:
      new Date(a.endTime).getMinutes() + new Date(a.endTime).getHours() * 60,
  }));

  // 3. Sort by startMin asc (stable)
  internal.sort(
    (a, b) => a.startMin - b.startMin || a.endMin - b.endMin || a.id - b.id,
  );

  // 4. Iterate and group
  interface InternalGroup {
    startMin: number;
    endMin: number;
    appointments: InternalAppointment[];
  }

  const groups: InternalGroup[] = [];

  for (const appointment of internal) {
    if (groups.length === 0) {
      groups.push({
        startMin: appointment.startMin,
        endMin: appointment.endMin,
        appointments: [appointment],
      });
      continue;
    }

    const last = groups[groups.length - 1];
    const overlapCheck = last
      ? treatTouchingAsOverlap
        ? appointment.startMin <= last.endMin
        : appointment.startMin < last.endMin
      : false;
    const proposedEnd = last
      ? Math.max(last.endMin, appointment.endMin)
      : appointment.endMin;
    const proposedSpan = last ? proposedEnd - last.startMin : 0;

    if (last && overlapCheck && proposedSpan <= maxGroupDurationMinutes) {
      // merge into last group
      last.endMin = proposedEnd;
      last.appointments.push(appointment);
    } else {
      // start a new group
      groups.push({
        startMin: appointment.startMin,
        endMin: appointment.endMin,
        appointments: [appointment],
      });
    }
  }

  // 5. Map internal groups back to AppointmentGroup (string times, original appointments)
  const result: AppointmentGroup[] = groups.map((g) => {
    console.log(g.startMin, g.endMin);
    const startTime = startOfDay(dayISO);

    return {
      startTime: add(startTime, {
        minutes: g.startMin,
      }).toISOString(),
      endTime: add(startTime, {
        minutes: g.endMin,
      }).toISOString(),
      // return the original Appointment objects (without the internal minute fields)
      appointments: g.appointments.map(
        ({ startMin: _startMin, endMin: _endMin, ...orig }) =>
          orig as Appointment,
      ),
    };
  });

  return result;
}

export function getHighlightTimes(
  highlight: HighlightRect,
  slotHeightPx = 25,
  date: Date,
) {
  if (!highlight) return null;

  const startMinutes = (highlight.top / slotHeightPx) * MINUTES_PER_SLOT;
  const endMinutes =
    ((highlight.top + highlight.height) / slotHeightPx) * MINUTES_PER_SLOT;

  const dayStart = startOfDay(date);
  const startDate = addMinutes(dayStart, startMinutes);
  const endDate = addMinutes(dayStart, endMinutes);

  return {
    startDate,
    endDate,
    startStr: format(startDate, "h:mm a"),
    endStr: format(endDate, "h:mm a"),
  };
}

import type { Modifier } from "@dnd-kit/core";

import type { Appointment, AppointmentGroup } from "../types/calendar";
import { DAY_MINUTES, SNAP_GRID } from "../components/calendar/constants";

/**
 * This is used to keep computed minutes or pixel offsets within valid bounds
 * @param v visual offset
 * @param a start range
 * @param b end range
 * @returns number
 */
export function clampBounds(v: number, a: number, b: number) {
  // (for example, preventing appointment start times or visual offsets from moving
  // outside the allowed day range or visible area).
  return Math.max(a, Math.min(b, v));
}

export function roundToQuarter(minutes: number) {
  return Math.round(minutes / 15) * 15;
}

export const snapToGrid: Modifier = ({ transform }) => {
  const snappedY = Math.round(transform.y / SNAP_GRID) * SNAP_GRID;
  return { ...transform, y: snappedY };
};

/**
 *
 * @param time takes time in format hh:mm
 * @returns
 */
export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return Number(hours) * 60 + Number(minutes);
}

/**
 *
 * @param minutes number of minutes
 * @returns returns in readable format e.g 11:45
 */

export function minutesToTime(minutes: number) {
  minutes = clampBounds(Math.round(minutes), 0, DAY_MINUTES - 1);
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/**
 *
 * @param timeString takes a time in this format 11AM
 * @returns time in 24 hours e.g 13:00
 */
export function convert12hTo24h(timeString: string) {
  const time = timeString.trim().toLowerCase();
  const [hourString, modifier] = time.split(/(am|pm)/);
  let hours = parseInt(String(hourString), 10);

  // Handle PM conversion (and 12:xx PM)
  if (modifier === "pm" && hours !== 12) {
    hours += 12;
  }
  // Handle 12:xx AM (midnight)
  if (modifier === "am" && hours === 12) {
    hours = 0;
  }

  return hours;
}

/**
 * Converts a time string from 24-hour format ("HH:MM") to 12-hour format ("h:mm AM/PM").
 * @param time24hr - The time string in "HH:MM" format (e.g., "14:30").
 * @returns The time string in "h:mm AM/PM" format (e.g., "2:30 PM").
 */
export function convert24hTo12h(time24hr: string): string {
  // 1. Basic validation to ensure the input is in the expected format (HH:MM)
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time24hr)) {
    // You could throw an error here, but for simplicity, we'll return the original string
    // or a default value if the format is incorrect.
    console.error(`Invalid time format: ${time24hr}. Expected "HH:MM".`);
    return time24hr;
  }

  // 2. Destructure the hours and minutes
  const [hoursStr, minutes] = time24hr.split(":");
  const hours = parseInt(String(hoursStr), 10);

  // 3. Determine the AM/PM suffix
  const ampm = hours >= 12 ? "PM" : "AM";

  // 4. Convert 24-hour number to 12-hour number
  let hours12 = hours % 12;

  // Handle midnight (00:xx) and noon (12:xx)
  if (hours12 === 0) {
    hours12 = 12; // 00:xx becomes 12:xx AM
  }

  // 5. Construct the final 12-hour string
  return `${hours12}:${minutes} ${ampm}`;
}

/**
 * Calculates the duration between two times in "HH:MM" 24-hour format
 * and returns a human-readable string (e.g., "2 hours 30 mins" or "45 mins").
 * * NOTE: This function does not handle durations that span across midnight (i.e., end time is before start time).
 * @param startTime24hr - The starting time in "HH:MM" format (e.g., "09:30").
 * @param endTime24hr - The ending time in "HH:MM" format (e.g., "12:00").
 * @returns A human-readable duration string (e.g., "2 hours 30 mins").
 */
export function getScheduleDuration(
  startTime24hr: string,
  endTime24hr: string,
): string {
  // 1. Convert start and end times to total minutes
  const startMinutes = timeToMinutes(startTime24hr);
  const endMinutes = timeToMinutes(endTime24hr);

  // 2. Calculate the difference in minutes
  const durationMinutes = endMinutes - startMinutes;

  // --- Basic Error/Edge Case Handling ---
  if (durationMinutes < 0) {
    // Handle case where end time is before start time on the same day.
    // If you need to handle cross-day duration, you would add 24 * 60 here.
    console.warn(
      `End time (${endTime24hr}) is before start time (${startTime24hr}). Duration is negative.`,
    );
    return "Invalid Duration";
  }

  if (durationMinutes === 0) {
    return "0 minutes";
  }

  // 3. Convert total minutes to hours and remaining minutes
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  // 4. Build the readable output string
  let result = "";

  if (hours > 0) {
    // Append hours, correctly pluralized
    result += `${hours}hr${hours > 1 ? "s" : ""}`;
  }

  if (minutes > 0) {
    // If there were hours, add a space before minutes
    if (result.length > 0) {
      result += " ";
    }
    // Append minutes, correctly pluralized
    result += `${minutes}m`;
  }

  return result;
}

/**
 *
 * @param hour takes string in this format 11AM
 * @returns the amount of time converted from the present time
 */
export function isAmPmThisHour(hour: string) {
  // Gets the current hour for the day
  const currentHour = new Date().getHours();
  const targetHour = convert12hTo24h(hour);
  return currentHour === targetHour;
}

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

  function uniformDate(date: string | Date) {
    let newDate = new Date();
    if (typeof date === "string") {
      newDate = new Date(date);
    } else {
      newDate = date;
    }
    return newDate.toLocaleDateString("en-CA");
  }

  const dailyAppointments = appointments.filter(
    (a) => uniformDate(a.date) === uniformDate(dayISO),
  );

  if (dailyAppointments.length === 0) return [];

  // 2. Map to internal objects with minute values
  type InternalAppointment = Appointment & { startMin: number; endMin: number };
  const internal: InternalAppointment[] = dailyAppointments.map((a) => ({
    ...a,
    startMin: timeToMinutes(a.startTime),
    endMin: timeToMinutes(a.endTime),
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
  const result: AppointmentGroup[] = groups.map((g) => ({
    startTime: minutesToTime(g.startMin),
    endTime: minutesToTime(g.endMin),
    // return the original Appointment objects (without the internal minute fields)
    appointments: g.appointments.map(
      ({ startMin: _startMin, endMin: _endMin, ...orig }) =>
        orig as Appointment,
    ),
  }));

  console.log(result);
  return result;
}

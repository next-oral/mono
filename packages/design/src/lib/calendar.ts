import type { Modifier } from "@dnd-kit/core";
import { DAY_MINUTES, SNAP_GRID } from "../components/calendar/constants";
import { Appointment, AppointmentGroup } from "../types/calendar";
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
}

export function timeToMinutes(time: string) {
    const [hours, minutes] = time.split(":").map(Number)
    return Number(hours) * 60 + Number(minutes)
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
    treatTouchingAsOverlap = true
): AppointmentGroup[] {
    // 1. Filter by date

    function uniformDate (date: string | Date) {
        let newDate = new Date();
        if(typeof date === 'string'){
            newDate = new Date(date);
        }else {
            newDate = date;
        }
       return newDate.toLocaleDateString('en-CA');
    }

    const dailyAppointments = appointments.filter((a) => uniformDate(a.date) === uniformDate(dayISO));
 
    if (dailyAppointments.length === 0) return [];

    // 2. Map to internal objects with minute values
    type InternalAppointment = Appointment & { startMin: number; endMin: number };
    const internal: InternalAppointment[] = dailyAppointments.map((a) => ({
        ...a,
        startMin: timeToMinutes(a.startTime),
        endMin: timeToMinutes(a.endTime),
    }));

    // 3. Sort by startMin asc (stable)
    internal.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin || a.id - b.id);

    // 4. Iterate and group
    interface InternalGroup {
        startMin: number;
        endMin: number;
        appointments: InternalAppointment[];
    };

    const groups: InternalGroup[] = [];

    for (const appointment of internal) {
        if (groups.length === 0) {
            groups.push({ startMin: appointment.startMin, endMin: appointment.endMin, appointments: [appointment] });
            continue;
        }

        const last = groups[groups.length - 1];
        const overlapCheck = treatTouchingAsOverlap ? appointment.startMin <= last?.endMin : appointment.startMin < last.endMin;
        const proposedEnd = Math.max(last?.endMin, appointment.endMin);
        const proposedSpan = proposedEnd - last?.startMin;

        if (overlapCheck && proposedSpan <= maxGroupDurationMinutes) {
            // merge into last group
            last.endMin = proposedEnd;
            last.appointments.push(appointment);
        } else {
            // start a new group
            groups.push({ startMin: appointment.startMin, endMin: appointment.endMin, appointments: [appointment] });
        }
    }

    // 5. Map internal groups back to AppointmentGroup (string times, original appointments)
    const result: AppointmentGroup[] = groups.map((g) => ({
        startTime: minutesToTime(g.startMin),
        endTime: minutesToTime(g.endMin),
        // return the original Appointment objects (without the internal minute fields)
        appointments: g.appointments.map(({ startMin, endMin, ...orig }) => orig as Appointment),
    }));

    console.log(result);
    return result;
}
import type { Modifier } from "@dnd-kit/core";
import { DAY_MINUTES, SNAP_GRID } from "../components/calendar/constants";

export function clampBounds(v: number, a: number, b: number) {
    // This is used to keep computed minutes or pixel offsets within valid bounds
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

export function minutesToTime(minutes: number) {
    minutes = clampBounds(Math.round(minutes), 0, DAY_MINUTES - 1);
    const hh = Math.floor(minutes / 60);
    const mm = minutes % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

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

export function isAmPmThisHour(hour: string /* in AM/PM format */) {
    // Gets the current hour for the day
    const currentHour = new Date().getHours();
    const targetHour = convert12hTo24h(hour);
    return currentHour === targetHour;
}

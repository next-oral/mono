  // Constants
  export const COLUMN_WIDTH = 160; // px per dentist column
  export const TIME_SLOT_HEIGHT = 100; // px per hour
  export const SNAP_GRID = 25; // px snap => 15 minutes
  export const MIN_APPOINTMENT_MINUTES = 15;
  export const SLOTS_PER_HOUR = 60 / MIN_APPOINTMENT_MINUTES; // 4 slots per hour
  export const SLOT_HEIGHT = TIME_SLOT_HEIGHT / SLOTS_PER_HOUR; // 25px per 15-min slot

 export const DAY_MINUTES = 24 * 60;
  export const DAY_MIN_START = 0;
  export const DAY_MAX_END = DAY_MINUTES - MIN_APPOINTMENT_MINUTES;

  export const timeSlots = Array.from({ length: 24 }).map((_, i) => {
      const hour = i
      const ampm = hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`
      return ampm
  });
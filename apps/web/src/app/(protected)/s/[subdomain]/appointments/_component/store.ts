import { create } from "zustand";

import type { Appointment } from "@repo/zero/src/schema";

import type { DentistsWithAppointments } from "./query";
import type { CalendarView } from "./types";

interface HighlightRect {
  top: number;
  height: number;
}
interface CalendarState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;

  calendarView: CalendarView;
  setCalendarView: (view: CalendarView) => void;
  timeFormat: "12h" | "24h";
  setTimeFormat: (format: "12h" | "24h") => void;

  dentists: DentistsWithAppointments[];
  updateDentists: (dentists: DentistsWithAppointments[]) => void;

  filteredDentists: DentistsWithAppointments[];
  updateFilteredDentists: (dentists: DentistsWithAppointments[]) => void;

  appointments: Appointment[];
  updateAppointment: (appointment: Appointment) => void;

  highlight: {
    dentistId: string;
    currentDate: Date;
    rect: HighlightRect | null;
  };
  setHighlight: (
    dentistId: string,
    currentDate: Date,
    rect: HighlightRect | null,
  ) => void;

  setHighlightBySlots: (
    startSlot: number,
    endSlot: number,
    slotHeightPx: number,
  ) => void;
  clearHighlight: () => void;

  showAppointmentSheet: boolean;
  setShowAppointmentSheet: (state: boolean) => void;
}

const currentDate = new Date();
export const useCalendarStore = create<CalendarState>((set) => ({
  currentDate,
  setCurrentDate: (date) => set({ currentDate: date }),

  calendarView: "day" as const,
  setCalendarView: (view) => set({ calendarView: view }),

  timeFormat: "12h" as const,
  setTimeFormat: (format) => set({ timeFormat: format }),

  dentists: [],
  updateDentists: (dentists) => set({ dentists }),

  filteredDentists: [],
  updateFilteredDentists: (dentists) =>
    set({
      filteredDentists: dentists,
    }),

  appointments: [],
  updateAppointment: (appointment) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === appointment.id ? appointment : a,
      ),
    })),

  highlight: { dentistId: "", currentDate, rect: null },
  setHighlight(dentistId, currentDate, rect) {
    set({ highlight: { dentistId, currentDate, rect } });
  },

  setHighlightBySlots(startSlot, endSlot, slotHeightPx) {
    const topSlot = Math.min(startSlot, endSlot);
    const bottomSlot = Math.max(startSlot, endSlot);
    const top = topSlot * slotHeightPx;
    const height = (bottomSlot - topSlot + 1) * slotHeightPx; // inclusive
    set({
      highlight: {
        rect: { top, height },
        currentDate,
        dentistId: "",
      },
    });
  },

  clearHighlight() {
    set({ highlight: { dentistId: "", currentDate, rect: null } });
  },
  showAppointmentSheet: false,
  setShowAppointmentSheet: (state) => {
    if (!state) useCalendarStore.getState().clearHighlight();
    set({ showAppointmentSheet: state });
  },
}));

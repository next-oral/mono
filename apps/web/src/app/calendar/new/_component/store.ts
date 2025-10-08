import { create } from "zustand";

import type {
  Appointment,
  CalendarView,
  Dentist,
  HighlightRect,
} from "./types";
import { appointments, dentists } from "./constants";

interface CalendarState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;

  calendarView: CalendarView;
  setCalendarView: (view: CalendarView) => void;
  timeFormat: "12h" | "24h";
  setTimeFormat: (format: "12h" | "24h") => void;

  dentists: Dentist[];
  updateDentists: (dentists: Dentist[]) => void;
  filteredDentists: Dentist[];
  updateFilteredDentists: (dentists: Dentist[]) => void;

  appointments: Appointment[];
  updateAppointment: (appointment: Appointment) => void;

  highlight: {
    dentistId: string | number;
    currentDate: Date;
    rect: HighlightRect;
  };
  setHighlight: (
    dentistId: string | number,
    currentDate: Date,
    rect: HighlightRect,
  ) => void;

  setHighlightBySlots: (
    startSlot: number,
    endSlot: number,
    slotHeightPx: number,
  ) => void;
  clearHighlight: () => void;

  showNewAppointmentDialog: boolean;
  setShowNewAppointmentDialog: (state: boolean) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),
  showNewAppointmentDialog: false,
  setShowNewAppointmentDialog: (state) =>
    set({ showNewAppointmentDialog: state }),

  calendarView: "day",
  setCalendarView: (view) => set({ calendarView: view }),

  timeFormat: "12h",
  setTimeFormat: (format) => set({ timeFormat: format }),

  dentists: dentists,
  updateDentists: (dentists) => set({ dentists }),

  filteredDentists: dentists,
  updateFilteredDentists: (dentists) =>
    set({
      filteredDentists: dentists,
    }),

  appointments: appointments,
  updateAppointment: (appointment) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === appointment.id ? appointment : a,
      ),
    })),

  highlight: { dentistId: "", currentDate: new Date(), rect: null },
  setHighlight(dentistId, currentDate, rect) {
    set({ highlight: { dentistId, currentDate, rect } });
  },

  // convenience: build rect from slot indexes (inclusive)
  setHighlightBySlots(startSlot, endSlot, slotHeightPx) {
    const topSlot = Math.min(startSlot, endSlot);
    const bottomSlot = Math.max(startSlot, endSlot);
    const top = topSlot * slotHeightPx;
    const height = (bottomSlot - topSlot + 1) * slotHeightPx; // inclusive
    set({
      highlight: {
        rect: { top, height },
        currentDate: new Date(),
        dentistId: "",
      },
    });
  },

  clearHighlight() {
    set({ highlight: { dentistId: "", currentDate: new Date(), rect: null } });
  },
}));

import { create } from "zustand";

import type { Appointment } from "@repo/zero/src/schema";

import type { DentistsWithAppointments } from "./query";
import type { CalendarView } from "./types";

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
}

export const useCalendarStore = create<CalendarState>((set) => ({
  currentDate: new Date(),
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
}));

import { create } from "zustand";

import type { Appointment, CalendarView, Dentist } from "./types";
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
}

export const useCalendarStore = create<CalendarState>((set) => ({
  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),

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
}));

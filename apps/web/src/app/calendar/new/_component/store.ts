import { create } from "zustand";

import type { Appointment } from "./types";
import { appointments } from "./constants";

interface CalendarState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  timeFormat: "12h" | "24h";
  setTimeFormat: (format: "12h" | "24h") => void;
  appointments: Appointment[];
  updateAppointment: (appointment: Appointment) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),

  timeFormat: "12h",
  setTimeFormat: (format) => set({ timeFormat: format }),

  appointments: appointments,
  updateAppointment: (appointment) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === appointment.id ? appointment : a,
      ),
    })),
}));

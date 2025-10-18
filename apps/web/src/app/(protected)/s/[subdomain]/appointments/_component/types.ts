export type CalendarView = "day" | "week";

export interface Appointment {
  id: number;
  dentistId: number;
  patientId: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  color: Color;
}

export interface AppointmentGroup {
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  appointments: Appointment[];
}

export interface Dentist {
  id: number;
  name: string;
  avatar: string;
  startDate: string;
}

export const colors = {
  sky: {
    bg: "bg-blue-100 border-blue-200",
    accent: "bg-blue-700",
  },
  pink: {
    bg: "bg-pink-100 border-pink-200",
    accent: "bg-pink-700",
  },
  orange: {
    bg: "bg-orange-100 border-orange-200",
    accent: "bg-orange-700",
  },
  purple: {
    bg: "bg-purple-100 border-purple-200",
    accent: "bg-purple-700",
  },
  green: {
    bg: "bg-green-100 border-green-200",
    accent: "bg-green-700",
  },
  blue: {
    bg: "bg-blue-100 border-blue-200",
    accent: "bg-blue-700",
  },
  red: {
    bg: "bg-red-100 border-red-200",
    accent: "bg-red-700",
  },
  yellow: {
    bg: "bg-yellow-100 border-yellow-200",
    accent: "bg-yellow-700",
  },
  rose: {
    bg: "bg-rose-100 border-rose-200",
    accent: "bg-rose-700",
  },
  lime: {
    bg: "bg-lime-100 border-lime-200",
    accent: "bg-lime-700",
  },
  indigo: {
    bg: "bg-indigo-100 border-indigo-200",
    accent: "bg-indigo-700",
  },
  teal: {
    bg: "bg-teal-100 border-teal-200",
    accent: "bg-teal-700",
  },
} as const;

export type Color = keyof typeof colors;

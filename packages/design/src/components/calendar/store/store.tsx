import type { CalendarView, Dentist, Appointment } from "@repo/design/types/calendar";
import { create } from "zustand";
import { dentistSample, dummyAppointments } from "../dummy";
import type { UniqueIdentifier } from "@dnd-kit/core";

interface CalendarState {
  dentists: Dentist[];
  selectedView: CalendarView;
  setSelectedView: (view: CalendarView) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  selectedDentists: Dentist[];
  setSelectedDentists: (dentists: Dentist[]) => void;
  isDentistsSelectorOpen: boolean;
  setIsDentistsSelectorOpen: (isOpen: boolean) => void;
  showNewAppointmentDialog: boolean;
  setShowNewAppointmentDialog: (isOpen: boolean) => void;
  showEditAppointmentDialog: boolean;
  setShowEditAppointmentDialog: (isOpen: boolean) => void;

  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  slotsSelection: Record<string, { start: { hour: number; minute: number }; end: { hour: number; minute: number } | null }>;
  setSlotsSelection: (selection: Record<string, { start: { hour: number; minute: number }; end: { hour: number; minute: number } | null }>) => void;

  // DND States
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  activeId: UniqueIdentifier | null;
  setActiveId: (id: UniqueIdentifier | null) => void;
  originalAppointment: Appointment | null;
  setOriginalAppointment: (appointment: Appointment | null) => void;
  newStartTime: string | null;
  setNewStartTime: (time: string | null) => void;

  // Confirm Dialog States
  showConfirmDialog: boolean;
  setShowConfirmDialog: (isOpen: boolean) => void;
  targetAppointment: Appointment | null;
  setTargetAppointment: (appointment: Appointment | null) => void;
  pendingNewStartMinutes: number | null;
  setPendingNewStartMinutes: (minutes: number | null) => void;
}

export const useCalendarStore = create<CalendarState>((set): CalendarState => ({
  dentists: dentistSample,
  selectedView: "Day",
  setSelectedView: (date) => set({ selectedView: date }),
  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),

  appointments: dummyAppointments,
  setAppointments: (appointments) => set({ appointments }),
  selectedDentists: [],
  setSelectedDentists: (
    updater:
      | Dentist[]
      | ((
        prev: Dentist[]
      ) => Dentist[])
  ) =>
    set((state) => ({
      selectedDentists:
        typeof updater === "function"
          ? updater(state.selectedDentists)
          : updater,
    })),

  isDentistsSelectorOpen: false,
  setIsDentistsSelectorOpen: (isOpen) => set({ isDentistsSelectorOpen: isOpen }),
  showNewAppointmentDialog: false,
  setShowNewAppointmentDialog: (isOpen) => set({ isDentistsSelectorOpen: isOpen }),
  showEditAppointmentDialog: false,
  setShowEditAppointmentDialog: (isOpen) => set({ isDentistsSelectorOpen: isOpen }),

  selectedAppointment: null,
  setSelectedAppointment: (
    updater:
      | Appointment | null
      | ((
        prev: Appointment | null
      ) => Appointment | null)
  ) =>
    set((state) => ({
      selectedAppointment:
        typeof updater === "function"
          ? updater(state.selectedAppointment)
          : updater,
    })),
  slotsSelection: {},
  setSlotsSelection: (
    updater:
      | Record<string, { start: { hour: number; minute: number }; end: { hour: number; minute: number } | null }>
      | ((
        prev: Record<string, { start: { hour: number; minute: number }; end: { hour: number; minute: number } | null }>
      ) => Record<string, { start: { hour: number; minute: number }; end: { hour: number; minute: number } | null }>)
  ) =>
    set((state) => ({
      slotsSelection:
        typeof updater === "function"
          ? updater(state.slotsSelection)
          : updater,
    })),

  // DND States
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  activeId: null,
  setActiveId: (id) => set({ activeId: id }),
  originalAppointment: null,
  setOriginalAppointment: (appointment) => set({ originalAppointment: appointment }),
  newStartTime: null,
  setNewStartTime: (time) => set({ newStartTime: time }),

  // Confirm Dialog States
  showConfirmDialog: false,
  setShowConfirmDialog: (isOpen) => set({ showConfirmDialog: isOpen }),
  targetAppointment: null,
  setTargetAppointment: (appointment) => set({ targetAppointment: appointment }),
  pendingNewStartMinutes: null,
  setPendingNewStartMinutes: (minutes) => set({ pendingNewStartMinutes: minutes }),


}));
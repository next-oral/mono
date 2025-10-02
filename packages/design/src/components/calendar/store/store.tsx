import type { UniqueIdentifier } from "@dnd-kit/core";
import type { EachDayOfIntervalResult } from "date-fns";
import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";
import { create } from "zustand";

import type {
  Appointment,
  CalendarView,
  Dentist,
} from "@repo/design/types/calendar";
import { timeToMinutes } from "@repo/design/lib/calendar";

import {
  MIN_APPOINTMENT_MINUTES,
  TIME_SLOT_HEIGHT,
  timeSlots,
} from "../constants";
import { dentistSample, dummyAppointments } from "../dummy";

interface CalendarState {
  // Constants
  dentists: Dentist[];
  selectedView: CalendarView;
  setSelectedView: (view: CalendarView) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  appointments: Appointment[];
  setAppointments: (
    updater: Appointment[] | ((prev: Appointment[]) => Appointment[]),
  ) => void;

  selectedDentists: Dentist[];
  setSelectedDentists: (dentists: Dentist[]) => void;

  toggleDentistSelectionObject: (dentist: Dentist) => void; // returns the new array after toggling

  isDentistsSelectorOpen: boolean;
  setIsDentistsSelectorOpen: (isOpen: boolean) => void;

  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  slotsSelection: Record<
    string,
    {
      start: { hour: number; minute: number };
      end: { hour: number; minute: number } | null;
    }
  >;
  setSlotsSelection: (
    selection:
      | Record<
        string,
        {
          start: { hour: number; minute: number };
          end: { hour: number; minute: number } | null;
        }
      >
      | ((
        prev: Record<
          string,
          {
            start: { hour: number; minute: number };
            end: { hour: number; minute: number } | null;
          }
        >,
      ) => Record<
        string,
        {
          start: { hour: number; minute: number };
          end: { hour: number; minute: number } | null;
        }
      >),
  ) => void;

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

  // -----------
  getFilteredDentists: () => Dentist[];
  getWeekDates: () => EachDayOfIntervalResult<
    {
      start: Date;
      end: Date;
    },
    undefined
  >;
  getDisplayedDentists: () => Dentist[];
  getFilteredAppointments: () => Appointment[];
  getTimeFromPixelPosition: (
    y: number,
    containerHeight: number,
  ) => { hour: number; minute: number };
  findActiveAppointment: () => Appointment | null | undefined;
  getAppointmentHeight: (startTime: string, endTime: string) => number;
  getAppointmentDuration: (startTime: string, endTime: string) => number;
  getAppointmentTop: (startTime: string) => number;
  getAppointmentWidth: () => string;
  getAppointmentLeft: (dentistId: number) => number;
}

export const useCalendarStore = create(
  (set, get): CalendarState => ({
    // generate time labels 12AM -> 11PM

    dentists: dentistSample,
    selectedView: "Day",
    setSelectedView: (date) => set({ selectedView: date }),
    currentDate: new Date(),
    setCurrentDate: (date) => set({ currentDate: date }),

    appointments: dummyAppointments, // supposed be an sync function to retrieve server request
    setAppointments: (
      updater: Appointment[] | ((prev: Appointment[]) => Appointment[]),
    ) =>
      set((state) => ({
        appointments:
          typeof updater === "function" ? updater(state.appointments) : updater,
      })),
    selectedDentists: [],
    setSelectedDentists: (
      updater: Dentist[] | ((prev: Dentist[]) => Dentist[]),
    ) =>
      set((state) => ({
        selectedDentists:
          typeof updater === "function"
            ? updater(state.selectedDentists)
            : updater,
      })),

    toggleDentistSelectionObject: (dentist: Dentist) => {
      const { selectedDentists: dentists } = get();

      // if currently "all" (empty array), selecting a dentist narrows to that dentist only (store the dentist object)
      if (dentists.length === 0) set({ selectedDentists: [dentist] });
      // otherwise toggle by id
      const exists = dentists.some((d) => d.id === dentist.id);
      const next = exists
        ? dentists.filter((x) => x.id !== dentist.id)
        : [...dentists, dentist];
      // if user removed all, return [] (meaning all)
      // if (next.length === 0) return [];
      set({ selectedDentists: next });
    },

    isDentistsSelectorOpen: false,
    setIsDentistsSelectorOpen: (isOpen) =>
      set({ isDentistsSelectorOpen: isOpen }),

    selectedAppointment: null,
    setSelectedAppointment: (
      updater:
        | Appointment
        | null
        | ((prev: Appointment | null) => Appointment | null),
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
        | Record<
          string,
          {
            start: { hour: number; minute: number };
            end: { hour: number; minute: number } | null;
          }
        >
        | ((
          prev: Record<
            string,
            {
              start: { hour: number; minute: number };
              end: { hour: number; minute: number } | null;
            }
          >,
        ) => Record<
          string,
          {
            start: { hour: number; minute: number };
            end: { hour: number; minute: number } | null;
          }
        >),
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
    setOriginalAppointment: (appointment) =>
      set({ originalAppointment: appointment }),
    newStartTime: null,
    setNewStartTime: (time) => set({ newStartTime: time }),

    // Confirm Dialog States
    showConfirmDialog: false,
    setShowConfirmDialog: (isOpen) => set({ showConfirmDialog: isOpen }),
    targetAppointment: null,
    setTargetAppointment: (appointment) =>
      set({ targetAppointment: appointment }),
    pendingNewStartMinutes: null,
    setPendingNewStartMinutes: (minutes) =>
      set({ pendingNewStartMinutes: minutes }),

    // -------------

    getFilteredDentists: function () {
      // function to filter dentists
      const selectedDentists = get().selectedDentists;
      const dentists = get().dentists;
      return selectedDentists.length === 0
        ? dentists
        : dentists.filter((d) => selectedDentists.some((sd) => sd.id === d.id));
    },

    getWeekDates: () => {
      const startDate = startOfWeek(get().currentDate, { weekStartsOn: 1 }); // get the start of the week (Monday)
      const endDate = endOfWeek(get().currentDate, { weekStartsOn: 1 }); // get the end of the week.

      const week = eachDayOfInterval({
        start: startDate,
        end: endDate,
      });

      return week;
    },
    getTimeFromPixelPosition: (y: number, containerHeight: number) => {
      const totalMinutes = (y / containerHeight) * (timeSlots.length * 60);
      const hour = Math.floor(totalMinutes / 60);
      const minute =
        Math.floor((totalMinutes % 60) / MIN_APPOINTMENT_MINUTES) *
        MIN_APPOINTMENT_MINUTES;

      return { hour, minute };
    },
    getDisplayedDentists: () => {
      const { dentists, selectedDentists } = get();
      return selectedDentists.length === 0
        ? dentists
        : dentists.filter((d) => selectedDentists.some((s) => s.id === d.id));
    },

    getFilteredAppointments: () => {
      const { currentDate, appointments, getDisplayedDentists } = get();
      // Function for filtering appointments by date and dentists selected
      const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
      let filtered = appointments.filter((a) => a.date === today);
      // show only displayed dentists (lookup by id)
      const displayedIds = getDisplayedDentists().map((d) => d.id);
      filtered = filtered.filter((a) => displayedIds.includes(a.dentistId));
      return filtered;
    },
    findActiveAppointment: () => {
      const activeId = get().activeId;
      const appointments = get().appointments;
      return activeId
        ? appointments.find((a) => String(a.id) === String(activeId))
        : null;
    },
    getAppointmentHeight: (startTime: string, endTime: string) => {
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);
      const durationMinutes = endMinutes - startMinutes;
      const minDuration = Math.max(durationMinutes, MIN_APPOINTMENT_MINUTES);
      return (minDuration / 60) * TIME_SLOT_HEIGHT;
    },
    getAppointmentDuration: (startTime: string, endTime: string) => {
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);
      return endMinutes - startMinutes;
    },
    getAppointmentTop: (startTime: string) => {
      const startMinutes = timeToMinutes(startTime);
      return (startMinutes / 60) * TIME_SLOT_HEIGHT;
    },
    getAppointmentWidth: () => {
      // TODO: Width is 100% minus padding (4px each side)
      return "calc(100% - 2px)";
    },
    getAppointmentLeft: (/*dentistId: number*/) => {
      // TODO: Since nested per column, left is always 0
      return 0;
    },
  }),
);

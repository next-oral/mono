"use client";

import type {
  Collision,
  CollisionDetection,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  Modifier,
} from "@dnd-kit/core";
import type { CSSProperties } from "react";
import React, { useEffect, useRef } from "react";
import {
  closestCenter,
  DndContext,
  MouseSensor,
  PointerSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { isToday } from "date-fns";
import { Plus, Stethoscope } from "lucide-react";

import {
  clampBounds,
  groupAppointmentsForDay,
  minutesToTime,
  roundToQuarter,
  timeToMinutes,
} from "@repo/design/lib/calendar";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "../../icons";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { DateSelector } from "./components/date-selector";
import { DentistsRow } from "./components/dentists-row";
import { DentistsSelector } from "./components/dentists-selector";
import { ConfirmAppointmentMove } from "./components/dialogs/confirm-appointment-move";
import { DragOverlayAppointment } from "./components/drag-overlay-appointment";
import { DraggableAppointment } from "./components/draggable-appointment";
import { DragTimeIndicator } from "./components/indicators";
import { SlotDroppable } from "./components/slot-droppable";
import { TimeLabels } from "./components/time-labels";
import { WeekViewDays } from "./components/week-view-days";
import { WeekViewSchedules } from "./components/week-view-schedules";
import {
  COLUMN_WIDTH,
  DAY_MAX_END,
  DAY_MIN_START,
  MIN_APPOINTMENT_MINUTES,
  SLOT_HEIGHT, // 25px per 15-min slot
  SLOTS_PER_HOUR, // 4 slots per hour
  SNAP_GRID, // px snap => 15 minutes
  TIME_SLOT_HEIGHT, // px per hour
  timeSlots,
} from "./constants";
import { dummyAppointments } from "./dummy";
import { useCalendarStore } from "./store/store";

function Calendar({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full min-w-2xl p-4">{children}</div>;
}

function CalendarHeader() {
  const { selectedView, setSelectedView, currentDate, setCurrentDate } =
    useCalendarStore();

  function handlePrev() {
    if (selectedView === "Day") {
      const oneDayAgo = new Date(currentDate);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      setCurrentDate(oneDayAgo);
    } else {
      const oneWeekAgo = new Date(currentDate);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      setCurrentDate(oneWeekAgo);
    }
  }

  function handleNext() {
    if (selectedView === "Day") {
      const oneDayFuture = new Date(currentDate);
      oneDayFuture.setDate(oneDayFuture.getDate() + 1);
      setCurrentDate(oneDayFuture);
    } else {
      const oneWeekFuture = new Date(currentDate);
      oneWeekFuture.setDate(oneWeekFuture.getDate() + 7);
      setCurrentDate(oneWeekFuture);
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-xs font-medium">Show</span>
        <DentistsSelector />
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <DateSelector />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleNext}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex flex-wrap-reverse items-center gap-3">
        <div className="bg-muted flex items-center rounded-lg p-0.5">
          <Button
            variant={selectedView === "Day" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedView("Day")}
            className={cn("h-7 px-3 text-xs", {
              "bg-popover shadow-sm": selectedView === "Day",
            })}
          >
            Day
          </Button>
          <Button
            variant={selectedView === "Week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedView("Week")}
            className={cn("h-7 px-3 text-xs", {
              "bg-popover shadow-sm": selectedView === "Week",
            })}
          >
            Week
          </Button>
        </div>

        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs"
          aria-label="New Appointment"
        >
          <span className="max-md:hidden">New Appointment</span>{" "}
          <Plus className="md:hidden" />{" "}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function CalendarBody() {
  const { selectedView, selectedDentists, getWeekDates } = useCalendarStore();

  const appointments = useCalendarStore((state) => state.appointments);

  const isDragging = useCalendarStore((state) => state.isDragging);
  const setIsDragging = useCalendarStore((state) => state.setIsDragging);

  const setActiveId = useCalendarStore((state) => state.setActiveId);

  const slotsSelection = useCalendarStore((state) => state.slotsSelection);
  const setSlotsSelection = useCalendarStore(
    (state) => state.setSlotsSelection,
  );

  const originalAppointment = useCalendarStore(
    (state) => state.originalAppointment,
  );
  const setOriginalAppointment = useCalendarStore(
    (state) => state.setOriginalAppointment,
  );

  const setNewStartTime = useCalendarStore((state) => state.setNewStartTime);

  const pendingNewStartMinutes = useCalendarStore(
    (state) => state.pendingNewStartMinutes,
  );
  const setPendingNewStartMinutes = useCalendarStore(
    (state) => state.setPendingNewStartMinutes,
  );

  const setTargetAppointment = useCalendarStore(
    (state) => state.setTargetAppointment,
  );

  const setShowConfirmDialog = useCalendarStore(
    (state) => state.setShowConfirmDialog,
  );

  const getFilteredDentists = useCalendarStore(
    (state) => state.getFilteredDentists,
  );
  const getFilteredAppointments = useCalendarStore(
    (state) => state.getFilteredAppointments,
  );

  const getAppointmentHeight = useCalendarStore(
    (state) => state.getAppointmentHeight,
  );
  const getAppointmentTop = useCalendarStore(
    (state) => state.getAppointmentTop,
  );
  const getAppointmentDuration = useCalendarStore(
    (state) => state.getAppointmentDuration,
  );
  const getAppointmentWidth = useCalendarStore(
    (state) => state.getAppointmentWidth,
  );
  const getAppointmentLeft = useCalendarStore(
    (state) => state.getAppointmentLeft,
  );

  const getTimeFromPixelPosition = useCalendarStore(
    (state) => state.getTimeFromPixelPosition,
  );

  const weekDates = getWeekDates();
  const dentistColumnRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const HOLD_THRESHOLD_MS = 250; // threshold for highlighting
  const MOVE_CANCEL_PX = 6; // mouse movement pixels to cancle out threshold

  const pressTimerRef = useRef<number | null>(null);
  const isHighlightingRef = useRef(false);
  const clickSuppressRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const activeRectRef = useRef<DOMRect | null>(null);

  // cleanup on unmount
  useEffect(() => {
    const pressRefCurrent = pressTimerRef.current;
    return () => {
      if (pressRefCurrent !== null) {
        window.clearTimeout(pressRefCurrent);
      }
    };
  }, []);

  // ---- Highlighting Feature
  function handleSlotHighlightMouseDown(
    dentistId: number | string,
    e: React.PointerEvent | null,
  ) {
    // prevent starting on appointments
    if ((e?.target as HTMLElement).closest("[data-is-appointment]")) {
      return;
    }

    setSlotsSelection({}); // clear slot section

    const columnRef = dentistColumnRefs.current[dentistId];
    if (!columnRef) return;

    const rect = columnRef.getBoundingClientRect();
    activeRectRef.current = rect;
    startPosRef.current = { x: Number(e?.clientX), y: Number(e?.clientY) };
    activePointerIdRef.current = Number(e?.pointerId);

    // attempt to capture the pointer so we keep receiving events
    (e?.currentTarget as Element).setPointerCapture(Number(e?.pointerId));

    // pre-phase listeners: cancel hold if user moves/releases early
    const onPreMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== e?.pointerId) return;
      const start = startPosRef.current;
      if (!start) return;
      if (
        Math.abs(moveEvent.clientY - start.y) > MOVE_CANCEL_PX ||
        Math.abs(moveEvent.clientX - start.x) > MOVE_CANCEL_PX
      ) {
        cancelPreHold();
      }
    };

    const onPreUp = (upEvent: PointerEvent) => {
      if (upEvent.pointerId !== e?.pointerId) return;
      cancelPreHold();
    };

    document.addEventListener("pointermove", onPreMove);
    document.addEventListener("pointerup", onPreUp);

    // start the hold timer
    pressTimerRef.current = window.setTimeout(() => {
      pressTimerRef.current = null;

      // remove pre-phase listeners
      document.removeEventListener("pointermove", onPreMove);
      document.removeEventListener("pointerup", onPreUp);

      // mark highlighting started and suppress click
      isHighlightingRef.current = true;
      clickSuppressRef.current = true;

      // begin the real selection and attach active drag listeners
      beginHighlighting(dentistId, Number(e?.pointerId), rect, {
        x: Number(e?.clientX),
        y: Number(e?.clientY),
      });
    }, HOLD_THRESHOLD_MS);

    // helper to cancel pre-hold
    function cancelPreHold() {
      if (pressTimerRef.current !== null) {
        window.clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }

      document.removeEventListener("pointermove", onPreMove);
      document.removeEventListener("pointerup", onPreUp);

      if (e?.currentTarget) e.currentTarget.releasePointerCapture(e.pointerId);

      startPosRef.current = null;
      activePointerIdRef.current = null;
      activeRectRef.current = null;
    }

    // beginHighlighting defined here to close over dentistId / rect, or you can move it to component scope
    function beginHighlighting(
      dentistIdBegin: number | string,
      pointerId: number,
      rectBegin: DOMRect,
      startPos: { x: number; y: number },
    ) {
      // compute initial start time from pixel Y
      const y = startPos.y - rectBegin.top;
      const { hour, minute } = getTimeFromPixelPosition(y, rectBegin.height);

      // set initial selection start (end is null until pointer up)
      setSlotsSelection((prev) => ({
        ...prev,
        [dentistIdBegin]: { start: { hour, minute }, end: null },
      }));

      // active move/up — update selection while dragging for the same pointerId
      const onActiveMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;
        const moveY = moveEvent.clientY - rectBegin.top;
        const { hour: endHour, minute: endMinute } = getTimeFromPixelPosition(
          moveY,
          rectBegin.height,
        );

        setSlotsSelection((prev) => {
          const existing = prev[dentistIdBegin];
          if (!existing) return prev;
          return {
            ...prev,
            [dentistIdBegin]: {
              start: existing.start,
              end: { hour: endHour, minute: endMinute },
            },
          };
        });
      };

      const onActiveUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;

        // cleanup active listeners
        document.removeEventListener("pointermove", onActiveMove);
        document.removeEventListener("pointerup", onActiveUp);

        // release pointer capture on the column element if possible
        columnRef?.releasePointerCapture(pointerId);

        // reset flags/refs
        isHighlightingRef.current = false;
        startPosRef.current = null;
        activePointerIdRef.current = null;
        activeRectRef.current = null;

        // keep a tick of click suppression so any immediate click does not fire
        window.setTimeout(() => {
          clickSuppressRef.current = false;
        }, 0);
      };

      // attach active listeners
      document.addEventListener("pointermove", onActiveMove);
      document.addEventListener("pointerup", onActiveUp);
    }
  }

  // This function styles the highlighting
  const highlightStyle = (dentistId: number | string): CSSProperties => {
    const selection = slotsSelection[dentistId];
    if (!selection?.end) return { display: "none" };

    // Determine min and max for start/end (allow dragging up or down)
    const startHour = Math.min(selection.start.hour, selection.end.hour);
    const endHour = Math.max(selection.start.hour, selection.end.hour);
    let startMinute: number, endMinute: number;
    if (selection.start.hour < selection.end.hour) {
      startMinute = selection.start.minute;
      endMinute = selection.end.minute;
    } else if (selection.start.hour > selection.end.hour) {
      startMinute = selection.end.minute;
      endMinute = selection.start.minute;
    } else {
      // same hour: pick min and max minutes
      startMinute = Math.min(selection.start.minute, selection.end.minute);
      endMinute = Math.max(selection.start.minute, selection.end.minute);
    }

    // Calculate top position and height in pixels
    const top =
      startHour * TIME_SLOT_HEIGHT +
      (startMinute / MIN_APPOINTMENT_MINUTES) * SLOT_HEIGHT;
    const durationMinutes =
      (endHour - startHour) * 60 + (endMinute - startMinute);
    const height = (durationMinutes / MIN_APPOINTMENT_MINUTES) * SLOT_HEIGHT;

    return {
      top: `${top}px`,
      left: 0,
      height: `${height}px`,
      zIndex: 5,
    };
  };

  // Function to get the label text for the highlight
  // This shows "(No title)" and the time range like in the image
  const highlightLabel = (dentistId: string): string => {
    const selection = slotsSelection[dentistId];
    if (!selection?.end) return "";

    // Sort start and end times
    const start =
      selection.start.hour < selection.end.hour ||
      (selection.start.hour === selection.end.hour &&
        selection.start.minute < selection.end.minute)
        ? selection.start
        : selection.end;
    const end = start === selection.start ? selection.end : selection.start;

    const formatTime = (hour: number, minute: number): string => {
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMinute = minute.toString().padStart(2, "0");
      return `${displayHour}:${displayMinute} ${period}`;
    };

    const startStr = formatTime(start.hour, start.minute);
    const endStr = formatTime(end.hour, end.minute);
    return `(No title)\n${startStr} - ${endStr}`;
  };

  // x ---- Highlighting Feature

  // ------ Drag Features

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const pointerSensor = useSensor(PointerSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    pointerSensor,
    // keyboardSensor,
  );
  const modifiers = [
    restrictToVerticalAxis,
    restrictToParentElement,
  ] satisfies Modifier[];

  function customCollisionDetection(
    args: Parameters<CollisionDetection>[number],
  ) {
    // RectIntersection to be able to detect even when schedule edges touch
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
      const appointmentCollisions = rectCollisions.filter(
        (c): c is Collision => !String(c.id).startsWith("slot-"),
      );
      if (appointmentCollisions.length > 0) return appointmentCollisions;
      return rectCollisions;
    }

    // Fallback to closest center
    return closestCenter(args);
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const appointment = appointments.find(
      (a) => String(a.id) === String(active.id),
    );
    if (!appointment) return;
    setActiveId(active.id);
    setOriginalAppointment({ ...appointment });

    // initialize pendingNewStartMinutes baseline
    const origMinutes = timeToMinutes(appointment.startTime);
    setPendingNewStartMinutes(origMinutes);
    setNewStartTime(minutesToTime(origMinutes));

    setIsDragging(true);
  }

  function handleDragMove(event: DragMoveEvent) {
    const { delta } = event;
    if (!originalAppointment) return;

    const snappedDeltaY = Math.round(delta.y / SNAP_GRID) * SNAP_GRID; // snap at every 15 minutes (25 px) on vertical axis
    const minutesDelta = (snappedDeltaY / TIME_SLOT_HEIGHT) * 60;

    let tentativeStart =
      timeToMinutes(originalAppointment.startTime) + minutesDelta;
    tentativeStart = roundToQuarter(tentativeStart);
    tentativeStart = clampBounds(tentativeStart, DAY_MIN_START, DAY_MAX_END);

    setPendingNewStartMinutes(tentativeStart);
    setNewStartTime(minutesToTime(tentativeStart));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setIsDragging(false);

    if (!originalAppointment) {
      setNewStartTime(null);
      setPendingNewStartMinutes(null);
      return;
    }

    const origMinutes = timeToMinutes(originalAppointment.startTime);
    const newStartMinutes =
      typeof pendingNewStartMinutes === "number"
        ? pendingNewStartMinutes
        : origMinutes;

    // If time didn't change, cancel / revert
    if (newStartMinutes === origMinutes) {
      setOriginalAppointment(null);
      setNewStartTime(null);
      setPendingNewStartMinutes(null);
      return;
    }

    const newStart = minutesToTime(newStartMinutes);

    // If over is a slot (id like "slot-{dentistId}-{minutes}") => treat as empty slot
    if (over && typeof over.id === "string" && over.id.startsWith("slot-")) {
      // setTargetAppointment(null)
      setPendingNewStartMinutes(newStartMinutes);
      setNewStartTime(newStart);
      setShowConfirmDialog(true);
      return;
    }

    // If dropped over another appointment
    if (over && String(over.id) !== String(active.id)) {
      const overAppointment = appointments.find(
        (a) => String(a.id) === String(over.id),
      );
      if (overAppointment) {
        // Restrict swap/replace to same dentist only
        if (overAppointment.dentistId !== originalAppointment.dentistId) {
          // revert silently
          setOriginalAppointment(null);
          setNewStartTime(null);
          setPendingNewStartMinutes(null);
          return;
        }

        // prepare confirm: swap/replace options
        setTargetAppointment(overAppointment);
        setPendingNewStartMinutes(newStartMinutes);
        setNewStartTime(newStart);
        setShowConfirmDialog(true);
        return;
      }
    }

    // fallback: treat as empty slot
    setTargetAppointment(null);
    setPendingNewStartMinutes(newStartMinutes);
    setNewStartTime(newStart);
    setShowConfirmDialog(true);
  }
  // x------ Drag Features

  return (
    <DndContext
      sensors={sensors}
      modifiers={modifiers}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      collisionDetection={customCollisionDetection}
    >
      <ScrollArea className="h-screen w-auto">
        <div className="absolute w-12 border border-l-0" />
        <div className="relative min-w-[800px]">
          {selectedView === "Week" && <WeekViewDays />}

          <div
            className={cn("bg-background z-10", {
              // "sticky top-0": selectedView === "Day",
            })}
          >
            <div className="border-secondary flex items-center overflow-hidden border-t first:border-b">
              <div className="text-muted-foreground h-full w-12 text-right text-xs font-medium">
                {selectedView === "Day" ? (
                  <Stethoscope className="size-4" />
                ) : null}
              </div>
              {selectedView === "Day" ? (
                <DentistsRow />
              ) : (
                <div className="flex flex-1 flex-row">
                  {weekDates.map((date, index) => (
                    <div
                      key={index}
                      className={cn(
                        "border-secondary-foreground/10 h-8 flex-1 border-b border-l",
                        { "bg-blue-50 dark:bg-blue-950": isToday(date) },
                      )}
                      style={{ width: `${COLUMN_WIDTH}px` }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Time Slots */}
          <div className="relative space-y-0">
            <div className="flex">
              <TimeLabels />
              {/* Dentist columns */}
              {selectedView === "Day" && (
                <>
                  {getFilteredDentists().map((dentist, index) => {
                    // Filter appointments for this dentist only
                    const appointmentsForDentist =
                      getFilteredAppointments().filter(
                        (appointment) => appointment.dentistId === dentist.id,
                      );
                    return (
                      <div
                        key={dentist.id + index}
                        ref={(el) => {
                          dentistColumnRefs.current[dentist.id] = el;
                        }}
                        className="border-secondary-foreground/10 relative flex-1 touch-pan-y touch-none border-l"
                        style={{
                          width:
                            selectedDentists.length !== 1
                              ? `${COLUMN_WIDTH}px`
                              : "100%",
                        }}
                        onPointerDown={(e) => {
                          if (!isDragging)
                            handleSlotHighlightMouseDown(dentist.id, e);
                        }}
                      >
                        {/* Render hour slots for the column */}
                        {timeSlots.map((time, timeIndex) => (
                          <div
                            key={timeIndex}
                            style={{ height: `${TIME_SLOT_HEIGHT}px` }}
                            className="border-secondary-foreground/10 relative border-b"
                          >
                            {/* Render sub-slots as droppable zones */}
                            {Array.from({ length: SLOTS_PER_HOUR }).map(
                              (_, slotIndex) => {
                                const minutes = timeIndex * 60 + slotIndex * 15;
                                const slotId = `slot-${dentist.id}-${minutes}`;
                                return (
                                  <SlotDroppable key={slotId} id={slotId} />
                                );
                              },
                            )}
                          </div>
                        ))}

                        {/* Render appointments absolute within the column */}
                        {appointmentsForDentist.map((appointment) => {
                          const top = getAppointmentTop(appointment.startTime);
                          const left = getAppointmentLeft(
                            appointment.dentistId,
                          );
                          const height = getAppointmentHeight(
                            appointment.startTime,
                            appointment.endTime,
                          );
                          const width = getAppointmentWidth();
                          const duration = getAppointmentDuration(
                            appointment.startTime,
                            appointment.endTime,
                          );
                          const showFullInfo = duration >= 30;

                          return (
                            <DraggableAppointment
                              key={appointment.id}
                              appointment={appointment}
                              top={top}
                              left={left}
                              width={width}
                              height={height}
                              showFullInfo={showFullInfo}
                            />
                          );
                        })}

                        {/* Render highlight if selection exists */}
                        {slotsSelection[dentist.id] && (
                          <div
                            style={highlightStyle(dentist.id)}
                            className="text-accent-foreground bg-primary/40 pointer-events-none absolute w-full overflow-hidden rounded-sm border-2 border-dashed p-2 text-xs sm:text-sm"
                          >
                            <div style={{ whiteSpace: "pre-line" }}>
                              {highlightLabel(String(dentist.id))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
              {selectedView === "Week" && (
                <>
                  {weekDates.map((day, index) => {
                    const schedulesToday = groupAppointmentsForDay(
                      day.toISOString(),
                      dummyAppointments,
                    );
                    return (
                      <div
                        key={index}
                        className={cn(
                          "border-secondary-foreground/10 relative z-10 flex-1 border-l",
                          { "bg-blue-50 dark:bg-blue-950": isToday(day) },
                        )}
                        style={{ width: `${COLUMN_WIDTH}px` }}
                      >
                        {timeSlots.map((time, index) => (
                          <div
                            key={index}
                            style={{ height: `${TIME_SLOT_HEIGHT}px` }}
                            className="border-secondary-foreground/10 relative border-b"
                          ></div>
                        ))}

                        {/* Render schedules absolute within the column */}
                        {schedulesToday.map((group, index) => {
                          const top = getAppointmentTop(group.startTime);
                          const left = 0;
                          const height = getAppointmentHeight(
                            group.startTime,
                            group.endTime,
                          );
                          const width = getAppointmentWidth();
                          const duration = getAppointmentDuration(
                            group.startTime,
                            group.endTime,
                          );
                          const showFullInfo = duration >= 30;
                          return (
                            <WeekViewSchedules
                              key={index}
                              group={group}
                              top={top}
                              left={left}
                              width={width}
                              height={height}
                              showFullInfo={showFullInfo}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {/* floating preview badge */}
      <DragTimeIndicator />

      <DragOverlayAppointment />
      <ConfirmAppointmentMove />
    </DndContext>
  );
}

export { Calendar, CalendarBody, CalendarHeader };

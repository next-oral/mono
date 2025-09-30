"use client"

import type { CSSProperties } from "react";
import React, { useRef } from "react"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "../../icons"
import { cn } from "../../lib/utils"
import { Stethoscope } from "lucide-react"
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    rectIntersection
} from "@dnd-kit/core"
import type { DragStartEvent, DragMoveEvent, DragEndEvent, CollisionDetection, Modifier, Collision } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { isToday } from "date-fns"
import { useCalendarStore } from "./store/store";
import { WeekViewDays } from "./components/week-view-days";
import { DentistsRow } from "./components/dentists-row";
import {
    COLUMN_WIDTH,
    TIME_SLOT_HEIGHT, // px per hour
    SNAP_GRID,// px snap => 15 minutes
    MIN_APPOINTMENT_MINUTES,
    SLOTS_PER_HOUR, // 4 slots per hour
    SLOT_HEIGHT, // 25px per 15-min slot
    DAY_MIN_START,
    DAY_MAX_END,
    timeSlots
} from "./constants";
import { SlotDroppable } from "./components/slot-droppable";
import { DraggableAppointment } from "./components/draggable-appointment";
import { DragTimeIndicator } from "./components/drag-time-indicator";
import { DragOverlayAppointment } from "./components/drag-overlay-appointment";
import { ConfirmAppointmentMove } from "./components/dialogs/confirm-appointment-move";
import { CreateAppointmentDialog } from "./components/dialogs/create-appointment-dialog";
import { AppointmentEditDialog } from "./components/dialogs/appointment-delete-dialog";
import { DentistsSelector } from "./components/dentists-selector";
import { DateSelector } from "./components/date-selector";
import { clampBounds, isAmPmThisHour, minutesToTime, roundToQuarter, snapToGrid } from "@repo/design/lib/calendar";

function Calendar({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full min-w-2xl mx-auto p-4">
            {children}
        </div >
    )
}

function CalendarHeader() {
    const {
        selectedView,
        setSelectedView,
        currentDate,
        setCurrentDate,
    } = useCalendarStore();

    // const selectedDentistNamesLabel = () => {
    //     if (selectedDentists.length === 0) return "All Dentists"
    //     const names = selectedDentists.map(d => `Dr. ${truncateText(d.name, 10)}`)
    //     if (names.length <= 2) return names.join(", ")
    //     return `${names[0]} + ${names.length - 1} more`
    // }

    function handlePrev() {
        if (selectedView === "Day") {
            const oneDayAgo = new Date(currentDate); oneDayAgo.setDate(oneDayAgo.getDate() - 1); setCurrentDate(oneDayAgo)
        } else {
            const oneWeekAgo = new Date(currentDate); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); setCurrentDate(oneWeekAgo)
        }
    }

    function handleNext() {
        if (selectedView === "Day") {
            const oneDayFuture = new Date(currentDate); oneDayFuture.setDate(oneDayFuture.getDate() + 1); setCurrentDate(oneDayFuture)
        } else {
            const oneWeekFuture = new Date(currentDate); oneWeekFuture.setDate(oneWeekFuture.getDate() + 7); setCurrentDate(oneWeekFuture)
        }
    }


    return (
        <div className="flex items-center justify-between mb-6 gap-4" >
            <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">Show</span>
                <DentistsSelector />
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrev}><ChevronLeft className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNext}><ChevronRight className="h-3 w-3" /></Button>
                </div>

                <DateSelector />

                <div className="flex items-center bg-muted rounded-lg p-0.5">
                    <Button variant={selectedView === "Day" ? "secondary" : "ghost"} size="sm" onClick={() => setSelectedView("Day")} className={cn("h-7 px-3 text-xs", { "bg-popover shadow-sm": selectedView === "Day" })}>Day</Button>
                    <Button variant={selectedView === "Week" ? "secondary" : "ghost"} size="sm" onClick={() => setSelectedView("Week")} className={cn("h-7 px-3 text-xs", { "bg-popover shadow-sm": selectedView === "Week" })}>Week</Button>
                </div>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs">New Appointment</Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3 w-3" /></Button>
            </div>
        </div >
    )
}

function CalendarBody() {
    const { selectedView, selectedDentists, getWeekDates, currentDate } = useCalendarStore();

    const appointments = useCalendarStore(state => state.appointments);

    const isDragging = useCalendarStore(state => state.isDragging);
    const setIsDragging = useCalendarStore(state => state.setIsDragging);

    const setActiveId = useCalendarStore(state => state.setActiveId);

    const slotsSelection = useCalendarStore(state => state.slotsSelection);
    const setSlotsSelection = useCalendarStore(state => state.setSlotsSelection);

    const originalAppointment = useCalendarStore(state => state.originalAppointment);
    const setOriginalAppointment = useCalendarStore(state => state.setOriginalAppointment);

    const setNewStartTime = useCalendarStore(state => state.setNewStartTime);

    const pendingNewStartMinutes = useCalendarStore(state => state.pendingNewStartMinutes);
    const setPendingNewStartMinutes = useCalendarStore(state => state.setPendingNewStartMinutes);

    const setTargetAppointment = useCalendarStore(state => state.setTargetAppointment);

    const setShowConfirmDialog = useCalendarStore(state => state.setShowConfirmDialog);

    const getFilteredDentists = useCalendarStore(state => state.getFilteredDentists);
    const getFilteredAppointments = useCalendarStore(state => state.getFilteredAppointments);

    const getAppointmentHeight = useCalendarStore(state => state.getAppointmentHeight);
    const getAppointmentTop = useCalendarStore(state => state.getAppointmentTop);
    const getAppointmentDuration = useCalendarStore(state => state.getAppointmentDuration);
    const getAppointmentWidth = useCalendarStore(state => state.getAppointmentWidth);
    const getAppointmentLeft = useCalendarStore(state => state.getAppointmentLeft);

    const getTimeFromPixelPosition = useCalendarStore(state => state.getTimeFromPixelPosition);
    const timeToMinutes = useCalendarStore(state => state.timeToMinutes);

    const findActiveAppointment = useCalendarStore(state => state.findActiveAppointment);
    const newStartTime = useCalendarStore(state => state.newStartTime);

    const dentistColumnRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const weekDates = getWeekDates();

    // ---- Highlighting Feature
    function handleSlotHighlightMouseDown(dentistId: number | string, e: React.MouseEvent) {
        // Prevent if the target is an appointment
        setSlotsSelection({})
        if ((e.target as HTMLElement).closest("[data-is-appointment]")) {
            return;
        }

        const columnRef = dentistColumnRefs.current[dentistId];
        if (!columnRef) return;

        const rect = columnRef.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const { hour, minute } = getTimeFromPixelPosition(y, rect.height);

        // Set initial start time, end is null until mouse up
        setSlotsSelection((prev) => ({
            ...prev,
            [dentistId]: { start: { hour, minute }, end: null }
        }));

        // Set up mouse move and up listeners for dragging
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const moveY = moveEvent.clientY - rect.top;
            const { hour: endHour, minute: endMinute } = getTimeFromPixelPosition(moveY, rect.height);

            // Ensure existing selection exists before updating end
            setSlotsSelection((prev) => {
                const existing = prev[dentistId];
                if (!existing) return prev; // nothing to update
                return {
                    ...prev,
                    [dentistId]: {
                        start: existing.start,
                        end: { hour: endHour, minute: endMinute }
                    }
                };
            });
        }

        const handleMouseUp = () => {
            // Clean up listeners after selection is complete
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    // This function styles the highlighting
    const getHighlightStyle = (dentistId: number | string): CSSProperties => {
        const selection = slotsSelection[dentistId];
        if (!selection?.end) return { display: "none" };

        // Determine min and max for start/end (allow dragging up or down)
        const startHour = Math.min(selection.start.hour, selection.end.hour);
        const startMinute = selection.start.hour === startHour ? selection.start.minute : selection.end.minute;
        const endHour = Math.max(selection.start.hour, selection.end.hour);
        const endMinute = selection.start.hour === startHour ? selection.end.minute : selection.start.minute;

        // Calculate top position and height in pixels
        const top = (startHour * TIME_SLOT_HEIGHT) + (startMinute / MIN_APPOINTMENT_MINUTES) * SLOT_HEIGHT;
        const durationMinutes = ((endHour - startHour) * 60) + (endMinute - startMinute);
        const height = (durationMinutes / MIN_APPOINTMENT_MINUTES) * SLOT_HEIGHT;

        return {
            position: "absolute",
            top: `${top}px`,
            left: 0,
            width: "100%",
            height: `${height}px`,
            backgroundColor: "rgba(0, 125, 255, 0.5)",
            borderRadius: "4px",
            color: "white",
            padding: "8px",
            boxSizing: "border-box",
            zIndex: 5,
            pointerEvents: "none"
        }
    }

    // Function to get the label text for the highlight
    // This shows "(No title)" and the time range like in the image
    const getLabel = (dentistId: string): string => {
        const selection = slotsSelection[dentistId];
        if (!selection?.end) return "";

        // Sort start and end times
        const start = selection.start.hour < selection.end.hour ||
            (selection.start.hour === selection.end.hour && selection.start.minute < selection.end.minute)
            ? selection.start : selection.end;
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

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 120, tolerance: 5 } }))
    const modifiers = [restrictToVerticalAxis, restrictToParentElement, snapToGrid] satisfies Modifier[];

    function customCollisionDetection(args: Parameters<CollisionDetection>[number]) {
        // RectIntersection to be able to detect even when schedule edges touch
        const rectCollisions = rectIntersection(args)
        if (rectCollisions.length > 0) {
            const appointmentCollisions = rectCollisions.filter((c): c is Collision => {
                return typeof c.id === "string" && c.id.startsWith("slot-")
            })
            if (appointmentCollisions.length > 0) return appointmentCollisions
            return rectCollisions
        }

        // // Detect pointer-within in-case if rect intersection fails
        // const pointerCollisions = pointerWithin(args)

        // if (pointerCollisions.length > 0) {
        //     // Prioritize appointment collisions
        //     const appointmentCollisions = pointerCollisions.filter((c: { id: string }) => {
        //         return !(c.id && c.id.startsWith("slot-"))
        //     })
        //     if (appointmentCollisions.length > 0) return appointmentCollisions
        //     return pointerCollisions
        // }

        // Fallback to closest center
        return closestCenter(args);
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event
        const appointment = appointments.find((a) => String(a.id) === String(active.id))
        if (!appointment) return
        setActiveId(active.id)
        setOriginalAppointment({ ...appointment })

        // initialize pendingNewStartMinutes baseline
        const origMinutes = timeToMinutes(appointment.startTime)
        setPendingNewStartMinutes(origMinutes)
        setNewStartTime(minutesToTime(origMinutes));

        setIsDragging(true);
    }

    function handleDragMove(event: DragMoveEvent) {
        const { delta } = event
        if (!originalAppointment) return;

        const snappedDeltaY = Math.round(delta.y / SNAP_GRID) * SNAP_GRID; // snap at every 15 minutes (25 px) on vertical axis
        const minutesDelta = (snappedDeltaY / TIME_SLOT_HEIGHT) * 60;

        let tentativeStart = timeToMinutes(originalAppointment.startTime) + minutesDelta;
        tentativeStart = roundToQuarter(tentativeStart);
        tentativeStart = clampBounds(tentativeStart, DAY_MIN_START, DAY_MAX_END);

        setPendingNewStartMinutes(tentativeStart);
        setNewStartTime(minutesToTime(tentativeStart));
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);
        setIsDragging(false)

        if (!originalAppointment) {
            setNewStartTime(null)
            setPendingNewStartMinutes(null)
            return
        }

        const origMinutes = timeToMinutes(originalAppointment.startTime)
        const newStartMinutes = typeof pendingNewStartMinutes === "number" ? pendingNewStartMinutes : origMinutes

        // If time didn't change, cancel / revert
        if (newStartMinutes === origMinutes) {
            setOriginalAppointment(null)
            setNewStartTime(null)
            setPendingNewStartMinutes(null)
            return
        }

        const newStart = minutesToTime(newStartMinutes)

        // If over is a slot (id like "slot-{dentistId}-{minutes}") => treat as empty slot
        if (over && typeof over.id === "string" && over.id.startsWith("slot-")) {
            setTargetAppointment(null)
            setPendingNewStartMinutes(newStartMinutes)
            setNewStartTime(newStart)
            setShowConfirmDialog(true)
            return
        }

        // If dropped over another appointment
        if (over && String(over.id) !== String(active.id)) {
            const overAppointment = appointments.find((a) => String(a.id) === String(over.id))
            if (overAppointment) {
                // Restrict swap/replace to same dentist only
                if (overAppointment.dentistId !== originalAppointment.dentistId) {
                    // revert silently
                    setOriginalAppointment(null)
                    setNewStartTime(null)
                    setPendingNewStartMinutes(null)
                    return
                }

                // prepare confirm: swap/replace options
                setTargetAppointment(overAppointment)
                setPendingNewStartMinutes(newStartMinutes)
                setNewStartTime(newStart)
                setShowConfirmDialog(true)
                return
            }
        }

        // fallback: treat as empty slot
        setTargetAppointment(null)
        setPendingNewStartMinutes(newStartMinutes)
        setNewStartTime(newStart)
        setShowConfirmDialog(true)
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
            <ScrollArea className="w-auto h-[100vh]">
                <div className="min-w-[800px] relative">
                    {selectedView === "Week" && (
                        <WeekViewDays />
                    )}

                    <div className={cn("bg-background z-[12]", { "sticky top-0": selectedView === "Day" })}>
                        <div className="flex items-center border-t first:border-b border-secondary">
                            <div className="text-xs font-medium text-muted-foreground text-right w-12">{selectedView === "Day" ? <Stethoscope className="h-4 w-4" /> : "All day"}</div>
                            {selectedView === "Day" ? (
                                <DentistsRow />
                            ) : (
                                <div className="flex-1 grid grid-cols-7">
                                    {weekDates.map((date, index) => <div key={index} className={cn("h-8 border border-primary/5", { "bg-primary/20": isToday(date) })}></div>)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-0 relative">
                        <div className="flex">
                            <div className="w-12 sticky left-0 z-10 bg-background/80 backdrop-blur-xl">
                                {timeSlots.map((time, index) => (
                                    <div key={index} style={{ height: `${TIME_SLOT_HEIGHT}px` }} className="border-b border-secondary text-xs text-muted-foreground pr-2 text-right">
                                        {time}
                                        {isAmPmThisHour(time) && isToday(currentDate) && <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 mx-auto"></div>}
                                    </div>
                                ))}
                            </div>

                            {/* Dentist columns */}
                            {getFilteredDentists().map((dentist, index) => {
                                // Filter appointments for this dentist only
                                const appointmentsForDentist = getFilteredAppointments().filter(appointment => appointment.dentistId === dentist.id);
                                return (
                                    <div
                                        key={dentist.id + index}
                                        ref={(el) => { dentistColumnRefs.current[dentist.id] = el }}
                                        className="flex-1 relative border-l border-secondary"
                                        style={{ width: selectedDentists.length !== 1 ? `${COLUMN_WIDTH}px` : "100%" }}
                                        onMouseDown={(e) => {
                                            if (!isDragging) handleSlotHighlightMouseDown(dentist.id, e);
                                        }}
                                    >
                                        {/* Render hour slots for the column */}
                                        {timeSlots.map((time, timeIndex) => (
                                            <div key={timeIndex} style={{ height: `${TIME_SLOT_HEIGHT}px` }} className="border-b border-secondary relative">
                                                {/* Render sub-slots as droppable zones */}
                                                {Array.from({ length: SLOTS_PER_HOUR }).map((_, slotIndex) => {
                                                    const minutes = (timeIndex * 60) + (slotIndex * 15);
                                                    const slotId = `slot-${dentist.id}-${minutes}`;
                                                    return (
                                                        <SlotDroppable
                                                            key={slotId}
                                                            id={slotId}
                                                        />
                                                    );
                                                })}
                                                {isAmPmThisHour(time) && isToday(currentDate) && <div className="absolute w-full h-[0.1px] border-primary/20 border-dashed border-2 rounded-sm bg-primary/20 z-[0] top-[48%]" />}
                                            </div>
                                        ))}

                                        {/* Render appointments absolute within the column */}
                                        {appointmentsForDentist.map((appointment) => {
                                            const top = getAppointmentTop(appointment.startTime);
                                            const height = getAppointmentHeight(appointment.startTime, appointment.endTime);
                                            const width = getAppointmentWidth();
                                            const duration = getAppointmentDuration(appointment.startTime, appointment.endTime);
                                            const showFullInfo = duration >= 30;

                                            return (
                                                <DraggableAppointment
                                                    key={appointment.id}
                                                    appointment={appointment}
                                                    top={top}
                                                    left={getAppointmentLeft(appointment.dentistId)}
                                                    width={width}
                                                    height={height}
                                                    showFullInfo={showFullInfo}
                                                />
                                            );
                                        })}

                                        {/* Render highlight if selection exists */}
                                        {slotsSelection[dentist.id] && (
                                            <div style={getHighlightStyle(dentist.id)}>
                                                <div style={{ whiteSpace: "pre-line" }}>{getLabel(String(dentist.id))}</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ScrollArea>
            {/* floating preview badge */}
            {
                findActiveAppointment() && newStartTime && (
                    <DragTimeIndicator />
                )
            }

            <DragOverlayAppointment />
            <ConfirmAppointmentMove />
            <CreateAppointmentDialog />
            <AppointmentEditDialog />
        </DndContext >
    )
}

export {
    Calendar,
    CalendarHeader,
    CalendarBody
}
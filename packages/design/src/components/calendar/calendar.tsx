"use client"

import type { CSSProperties } from "react";
import React, { useRef } from "react"
import { Button } from "../ui/button"
import { Calendar as CalendarUI } from "../ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ScrollArea } from "../ui/scroll-area"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "../../icons"
import { cn, isAmPmThisHour, truncateText } from "../../lib/utils"
import { ArrowUpDown, ChevronsUpDown, ReplaceAllIcon, ReplaceIcon, Stethoscope } from "lucide-react"
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    pointerWithin,
    rectIntersection
} from "@dnd-kit/core"
import type { DragStartEvent, DragMoveEvent, DragEndEvent, CollisionDetection, Modifier } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { endOfWeek, format, isToday, startOfWeek } from "date-fns"
import { Command, CommandGroup, CommandInput, CommandItem } from "../ui/command"
import { Checkbox } from "../ui/checkbox"
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
    DAY_MINUTES,
    DAY_MIN_START,
    DAY_MAX_END,
    timeSlots
} from "./constants";
import { SlotDroppable } from "./components/slot-droppable";
import { DraggableAppointment } from "./components/draggable-appointment";
import { DragTimeIndicator } from "./components/drag-time-indicator";
import { DragOverlayAppointment } from "./components/drag-overlay-appointment";
import { ConfirmAppointmentMove } from "./components/dialogs/confirm-appointment-move";

const {
    dentists,
} = useCalendarStore.getState();

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const roundToQuarter = (minutes: number) => Math.round(minutes / 15) * 15;

const snapToGrid = (args: { transform?: { y: number } }): Modifier => {
    const { transform } = args;

    if (!transform) return {
        y: 0
    };
    const snappedY = Math.round(transform.y / SNAP_GRID) * SNAP_GRID;
    return { ...transform, y: snappedY };
}

// generate time labels 12AM -> 11PM

function minutesToTime(minutes: number) {
    minutes = clamp(Math.round(minutes), 0, DAY_MINUTES - 1);
    const hh = Math.floor(minutes / 60);
    const mm = minutes % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function Calendar({ children }: { children: React.ReactNode }) {
    const {
        showNewAppointmentDialog,
        setShowNewAppointmentDialog,
        showEditAppointmentDialog,
        setShowEditAppointmentDialog,
        setSelectedAppointment,
    } = useCalendarStore();

    const setAppointments = useCalendarStore(state => state.setAppointments);

    // DnD states
    const {
        originalAppointment,
        setOriginalAppointment,
        newStartTime,
        setNewStartTime,
    } = useCalendarStore();

    const timeToMinutes = useCalendarStore(state => state.timeToMinutes);
    const findActiveAppointment = useCalendarStore(state => state.findActiveAppointment);

    // confirm dialog
    const {
        showConfirmDialog,
        setShowConfirmDialog,
        targetAppointment,
        setTargetAppointment,
        pendingNewStartMinutes,
        setPendingNewStartMinutes,
    } = useCalendarStore();

    const handleNewAppointmentDialogClose = () => setShowNewAppointmentDialog(false)
    const handleEditAppointmentDialogClose = () => { setShowEditAppointmentDialog(false); setSelectedAppointment(null) }

    const getAppointmentDuration = (startTime: string, endTime: string) => {
        const startMinutes = timeToMinutes(startTime)
        const endMinutes = timeToMinutes(endTime)
        return endMinutes - startMinutes
    }

    // Handle the user's choice from the dialog
    function handleConfirmChoice(choice: "replace" | "replace_preserve_time" | "swap" | "cancel" | "move") {
        if (!originalAppointment) {
            setShowConfirmDialog(false)
            setOriginalAppointment(null)
            setNewStartTime(null)
            setPendingNewStartMinutes(null)
            setTargetAppointment(null)
            return
        }

        const draggedId = originalAppointment.id

        if (choice === "cancel") {
            // revert
            setShowConfirmDialog(false);
            setOriginalAppointment(null);
            setNewStartTime(null);
            setPendingNewStartMinutes(null);
            setTargetAppointment(null);
            return;
        }

        setAppointments((prev) => {
            let next = prev.map((p) => ({ ...p }));

            const draggedIndex = next.findIndex((p) => p.id === draggedId);
            if (draggedIndex === -1) return prev;

            const dragged = next[draggedIndex];

            // Move to empty time slot
            if (choice === "move") {
                if (pendingNewStartMinutes === null) return prev;
                const duration = getAppointmentDuration(String(dragged?.startTime), String(dragged?.endTime));
                const newStart = minutesToTime(pendingNewStartMinutes);
                const newEnd = minutesToTime(pendingNewStartMinutes + duration);
                next[draggedIndex] = { ...dragged, startTime: newStart, endTime: newEnd };
                return next;
            }

            // actions that need a target
            if (!targetAppointment) return prev;
            const targetIndex = next.findIndex((p) => p.id === targetAppointment.id);
            if (targetIndex === -1) return prev;
            const target = next[targetIndex];

            if (choice === "replace") {
                // dragged takes target's time & dentist; remove target
                next[draggedIndex] = { ...dragged, startTime: String(target?.startTime), endTime: String(target?.endTime), dentistId: Number(target?.dentistId) };
                next = next.filter((p) => p.id !== target?.id);
                return next;
            } else if (choice === "replace_preserve_time") {
                // delete target; dragged keeps its time
                next = next.filter((p) => p.id !== target?.id);
                return next;
            } else {
                // if choice is swap
                // swap times between dragged and target
                const draggedTimes = { startTime: dragged?.startTime, endTime: String(dragged?.endTime) }
                next[draggedIndex] = { ...dragged, startTime: target.startTime, endTime: target.endTime }
                next[targetIndex] = { ...target, startTime: draggedTimes.startTime, endTime: draggedTimes.endTime }
                return next
            }
        });

        // clear state
        setShowConfirmDialog(false);
        setOriginalAppointment(null);
        setTargetAppointment(null);
        setNewStartTime(null);
        setPendingNewStartMinutes(null);
    }

    // Utility function to convert pixel position to time
    // This calculates the start/end time based on y-position in the calendar
    const getTimeFromPixelPosition = (y: number, containerHeight: number): { hour: number; minute: number } => {
        const totalMinutes = (y / containerHeight) * (timeSlots.length * 60);
        const hour = Math.floor(totalMinutes / 60);
        const minute = Math.floor((totalMinutes % 60) / MIN_APPOINTMENT_MINUTES) * MIN_APPOINTMENT_MINUTES;

        return { hour, minute };
    };

    return (

        <div className="w-full min-w-2xl mx-auto p-4">
            {children}

            <DragOverlayAppointment />

            <Dialog open={showNewAppointmentDialog} onOpenChange={handleNewAppointmentDialogClose}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Create New Appointment</DialogTitle></DialogHeader>
                    <div className="p-4"><p>New appointment dialog content will be implemented here.</p><Button onClick={handleNewAppointmentDialogClose} className="mt-4">Close</Button></div>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditAppointmentDialog} onOpenChange={handleEditAppointmentDialogClose}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Edit Appointment</DialogTitle></DialogHeader>
                    <div className="p-4"><p>Edit appointment dialog content will be implemented here.</p><div className="flex gap-2 mt-4"><Button onClick={() => handleEditAppointmentDialogClose()}>Save Changes</Button><Button variant="outline" onClick={() => handleEditAppointmentDialogClose()}>Cancel</Button></div></div>
                </DialogContent>
            </Dialog>
        </div >
    )
}

function CalendarHeader() {
    const {
        selectedView,
        setSelectedView,
        currentDate,
        setCurrentDate,
        selectedDentists,
        setSelectedDentists,
        isDentistsSelectorOpen,
        setIsDentistsSelectorOpen,
        toggleDentistSelectionObject
    } = useCalendarStore();

    const selectedDentistNamesLabel = () => {
        if (selectedDentists.length === 0) return "All Dentists"
        const names = selectedDentists.map(d => `Dr. ${truncateText(d.name, 10)}`)
        if (names.length <= 2) return names.join(", ")
        return `${names[0]} + ${names.length - 1} more`
    }

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

    function selectAllDentistsObjects() {
        setSelectedDentists([]) // empty array = all
    }

    return (
        <div className="flex items-center justify-between mb-6 gap-4" >
            <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">Show</span>
                {/* Popover + Command (combobox-like) for selecting dentists (store objects) */}
                <Popover open={isDentistsSelectorOpen} onOpenChange={setIsDentistsSelectorOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isDentistsSelectorOpen}
                            className="w-[240px] justify-between text-xs"
                        >
                            {selectedDentistNamesLabel()}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="size-fit p-0">
                        <Command>
                            <CommandInput placeholder="Search dentist..." className="h-9" />
                            <CommandGroup className="border-b">
                                <CommandItem onSelect={() => selectAllDentistsObjects()} className="data-[selected=true]:bg-transparent">
                                    <div className="flex items-center gap-2">
                                        <Checkbox checked={selectedDentists.length === 0} />
                                        <span>All Dentists</span>
                                    </div>
                                </CommandItem>
                            </CommandGroup>

                            <CommandGroup>
                                {dentists.map((dentist) => {
                                    const checked = selectedDentists.length === 0 || selectedDentists.some(s => s.id === dentist.id)
                                    return (
                                        <CommandItem
                                            key={dentist.id}
                                            onSelect={() => toggleDentistSelectionObject(dentist)}
                                            className="capitalize data-[selected=true]:bg-transparent"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Checkbox checked={checked} />
                                                <span>Dr. {dentist.name}</span>
                                            </div>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrev}><ChevronLeft className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNext}><ChevronRight className="h-3 w-3" /></Button>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className="text-xs">
                            {selectedView === "Day" && format(currentDate, "MMM d, yyyy")}
                            {selectedView === "Week" &&
                                (`${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} - 
                                    ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")}, ${currentDate.getFullYear()}`)}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="size-fit p-0 border-0">
                        <CalendarUI
                            mode={"single"}
                            selected={currentDate}
                            onSelect={(date) => {
                                console.log(date)
                                if (date)
                                    setCurrentDate(new Date(date));
                            }}
                            today={new Date()}
                            className="rounded-md border shadow-sm" />
                    </PopoverContent>
                </Popover>

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

    const timeToMinutes = useCalendarStore(state => state.timeToMinutes);

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
        setSlotsSelection((prev: Record<string, { start: { hour: number; minute: number }; end: { hour: number; minute: number } | null }>) => ({
            ...prev,
            [dentistId]: { start: { hour, minute }, end: null }
        }));

        // Set up mouse move and up listeners for dragging
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const moveY = moveEvent.clientY - rect.top;
            const { hour: endHour, minute: endMinute } = getTimeFromPixelPosition(moveY, rect.height);

            // Update end time in real-time as user drags
            setSlotsSelection((prev) => (({
                ...prev,
                [dentistId]: { ...prev[dentistId], end: { hour: endHour, minute: endMinute } }
            })));
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
    const modifiers = [restrictToVerticalAxis, restrictToParentElement] satisfies Modifier[];

    function customCollisionDetection(args: Parameters<CollisionDetection>[number]) {
        // RectIntersection to be able to detect even when schedule edges touch
        const rectCollisions = rectIntersection(args)
        if (rectCollisions.length > 0) {
            const appointmentCollisions = rectCollisions.filter((c: { id: string }) => {
                return (c?.id && c?.id?.startsWith("slot-"))
            })
            if (appointmentCollisions.length > 0) return appointmentCollisions
            return rectCollisions
        }

        // Detect pointer-within in-case if rect intersection fails
        const pointerCollisions = pointerWithin(args)

        if (pointerCollisions.length > 0) {
            // Prioritize appointment collisions
            const appointmentCollisions = pointerCollisions.filter((c: { id: string }) => {
                return !(c.id && c.id.startsWith("slot-"))
            })
            if (appointmentCollisions.length > 0) return appointmentCollisions
            return pointerCollisions
        }

        // Fallback to closest center
        return closestCenter(args)
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
        tentativeStart = clamp(tentativeStart, DAY_MIN_START, DAY_MAX_END);

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
                                        ref={(el) => (dentistColumnRefs.current[dentist.id] = el)}
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
        </DndContext>
    )
}


function CalendarDragOverlayAppoitment() {
    return (
        <DragOverlayAppointment />
    )
}

// TODO: Move Indicator indicator within the body if necessary
function CalendarDragIndicator() {
    const { findActiveAppointment, newStartTime } = useCalendarStore();
    return (
        <>
            {/* floating preview badge */}
            {
                findActiveAppointment() && newStartTime && (
                    <DragTimeIndicator />
                )
            }
        </>
    )
}

function CalendarConfirmAppointmentMove() {
    return (
        <ConfirmAppointmentMove />
    )
}

export {
    Calendar,
    CalendarHeader,
    CalendarBody
}
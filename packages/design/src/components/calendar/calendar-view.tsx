"use client"

import React, { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Calendar as CalendarUI } from "../ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "../../icons"
import { cn, truncateText } from "../../lib/utils"
import { Stethoscope } from "lucide-react"
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    pointerWithin,




    useDraggable,
    useDroppable
} from "@dnd-kit/core"
import type { DragStartEvent, DragMoveEvent, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

const dentistSample = [
    { id: 1, name: "josh keneddy", avatar: "https://github.com/shadcn.png", startDate: "2023-08-25" },
    { id: 2, name: "princewill maximillian", avatar: "https://placehold.co/100x100/F0F8FF/333?text=PM", startDate: "2021-05-12" },
    { id: 3, name: "ebere adeotun", avatar: "https://github.com/evilrabbit.png", startDate: "2022-03-04" },
    { id: 4, name: "john doe", avatar: "https://github.com/shadcn.png", startDate: "2020-07-19" },
    { id: 5, name: "harry simmons", avatar: "https://github.com/leerob.png", startDate: "2023-01-20" },
    { id: 6, name: "beatrice salvador", avatar: "https://github.com/evilrabbit.png", startDate: "2021-09-08" },
    { id: 7, name: "joy madueke", avatar: "https://github.com/leerob.png", startDate: "2022-11-15" },
    { id: 8, name: "santiago de-lima", avatar: "https://placehold.co/100x100/F0F8FF/333?text=SDL", startDate: "2023-04-30" },
    { id: 9, name: "tola oluwatosin", avatar: "https://placehold.co/100x100/F0F8FF/333?text=TO", startDate: "2020-06-22" },
    { id: 10, name: "kvicha belmond kvarakeslia", avatar: "https://placehold.co/100x100/F0F8FF/333?text=KBK", startDate: "2023-07-07" },
]

const colorClasses = [
    { stickerColor: "bg-blue-50 dark:bg-blue-700 text-foreground dark:text-background", lineColor: "bg-blue-700 dark:bg-blue-50" },
    { stickerColor: "bg-lime-50 dark:bg-lime-700 text-foreground dark:text-background", lineColor: "bg-lime-700 dark:bg-lime-50" },
    { stickerColor: "bg-orange-50 dark:bg-orange-700 text-foreground dark:text-background", lineColor: "bg-orange-700 dark:bg-orange-50" },
    { stickerColor: "bg-red-50 dark:bg-red-700 text-foreground dark:text-background", lineColor: "bg-red-700 dark:bg-red-50" },
    { stickerColor: "bg-amber-50 dark:bg-amber-700 text-foreground dark:text-background", lineColor: "bg-amber-700 dark:bg-amber-50" },
    { stickerColor: "bg-green-50 dark:bg-green-700 text-foreground dark:text-background", lineColor: "bg-green-700 dark:bg-green-50" },
]

const getRandomColor = () => colorClasses[Math.floor(Math.random() * colorClasses.length)]

const dummyAppointments = [
    { id: 1, dentistId: 1, patientName: "victor osimhen", startTime: "08:00", endTime: "10:15", date: new Date().toISOString().slice(0, 10), color: getRandomColor() },
    { id: 2, dentistId: 2, patientName: "Sarah Johnson", startTime: "09:00", endTime: "10:00", date: new Date().toISOString().slice(0, 10), color: getRandomColor() },
    { id: 3, dentistId: 1, patientName: "Mike Wilson", startTime: "14:00", endTime: "15:30", date: new Date().toISOString().slice(0, 10), color: getRandomColor() },
    { id: 4, dentistId: 3, patientName: "Emma Davis", startTime: "11:00", endTime: "12:00", date: new Date().toISOString().slice(0, 10), color: getRandomColor() },
    { id: 5, dentistId: 1, patientName: "Ikay Gundogan", startTime: "12:00", endTime: "14:00", date: new Date().toISOString().slice(0, 10), color: getRandomColor() },
    { id: 6, dentistId: 4, patientName: "Ikay Gundogan", startTime: "12:00", endTime: "13:55", date: new Date().toISOString().slice(0, 10), color: getRandomColor() },
    { id: 7, dentistId: 5, patientName: "Ikay Gundogan", startTime: "12:00", endTime: "13:55", date: new Date().toISOString().slice(0, 10), color: getRandomColor() },
    { id: 8, dentistId: 1, patientName: "Mavins Bernado", startTime: "08:00", endTime: "10:15", date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10), color: getRandomColor() },
    { id: 9, dentistId: 2, patientName: "Sarah Johnson", startTime: "09:00", endTime: "10:00", date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10), color: getRandomColor() },
    { id: 10, dentistId: 1, patientName: "Mike Wilson", startTime: "14:00", endTime: "15:30", date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10), color: getRandomColor() },
    { id: 11, dentistId: 3, patientName: "Emma Davis", startTime: "11:00", endTime: "12:00", date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10), color: getRandomColor() },
    { id: 12, dentistId: 1, patientName: "Ikay Gundogan", startTime: "12:00", endTime: "14:00", date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10), color: getRandomColor() },
    { id: 13, dentistId: 4, patientName: "Ikay Gundogan", startTime: "12:00", endTime: "13:55", date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().slice(0, 10), color: getRandomColor() },
    { id: 14, dentistId: 5, patientName: "james rodriguez", startTime: "12:00", endTime: "13:55", date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10), color: getRandomColor() },
]

const COLUMN_WIDTH = 160 // px per dentist column
const TIME_SLOT_HEIGHT = 100 // px per hour
const SNAP_GRID = 25 // px snap => 15 minutes
const MIN_APPOINTMENT_MINUTES = 15
const DAY_MINUTES = 24 * 60
const DAY_MIN_START = 0
const DAY_MAX_END = DAY_MINUTES - MIN_APPOINTMENT_MINUTES

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const roundToQuarter = (minutes: number) => Math.round(minutes / 15) * 15

const snapToGrid = (args: any) => {
    const { transform } = args
    if (!transform) return transform
    const snappedY = Math.round(transform.y / SNAP_GRID) * SNAP_GRID
    return { ...transform, y: snappedY }
}

type Appointment = (typeof dummyAppointments)[0]

function minutesToTime(minutes: number) {
    minutes = clamp(Math.round(minutes), 0, DAY_MINUTES - 1)
    const hh = Math.floor(minutes / 60)
    const mm = minutes % 60
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
}

export const Calendar = () => {
    const [selectedView, setSelectedView] = useState<"Day" | "Week">("Day")
    const [selectedDentist, setSelectedDentist] = useState<string | number>("All dentists")
    const [currentDate, setCurrentDate] = useState(new Date())

    const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)
    const [showEditAppointmentDialog, setShowEditAppointmentDialog] = useState(false)
    const [appointments, setAppointments] = useState<Appointment[]>(dummyAppointments)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

    // DnD state
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
    const [originalAppointment, setOriginalAppointment] = useState<Appointment | null>(null)
    const [newStartTime, setNewStartTime] = useState<string | null>(null)

    // confirm dialog
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [targetAppointment, setTargetAppointment] = useState<Appointment | null>(null)
    const [pendingNewStartMinutes, setPendingNewStartMinutes] = useState<number | null>(null)

    // generate time labels 12AM -> 11PM
    const timeSlots = Array.from({ length: 24 }).map((_, i) => {
        const hour = i
        const ampm = hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`
        return ampm
    })

    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number)
        return Number(hours) * 60 + Number(minutes)
    }

    const getAppointmentHeight = (startTime: string, endTime: string) => {
        const startMinutes = timeToMinutes(startTime)
        const endMinutes = timeToMinutes(endTime)
        const durationMinutes = endMinutes - startMinutes
        const minDuration = Math.max(durationMinutes, MIN_APPOINTMENT_MINUTES)
        return (minDuration / 60) * TIME_SLOT_HEIGHT
    }

    const getAppointmentTop = (startTime: string) => {
        const startMinutes = timeToMinutes(startTime)
        return (startMinutes / 60) * TIME_SLOT_HEIGHT
    }

    const getWeekDates = (date: Date) => {
        const week = []
        const startOfWeek = new Date(date)
        const day = startOfWeek.getDay()
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
        startOfWeek.setDate(diff)
        for (let i = 0; i < 7; i++) {
            const weekDate = new Date(startOfWeek)
            weekDate.setDate(startOfWeek.getDate() + i)
            week.push(weekDate)
        }
        return week
    }

    const weekDates = getWeekDates(currentDate)
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", year: "numeric" }
        return date.toLocaleDateString("en-US", options)
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const handlePrev = () => {
        if (selectedView === "Day") {
            const oneDayAgo = new Date(currentDate); oneDayAgo.setDate(oneDayAgo.getDate() - 1); setCurrentDate(oneDayAgo)
        } else {
            const oneWeekAgo = new Date(currentDate); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); setCurrentDate(oneWeekAgo)
        }
    }

    const handleNext = () => {
        if (selectedView === "Day") {
            const oneDayFuture = new Date(currentDate); oneDayFuture.setDate(oneDayFuture.getDate() + 1); setCurrentDate(oneDayFuture)
        } else {
            const oneWeekFuture = new Date(currentDate); oneWeekFuture.setDate(oneWeekFuture.getDate() + 7); setCurrentDate(oneWeekFuture)
        }
    }

    const handleNewAppointmentDialogClose = () => setShowNewAppointmentDialog(false)
    const handleEditAppointmentDialogClose = () => { setShowEditAppointmentDialog(false); setSelectedAppointment(null) }

    const handleSlotDoubleClick = (e: React.MouseEvent, dentistId: number, index: number) => {
        console.log(e, dentistId, index)
    }

    const handleAppointmentClick = (e: React.MouseEvent, appointment: Appointment) => {
        console.log(e, appointment)
    }

    const getAppointmentLeft = (dentistId: number) => {
        if (selectedDentist !== "All dentists") return 4
        const dentistIndex = dentistSample.findIndex((d) => d.id === dentistId)
        return dentistIndex * COLUMN_WIDTH + 4
    }

    const getAppointmentWidth = () => {
        if (selectedDentist !== "All dentists") return "calc(100% - 56px)"
        return COLUMN_WIDTH - 8
    }

    const getAppointmentDuration = (startTime: string, endTime: string) => {
        const startMinutes = timeToMinutes(startTime)
        const endMinutes = timeToMinutes(endTime)
        return endMinutes - startMinutes
    }

    const getFilteredDentists = () => (selectedDentist === "All dentists" ? dentistSample : dentistSample.filter((d) => d.id === selectedDentist))

    const getFilteredAppointments = () => {
        const currentDateString = currentDate.toISOString().split("T")[0]
        let filtered = appointments.filter((appointment) => appointment.date === currentDateString)
        if (selectedDentist !== "All dentists") filtered = filtered.filter((appointment) => appointment.dentistId === selectedDentist)
        return filtered
    }

    // sensors + modifiers
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 120, tolerance: 5 } }))
    const modifiers = [restrictToVerticalAxis, restrictToParentElement, snapToGrid]

    const customCollisionDetection = (args: any) => {
        // Get droppables that contain the pointer
        const pointerCollisions = pointerWithin(args)

        if (pointerCollisions.length > 0) {
            // Prioritize appointment droppables (ids that are NOT "slot-...").
            // pointerWithin may return overlapping droppables (slot + appointment),
            // so prefer appointments so dropping on a visible appointment triggers replace/swap.
            const appointmentCollisions = pointerCollisions.filter((c: any) => {
                // If id is a string and starts with "slot-" it's a slot; otherwise treat as appointment.
                if (typeof c.id === "string") {
                    return !c.id.startsWith("slot-")
                }
                // numeric ids (or other types) are appointment ids — keep them.
                return true
            })

            if (appointmentCollisions.length > 0) {
                return appointmentCollisions
            }

            // No appointment under pointer — return slot collisions
            return pointerCollisions
        }

        // If pointerWithin found nothing, fallback to closestCenter (old behavior)
        return closestCenter(args)
    }

    // Drag handlers
    function handleDragStart(event: DragStartEvent) {
        const { active } = event
        const appointment = appointments.find((a) => String(a.id) === String(active.id))
        if (!appointment) return
        setActiveId(active.id)
        setOriginalAppointment({ ...appointment })

        // initialize pendingNewStartMinutes baseline
        const origMinutes = timeToMinutes(appointment.startTime)
        setPendingNewStartMinutes(origMinutes)
        setNewStartTime(minutesToTime(origMinutes))

        setTargetAppointment(null)
    }

    function handleDragMove(event: DragMoveEvent) {
        const { delta } = event
        if (!originalAppointment) return

        const snappedDeltaY = Math.round(delta.y / SNAP_GRID) * SNAP_GRID
        const minutesDelta = (snappedDeltaY / TIME_SLOT_HEIGHT) * 60

        let tentativeStart = timeToMinutes(originalAppointment.startTime) + minutesDelta
        tentativeStart = roundToQuarter(tentativeStart)
        tentativeStart = clamp(tentativeStart, DAY_MIN_START, DAY_MAX_END)

        setPendingNewStartMinutes(tentativeStart)
        setNewStartTime(minutesToTime(tentativeStart))
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveId(null)

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
            // parse for extra safety (but we already used pendingNewStartMinutes)
            // const [, dentistIdStr, minutesStr] = String(over.id).split("-")
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

    // Handle the user's choice from the dialog
    const handleConfirmChoice = (choice: "replace" | "replace_preserve_time" | "swap" | "no" | "move") => {
        if (!originalAppointment) {
            setShowConfirmDialog(false)
            setOriginalAppointment(null)
            setNewStartTime(null)
            setPendingNewStartMinutes(null)
            setTargetAppointment(null)
            return
        }

        const draggedId = originalAppointment.id

        if (choice === "no") {
            // revert
            setShowConfirmDialog(false)
            setOriginalAppointment(null)
            setNewStartTime(null)
            setPendingNewStartMinutes(null)
            setTargetAppointment(null)
            return
        }

        setAppointments((prev) => {
            let next = prev.map((p) => ({ ...p }))

            const draggedIndex = next.findIndex((p) => p.id === draggedId)
            if (draggedIndex === -1) return prev

            const dragged = next[draggedIndex]

            // Move to empty timeslot
            if (choice === "move") {
                if (pendingNewStartMinutes === null) return prev
                const duration = getAppointmentDuration(dragged.startTime, dragged.endTime)
                const newStart = minutesToTime(pendingNewStartMinutes)
                const newEnd = minutesToTime(pendingNewStartMinutes + duration)
                next[draggedIndex] = { ...dragged, startTime: newStart, endTime: newEnd }
                return next
            }

            // actions that need a target
            if (!targetAppointment) return prev
            const targetIndex = next.findIndex((p) => p.id === targetAppointment.id)
            if (targetIndex === -1) return prev
            const target = next[targetIndex]

            if (choice === "replace") {
                // dragged takes target's time & dentist; remove target
                next[draggedIndex] = { ...dragged, startTime: target.startTime, endTime: target.endTime, dentistId: target.dentistId }
                next = next.filter((p) => p.id !== target.id)
                return next
            }

            if (choice === "replace_preserve_time") {
                // delete target; dragged keeps its time
                next = next.filter((p) => p.id !== target.id)
                return next
            }

            if (choice === "swap") {
                // swap times between dragged and target
                const draggedTimes = { startTime: dragged.startTime, endTime: dragged.endTime }
                next[draggedIndex] = { ...dragged, startTime: target.startTime, endTime: target.endTime }
                next[targetIndex] = { ...target, startTime: draggedTimes.startTime, endTime: draggedTimes.endTime }
                return next
            }

            return prev
        })

        // clear state
        setShowConfirmDialog(false)
        setOriginalAppointment(null)
        setTargetAppointment(null)
        setNewStartTime(null)
        setPendingNewStartMinutes(null)
    }

    // active appointment for overlay
    const activeAppointment = activeId ? appointments.find((a) => String(a.id) === String(activeId)) : null

    return (
        <DndContext
            sensors={sensors}
            modifiers={modifiers}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            collisionDetection={customCollisionDetection}
        >
            <div className="w-full min-w-2xl mx-auto p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-muted-foreground">Show</span>
                        <Select value={selectedDentist.toString()} onValueChange={(value) => setSelectedDentist(value === "All dentists" ? "All dentists" : Number(value))}>
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem defaultChecked value="All dentists">All dentists</SelectItem>
                                {dentistSample.map((dentist) => (
                                    <SelectItem key={dentist.id} value={dentist.id.toString()} className="capitalize">Dr. {dentist.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrev}><ChevronLeft className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNext}><ChevronRight className="h-3 w-3" /></Button>
                        </div>

                        <Popover>
                            <PopoverTrigger asChild><Button variant={"outline"} className="text-xs">{formatDate(currentDate)}</Button></PopoverTrigger>
                            <PopoverContent className="size-fit p-0 border-0">
                                <CalendarUI mode="single" selected={currentDate} onSelect={(date) => date && setCurrentDate(date)} today={new Date()} className="rounded-md border shadow-sm" required />
                            </PopoverContent>
                        </Popover>

                        <div className="flex items-center bg-muted rounded-lg p-0.5">
                            <Button variant={selectedView === "Day" ? "secondary" : "ghost"} size="sm" onClick={() => setSelectedView("Day")} className={cn("h-7 px-3 text-xs", { "bg-popover shadow-sm": selectedView === "Day" })}>Day</Button>
                            <Button variant={selectedView === "Week" ? "secondary" : "ghost"} size="sm" onClick={() => setSelectedView("Week")} className={cn("h-7 px-3 text-xs", { "bg-popover shadow-sm": selectedView === "Week" })}>Week</Button>
                        </div>

                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs">New Appointment</Button>

                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3 w-3" /></Button>
                    </div>
                </div>

                {/* Calendar Content */}
                <ScrollArea className="w-auto h-[100vh]">
                    <div className="min-w-[800px] relative">
                        {selectedView === "Week" && (
                            <div className="flex items-center sticky top-0 bg-background z-10">
                                <div className="w-12"></div>
                                <div className="flex-1 grid grid-cols-7 gap-px">
                                    {weekDates.map((date, index) => (
                                        <div key={index} className={cn("text-center py-2 border border-primary/5", { "bg-primary/20": isToday(date) })}>
                                            <div className={cn("flex flex-col items-center")}>
                                                <span className={cn("text-xs font-medium text-muted-foreground", { "text-primary": isToday(date) })}>{dayNames[index]} {date.getDate()}</span>
                                                {isToday(date) && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Day Section */}
                        <div className={cn("bg-background z-10", { "sticky top-0": selectedView === "Day" })}>
                            <div className="flex items-center border border-primary/10 border-l-0 border-b-0">
                                <div className="text-xs font-medium text-muted-foreground text-right pl-[1.7px] pr-2 min-w-12">{selectedView === "Day" ? <Stethoscope className="h-4 w-4" /> : "All day"}</div>
                                {selectedView === "Day" ? (
                                    <div className="flex flex-row overflow-x-auto text-center items-center">
                                        {getFilteredDentists().map(({ id, name, avatar, startDate }) => (
                                            <Tooltip key={id}>
                                                <TooltipTrigger>
                                                    <div className="flex items-center h-8 justify-center border border-primary/5 capitalize text-xs font-medium" style={{ width: selectedDentist === "All dentists" ? `${COLUMN_WIDTH}px` : "100%" }}>
                                                        Dr. {selectedDentist === "All dentists" ? truncateText(name, 10) : name}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent content="bg-lime-100 fill-lime-100 dark:bg-lime-700 dark:fill-lime-700" className="bg-lime-100 dark:bg-lime-700">
                                                    <div>
                                                        <div className="flex gap-1 items-center">
                                                            <Avatar><AvatarImage src={avatar || "/placeholder.svg"} /><AvatarFallback className="uppercase bg-background text-foreground font-medium">{name.split(" ")[0]?.charAt(0)}{name.split(" ")[1]?.charAt(0)}</AvatarFallback></Avatar>
                                                            <span className="capitalize text-foreground">{name}</span>
                                                        </div>
                                                        <span className="font-medium text-foreground">Since: {startDate}</span>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 grid grid-cols-7">
                                        {weekDates.map((date, index) => <div key={index} className={cn("h-8 border border-primary/5", { "bg-primary/20": isToday(date) })}></div>)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-0 border-t border-primary/10 relative">
                            {timeSlots.map((time, index) => (
                                <div key={index} className="flex border-t border-primary/10 first:border-t-0 relative">
                                    <div className="flex items-start border border-b-0 border-l-0 border-primary/5 sticky left-0 z-10 bg-background"><div className="w-12 text-xs text-muted-foreground pr-2 text-right">{time}</div></div>

                                    {selectedView === "Day" ? (
                                        <div className="flex relative" style={{ height: `${TIME_SLOT_HEIGHT}px` }}>
                                            {getFilteredDentists().map((dentist) => (
                                                <div key={dentist.id} className="border-r border-t border-primary/10 last:border-r-0 cursor-pointer transition-colors relative" style={{ width: selectedDentist === "All dentists" ? `${COLUMN_WIDTH}px` : "100%" }} onDoubleClick={(e) => handleSlotDoubleClick(e, dentist.id, index)} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex-1 grid grid-cols-7">
                                            {weekDates.map((date, dayIndex) => (
                                                <div key={dayIndex} className={cn("min-h-[60px] relative border-r border-primary/10 last:border-r-0", { "bg-primary/20": isToday(date) })}>
                                                    <div className="absolute inset-0 hover:bg-muted/20 transition-colors cursor-pointer hover:rounded-md hover:border-2 hover:border-primary" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* SLOTS + SCHEDULES: Render slots first (so appointments appear above them) */}
                            {selectedView === "Day" && (
                                <div className="absolute inset-0" style={{ left: "48px" }}>
                                    {/* droppable slots grid */}
                                    {getFilteredDentists().map((dentist) => {
                                        const left = getAppointmentLeft(dentist.id)
                                        const width = getAppointmentWidth()
                                        return (
                                            <React.Fragment key={`slots-${dentist.id}`}>
                                                {Array.from({ length: 24 * 4 }).map((_, i) => {
                                                    const minutes = i * 15
                                                    const slotId = `slot-${dentist.id}-${minutes}`
                                                    const top = (minutes / 60) * TIME_SLOT_HEIGHT
                                                    const height = (15 / 60) * TIME_SLOT_HEIGHT
                                                    return (
                                                        <SlotDroppable
                                                            key={slotId}
                                                            id={slotId}
                                                            dentistId={dentist.id}
                                                            minutes={minutes}
                                                            top={top}
                                                            leftPx={left}
                                                            width={width}
                                                            height={height}
                                                        />
                                                    )
                                                })}
                                            </React.Fragment>
                                        )
                                    })}

                                    {/* appointments (on top of slots) */}
                                    {getFilteredAppointments().map((appointment) => {
                                        const top = getAppointmentTop(appointment.startTime)
                                        const height = getAppointmentHeight(appointment.startTime, appointment.endTime)
                                        const left = getAppointmentLeft(appointment.dentistId)
                                        const width = getAppointmentWidth()
                                        const duration = getAppointmentDuration(appointment.startTime, appointment.endTime)
                                        const showFullInfo = duration >= 30

                                        return (
                                            <DraggableAppointment
                                                key={appointment.id}
                                                appointment={appointment}
                                                top={top}
                                                left={left}
                                                width={width}
                                                height={height}
                                                showFullInfo={showFullInfo}
                                                onClick={handleAppointmentClick}
                                                activeId={activeId}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* floating preview badge */}
                {activeAppointment && newStartTime && (
                    <div className="fixed z-[999] pointer-events-none top-24 right-6 bg-muted px-3 py-1 rounded shadow">
                        Moving {activeAppointment.patientName} → <strong>{newStartTime}</strong>
                    </div>
                )}

                <DragOverlay>
                    {activeAppointment && (
                        <div className={cn("rounded-md p-2 flex pointer-events-none", activeAppointment.color?.stickerColor)} style={{ width: typeof getAppointmentWidth() === "string" ? getAppointmentWidth() : `${getAppointmentWidth()}px`, height: activeAppointment ? getAppointmentHeight(activeAppointment.startTime, activeAppointment.endTime) : undefined }}>
                            <div className={cn("w-1 rounded-full mr-2 flex-shrink-0", activeAppointment.color?.lineColor)} />
                            <div className="flex-1 overflow-hidden">
                                <div className="text-xs font-medium leading-tight">{activeAppointment.patientName}</div>
                                <div className="text-xs opacity-75 leading-tight">{activeAppointment.startTime} - {activeAppointment.endTime}</div>
                            </div>
                        </div>
                    )}
                </DragOverlay>

                {/* Confirm dialog for replace/swap/move */}
                <Dialog open={showConfirmDialog} onOpenChange={(open) => { if (!open) handleConfirmChoice("no") }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {targetAppointment ? `Confirm action with ${targetAppointment.patientName}` : "Confirm move"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="p-4">
                            {targetAppointment ? (
                                <div>
                                    <p className="mb-3">You dropped <strong>{originalAppointment?.patientName}</strong> onto <strong>{targetAppointment.patientName}</strong>. Choose an action:</p>
                                    <ul className="list-disc pl-5 text-sm">
                                        <li><strong>Replace:</strong> Remove the target; dragged appointment moves to the target's time.</li>
                                        <li><strong>Replace & keep time:</strong> Remove the target; dragged appointment keeps its own time.</li>
                                        <li><strong>Swap:</strong> Swap the time ranges of the two appointments.</li>
                                        <li><strong>No:</strong> Cancel and revert to original position.</li>
                                    </ul>
                                </div>
                            ) : (
                                <div>
                                    <p>Move <strong>{originalAppointment?.patientName}</strong> to <strong>{newStartTime}</strong>?</p>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            {targetAppointment ? (
                                <>
                                    <Button variant="destructive" onClick={() => handleConfirmChoice("replace")}>Replace</Button>
                                    <Button onClick={() => handleConfirmChoice("replace_preserve_time")}>Replace & keep time</Button>
                                    <Button onClick={() => handleConfirmChoice("swap")}>Swap</Button>
                                    <Button variant="outline" onClick={() => handleConfirmChoice("no")}>No</Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => handleConfirmChoice("move")}>Move</Button>
                                    <Button variant="outline" onClick={() => handleConfirmChoice("no")}>No</Button>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
            </div>
        </DndContext>
    )
}

/* ---------- SlotDroppable component ---------- */

function SlotDroppable({ id, dentistId, minutes, top, leftPx, width, height }: { id: string; dentistId: number; minutes: number; top: number; leftPx: number; width: string | number; height: number }) {
    const { setNodeRef, isOver } = useDroppable({ id })

    return (
        <div
            ref={setNodeRef}
            data-slot-id={id}
            className={cn("absolute transition-colors pointer-events-auto", { "bg-primary/10": isOver })}
            style={{
                top: `${top}px`,
                left: typeof leftPx === "string" ? leftPx : `${leftPx}px`,
                width: typeof width === "string" ? width : `${width}px`,
                height: `${height}px`,
                zIndex: 1, // slots behind appointments
            }}
        />
    )
}

/* ---------- DraggableAppointment component (combines draggable + droppable) ---------- */

function DraggableAppointment({
    appointment,
    top,
    left,
    width,
    height,
    showFullInfo,
    onClick,
    activeId,
}: {
    appointment: Appointment
    top: number
    left: number
    width: string | number
    height: number
    showFullInfo: boolean
    onClick: (e: React.MouseEvent, appointment: Appointment) => void
    activeId: UniqueIdentifier | null
}) {
    const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
        id: appointment.id,
    })

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: appointment.id,
    })

    const setNodeRef = (node: HTMLElement | null) => {
        setDraggableRef(node)
        setDroppableRef(node)
    }

    // Hide the original while dragging
    if (isDragging || String(activeId) === String(appointment.id)) {
        return null
    }

    const transformStyle = transform ? CSS.Translate.toString(transform) : undefined

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="absolute pointer-events-auto"
            style={{
                top: `${top}px`,
                left: `${left}px`,
                width: typeof width === "string" ? width : `${width}px`,
                height: `${height}px`,
                transform: transformStyle,
                position: "absolute",
                zIndex: 2, // above slots
            }}
        >
            <div
                className={cn("rounded-md p-2 cursor-move flex", appointment.color?.stickerColor)}
                style={{
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                }}
                onClick={(e) => onClick(e, appointment)}
            >
                <div className={cn("w-1 rounded-full mr-2 flex-shrink-0", appointment.color?.lineColor)} />
                <div className="flex-1 overflow-hidden">
                    {showFullInfo ? (
                        <>
                            <div className="text-xs font-medium leading-tight">Dr. {dentistSample.find((d) => d.id === appointment.dentistId)?.name.split(" ")[0]} /w {appointment.patientName}</div>
                            <div className="text-xs opacity-75 leading-tight">{appointment.startTime} - {appointment.endTime}</div>
                        </>
                    ) : (
                        <div className="text-xs font-medium leading-tight">{appointment.patientName}</div>
                    )}
                </div>
            </div>
        </div>
    )
}

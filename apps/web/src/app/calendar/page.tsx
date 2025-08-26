"use client";
// import { YearView } from "@repo/design/components/calendar/year-view";

import { Calendar as CalendarUI } from "@repo/design/src/components/ui/calendar";
import { Button } from "@repo/design/src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design/src/components/ui/popover";
import { ScrollArea, ScrollBar } from "@repo/design/src/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/design/src/components/ui/select";
import { ChevronLeft, ChevronRight, MoreHorizontal, StethoscopeIcon } from "@repo/design/src/icons";
import { useState, useEffect, useRef } from "react";
import { cn } from "~/lib/utils";
import { truncateText } from "@repo/design/src/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/design/src/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/src/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@repo/design/src/components/ui/dialog";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@repo/design/src/components/ui/context-menu";
import { Info, Stethoscope } from "lucide-react";

const dentistSample = [
  {
    id: 1,
    name: "josh keneddy",
    avatar: "https://github.com/shadcn.png",
    startDate: "2023-08-25",
  },
  {
    id: 2,
    name: "princewill maximillian",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=PM",
    startDate: "2021-05-12",
  },
  {
    id: 3,
    name: "ebere adeotun",
    avatar: "https://github.com/evilrabbit.png",
    startDate: "2022-03-04",
  },
  {
    id: 4,
    name: "john doe",
    avatar: "https://github.com/shadcn.png",
    startDate: "2020-07-19",
  },
  {
    id: 5,
    name: "harry simmons",
    avatar: "https://github.com/leerob.png",
    startDate: "2023-01-20",
  },
  {
    id: 6,
    name: "beatrice salvador",
    avatar: "https://github.com/evilrabbit.png",
    startDate: "2021-09-08",
  },
  {
    id: 7,
    name: "joy madueke",
    avatar: "https://github.com/leerob.png",
    startDate: "2022-11-15",
  },
  {
    id: 8,
    name: "santiago de-lima",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=SDL",
    startDate: "2023-04-30",
  },
  {
    id: 9,
    name: "tola oluwatosin",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=TO",
    startDate: "2020-06-22",
  },
  {
    id: 10,
    name: "kvicha belmond kvarakeslia",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=KBK",
    startDate: "2023-07-07",
  },
]

const colorClasses = [
  {
    stickerColor: "bg-blue-50 dark:bg-blue-700 text-foreground dark:text-background",
    lineColor: "bg-blue-700 dark:bg-blue-50",
  },
  {
    stickerColor: "bg-lime-50 dark:bg-lime-700 text-foreground dark:text-background",
    lineColor: "bg-lime-700 dark:bg-lime-50",
  },
  {
    stickerColor: "bg-orange-50 dark:bg-orange-700 text-foreground dark:text-background",
    lineColor: "bg-orange-700 dark:bg-orange-50",
  },
  {
    stickerColor: "bg-red-50 dark:bg-red-700 text-foreground dark:text-background",
    lineColor: "bg-red-700 dark:bg-red-50",
  },
  {
    stickerColor: "bg-amber-50 dark:bg-amber-700 text-foreground dark:text-background",
    lineColor: "bg-amber-700 dark:bg-amber-50",
  },
  {
    stickerColor: "bg-green-50 dark:bg-green-700 text-foreground dark:text-background",
    lineColor: "bg-green-700 dark:bg-green-50",
  },
]

const getRandomColor = () => {
  return colorClasses[Math.floor(Math.random() * colorClasses.length)]
}

const dummyAppointments = [
  {
    id: 1,
    dentistId: 1,
    patientName: "Mavins Bernado",
    startTime: "08:00",
    endTime: "10:15",
    color: colorClasses[1], // lime
  },
  {
    id: 2,
    dentistId: 2,
    patientName: "Sarah Johnson",
    startTime: "09:00",
    endTime: "10:00",
    color: colorClasses[0], // blue
  },
  {
    id: 3,
    dentistId: 1,
    patientName: "Mike Wilson",
    startTime: "14:00",
    endTime: "15:30",
    color: colorClasses[2], // orange
  },

  {
    id: 4,
    dentistId: 3,
    patientName: "Emma Davis",
    startTime: "11:00",
    endTime: "12:00",
    color: colorClasses[3], // red
  },
  {
    id: 3,
    dentistId: 1,
    patientName: "Ikay Gundogan",
    startTime: "12:00",
    endTime: "13:55",
    color: colorClasses[5], // orange
  },
]


const COLUMN_WIDTH = 160 // Fixed width for each dentist column
const TIME_SLOT_HEIGHT = 100 // Updated to 100px to accommodate 4 schedules per hour

const Calendar = () => {

  const [selectedView, setSelectedView] = useState<"Day" | "Week">("Day")
  const [selectedDentist, setSelectedDentist] = useState("All dentists")
  const [currentDate, setCurrentDate] = useState(new Date())

  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)
  const [showEditAppointmentDialog, setShowEditAppointmentDialog] = useState(false)
  const [appointments, setAppointments] = useState(dummyAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  const timeSlots = [
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM",
    "12 AM",
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
  ];

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const getAppointmentHeight = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)
    const durationMinutes = endMinutes - startMinutes
    const minDuration = Math.max(durationMinutes, 15)
    return (minDuration / 60) * 100
  }

  const getAppointmentTop = (startTime: string) => {
    const startMinutes = timeToMinutes(startTime)
    const startHour = Math.floor(startMinutes / 60)
    const minuteOffset = startMinutes % 60
    const timeSlotIndex = timeSlots.findIndex((slot) => {
      const slotHour = slot.includes("AM")
        ? slot === "12 AM"
          ? 0
          : Number.parseInt(slot)
        : slot === "12 PM"
          ? 12
          : Number.parseInt(slot) + 12
      return slotHour === startHour
    })
    return timeSlotIndex * TIME_SLOT_HEIGHT + (minuteOffset / 60) * TIME_SLOT_HEIGHT
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
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isTodayInSameWeek = (targetDate: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    targetDate = new Date(targetDate)
    targetDate.setHours(0, 0, 0, 0)

    const targetDay = targetDate.getDay()
    const diffToMonday = targetDay === 0 ? 6 : targetDay - 1
    const weekStart = new Date(targetDate)
    weekStart.setDate(targetDate.getDate() - diffToMonday)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    return today >= weekStart && today <= weekEnd
  }

  const handlePrev = () => {
    if (selectedView === "Day") {
      const oneDayAgo = new Date(currentDate)
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)
      setCurrentDate(oneDayAgo)
    } else {
      const oneWeekAgo = new Date(currentDate)
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      setCurrentDate(oneWeekAgo)
    }
  }

  const handleNext = () => {
    if (selectedView === "Day") {
      const oneDayFuture = new Date(currentDate)
      oneDayFuture.setDate(oneDayFuture.getDate() + 1)
      setCurrentDate(oneDayFuture)
    } else {
      const oneWeekFuture = new Date(currentDate)
      oneWeekFuture.setDate(oneWeekFuture.getDate() + 7)
      setCurrentDate(oneWeekFuture)
    }
  }

  const handleNewAppointmentDialogClose = () => {
    setShowNewAppointmentDialog(false)
  }

  const handleEditAppointmentDialogClose = () => {
    setShowEditAppointmentDialog(false)
    setSelectedAppointment(null)
  }

  const handleSlotDoubleClick = (e: React.MouseEvent, dentistId: number, index: number) => {
    // Handle slot double click logic here
    console.log(e, dentistId, index)
  }

  const handleAppointmentClick = (e: React.MouseEvent, appointment: typeof appointments[0]) => {
    // Handle appointment click logic here
    console.log(e, appointment)
  }

  const getAppointmentLeft = (dentistId: number) => {
    const dentistIndex = dentistSample.findIndex((d) => d.id === dentistId)
    return dentistIndex * COLUMN_WIDTH + 4 // 4px padding from left
  }

  const getAppointmentWidth = () => {
    return COLUMN_WIDTH - 8 // 8px total padding (4px each side)
  }

  const getAppointmentDuration = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)
    return endMinutes - startMinutes
  }

  return (
    <div className="w-full min-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">Show</span>
          <Select value={selectedDentist} onValueChange={setSelectedDentist}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem defaultChecked value="All dentists">
                All dentists
              </SelectItem>
              {dentistSample.map(({ name }) => (
                <SelectItem key={name} value={name} className="capitalize">
                  Dr {""} {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrev}>
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleNext}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>

          <Popover>
            <PopoverTrigger>
              <Button variant={"outline"} className="text-xs">
                {formatDate(currentDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="size-fit p-0 border-0">
              <CalendarUI
                mode="single"
                selected={currentDate}
                onSelect={setCurrentDate}
                today={new Date()}
                className="rounded-md border shadow-sm"
                // hidden={{ after: new Date() }}
                required
              />
            </PopoverContent>
          </Popover>

          <div className="flex items-center bg-muted rounded-lg p-0.5">
            <Button
              variant={selectedView === "Day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedView("Day")}
              className={cn("h-7 px-3 text-xs", { "bg-popover shadow-sm": selectedView === "Day" })}
            >
              Day
            </Button>
            <Button
              variant={selectedView === "Week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedView("Week")}
              className={cn("h-7 px-3 text-xs", { "bg-popover shadow-sm": selectedView === "Week" })}
            >
              Week
            </Button>
          </div>

          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs">
            New Appointment
          </Button>

          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
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
                  <div
                    key={index}
                    className={cn("text-center py-2 border border-primary/5", { "bg-primary/20": isToday(date) })}
                  >
                    <div className={cn("flex flex-col items-center")}>
                      <span
                        className={cn("text-xs font-medium text-muted-foreground", { "text-primary": isToday(date) })}
                      >
                        {dayNames[index]} {date.getDate()}
                      </span>
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
              <div className="text-xs font-medium text-muted-foreground text-right pl-[1.7px] pr-2 min-w-12">
                {selectedView === "Day" ? <Stethoscope className="h-4 w-4" /> : "All day"}
              </div>
              {selectedView === "Day" ? (
                <div className="flex flex-row overflow-x-auto text-center items-center">
                  {dentistSample.map(({ id, name, avatar, startDate }) => (
                    <Tooltip key={id}>
                      <TooltipTrigger>
                        <div
                          className="flex items-center h-8 justify-center border border-primary/5 capitalize text-xs font-medium"
                          style={{ width: `${COLUMN_WIDTH}px` }}
                        >
                          Dr.{" "}
                          {truncateText(name, 10)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent content="bg-lime-100 fill-lime-100 dark:bg-lime-700 dark:fill-lime-700" className="bg-lime-100 dark:bg-lime-700">
                        <div>
                          <div className="flex gap-1 items-center">
                            <Avatar>
                              <AvatarImage src={avatar || "/placeholder.svg"} />
                              <AvatarFallback className="uppercase bg-background text-foreground font-medium">
                                {name.split(" ")[0]?.charAt(0)}
                                {name.split(" ")[1]?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
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
                  {weekDates.map((date, index) => (
                    <div
                      key={index}
                      className={cn("h-8 border border-primary/5", { "bg-primary/20": isToday(date) })}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-0 border-t border-primary/10 relative">
            {timeSlots.map((time, index) => (
              <div key={index} className="flex border-t border-primary/10 first:border-t-0 relative">
                <div className="flex items-start border border-b-0 border-l-0 border-primary/5 sticky left-0 z-10 bg-background">
                  <div className="w-12 text-xs text-muted-foreground pt-2 pr-2 text-right">{time}</div>
                </div>
                {selectedView === "Day" ? (
                  <div className="flex relative" style={{ height: `${TIME_SLOT_HEIGHT}px` }}>
                    {dentistSample.map((dentist) => (
                      <div
                        key={dentist.id}
                        className="border-r border-primary/10 last:border-r-0 cursor-pointer transition-colors relative"
                        style={{ width: `${COLUMN_WIDTH}px` }}
                        onDoubleClick={(e) => handleSlotDoubleClick(e, dentist.id, index)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-7">
                    {weekDates.map((date, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={cn("min-h-[60px] relative border-r border-primary/10 last:border-r-0", {
                          "bg-primary/20": isToday(date),
                        })}
                      >
                        <div className="absolute inset-0 hover:bg-muted/20 transition-colors cursor-pointer hover:rounded-md hover:border-2 hover:border-primary"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {selectedView === "Day" && (
              <div className="absolute inset-0 pointer-events-none" style={{ left: "48px" }}>
                {appointments.map((appointment, index) => {
                  const top = getAppointmentTop(appointment.startTime)
                  const height = getAppointmentHeight(appointment.startTime, appointment.endTime)
                  const left = getAppointmentLeft(appointment.dentistId)
                  const width = getAppointmentWidth()
                  const duration = getAppointmentDuration(appointment.startTime, appointment.endTime)
                  const showFullInfo = duration >= 30 // Show full info for appointments ≥30 minutes

                  return (
                    <div
                      key={appointment.id}
                      className={cn(
                        "absolute rounded-md p-2 cursor-pointer z-[2] flex pointer-events-auto",
                        appointment.color.stickerColor,
                      )}
                      style={{
                        top: `${top + (index + 7.5)}px`,
                        left: `${left}px`,
                        width: `${width}px`,
                        height: `${height}px`,
                      }}
                      onClick={(e) => handleAppointmentClick(e, appointment)}
                    >
                      <div className={cn("w-1 rounded-full mr-2 flex-shrink-0", appointment.color.lineColor)}></div>
                      <div className="flex-1 overflow-hidden">
                        {showFullInfo ? (
                          <>
                            <div className="text-xs font-medium leading-tight">
                              Dr. {dentistSample.find((d) => d.id === appointment.dentistId)?.name.split(" ")[0]} /w{" "}
                              {appointment.patientName}
                            </div>
                            <div className="text-xs opacity-75 leading-tight">
                              {appointment.startTime} - {appointment.endTime}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs font-medium leading-tight">{appointment.patientName}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Dialog open={showNewAppointmentDialog} onOpenChange={handleNewAppointmentDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>New appointment dialog content will be implemented here.</p>
            <Button onClick={handleNewAppointmentDialogClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditAppointmentDialog} onOpenChange={handleEditAppointmentDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Edit appointment dialog content will be implemented here.</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => handleEditAppointmentDialogClose()}>Save Changes</Button>
              <Button variant="outline" onClick={() => handleEditAppointmentDialogClose()}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Calendar;
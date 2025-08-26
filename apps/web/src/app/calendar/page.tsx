"use client";
// import { YearView } from "@repo/design/components/calendar/year-view";

import { Calendar as CalendarUI } from "@repo/design/src/components/ui/calendar";
import { Button } from "@repo/design/src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design/src/components/ui/popover";
import { ScrollArea, ScrollBar } from "@repo/design/src/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/design/src/components/ui/select";
import { ChevronLeft, ChevronRight, MoreHorizontal, StethoscopeIcon } from "@repo/design/src/icons";
import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { truncateText } from "@repo/design/src/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/design/src/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/src/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@repo/design/src/components/ui/dialog";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@repo/design/src/components/ui/context-menu";
import { Info } from "lucide-react";

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
    startDate: "2021-15-12",
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
];

const initialAppointments = [
  {
    dentistId: 1,
    start: { hour: 8, minute: 0 },
    end: { hour: 10, minute: 15 },
    patient: "Mavins Bernardo",
    note: "Patient's note must be muted. Quick-win walk as this cost parking can't. Native masking hour right intersection gave wiggle team what. Policy eye issues third social. Office ipsum you must be muted. Quick-win walk out as this cost parking can't.",
  },
  {
    dentistId: 2,
    start: { hour: 9, minute: 0 },
    end: { hour: 9, minute: 30 },
    patient: "Jane Smith",
  },
  {
    dentistId: 3,
    start: { hour: 10, minute: 0 },
    end: { hour: 11, minute: 0 },
    patient: "Alex Johnson",
  },
  {
    dentistId: 1,
    start: { hour: 11, minute: 0 },
    end: { hour: 12, minute: 0 },
    patient: "Emily Davis",
  },
  {
    dentistId: 2,
    start: { hour: 14, minute: 30 },
    end: { hour: 15, minute: 45 },
    patient: "Michael Brown",
  },
  {
    dentistId: 3,
    start: { hour: 16, minute: 0 },
    end: { hour: 16, minute: 59 },
    patient: "Sophia Wilson",
  },
  {
    dentistId: 5,
    start: { hour: 16, minute: 0 },
    end: { hour: 16, minute: 59 },
    patient: "ersdtty dagyhdvad",
  },
];

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
];

const getRandomColor = () => {
  return colorClasses[Math.floor(Math.random() * colorClasses.length)];
};

const Calendar = () => {
  const [selectedView, setSelectedView] = useState<"Day" | "Week">("Day");
  const [selectedDentist, setSelectedDentist] = useState("All dentists");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments.map((appt, idx) => ({
    ...appt,
    id: idx.toString(),
    start_hours: appt.start.hour + appt.start.minute / 60,
    end_hours: appt.end.hour + appt.end.minute / 60,
  })));
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [draggingInfo, setDraggingInfo] = useState<{ apptId: string; originalTop: number; deltaY: number } | null>(null);

  const filteredDentists = selectedDentist === "All dentists" ? dentistSample : dentistSample.filter(d => d.name === selectedDentist.toLowerCase());
  const timeSlots = [
    "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
    "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM",
  ];

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeColumnWidth = 48;
  const columnWidth = 160;
  const slotHeight = 100; // Increased to 100px to accommodate 4 schedules
  const minHeightPercent = 0.245; // 24.5% of slot height for 15-minute increments

  const filteredDentistIds = new Set(filteredDentists.map((d) => d.id));
  const filteredAppointments = appointments.filter((a) => filteredDentistIds.has(a.dentistId));
  const apptsByDentist: Record<number, Appointment[]> = filteredAppointments.reduce(
    (acc, appt) => {
      const id = appt.dentistId;
      if (!acc[id]) acc[id] = [];
      acc[id].push(appt);
      return acc;
    },
    {}
  );

  const laneInfoByDentist: Record<number, LaneInfo> = {};

  Object.keys(apptsByDentist).forEach((dentistIdStr) => {
    const dentistId = parseInt(dentistIdStr);
    const appts = apptsByDentist[dentistId];
    appts.sort((a, b) => a.start_hours - b.start_hours);

    const dentistLanes: number[] = [];
    const apptLane = new Map<Appointment, number>();

    for (const appt of appts) {
      const duration = appt.end_hours - appt.start_hours;
      const virtualDuration = Math.max(duration, minHeightPercent * 4); // Ensure minimum 15-minute height
      const virtualEnd = appt.start_hours + virtualDuration;

      let assignedLane = -1;
      for (let i = 0; i < dentistLanes.length && i < 4; i++) { // Limit to 4 lanes
        if (dentistLanes[i] <= appt.start_hours) {
          assignedLane = i;
          break;
        }
      }

      if (assignedLane === -1 && dentistLanes.length < 4) {
        assignedLane = dentistLanes.length;
        dentistLanes.push(0);
      }

      if (assignedLane !== -1) {
        dentistLanes[assignedLane] = virtualEnd;
        apptLane.set(appt, assignedLane);
      }
    }

    laneInfoByDentist[dentistId] = {
      numLanes: Math.min(dentistLanes.length, 4), // Cap at 4 lanes
      apptLane,
    };
  });

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTodayInSameWeek = (targetDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate = new Date(targetDate);
    targetDate.setHours(0, 0, 0, 0);

    const targetDay = targetDate.getDay();
    const diffToMonday = targetDay === 0 ? 6 : targetDay - 1;
    const weekStart = new Date(targetDate);
    weekStart.setDate(targetDate.getDate() - diffToMonday);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return today >= weekStart && today <= weekEnd;
  };

  const handlePrev = () => {
    if (selectedView === "Day") {
      const oneDayAgo = new Date(currentDate);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      setCurrentDate(oneDayAgo);
    } else {
      const oneWeekAgo = new Date(currentDate);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      setCurrentDate(oneWeekAgo);
    }
  };

  const handleNext = () => {
    if (selectedView === "Day") {
      const oneDayFuture = new Date(currentDate);
      oneDayFuture.setDate(oneDayFuture.getDate() + 1);
      setCurrentDate(oneDayFuture);
    } else {
      const oneWeekFuture = new Date(currentDate);
      oneWeekFuture.setDate(oneWeekFuture.getDate() + 7);
      if (!isTodayInSameWeek(oneWeekFuture)) {
        setCurrentDate(oneWeekFuture);
      } else {
        setCurrentDate(new Date());
      }
    }
  };

  const formatTime = (hour: number, minute: number) => {
    const ampm = hour < 12 ? "AM" : "PM";
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, "0");
    return `${h.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  interface Appointment {
    id: string;
    dentistId: number;
    start: { hour: number; minute: number };
    end: { hour: number; minute: number };
    patient: string;
    note?: string;
    start_hours: number;
    end_hours: number;
  }

  interface LaneInfo {
    numLanes: number;
    apptLane: Map<Appointment, number>;
  }

  const calculateDuration = (start: { hour: number; minute: number }, end: { hour: number; minute: number }) => {
    const durationMinutes = (end.hour - start.hour) * 60 + (end.minute - start.minute);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}hrs${minutes > 0 ? ` ${minutes}min` : ""}`;
  };

  const handleStartDrag = (e: React.MouseEvent, appt: Appointment, top: number) => {
    e.preventDefault();
    setDraggingInfo({ apptId: appt.id, originalTop: top, deltaY: 0 });
  };

  const hoursToTime = (hours: number) => {
    const hour = Math.floor(hours);
    const minute = Math.round((hours - hour) * 60);
    return { hour, minute };
  };

  const handleDrop = (dragInfo: { apptId: string; originalTop: number; deltaY: number }) => {
    const appt = appointments.find(a => a.id === dragInfo.apptId);
    if (!appt) return;

    const newTop = dragInfo.originalTop + dragInfo.deltaY;
    const newStartHours = Math.floor(newTop / slotHeight);
    const duration = appt.end_hours - appt.start_hours;
    const newEndHours = newStartHours + duration;

    const overlapped = appointments.filter(other =>
      other.dentistId === appt.dentistId &&
      other.id !== appt.id &&
      !(newEndHours <= other.start_hours || newStartHours >= other.end_hours)
    );

    let proceed = true;
    let replaced: Appointment | undefined;

    if (overlapped.length > 0) {
      replaced = overlapped[0];
      proceed = window.confirm(`Replace existing schedule with ${replaced.patient}?`);
    } else {
      proceed = window.confirm("Save changes?");
    }

    if (proceed) {
      const newStart = hoursToTime(newStartHours);
      const newEnd = hoursToTime(newEndHours);
      setAppointments(prev => {
        let updated = prev.map(p => p.id === appt.id ? { ...p, start: newStart, end: newEnd, start_hours: newStartHours, end_hours: newEndHours } : p);
        if (replaced) {
          updated = updated.filter(p => p.id !== replaced.id);
        }
        return updated;
      });
      console.log(`New time: ${formatTime(newStart.hour, newStart.minute)} - ${formatTime(newEnd.hour, newEnd.minute)}${replaced ? `, replaced: ${replaced.patient}` : ""}`);
    }
    setDraggingInfo(null);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingInfo) {
        setDraggingInfo((prev) => prev ? { ...prev, deltaY: prev.deltaY + e.movementY } : null);
      }
    };

    const handleMouseUp = () => {
      if (draggingInfo) {
        handleDrop(draggingInfo);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingInfo]);

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
              <SelectItem defaultChecked value="All dentists">All dentists</SelectItem>
              {dentistSample.map(({ name }) => (
                <SelectItem key={name} value={name} className="capitalize">Dr {""} {name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrev}>
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isToday(currentDate) || isTodayInSameWeek(currentDate)} onClick={handleNext}>
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
                hidden={{ after: new Date() }}
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
                  <div key={index} className={cn("text-center py-2 border border-primary/5", { "bg-primary/20": isToday(date) })}>
                    <div className={cn("flex flex-col items-center")}>
                      <span className={cn("text-xs font-medium text-muted-foreground", { "text-primary": isToday(date) })}>
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
              <div className="text-xs font-medium text-muted-foreground text-right pl-[1.7px] pr-2 min-w-12">{selectedView === "Day" ? <StethoscopeIcon /> : "All day"}</div>
              {selectedView === "Day" ? (
                <div className="flex flex-row text-center items-center min-w-full">
                  {filteredDentists.map(({ name, avatar, startDate }) => (
                    <Tooltip key={name}>
                      <TooltipTrigger><div className={cn("flex items-center h-8 justify-center border border-primary/5 capitalize text-xs font-medium flex-1 w-[160px] my-auto")}>Dr. {truncateText(String(name.split("")[0]), 10)}</div></TooltipTrigger>
                      <TooltipContent className="bg-lime-100 dark:bg-lime-700">
                        <div>
                          <div className="flex gap-1 items-center">
                            <Avatar>
                              <AvatarImage src={avatar} />
                              <AvatarFallback className="uppercase bg-background text-foreground font-medium">{name.split("")[0]?.charAt(0)}{name.split("")[1]?.charAt(0)}</AvatarFallback>
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
                    <div key={index} className={cn("h-8 border border-primary/5", { "bg-primary/20": isToday(date) })}></div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Time Slots */}
          <div className="relative space-y-0 border-t border-primary/10">
            {timeSlots.map((time, index) => (
              <div key={index} className="flex border-t border-primary/10 first:border-t-0">
                <div className="flex items-start border border-b-0 border-l-0 border-primary/5 sticky left-0 z-10 bg-background">
                  <div className="w-12 text-xs text-muted-foreground pt-2 pr-2 text-right">{time}</div>
                </div>
                {selectedView === "Day" ? (
                  <div className="flex flex-row min-w-full">
                    {filteredDentists.map((dentist) => (
                      <div
                        key={dentist.id}
                        className="flex-1 w-[160px] h-[100px] relative border-r border-primary/10 last:border-r-0"
                      >
                        <div className="absolute inset-0 hover:rounded-md hover:border-2 hover:border-primary transition-colors cursor-pointer"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-7">
                    {weekDates.map((date, dayIndex) => (
                      <div key={dayIndex} className={cn("min-h-[100px] relative border-r border-primary/10 last:border-r-0", { "bg-primary/20": isToday(date) })}>
                        <div className="absolute inset-0 hover:bg-muted/20 transition-colors cursor-pointer hover:rounded-md hover:border-2 hover:border-primary"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {selectedView === "Day" && filteredAppointments.map((appt) => {
              const dentistIndex = filteredDentists.findIndex((d) => d.id === appt.dentistId);
              if (dentistIndex === -1) return null;

              const dentist = filteredDentists[dentistIndex];
              const color = getRandomColor();

              const dentistLeft = timeColumnWidth + dentistIndex * columnWidth;
              const startHours = appt.start_hours;
              const endHours = appt.end_hours;
              const totalMinutes = (endHours - startHours) * 60;
              const slots = Math.ceil(totalMinutes / 15); // Number of 15-minute slots
              const height = slots * (slotHeight * minHeightPercent); // Height based on 24.5% per 15 minutes
              let top = (Math.floor(startHours) * slotHeight) + 6; // Align to slot boundary
              const patientInitial = appt.patient.charAt(0).toUpperCase();

              const { numLanes, apptLane } = laneInfoByDentist[appt.dentistId] || { numLanes: 1, apptLane: new Map() };
              const laneIdx = apptLane.get(appt) || 0;
              const subWidth = columnWidth / Math.min(numLanes, 4); // Limit to 4 lanes
              const left = dentistLeft + (laneIdx * subWidth); // Precise left positioning


              console.log(left, laneIdx, subWidth, dentistLeft)
              const width = subWidth; // Full width within lane

              const showFullInfo = totalMinutes >= 60;

              if (draggingInfo && draggingInfo.apptId === appt.id) {
                const newTop = Math.floor((draggingInfo.originalTop + draggingInfo.deltaY) / slotHeight) * slotHeight;
                top = newTop;
              }

              return (
                <ContextMenu key={appt.id}>
                  <ContextMenuTrigger>
                    <div
                      style={{
                        position: "absolute",
                        left: `${left}px`,
                        top: `${top}px`,
                        minWidth: `${width}px`,
                        maxWidth: `${width}px`,
                        height: `${height}px`,
                        boxSizing: "border-box", // Ensure padding doesn't affect size
                      }}
                      className={cn(
                        `rounded-md ${color.stickerColor} p-1 text-sm overflow-hidden flex`,
                        selectedAppointment?.id === appt.id && "scale-102 z-20",
                        draggingInfo?.apptId === appt.id && "opacity-50 cursor-grabbing"
                      )}
                      onDoubleClick={() => setSelectedAppointment(appt)}
                      onMouseDown={(e) => handleStartDrag(e, appt, top)}
                    >
                      <div className={`h-full w-1 mr-1 rounded-sm ${color.lineColor}`}></div>
                      <div className="">
                        <div className="font-medium text-xs">Dr. {dentist.name.split(" ")[0]} /w {appt.patient}</div>
                        {showFullInfo && (
                          <div className="flex items-center mt-1">
                            <span className="text-[9px]">
                              {formatTime(appt.start.hour, appt.start.minute)} →{" "}
                              {formatTime(appt.end.hour, appt.end.minute)}
                            </span>
                            <div className="ml-auto flex size-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                              {patientInitial}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => setSelectedAppointment(appt)}>
                      Info
                      <Info className="ml-2 h-4 w-4" />
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {/* Appointment Details Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Title</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="bg-blue-500 text-white">
                    {selectedAppointment.patient.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    Dr. {dentistSample.find(d => d.id === selectedAppointment.dentistId)?.name.split(" ")[0]} /w {selectedAppointment.patient}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Date & Time</h4>
                <p>
                  {formatTime(selectedAppointment.start.hour, selectedAppointment.start.minute)} - {formatTime(selectedAppointment.end.hour, selectedAppointment.end.minute)}
                </p>
                <p>{formatDate(currentDate)}</p>
                <p>{calculateDuration(selectedAppointment.start, selectedAppointment.end)} • One-off</p>
              </div>
              <div>
                <h4 className="font-medium">Patient's note</h4>
                <p className="text-muted-foreground">{selectedAppointment.note || "No note available."}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="destructive" onClick={() => {
                  setAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));
                  setSelectedAppointment(null);
                }}>
                  Delete
                </Button>
                <Button variant="outline" onClick={() => console.log("Edit details")}>
                  Edit details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
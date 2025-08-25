"use client";
// import { YearView } from "@repo/design/components/calendar/year-view";

import { Calendar as CalendarUI } from "@repo/design/src/components/ui/calendar";
import { Button } from "@repo/design/src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design/src/components/ui/popover";
import { ScrollArea, ScrollBar } from "@repo/design/src/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/design/src/components/ui/select";
import { ChevronLeft, ChevronRight, MoreHorizontal, StethoscopeIcon } from "@repo/design/src/icons";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { truncateText } from "@repo/design/src/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/design/src/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/src/components/ui/avatar";

const dentistSample = [
  {
    name: "josh keneddy",
    avatar: "https://github.com/shadcn.png",
    startDate: "2023-08-25"
  },
  {
    name: "princewill maximillian",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=PM",
    startDate: "2021-05-12"
  },
  {
    name: "ebere adeotun",
    avatar: "https://github.com/evilrabbit.png",
    startDate: "2022-03-04"
  },
  {
    name: "john doe",
    avatar: "https://github.com/shadcn.png",
    startDate: "2020-07-19"
  },
  {
    name: "harry simmons",
    avatar: "https://github.com/leerob.png",
    startDate: "2023-01-20"
  },
  {
    name: "beatrice salvador",
    avatar: "https://github.com/evilrabbit.png",
    startDate: "2021-09-08"
  },
  {
    name: "joy madueke",
    avatar: "https://github.com/leerob.png",
    startDate: "2022-11-15"
  },
  {
    name: "santiago de-lima",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=SDL",
    startDate: "2023-04-30"
  },
  {
    name: "tola oluwatosin",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=TO",
    startDate: "2020-06-22"
  },
  {
    name: "kvicha belmond kvarakeslia",
    avatar: "https://placehold.co/100x100/F0F8FF/333?text=KBK",
    startDate: "2023-07-07"
  }
]


const Calendar = () => {
  const [selectedView, setSelectedView] = useState<"Day" | "Week">("Day");
  const [selectedDentist, setSelectedDentist] = useState("All dentists");
  const [currentDate, setCurrentDate] = useState(new Date());



  const timeSlots = [
    "12 AM",
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
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
  ]

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
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
    const today = new Date();

    // First Reset time to midnight for accurate comparison
    today.setHours(0, 0, 0, 0);
    targetDate = new Date(targetDate);
    targetDate.setHours(0, 0, 0, 0);

    // Get start of week (Monday) for target date
    const targetDay = targetDate.getDay();
    const diffToMonday = targetDay === 0 ? 6 : targetDay - 1;
    const weekStart = new Date(targetDate);
    weekStart.setDate(targetDate.getDate() - diffToMonday);

    // Get end of week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Check if today is between weekStart and weekEnd
    return today >= weekStart && today <= weekEnd;
  }


  const handlePrev = () => {
    if (selectedView === "Day") {
      const oneDayAgo = new Date(currentDate); // Create a new Date object to avoid modifying the original
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      setCurrentDate(oneDayAgo);
    } else {
      const oneWeekAgo = new Date(currentDate); // Create a new Date object to avoid modifying the original
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      setCurrentDate(oneWeekAgo);
    }
  }

  const handleNext = () => {
    if (selectedView === "Day") {
      const oneDayFuture = new Date(currentDate); // Create a new Date object to avoid modifying the original
      oneDayFuture.setDate(oneDayFuture.getDate() + 1);
      setCurrentDate(oneDayFuture);
    } else {
      const oneWeekFuture = new Date(currentDate); // Create a new Date object to avoid modifying the original
      oneWeekFuture.setDate(oneWeekFuture.getDate() + 7);
      if (!isTodayInSameWeek(oneWeekFuture)) {
        setCurrentDate(oneWeekFuture);
      } else {
        setCurrentDate(new Date());
      }
    }
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
                // toDate={}
                hidden={{ after: new Date() }}
              // captionLayout="dropdown"
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
            <div className="flex items-center">
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
                <div className={"flex flex-row overflow-x-auto text-center items-center min-w-full"}>
                  {dentistSample.map(({ name, avatar, startDate }) => (
                    <Tooltip>
                      <TooltipTrigger key={name}><div className={cn("flex items-center h-8 justify-center border border-primary/5 capitalize text-xs font-medium flex-1 w-[160px] my-auto")}>Dr. {""} {truncateText(String(name.split(" ")[0]), 10)}</div></TooltipTrigger>
                      <TooltipContent className="">
                        <div className="flex gap-1 items-center">
                          <Avatar>
                            <AvatarImage src={avatar} />
                            <AvatarFallback className="uppercase bg-background text-foreground font-medium">{name.split("")[0]?.charAt(0)}{name.split("")[1]?.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <span className="capitalize">{name}</span>
                        </div>

                        <span className="font-medium">Since: {startDate}</span>
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
          <div className="space-y-0 border-t border-primary/10">
            {timeSlots.map((time, index) => (
              <div key={index} className="flex border-t border-primary/10 first:border-t-0">
                <div className="flex items-start border border-b-0 border-l-0 border-primary/5 sticky left-0 z-10 bg-background">
                  <div className="w-12 text-xs text-muted-foreground pt-2 pr-2 text-right">{time}</div>
                </div>
                {selectedView === "Day" ? (
                  <div className="flex-1 min-h-[40px] relative">
                    <div className="absolute inset-0 hover:rounded-md hover:border-2 hover:border-primary transition-colors cursor-pointer"></div>
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-7">
                    {weekDates.map((date, dayIndex) => (
                      <div key={dayIndex} className={cn("min-h-[60px] relative border-r border-primary/10 last:border-r-0", { "bg-primary/20": isToday(date) })}>
                        <div className="absolute inset-0 hover:bg-muted/20 transition-colors cursor-pointer hover:rounded-md hover:border-2 hover:border-primary"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
};

export default Calendar;

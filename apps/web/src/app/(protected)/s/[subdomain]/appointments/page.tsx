"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@repo/design/components/ui/button";
import { ScrollArea } from "@repo/design/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design/components/ui/select";

import { cn } from "~/lib/utils";

export default function AppointmentsPage() {
  const [selectedView, setSelectedView] = useState<"Day" | "Week">("Day");
  const [selectedDentist, setSelectedDentist] = useState("All dentists");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 11)); // June 11, 2025

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
  ];
  // Todo: Fix day dates
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

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-xs font-medium">
            Show
          </span>
          <Select value={selectedDentist} onValueChange={setSelectedDentist}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All dentists">All dentists</SelectItem>
              <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
              <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
              <SelectItem value="Dr. Williams">Dr. Williams</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>

          <span className="text-sm font-semibold">
            {formatDate(currentDate)}
          </span>

          <div className="bg-muted flex items-center rounded-lg p-0.5">
            <Button
              variant={selectedView === "Day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedView("Day")}
              className={cn("h-7 px-3 text-xs", {
                "bg-popover shadow-m": selectedView === "Day",
              })}
            >
              Day
            </Button>
            <Button
              variant={selectedView === "Week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedView("Week")}
              className={cn("h-7 px-3 text-xs", {
                "bg-popover shadow-m": selectedView === "Week",
              })}
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
      <ScrollArea className="h-[600px] w-full">
        <div className="min-w-[800px]">
          {/* All Day Section */}
          <div className="border-border mb-4 border-b pb-3">
            <div className="flex items-center">
              <div className="text-muted-foreground w-12 text-xs font-medium">
                All Day
              </div>
              {selectedView === "Day" ? (
                <div className="bg-muted/30 h-8 flex-1 rounded-sm"></div>
              ) : (
                <div className="grid flex-1 grid-cols-7 gap-px">
                  {weekDates.map((date, index) => (
                    <div
                      key={index}
                      className="bg-muted/30 h-8 rounded-sm"
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedView === "Week" && (
            <div className="mb-4 flex items-center">
              <div className="w-12"></div>
              <div className="grid flex-1 grid-cols-7 gap-px">
                {weekDates.map((date, index) => (
                  <div key={index} className="py-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-muted-foreground text-xs font-medium">
                        {dayNames[index]} {date.getDate()}
                      </span>
                      {isToday(date) && (
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Slots */}
          <div className="space-y-0">
            {timeSlots.map((time, index) => (
              <div
                key={time}
                className="border-border/30 flex items-start border-t first:border-t-0"
              >
                <div className="text-muted-foreground w-12 pt-2 pr-2 text-right text-xs font-medium">
                  {time}
                </div>
                {selectedView === "Day" ? (
                  <div className="relative min-h-[40px] flex-1">
                    <div className="hover:bg-muted/20 absolute inset-0 cursor-pointer transition-colors"></div>
                  </div>
                ) : (
                  <div className="grid flex-1 grid-cols-7 gap-px">
                    {weekDates.map((date, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="border-border/20 relative min-h-[40px] border-r last:border-r-0"
                      >
                        <div className="hover:bg-muted/20 absolute inset-0 cursor-pointer transition-colors"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

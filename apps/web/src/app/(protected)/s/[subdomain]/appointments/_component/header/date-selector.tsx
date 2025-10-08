import { endOfWeek, format, startOfWeek } from "date-fns";

import { Button } from "@repo/design/src/components/ui/button";
import { Calendar } from "@repo/design/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design/src/components/ui/popover";
import { ChevronLeft, ChevronRight } from "@repo/design/src/icons";

import { useCalendarStore } from "../store";

export function DateSelector() {
  const { calendarView, currentDate, setCurrentDate } = useCalendarStore();

  function viewDate() {
    let viewTypeValue = "";

    if (calendarView === "day") {
      viewTypeValue = format(currentDate, "MMM d, yyyy");
    } else {
      const weekStart = format(
        startOfWeek(currentDate, { weekStartsOn: 1 }),
        "MMM d",
      ); // starts from monday
      const weekEnd = format(
        endOfWeek(currentDate, { weekStartsOn: 1 }),
        "MMM d",
      );

      viewTypeValue = `${weekStart} - ${weekEnd}, ${currentDate.getFullYear()}`;
    }
    return viewTypeValue;
  }

  function handlePrev() {
    if (calendarView === "day") {
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
    if (calendarView === "day") {
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
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="text-xs">
            {viewDate()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="size-fit border-0 p-0">
          <Calendar
            mode={"single"}
            selected={currentDate}
            onSelect={(date) => {
              if (date) setCurrentDate(new Date(date));
            }}
            today={new Date()}
            className="rounded-md border shadow-sm"
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleNext}
      >
        <ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  );
}

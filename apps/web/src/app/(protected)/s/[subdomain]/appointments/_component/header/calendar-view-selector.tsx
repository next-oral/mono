import { Button } from "@repo/design/src/components/ui/button";

import { cn } from "~/lib/utils";
import { useCalendarStore } from "../store";

export function CalendarViewSelector() {
  const { calendarView, setCalendarView } = useCalendarStore();

  return (
    <div className="bg-muted flex items-center rounded-lg p-0.5">
      <Button
        variant={calendarView === "day" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setCalendarView("day")}
        className={cn("h-7 px-3 text-xs", {
          "bg-popover shadow-sm": calendarView === "day",
        })}
      >
        Day
      </Button>
      <Button
        variant={calendarView === "week" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setCalendarView("week")}
        className={cn("h-7 px-3 text-xs", {
          "bg-popover shadow-sm": calendarView === "week",
        })}
      >
        Week
      </Button>
    </div>
  );
}

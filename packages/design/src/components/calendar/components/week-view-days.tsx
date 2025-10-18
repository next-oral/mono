import { isToday } from "date-fns";

import { cn } from "@repo/design/lib/utils";

import { COLUMN_WIDTH } from "../constants";
import { useCalendarStore } from "../store/store";

/**
 * This Shows the days and Dates on the header of the week view calender usually in this format (MON 17)
 * @returns
 */

export const WeekViewDays = () => {
  const namesOfDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const getWeekDates = useCalendarStore((state) => state.getWeekDates);

  const weekDates = getWeekDates();
  return (
    <div className="bg-background sticky top-0 z-20 flex items-center">
      <div className="text-primary w-12 text-xs">Days</div>
      <div className="flex flex-1 flex-row">
        {weekDates.map((date, index) => (
          <div
            key={index}
            className={cn(
              "border-secondary-foreground/10 flex-1 border-y text-center",
              { "bg-blue-50 dark:bg-blue-950": isToday(date) },
            )}
            style={{ width: `${COLUMN_WIDTH}px` }}
          >
            <div
              className={cn(
                "border-secondary-foreground/10 flex h-8 w-full flex-col items-center justify-center overflow-y-hidden border-l text-xs font-medium capitalize",
              )}
            >
              <span
                className={cn("text-muted-foreground text-xs font-medium", {
                  "text-primary": isToday(date),
                })}
              >
                {namesOfDays[index]} {date.getDate()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { isToday } from "date-fns";
import { useCalendarStore } from "../store/store";
import { cn } from "@repo/design/lib/utils";
import { COLUMN_WIDTH } from "../constants";

/**
 * This Shows the days and Dates on the header of the week view calender usually in this format (MON 17) 
 * @returns 
 */

export const WeekViewDays = () => {
    const namesOfDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const getWeekDates = useCalendarStore((state) => state.getWeekDates);

    const weekDates = getWeekDates();
    return (
        <div className="flex items-center sticky top-0 bg-background z-20">
            <div className="w-12 text-xs text-primary">Days</div>
            <div className="flex-1 flex flex-row">
                {weekDates.map((date, index) => (
                    <div
                        key={index}
                        className={cn("text-center flex-1 border-y border-secondary-foreground/10", { "bg-blue-50 dark:bg-blue-950": isToday(date) })}
                        style={{ width: `${COLUMN_WIDTH}px` }}>
                        <div className={cn("flex flex-col w-full h-8 justify-center items-center overflow-y-hidden border-l border-secondary-foreground/10 capitalize text-xs font-medium")}>
                            <span className={cn("text-xs font-medium text-muted-foreground", { "text-primary": isToday(date) })}>
                                {namesOfDays[index]} {date.getDate()}
                            </span>
                            {isToday(date) && <div className="w-1.5 h-1.5 bg-primary rounded-sm mt-1"></div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

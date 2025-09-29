import { isToday } from "date-fns";
import { useCalendarStore } from "../store/store";
import { cn } from "@repo/design/lib/utils";

// This Shows the days and Dates on the header of the week view calender usually in this format (MON 17) 

export const WeekViewDays = () => {
    const namesOfDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const { getWeekDates } = useCalendarStore();

    const weekDates = getWeekDates();

    return (
        <div className="flex items-center sticky top-0 bg-background z-10">
            <div className="w-12"></div>
            <div className="flex-1 grid grid-cols-7 gap-px">
                {weekDates.map((date, index) => (
                    <div key={index} className={cn("text-center py-2 border border-primary/5", { "bg-primary/20": isToday(date) })}>
                        <div className={cn("flex flex-col items-center")}>
                            <span className={cn("text-xs font-medium text-muted-foreground", { "text-primary": isToday(date) })}>
                                {namesOfDays[index]} {date.getDate()}
                            </span>
                            {isToday(date) && <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1"></div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

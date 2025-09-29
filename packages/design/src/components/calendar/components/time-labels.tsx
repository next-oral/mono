import { isToday } from "date-fns";
import { useCalendarStore } from "../store/store";

export function TimeLabels() {
    const { timeSlots, TIME_SLOT_HEIGHT, currentDate } = useCalendarStore();
    return (
          <div className="w-12 sticky left-0 z-10 bg-background/80 backdrop-blur-xl">
                                         {timeSlots.map((time, index) => (
                                             <div key={index} style={{ height: `${TIME_SLOT_HEIGHT}px` }} className="border-b border-secondary text-xs text-muted-foreground pr-2 text-right">
                                                 {time}
                                                 {isThisHour(time) && isToday(currentDate) && <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 mx-auto"></div>}
                                             </div>
                                         ))}
                                     </div>
    );
}

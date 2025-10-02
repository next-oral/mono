import { isToday } from "date-fns";

import { useCalendarStore } from "../store/store";

export function TimeLabels() {
  const { timeSlots, TIME_SLOT_HEIGHT, currentDate } = useCalendarStore();
  return (
    <div className="bg-background/80 sticky left-0 z-10 w-12 backdrop-blur-xl">
      {timeSlots.map((time, index) => (
        <div
          key={index}
          style={{ height: `${TIME_SLOT_HEIGHT}px` }}
          className="border-secondary text-muted-foreground border-b pr-2 text-right text-xs"
        >
          {time}
          {isThisHour(time) && isToday(currentDate) && (
            <div className="bg-primary mx-auto mt-1 h-1.5 w-1.5 rounded-full"></div>
          )}
        </div>
      ))}
    </div>
  );
}

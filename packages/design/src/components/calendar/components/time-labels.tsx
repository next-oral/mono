import { TIME_SLOT_HEIGHT, timeSlots } from "../constants";
import { useCalendarStore } from "../store/store";
import { CurrentTimeIndicator } from "./indicators";

export function TimeLabels() {
  const { currentDate } = useCalendarStore();
  return (
    <div className="bg-background/80 sticky left-0 z-10 w-12 backdrop-blur-xl">
      {timeSlots.map((time, index) => (
        <div
          key={index}
          style={{ height: `${TIME_SLOT_HEIGHT}px` }}
          className="border-secondary text-muted-foreground border-b pr-2 text-right text-xs"
        >
          {time}
          <CurrentTimeIndicator time={time} currentDate={currentDate} />
        </div>
      ))}
    </div>
  );
}

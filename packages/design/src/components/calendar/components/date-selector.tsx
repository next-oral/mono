import { endOfWeek, format, startOfWeek } from "date-fns";

import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useCalendarStore } from "../store/store";

export function DateSelector() {
  const { selectedView, currentDate, setCurrentDate } = useCalendarStore();

  function viewDate() {
    let viewTypeValue = "";

    if (selectedView === "Day") {
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

  return (
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
            console.log(date);
            if (date) setCurrentDate(new Date(date));
          }}
          today={new Date()}
          className="rounded-md border shadow-sm"
        />
      </PopoverContent>
    </Popover>
  );
}

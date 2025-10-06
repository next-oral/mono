"use client";

import { eachHourOfInterval, endOfDay, format, startOfToday } from "date-fns";

import { useCalendarStore } from "../store";
import { CurrentTimeIndicator } from "./indicators";

const today = startOfToday();
const result = eachHourOfInterval({
  start: today,
  end: endOfDay(today),
});

export function TimeLabels() {
  const timeFormat = useCalendarStore((state) => state.timeFormat);

  return (
    <div className="relative h-full w-10">
      <div className="bg-background sticky top-0 left-0 z-30 flex min-h-10 items-center justify-center border-b text-end text-xs">
        Time
      </div>
      {result.map((label) => (
        <div
          key={label.toISOString()}
          className="text-md relative min-h-24 border-b"
        >
          <time
            className="text-xs"
            dateTime={format(label, "yyyy-MM-dd HH:mm")}
          >
            {format(label, timeFormat === "12h" ? "hh a" : "HH:mm")}
          </time>
          <CurrentTimeIndicator currentTime={label.toISOString()} />
        </div>
      ))}
    </div>
  );
}

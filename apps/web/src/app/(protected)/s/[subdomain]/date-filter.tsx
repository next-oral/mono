"use client";

import type { DateRange } from "react-day-picker";
import { useState } from "react";
import { format } from "date-fns";
import { CircleCheck } from "lucide-react";

import { Calender } from "@repo/design/components/dashboard/calender";
import { Button } from "@repo/design/src/components/ui/button";
import { HugeIcons } from "@repo/design/src/icons";
import { cn } from "@repo/design/src/lib/utils";

export const DateFilter = () => {
  const [active, setActive] = useState<"7" | "30" | "custom">("30");
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setActive("7")}
        className={cn({
          "cursor-pointer bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900":
            active === "7",
        })}
      >
        {active === "7" && (
          <CircleCheck className="fill-slate-900 text-slate-100" />
        )}
        <span>7 days</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setActive("30")}
        className={cn({
          "cursor-pointer bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900":
            active === "30",
        })}
      >
        {active === "30" && (
          <CircleCheck className="fill-slate-900 text-slate-100" />
        )}
        <span>30 days</span>
      </Button>

      <div className="text-slate-200">|</div>
      <Calender setDate={setDate} date={date}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActive("custom")}
          className={cn({
            "cursor-pointer bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900":
              active === "custom",
          })}
        >
          {active === "custom" && (
            <CircleCheck className="fill-slate-900 text-slate-100" />
          )}
          <span>
            {date?.from
              ? date.to
                ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                : format(date.from, "LLL dd, y")
              : "Custom"}
          </span>
          <div className="h-full border-[0.5]"></div>
          <HugeIcons.CalendarAdd />
        </Button>
      </Calender>
    </div>
  );
};

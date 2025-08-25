"use client";

import type {
  DateRange,
  DropdownNavProps,
  DropdownProps,
} from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import { Calendar as CalendarUI } from "@repo/design/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design/components/ui/select";

export function Calender({
  children,
  setDate,
  date,
}: {
  children: React.ReactNode;
  setDate: (date: DateRange | undefined) => void;
  date: DateRange | undefined;
}) {
  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>,
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="mr-4 flex w-auto gap-2 p-2" align="start">
          <CalendarUI
            mode="range"
            numberOfMonths={2}
            pagedNavigation
            className="bg-background rounded-md border p-2"
            classNames={{
              month_caption: "mx-0",
            }}
            selected={date}
            onSelect={setDate}
            captionLayout="dropdown"
            defaultMonth={new Date()}
            startMonth={new Date(1980, 6)}
            hideNavigation
            components={{
              DropdownNav: (props: DropdownNavProps) => {
                return (
                  <div className="flex w-full items-center justify-center gap-2">
                    {props.children}
                  </div>
                );
              },
              Dropdown: (props: DropdownProps) => {
                return (
                  <Select
                    value={String(props.value)}
                    onValueChange={(value) => {
                      if (props.onChange) {
                        handleCalendarChange(value, props.onChange);
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-fit font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                      {props.options?.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={String(option.value)}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}


"use client";

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ClassValue } from "class-variance-authority/types";
import type React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, Clock, X } from "lucide-react";

import { Button } from "@repo/design/components/ui/button";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design/components/ui/popover";
import { cn, splitCamelCaseToWords } from "@repo/design/lib/utils";

type TimeFieldType = "normal" | "from-to";

interface CustomTimeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  timeFieldType?: TimeFieldType;
  isNotLabeled?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  onTimeChange?: (value: string | { from: string; to: string }) => void;
  fieldClassName?: ClassValue;
  labelClassName?: ClassValue;
  inputClassName?: ClassValue;
  popoverContentClassName?: ClassValue;
}

// Helper to format time (e.g., "09:00 AM")
const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${strMinutes} ${ampm}`;
};

// Helper to parse time string (e.g., "09:00 AM") to Date object
const parseTime = (timeString: string): Date => {
  const [time, ampm] = timeString.split(" ");
  // eslint-disable-next-line prefer-const
  let [hours, minutes] = String(time).split(":").map(Number);

  if (ampm === "PM" && hours && hours !== 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }
  const date = new Date();
  date.setHours(Number(hours), minutes, 0, 0);
  return date;
};

// 3D Wheel Time Column Component
interface TimeColumnProps {
  values: (number | string)[];
  selectedValue: number | string;
  onValueChange: (value: number | string) => void;
  formatValue?: (value: number | string) => string;
}

const TimeColumn: React.FC<TimeColumnProps> = ({
  values,
  selectedValue,
  onValueChange,
  formatValue,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const itemHeight = 32; // Reduced height for compactness
  const visibleItems = 3;
  const containerHeight = itemHeight * visibleItems;
  const buttonIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToValue = useCallback(
    (value: number | string, smooth = true) => {
      const index = values.indexOf(value);
      if (index !== -1 && containerRef.current) {
        // Center the selected item by offsetting by half the container height minus half item height
        const scrollTop = index * itemHeight - itemHeight; // This centers the selected item
        containerRef.current.scrollTo({
          top: scrollTop,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    },
    [values, itemHeight],
  );

  useEffect(() => {
    scrollToValue(selectedValue, false);
  }, [selectedValue, scrollToValue]);

  const updateSelectedValue = useCallback(
    (scrollTop: number) => {
      // Calculate which item should be selected based on scroll position
      const centerOffset = itemHeight; // Offset to center the selection
      const index = Math.round((scrollTop + centerOffset) / itemHeight);
      const clampedIndex = Math.max(0, Math.min(values.length - 1, index));
      const newValue = values[clampedIndex];

      if (newValue !== selectedValue) {
        onValueChange(newValue as string);
      }

      // Snap to the correct position
      const targetScrollTop = clampedIndex * itemHeight - itemHeight;
      if (Math.abs(scrollTop - targetScrollTop) > 2) {
        containerRef.current?.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    },
    [values, selectedValue, onValueChange, itemHeight],
  );

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isDragging.current) return;
    updateSelectedValue(containerRef.current.scrollTop);
  }, [updateSelectedValue]);

  // Mouse drag handlers

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      e.preventDefault();
      const deltaY = e.clientY - startY.current;
      const newScrollTop = startScrollTop.current - deltaY;
      containerRef.current.scrollTop = newScrollTop;
      updateSelectedValue(newScrollTop);
    },
    [updateSelectedValue],
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      startY.current = e.clientY;
      startScrollTop.current = containerRef.current?.scrollTop ?? 0;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      e.preventDefault();
    },
    [handleMouseMove, handleMouseUp],
  );

  // Touch handlers with proper passive configuration
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const touchStartHandler = (e: TouchEvent) => {
      isDragging.current = true;
      startY.current = (e.touches[0] as any).clientY;
      startScrollTop.current = container.scrollTop;
    };

    const touchMoveHandler = (e: TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const deltaY = (e.touches[0] as any).clientY - startY.current;
      const newScrollTop = startScrollTop.current - deltaY;
      container.scrollTop = newScrollTop;
      updateSelectedValue(newScrollTop);
    };

    const touchEndHandler = () => {
      isDragging.current = false;
    };

    // Add touch event listeners with proper options
    container.addEventListener("touchstart", touchStartHandler, {
      passive: true,
    });
    container.addEventListener("touchmove", touchMoveHandler, {
      passive: false,
    });
    container.addEventListener("touchend", touchEndHandler, { passive: true });
    const wheelTimeoutRefCurrent = wheelTimeoutRef.current;

    return () => {
      container.removeEventListener("touchstart", touchStartHandler);
      container.removeEventListener("touchmove", touchMoveHandler);
      container.removeEventListener("touchend", touchEndHandler);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // Clear any intervals or timeouts
      if (buttonIntervalRef.current) {
        clearInterval(buttonIntervalRef.current);
      }
      if (wheelTimeoutRefCurrent) {
        clearTimeout(wheelTimeoutRefCurrent as any);
      }
    };
  }, [handleMouseMove, handleMouseUp, updateSelectedValue]);

  // Implement holdable buttons
  const startIncrement = () => {
    incrementValue();
    buttonIntervalRef.current = setInterval(incrementValue, 150);
  };

  const startDecrement = () => {
    decrementValue();
    buttonIntervalRef.current = setInterval(decrementValue, 150);
  };

  const stopButtonInterval = () => {
    if (buttonIntervalRef.current) {
      clearInterval(buttonIntervalRef.current);
      buttonIntervalRef.current = null;
    }
  };

  const incrementValue = () => {
    const currentIndex = values.indexOf(selectedValue);
    const newIndex = Math.max(0, currentIndex - 1);
    const newValue = values[newIndex];
    onValueChange(newValue as string);
    scrollToValue(newValue as number);
  };

  const decrementValue = () => {
    const currentIndex = values.indexOf(selectedValue);
    const newIndex = Math.min(values.length - 1, currentIndex + 1);
    const newValue = values[newIndex];
    onValueChange(newValue as string);
    scrollToValue(newValue as number);
  };

  return (
    <div className="relative flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-accent/50 mb-1 h-5 w-5"
        onMouseDown={startIncrement}
        onMouseUp={stopButtonInterval}
        onMouseLeave={stopButtonInterval}
        onTouchStart={startIncrement}
        onTouchEnd={stopButtonInterval}
        disabled={values.indexOf(selectedValue) === 0}
      >
        <ChevronUp className="h-3 w-3" />
      </Button>

      <div
        ref={containerRef}
        className="relative cursor-grab overflow-hidden rounded-lg select-none active:cursor-grabbing"
        style={{
          height: containerHeight,
          width: "56px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.1) 100%)",
        }}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
      >
        {/* 3D Wheel Effect Overlay */}
        <div className="pointer-events-none absolute inset-0">
          <div className="from-background absolute top-0 right-0 left-0 z-10 h-2 bg-gradient-to-b to-transparent" />
          <div className="from-background absolute right-0 bottom-0 left-0 z-10 h-2 bg-gradient-to-t to-transparent" />
          <div className="border-primary/20 bg-primary/5 absolute top-1/2 right-0 left-0 h-8 -translate-y-1/2 rounded border-y" />
        </div>

        <div
          style={{ height: values.length * itemHeight, paddingTop: itemHeight }}
        >
          {values.map((value, index) => {
            const selectedIndex = values.indexOf(selectedValue);
            const distance = Math.abs(selectedIndex - index);
            const isSelected = value === selectedValue;

            // 3D wheel effect calculations
            const angle = (index - selectedIndex) * 15; // degrees
            const translateY = Math.sin((angle * Math.PI) / 180) * 2;
            const scale = isSelected ? 1 : Math.max(0.7, 1 - distance * 0.15);
            const opacity = isSelected ? 1 : Math.max(0.3, 1 - distance * 0.3);
            const rotateX = angle;

            return (
              <div
                key={value}
                className={cn(
                  "absolute right-0 left-0 flex cursor-pointer items-center justify-center text-base font-semibold transition-all duration-200",
                  isSelected ? "text-foreground" : "text-muted-foreground",
                )}
                style={{
                  top: index * itemHeight,
                  height: itemHeight,
                  opacity,
                  transform: `scale(${scale}) translateY(${translateY}px) rotateX(${rotateX}deg)`,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  onValueChange(value);
                  scrollToValue(value);
                }}
              >
                {formatValue
                  ? formatValue(value)
                  : Number(value) < 10
                    ? `0${value}`
                    : value}
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-accent/50 mt-1 h-5 w-5"
        onMouseDown={startDecrement}
        onMouseUp={stopButtonInterval}
        onMouseLeave={stopButtonInterval}
        onTouchStart={startDecrement}
        onTouchEnd={stopButtonInterval}
        disabled={values.indexOf(selectedValue) === values.length - 1}
      >
        <ChevronDown className="h-3 w-3" />
      </Button>
    </div>
  );
};

// Time Picker Component
interface TimePickerProps {
  initialTime: string;
  onSelect: (time: string) => void;
  onCancel: () => void;
  popoverContentClassName?: ClassValue;
}

const TimePicker: React.FC<TimePickerProps> = ({
  initialTime,
  onSelect,
  onCancel,
  popoverContentClassName,
}) => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedAmPm, setSelectedAmPm] = useState("AM");

  const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    const date = parseTime(initialTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    setSelectedHour(hours);
    setSelectedMinute(minutes);
    setSelectedAmPm(ampm);
  }, [initialTime]);

  const handleOk = () => {
    let finalHours = selectedHour;
    if (selectedAmPm === "PM" && finalHours !== 12) {
      finalHours += 12;
    } else if (selectedAmPm === "AM" && finalHours === 12) {
      finalHours = 0;
    }
    const date = new Date();
    date.setHours(finalHours, selectedMinute, 0, 0);
    onSelect(formatTime(date));
  };

  return (
    <div
      className={cn("flex w-72 flex-col gap-3 p-2", popoverContentClassName)}
    >
      {/* <h3 className="text-center text-base font-semibold">Select time</h3> */}

      <div className="flex items-center justify-center gap-3">
        <TimeColumn
          values={hours}
          selectedValue={selectedHour}
          onValueChange={setSelectedHour as (value: string | number) => void}
        />

        <div className="flex items-center justify-center">
          <span className="text-muted-foreground text-xl font-bold">:</span>
        </div>

        <TimeColumn
          values={minutes}
          selectedValue={selectedMinute}
          onValueChange={setSelectedMinute as (value: string | number) => void}
        />

        <div className="ml-3 flex flex-col">
          <Button
            variant={selectedAmPm === "AM" ? "default" : "outline"}
            size="sm"
            className="h-10 w-12 text-xs font-medium rounded-b-none"
            onClick={() => setSelectedAmPm("AM")}
          >
            AM
          </Button>
          <Button
            variant={selectedAmPm === "PM" ? "default" : "outline"}
            size="sm"
            className="h-10 w-12 text-xs font-medium rounded-t-none"
            onClick={() => setSelectedAmPm("PM")}
          >
            PM
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCancel}
        >
          <X className="text-destructive h-4 w-4" />
          <span className="sr-only">Cancel</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleOk}
        >
          <Check className="text-primary h-4 w-4" />
          <span className="sr-only">OK</span>
        </Button>
      </div>
    </div>
  );
};

export default function CustomTimeField<T extends FieldValues>({
  control,
  name,
  label = "",
  placeholder = "Select time",
  description = "",
  timeFieldType = "normal",
  isNotLabeled = false,
  disabled = false,
  hidden = false,
  readOnly = false,
  onTimeChange,
  fieldClassName = "",
  labelClassName = "",
  inputClassName = "",
  popoverContentClassName = "",
}: CustomTimeFieldProps<T>) {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const defaultTime = "09:00 AM"; // Default time if none is set

  const renderTimeInput = (
    field: any,
    fieldState: any,
    isFromField = false,
    isToField = false,
  ) => {
    const currentFieldValue = isFromField
      ? field.value?.from
      : isToField
        ? field.value?.to
        : field.value;
    const initialTime = currentFieldValue ?? defaultTime;

    const handleTimeSelect = (time: string) => {
      if (isFromField) {
        field.onChange({ ...field.value, from: time });
        onTimeChange?.({ ...field.value, from: time });
        setOpenFrom(false);
      } else if (isToField) {
        field.onChange({ ...field.value, to: time });
        onTimeChange?.({ ...field.value, to: time });
        setOpenTo(false);
      } else {
        field.onChange(time);
        onTimeChange?.(time);
        setOpenFrom(false);
      }
    };

    const handleCancel = () => {
      if (isFromField) setOpenFrom(false);
      else if (isToField) setOpenTo(false);
      else setOpenFrom(false);
    };

    return (
      <Popover
        open={isFromField ? openFrom : openTo}
        onOpenChange={isFromField ? setOpenFrom : setOpenTo}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex w-full min-w-0 justify-between rounded-lg border border-dashed px-3 py-2 text-left font-normal shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              inputClassName,
              {
                "border-destructive bg-destructive/10 text-destructive-foreground":
                  fieldState.error,
                "text-muted-foreground": !currentFieldValue,
              },
            )}
            disabled={disabled || readOnly}
          >
            <Clock className="mr-2 h-4 w-4" />
            <span className="truncate text-xs">
              {currentFieldValue ?? placeholder}
            </span>
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <TimePicker
            initialTime={initialTime}
            onSelect={handleTimeSelect}
            onCancel={handleCancel}
            popoverContentClassName={popoverContentClassName}
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn("space-y-[0.2px]", fieldClassName)}
          hidden={hidden}
        >
          {!isNotLabeled && (
            <FormLabel
              className={cn(
                "text-foreground text-sm font-medium capitalize",
                labelClassName,
              )}
            >
              {label || splitCamelCaseToWords(name)}
            </FormLabel>
          )}

          {timeFieldType === "from-to" ? (
            <div className="grid grid-cols-5 items-center">
              <div className="col-span-2 min-w-0">
                {renderTimeInput(field, fieldState, true, false)}
              </div>
              <span className="text-muted-foreground col-span-1 text-center sm:text-left mx-auto">
                to
              </span>
              <div className="col-span-2 min-w-0">
                {renderTimeInput(field, fieldState, false, true)}
              </div>
            </div>
          ) : (
            renderTimeInput(field, fieldState)
          )}

          {fieldState.error ? (
            <FormMessage className={cn("text-destructive text-sm")} >{fieldState.error.message}</FormMessage>
          ) : (
            <FormDescription className="text-sm">{description}</FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

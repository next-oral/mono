import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassValue } from "clsx";
import { addMinutes, format, isAfter, isBefore, parse } from "date-fns";
import { Control, FieldValues, Path, useForm } from "react-hook-form";
import z from "zod";

import { CustomCommandField } from "@repo/design/src/components/form/custom-command-field";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/src/components/ui/avatar";
import { Button } from "@repo/design/src/components/ui/button";
import { Calendar } from "@repo/design/src/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/design/src/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design/src/components/ui/form";
import { Input } from "@repo/design/src/components/ui/input";
import { Label } from "@repo/design/src/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design/src/components/ui/popover";
import { ScrollArea } from "@repo/design/src/components/ui/scroll-area";
import { SheetClose, SheetFooter } from "@repo/design/src/components/ui/sheet";
import { Textarea } from "@repo/design/src/components/ui/textarea";
import { CalendarIcon, Check, ChevronsUpDown } from "@repo/design/src/icons";
import {
  cn,
  parseTimeToMinutes,
  splitCamelCaseToWords,
} from "@repo/design/src/lib/utils";

import { dentists, patients } from "../constants";
import { useCalendarStore } from "../store";
import { computePositionAndSize } from "../utils";

/**
 *
 * This function first parses the string into a Date object based on its length
 * and then uses 'format' to output the desired "HH:MM" string.
 *
 * @param timeStr The 24-hour time string ("08:30:15" or "08:30").
 * @returns The normalized time string in "HH:MM" format.
 */
function normalizeTimeFormat(timeStr: string): string {
  // Determine the input format string based on string length
  let inputFormat: string;
  const referenceDate = new Date();

  // Use the length to determine the correct parsing mask
  if (timeStr.length >= 8 && timeStr.lastIndexOf(":") === 5) {
    // Matches "HH:mm:ss"
    inputFormat = "HH:mm:ss";
  } else if (timeStr.length >= 5 && timeStr.indexOf(":") === 2) {
    // Matches "HH:mm"
    inputFormat = "HH:mm";
  } else {
    // If format is completely unknown, return original string or throw error
    console.error(`Unknown time string format: ${timeStr}`);
    return timeStr;
  }

  try {
    // 1. Parse the time string into a Date object
    const dateObj = parse(timeStr, inputFormat, referenceDate);

    // 2. Check if parsing failed (e.g., "99:99")
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid time component parsed.");
    }

    // 3. Format the Date object to the desired "HH:MM" output
    return format(dateObj, "HH:mm");
  } catch (error) {
    console.error(
      `Failed to parse time string "${timeStr}" with date-fns:`,
      error,
    );
    return timeStr;
  }
}

const timeFieldSchema = z
  .object({
    from: z.string().optional(), // Allow initial empty state
    to: z.string().optional(), // Allow initial empty state
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        try {
          const fromMinutes = parseTimeToMinutes(data.from);
          const toMinutes = parseTimeToMinutes(data.to);
          return toMinutes > fromMinutes;
        } catch {
          return false; // Invalid time format
        }
      }
      return true; // Skip if either field is empty
    },
    {
      message: "'To' time must be after 'From' time",
      path: ["to"], // Will be nested under "time" in the form
    },
  );

const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  dentistId: z.string().min(1, "Please select a dentist"),
  date: z.string().min(1, "Please select a date"),
  time: timeFieldSchema,
  notes: z.string().max(150, "Notes must be 150 characters or less").optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  // Optional initial values for editing
  initialValues?: Partial<AppointmentFormData> | null;
  // Callbacks
  onSubmit?: (data: AppointmentFormData) => void;
  onCancel?: () => void;

  // UI customization
  submitLabel?: string;
  showCancelButton?: boolean;
  maxNotesLength?: number;
}

function parseTimeFromMeridianTo24h(type: "from" | "to", timeString?: string) {
  if (!timeString) return type == "from" ? "00:00" : "00:30";
  const parsedDate = parse(timeString, "hh:mm a", new Date());
  return format(parsedDate, "HH:mm:ss");
}

function parseTimeFrom24hToMeridian(timeString?: string) {
  if (!timeString) return "12:00 am";
  const parsedDate = parse(timeString, "HH:mm:ss", new Date());
  return format(parsedDate, "hh:mm a ");
}

export function AppointmentForm({
  initialValues = null,
  onSubmit,
  onCancel,
  submitLabel = "Save Appointment",
  maxNotesLength = 150,
}: AppointmentFormProps) {
  const setHighlight = useCalendarStore((state) => state.setHighlight);
  const setCurrentDate = useCalendarStore((state) => state.setCurrentDate);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: initialValues?.patientId || "",
      dentistId: initialValues?.dentistId || "",
      time: {
        from: parseTimeFromMeridianTo24h("from", initialValues?.time?.from),
        to: parseTimeFromMeridianTo24h("to", initialValues?.time?.to),
      },
      date: initialValues?.date || "",
      notes: initialValues?.notes || "",
    },
  });

  const handleSubmit = (data: AppointmentFormData) => {
    onSubmit?.(data);
  };

  const selectedPatientId = form.watch("patientId");
  const selectedDentistId = form.watch("dentistId");
  const selectedDate = form.watch("date");
  const selectedTime = form.watch("time");
  const notesValue = form.watch("notes");

  useEffect(() => {
    setCurrentDate(new Date(selectedDate));
  }, [form.watch("date")]);

  useEffect(() => {
    const fromStr = normalizeTimeFormat(String(selectedTime.from));
    const toStr = normalizeTimeFormat(String(selectedTime.to));
    if (!fromStr || !toStr) return;

    const fromDate = parse(fromStr, "HH:mm", new Date());
    const toDate = parse(toStr, "HH:mm", new Date());
    const minToDate = addMinutes(fromDate, 15);

    if (isBefore(toDate, minToDate)) {
      const maxToDate = parse("23:45:00", "HH:mm:ss", new Date());
      const newToDate = isAfter(minToDate, maxToDate) ? maxToDate : minToDate;
      form.setValue("time.to", format(newToDate, "HH:mm"));
    }
  }, [form.watch("time.from"), form]);

  useEffect(() => {
    if (selectedDentistId && selectedDate) {
      const parsedFromTime = parse(
        normalizeTimeFormat(String(selectedTime.from)),
        "HH:mm",
        new Date(selectedDate),
      );
      const parsedToTime = parse(
        normalizeTimeFormat(String(selectedTime.to)),
        "HH:mm",
        new Date(selectedDate),
      );

      const rect = computePositionAndSize(
        parsedFromTime.toISOString(),
        parsedToTime.toISOString(),
      );
      setHighlight(selectedDentistId, new Date(selectedDate), {
        height: rect.heightPx,
        top: rect.topPx,
      });
    }
  }, [
    form.watch("time.from"),
    form.watch("time.to"),
    form.watch("dentistId"),
    form.watch("date"),
  ]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const selectedDentist = dentists.find(
    (d) => String(d.id) === selectedDentistId,
  );

  return (
    <Form {...form}>
      <ScrollArea className="max-h-[80vh]">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex flex-col gap-6 px-2">
            <CustomComboboxField
              control={form.control}
              name="patientId"
              options={patients}
              label="Patient"
              defaultSelected={selectedPatient?.id}
            />

            <CustomComboboxField
              control={form.control}
              name="dentistId"
              options={dentists as unknown as ComboboxOption[]}
              label="Attending Dentist"
              defaultSelected={selectedDentist?.id}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "py-5 pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="time-picker">Time duration</Label>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="time.from"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="time"
                          id="time-picker"
                          step="900"
                          defaultValue="12:00:00"
                          max="23:00:00"
                          className="bg-background appearance-none text-sm [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time.to"
                  render={({ field }) => {
                    const fromStr = selectedTime.from; // Watch inside render for dynamic min
                    let minTo = "00:15"; // Fallback
                    if (fromStr) {
                      const fromDate = parse(
                        normalizeTimeFormat(fromStr),
                        "HH:mm",
                        new Date(),
                      );
                      minTo = format(addMinutes(fromDate, 15), "HH:mm");
                    }
                    return (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="time"
                            step="900"
                            defaultValue="12:30:00"
                            min={minTo}
                            max="23:45:00"
                            className="bg-background appearance-none text-sm [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            <hr />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-2 flex items-center justify-between">
                    <FormLabel className="text-muted-foreground text-xs tracking-wider uppercase">
                      Extra
                    </FormLabel>
                  </div>
                  <FormLabel>Patient notes</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        placeholder="Add any additional notes about the patient or appointment..."
                        className="focus-visible:border-secondary-foreground/50 min-h-[120px] resize-none focus-visible:ring-0"
                        maxLength={maxNotesLength}
                      />
                      <div className="text-muted-foreground absolute right-3 bottom-3 text-xs">
                        {notesValue?.length || 0}/{maxNotesLength}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <SheetFooter className="px-0">
            <hr />
            <SheetClose asChild>
              <Button variant={"outline"}>Discard</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </ScrollArea>
    </Form>
  );
}

interface ComboboxOption {
  id: string;
  name: string;
  avatar?: string; // URL or path to avatar image
  disabled?: boolean;
}

interface CustomComboboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  description?: string;
  options: ComboboxOption[];
  defaultSelected?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
}

const getInitials = (name: string): string => {
  const initial = name.charAt(0);
  return initial.toUpperCase();
};

export default function CustomComboboxField<T extends FieldValues>({
  control,
  name,
  label = "",
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  description = "",
  options = [],
  defaultSelected,
  disabled = false,
  readOnly = false,
  onValueChange,
}: CustomComboboxFieldProps<T>) {
  const [open, setOpen] = useState(false);

  const renderSelectedOption = (selectedId: string) => {
    const selected = options.find((option) => option.id == selectedId);
    if (!selected) return placeholder;

    return (
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={selected.avatar} alt={selected.name} />
          <AvatarFallback className="text-foreground bg-primary/70 text-xs font-semibold">
            {getInitials(selected.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{selected.name}</span>
        </div>
      </div>
    );
  };

  const renderOption = (option: ComboboxOption, isSelected: boolean) => {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={option.avatar} alt={option.name} />
          <AvatarFallback
            className={cn(
              "text-foreground bg-primary/70 text-xs font-semibold",
            )}
          >
            {getInitials(option.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{option.name}</span>
        </div>
        {isSelected && <Check className="ml-auto h-4 w-4 flex-shrink-0" />}
      </div>
    );
  };

  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      // defaultValue={defaultSelected}
      render={({ field, fieldState }) => (
        <FormItem className="">
          <FormLabel className="text-foreground text-sm font-medium capitalize">
            {label || splitCamelCaseToWords(name)}
          </FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl className="-mt-1">
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled || readOnly}
                  className={cn(
                    "border-input bg-background hover:bg-background w-full justify-between rounded-lg border px-3 py-6 text-left font-normal capitalize shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    {
                      "border-destructive bg-destructive/5": fieldState.error,
                      "text-muted-foreground": !field.value,
                    },
                  )}
                >
                  {field.value || defaultSelected
                    ? renderSelectedOption(
                      field.value || String(defaultSelected),
                    )
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command className="w-full">
                <CommandInput placeholder={searchPlaceholder} className="h-9" />
                <CommandList>
                  <CommandEmpty className="py-6 text-center text-sm">
                    No result found
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => {
                      const isSelected = field.value === option.id;

                      return (
                        <CommandItem
                          key={option.id}
                          value={option.name} // Search by name
                          disabled={option.disabled}
                          onSelect={() => {
                            field.onChange(option.id);
                            onValueChange?.(option.id);
                            setOpen(false);
                          }}
                          className="cursor-pointer capitalize"
                        >
                          {renderOption(option, isSelected)}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {fieldState.error ? (
            <FormMessage className={cn("text-destructive text-sm")} />
          ) : (
            <FormDescription className="text-sm">{description}</FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

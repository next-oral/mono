import type { ClassValue } from "clsx";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { useZero } from "@rocicorp/zero/react";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";

import type { Mutators } from "@repo/zero/src/mutators";
import type { Appointment, Schema } from "@repo/zero/src/schema";
import { aptTypeEnum, colourEnum } from "@repo/database/src/schema";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/src/components/ui/avatar";
import { Badge } from "@repo/design/src/components/ui/badge";
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
import { Textarea } from "@repo/design/src/components/ui/textarea";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  User,
} from "@repo/design/src/icons";
import {
  cn,
  parseTimeToMinutes,
  splitCamelCaseToWords,
} from "@repo/design/src/lib/utils";

import type { Color } from "../types";
import { authClient } from "~/auth/client";
import { useZeroQuery } from "~/providers/zero";
import { buildQuery } from "../query";
import { useCalendarStore } from "../store";

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
  type: z.enum(aptTypeEnum.enumValues),
  date: z.string().min(1, "Please select a date"),
  time: timeFieldSchema,
  // startTime: z.string().min(1, "Please select a start time"),
  // endTime: z.string().min(1, "Please select an end time"),
  description: z
    .string()
    .max(150, "Description must be 150 characters or less")
    .optional(),
  notes: z.string().max(150, "Notes must be 150 characters or less").optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema> & {
  id?: string;
  colour?: Color;
};

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
  children: (props: { onSubmit: () => void }) => React.ReactNode;
}

function parseTimeFromMeridianTo24h(timeString?: string) {
  if (!timeString) return format(new Date(), "HH:mm");
  const parsedDate = parse(timeString, "hh:mm a", new Date());
  return format(parsedDate, "HH:mm");
}

export function AppointmentForm({
  initialValues = null,
  onSubmit,

  maxNotesLength = 150,
  children,
}: AppointmentFormProps) {
  const currentDate = useCalendarStore((state) => state.currentDate);
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: initialValues?.patientId,
      dentistId: initialValues?.dentistId,
      type: initialValues?.type,
      time: {
        from: parseTimeFromMeridianTo24h(initialValues?.time?.from),
        to: parseTimeFromMeridianTo24h(initialValues?.time?.to),
      },
      date: initialValues?.date ?? currentDate.toISOString(),
      notes: initialValues?.notes ?? initialValues?.description,
    },
  });
  const z = useZero<Schema, Mutators>();
  const handleSubmit = (data: AppointmentFormData) => {
    if (!data.time.from || !data.time.to) return;
    onSubmit?.(data);

    const start = parse(data.time.from, "HH:mm", data.date).getTime();
    const end = parse(data.time.to, "HH:mm", data.date).getTime();

    const id = initialValues?.id ?? createId();
    console.log("appointment id", id);
    const ap = {
      id,
      start,
      end,
      colour:
        initialValues?.colour ??
        colourEnum.enumValues[
          Math.floor(Math.random() * colourEnum.enumValues.length)
        ] ??
        "sky",
      orgId: orgId,
      patId: data.patientId,
      dentistId: data.dentistId,
      type: data.type,
      note: data.notes ?? data.description ?? null,
      status: "PENDING",
      description: null,
    } as Appointment;
    z.mutate.appointment.create(ap);
  };

  const notesValue = form.watch("notes");

  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();
  const orgId = activeOrganization?.id ?? organizations?.[0]?.id ?? "";

  const { data: patients } = useZeroQuery(
    z.query.patient.where("orgId", "=", orgId),
  );

  const { data: dentists } = useZeroQuery(buildQuery(z, currentDate, orgId));

  const dentistsOptions = dentists.map((dentist) => ({
    ...dentist,
    name: `${dentist.firstName} ${dentist.lastName}`,
  }));
  const patientsOptions = patients.map((patient) => ({
    ...patient,
    name: `${patient.firstName} ${patient.lastName}`,
  }));

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 px-4"
        >
          <ScrollArea className="">
            <div className="flex max-h-[20%] flex-col gap-4">
              <CustomComboboxField
                control={form.control}
                name="patientId"
                options={patientsOptions}
                label="Patient"
              />
              <CustomComboboxField
                control={form.control}
                name="dentistId"
                options={dentistsOptions}
                label="Attending Dentist"
              />
              <CustomComboboxField
                control={form.control}
                name="type"
                showAvatar={false}
                options={aptTypeEnum.enumValues
                  .filter((type) =>
                    type === "NEW_PATIENT" && initialValues?.patientId
                      ? false
                      : true,
                  )
                  .map((type) => ({
                    id: type,
                    name: type.toLowerCase().replace("_", " "),
                  }))}
                label="Type"
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
                            className="bg-background appearance-none text-xs [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="time"
                            step="900"
                            defaultValue="12:30:00"
                            className="bg-background appearance-none text-xs [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
                          className="min-h-[120px] resize-none"
                          maxLength={maxNotesLength}
                        />
                        <div className="text-muted-foreground absolute right-3 bottom-3 text-xs">
                          {notesValue?.length ?? 0}/{maxNotesLength}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>
        </form>
      </Form>
      {children({ onSubmit: () => handleSubmit(form.getValues()) })}
    </>
  );
}

type ComboboxVariant = "default" | "compact" | "minimal";

interface ComboboxOption {
  id: string;
  name: string;
  image?: string; // URL or path to avatar image
  email?: string | null; // Optional email for additional info
  role?: string; // Optional role/title
  disabled?: boolean;
  badge?: string; // Optional badge text
}

interface CustomComboboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  description?: string;
  options: ComboboxOption[];
  defaultSelected?: ComboboxOption;
  emptyMessage?: string;
  variant?: ComboboxVariant;
  showAvatar?: boolean;
  showEmail?: boolean;
  showRole?: boolean;
  showBadge?: boolean;
  allowClear?: boolean;
  isNotLabeled?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
  fieldClassName?: ClassValue;
  labelClassName?: ClassValue;
  triggerClassName?: ClassValue;
  contentClassName?: ClassValue;
  avatarClassName?: ClassValue;
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
  // defaultSelected,
  emptyMessage = "No results found.",
  // variant = "default",
  showAvatar = true,
  showEmail = false,
  showRole = false,
  showBadge = false,
  allowClear = false,
  isNotLabeled = false,
  disabled = false,
  hidden = false,
  readOnly = false,
  onValueChange,
  fieldClassName = "",
  labelClassName = "",
  triggerClassName = "",
  contentClassName = "",
  avatarClassName = "",
}: CustomComboboxFieldProps<T>) {
  const [open, setOpen] = useState(false);

  const renderSelectedOption = (selectedId: string) => {
    const selected = options.find((option) => option.id === selectedId);
    if (!selected) return placeholder;

    return (
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {showAvatar && (
          <Avatar className={cn("h-8 w-8 flex-shrink-0", avatarClassName)}>
            <AvatarImage src={selected.image} alt={selected.name} />
            <AvatarFallback className="text-foreground bg-primary/70 text-xs font-semibold">
              {getInitials(selected.name)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{selected.name}</span>
          {showEmail && selected.email && (
            <span className="text-muted-foreground truncate text-xs">
              {selected.email}
            </span>
          )}
          {showRole && selected.role && (
            <span className="text-muted-foreground truncate text-xs">
              {selected.role}
            </span>
          )}
        </div>
        {showBadge && selected.badge && (
          <Badge variant="secondary" className="flex-shrink-0 text-xs">
            {selected.badge}
          </Badge>
        )}
      </div>
    );
  };

  const renderOption = (option: ComboboxOption, isSelected: boolean) => {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {showAvatar && (
          <Avatar className={cn("h-8 w-8 flex-shrink-0", avatarClassName)}>
            <AvatarImage src={option.image} alt={option.name} />
            <AvatarFallback
              className={cn(
                "text-foreground bg-primary/70 text-xs font-semibold",
              )}
            >
              {getInitials(option.name)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{option.name}</span>
          {showEmail && option.email && (
            <span className="text-muted-foreground truncate text-xs">
              {option.email}
            </span>
          )}
          {showRole && option.role && (
            <span className="text-muted-foreground truncate text-xs">
              {option.role}
            </span>
          )}
        </div>
        {showBadge && option.badge && (
          <Badge variant="secondary" className="flex-shrink-0 text-xs">
            {option.badge}
          </Badge>
        )}
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
        <FormItem className={cn("space-y-2", fieldClassName)} hidden={hidden}>
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

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl className="-mt-2">
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled || readOnly}
                  className={cn(
                    "border-input bg-background hover:bg-background focus-visible:ring-ring w-full justify-between rounded-lg border px-3 py-6 text-left font-normal shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    triggerClassName,
                    {
                      "border-destructive bg-destructive/5": fieldState.error,
                      "text-muted-foreground": !field.value,
                    },
                  )}
                >
                  {field.value
                    ? renderSelectedOption(field.value)
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className={cn(
                "popover-content-width-full w-full bg-red-500 p-0",
                contentClassName,
              )}
              align="start"
            >
              <Command className="w-full">
                <CommandInput placeholder={searchPlaceholder} className="h-9" />
                <CommandList>
                  <CommandEmpty className="py-6 text-center text-sm">
                    {emptyMessage}
                  </CommandEmpty>
                  <CommandGroup>
                    {allowClear && field.value && (
                      <CommandItem
                        value=""
                        onSelect={() => {
                          field.onChange("");
                          onValueChange?.("");
                          setOpen(false);
                        }}
                        className="text-muted-foreground"
                      >
                        <div className="flex items-center gap-3">
                          <div className="border-muted-foreground/30 flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed">
                            <User className="h-4 w-4" />
                          </div>
                          <span>Clear selection</span>
                        </div>
                      </CommandItem>
                    )}
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

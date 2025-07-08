"use client";

import type { ClassValue } from "class-variance-authority/types";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn, splitCamelCaseToWords } from "@repo/design/lib/utils";

import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface CommandOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CustomCommandFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  description?: string;
  options: CommandOption[];
  emptyMessage?: string;
  isNotLabeled?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  allowSearch?: boolean;
  allowClear?: boolean;
  onSelect?: (value: string) => void;
  fieldClassName?: ClassValue;
  labelClassName?: ClassValue;
  commandClassName?: ClassValue;
  triggerClassName?: ClassValue;
  contentClassName?: ClassValue;
}

export default function CustomCommandField<T extends FieldValues>({
  control,
  name,
  label = "",
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  description = "",
  options = [],
  emptyMessage = "No options found.",
  isNotLabeled = false,
  disabled = false,
  hidden = false,
  readOnly = false,
  allowSearch = true,
  allowClear = false,
  onSelect,
  fieldClassName = "",
  labelClassName = "",
  commandClassName = "",
  triggerClassName = "",
  contentClassName = "",
}: CustomCommandFieldProps<T>) {
  const [open, setOpen] = useState(false);

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
                "text-accent-foreground/80 text-sm font-medium capitalize",
                labelClassName,
              )}
            >
              {label || splitCamelCaseToWords(name)}
            </FormLabel>
          )}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled || readOnly}
                  className={cn(
                    "border-secondary-foreground/30 w-full justify-between rounded-lg border bg-transparent px-3 py-5 shadow-none transition-all duration-200 hover:bg-transparent focus:border-transparent focus:ring-0 focus:outline-none focus-visible:ring-0",
                    triggerClassName,
                    {
                      "border-destructive/5 focus:ring-destructive/10 bg-destructive/10":
                        fieldState.error,
                      "text-muted-foreground": !field.value,
                    },
                  )}
                >
                  {field.value
                    ? options.find((option) => option.value === field.value)
                        ?.label
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className={cn("w-[130%] p-0", contentClassName)}
              align="start"
            >
              <Command className={cn(commandClassName)}>
                {allowSearch && (
                  <CommandInput
                    placeholder={searchPlaceholder}
                    className="h-9"
                  />
                )}
                <CommandList>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {allowClear && field.value && (
                      <CommandItem
                        value=""
                        onSelect={() => {
                          field.onChange("");
                          onSelect?.("");
                          setOpen(false);
                        }}
                        className="text-muted-foreground"
                      >
                        Clear selection
                      </CommandItem>
                    )}
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        onSelect={(currentValue) => {
                          const newValue =
                            currentValue === field.value ? "" : currentValue;
                          field.onChange(newValue);
                          onSelect?.(newValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
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

import type { ClassValue } from "class-variance-authority/types";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design/components/ui/accordion";
import { Badge } from "@repo/design/components/ui/badge";
import { Checkbox } from "@repo/design/components/ui/checkbox";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design/components/ui/form";
import { cn, splitCamelCaseToWords } from "@repo/design/lib/utils";

import { ScrollArea } from "../ui/scroll-area";

interface CheckboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CustomAccordionCheckboxGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  options: CheckboxOption[];
  isNotLabeled?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  onSelectionChange?: (value: string[]) => void;
  fieldClassName?: ClassValue;
  labelClassName?: ClassValue;
  accordionClassName?: ClassValue;
  triggerClassName?: ClassValue;
  contentClassName?: ClassValue;
  checkboxItemClassName?: ClassValue;
}

export function CustomAccordionCheckboxGroup<T extends FieldValues>({
  control,
  name,
  label = "",
  placeholder = "Select options...",
  description = "",
  options = [],
  isNotLabeled = false,
  disabled = false,
  hidden = false,
  readOnly = false,
  onSelectionChange,
  fieldClassName = "",
  labelClassName = "",
  accordionClassName = "",
  triggerClassName = "",
  contentClassName = "",
  checkboxItemClassName = "",
}: CustomAccordionCheckboxGroupProps<T>) {
  const [accordionOpen, setAccordionOpen] = useState(false);

  const handleCheckboxChange = (
    checked: boolean,
    optionValue: string,
    currentValues: string[],
    onChange: (value: string[]) => void,
  ) => {
    let newValues: string[];
    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter((value) => value !== optionValue);
    }
    onChange(newValues);
    onSelectionChange?.(newValues);
  };

  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => {
        const selectedCount = (field.value ?? []).length;
        const displayCount =
          selectedCount > 0 ? `${selectedCount} selected` : "";

        return (
          <FormItem
            className={cn("space-y-[0.2px]", fieldClassName)}
            hidden={hidden}
          >
            <div className="flex items-center justify-between">
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
              {selectedCount > 0 && (
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  {displayCount}
                </Badge>
              )}
            </div>

            <Accordion
              type="single"
              collapsible
              className={cn("w-full", accordionClassName)}
              value={accordionOpen ? "item-1" : ""}
              onValueChange={(value) => setAccordionOpen(value === "item-1")}
            >
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger
                  className={cn(
                    "border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex w-full justify-between rounded-lg border px-3 py-2 text-sm shadow-sm transition-all duration-200 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    triggerClassName,
                    {
                      "border-destructive bg-destructive/10 text-destructive-foreground":
                        fieldState.error,
                      "rounded-b-none border-b-0": accordionOpen,
                    },
                  )}
                >
                  <span className="text-muted-foreground">{placeholder}</span>
                </AccordionTrigger>
                <AccordionContent
                  className={cn(
                    "border-input bg-popover text-popover-foreground rounded-b-lg border shadow-sm",
                    contentClassName,
                    {
                      "border-destructive bg-destructive/10": fieldState.error,
                    },
                  )}
                >
                  <ScrollArea>
                    <div className="max-h-[50svh] space-y-3 p-4">
                      {options.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                          No options available.
                        </p>
                      )}
                      {options.map((option) => (
                        <div
                          key={option.value}
                          className={cn(
                            "flex items-center space-x-2",
                            checkboxItemClassName,
                          )}
                        >
                          <Checkbox
                            id={`${name}-${option.value}`}
                            checked={((field.value ?? []) as string[]).includes(
                              option.value,
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                checked as boolean,
                                option.value,
                                (field.value ?? []) as string[],
                                field.onChange,
                              )
                            }
                            disabled={disabled || readOnly || option.disabled}
                            className={cn(
                              "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                              {
                                "border-destructive data-[state=checked]:bg-destructive":
                                  fieldState.error,
                              },
                            )}
                          />
                          <label
                            htmlFor={`${name}-${option.value}`}
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {fieldState.error ? (
              <FormMessage className={cn("text-destructive text-sm")} />
            ) : (
              <FormDescription className="text-sm">
                {description}
              </FormDescription>
            )}
          </FormItem>
        );
      }}
    />
  );
}

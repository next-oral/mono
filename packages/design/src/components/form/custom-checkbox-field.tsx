"use client";

import type { ClassValue } from "class-variance-authority/types";
import type { Control, FieldValues, Path } from "react-hook-form";

import { cn, splitCamelCaseToWords } from "@repo/design/lib/utils";

import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface CustomCheckboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  isNotLabeled?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  defaultChecked?: boolean;
  fieldClassName?: ClassValue;
  labelClassName?: ClassValue;
  checkboxClassName?: ClassValue;
}

/**
 * A reusable checkbox component for React Hook Form, styled with shadcn/ui.
 * It follows the same pattern as the CustomInputField, providing a consistent
 * and controlled form element.
 */
export function CustomCheckboxField<T extends FieldValues>({
  control,
  name,
  label = "",
  description = "",
  isNotLabeled = false,
  disabled = false,
  hidden = false,
  defaultChecked = false,
  fieldClassName = "",
  labelClassName = "",
  checkboxClassName = "",
}: CustomCheckboxFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-y-0 space-x-3",
            fieldClassName,
          )}
          hidden={hidden}
        >
          <FormControl>
            {/* The Checkbox component from shadcn/ui. We use field.value and field.onChange */}
            <Checkbox
              checked={field.value}
              defaultChecked={defaultChecked}
              onCheckedChange={field.onChange}
              className={cn(checkboxClassName, {
                // Add error styling if the field has an error
                "border-destructive focus:ring-destructive/10 bg-destructive/10":
                  fieldState.error,
              })}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {!isNotLabeled && (
              <FormLabel
                className={cn(
                  "text-accent-foreground/80 text-sm font-medium capitalize",
                  labelClassName,
                )}
              >
                {/* Use the provided label or automatically generate one from the name */}
                {label || splitCamelCaseToWords(name)}
              </FormLabel>
            )}
            {fieldState.error ? (
              <FormMessage className={cn("text-destructive text-sm")} />
            ) : (
              <FormDescription className="text-sm">
                {description}
              </FormDescription>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}

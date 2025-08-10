import type { ClassValue } from "class-variance-authority/types";
import type { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design/components/ui/form";
import { Switch } from "@repo/design/components/ui/switch";
import { cn, splitCamelCaseToWords } from "@repo/design/lib/utils";

interface CustomSwitchFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  isNotLabeled?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  fieldClassName?: ClassValue;
  labelClassName?: ClassValue;
  switchClassName?: ClassValue; // Renamed from inputClassName for clarity
}

export function CustomSwitchField<T extends FieldValues>({
  control,
  name,
  label = "",
  description = "",
  isNotLabeled = false,
  disabled = false,
  hidden = false,
  readOnly = false,
  onCheckedChange,
  fieldClassName = "",
  labelClassName = "",
  switchClassName = "",
}: CustomSwitchFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            "border-input bg-background flex flex-row items-center justify-between p-4 transition-colors",
            fieldClassName,
            {
              "border-destructive bg-destructive/10": fieldState.error,
            },
          )}
          hidden={hidden}
        >
          <div className="space-y-0.5">
            {!isNotLabeled && (
              <FormLabel
                className={cn(
                  "text-foreground text-base font-normal capitalize",
                  labelClassName,
                )}
              >
                {label || splitCamelCaseToWords(name)}
              </FormLabel>
            )}
            {fieldState.error ? (
              <FormMessage className={cn("text-destructive text-sm")} />
            ) : (
              <FormDescription className="text-muted-foreground text-sm">
                {description}
              </FormDescription>
            )}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                onCheckedChange?.(checked);
              }}
              disabled={disabled || readOnly}
              className={switchClassName as string}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

"use client";

import type { ClassValue } from "class-variance-authority/types";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { cn, splitCamelCaseToWords } from "@repo/design/lib/utils";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface CustomInputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  inputType?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  isPasswordVisible?: boolean;
  setIsPasswordVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  isNotLabeled?: boolean;
  defaultValue?: never;
  value?: string | number;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  fieldClassName?: ClassValue;
  labelClassName?: ClassValue;
  inputClassName?: ClassValue;
}

export default function CustomInputField<T extends FieldValues>({
  control,
  name,
  label = "",
  placeholder = "",
  description = "",
  inputType = "text",
  inputMode = "text",
  isPasswordVisible,
  setIsPasswordVisible,
  isNotLabeled = false,
  defaultValue,
  value = "",
  disabled = false,
  hidden = false,
  readOnly = false,
  fieldClassName = "",
  labelClassName = "",
  inputClassName = "",
}: CustomInputFieldProps<T>) {
  //   Checks if input is a password by checking input tyoe or if name contains "PASSWORD"
  const isPasswordField =
    inputType === "password" || name.toLowerCase().includes("password");

  const togglePasswordVisibility = () => {
    if (setIsPasswordVisible) {
      setIsPasswordVisible(!isPasswordVisible);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
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

          <div className="relative">
            <FormControl>
              <Input
                className={cn(
                  "border-secondary-foreground/30 w-full rounded-lg border bg-transparent px-3 py-5 shadow-none transition-all duration-200 focus:border-transparent focus:ring-0 focus:outline-none focus-visible:ring-0",
                  inputClassName,
                  {
                    "border-destructive/5 focus:ring-destructive/10 bg-destructive/10":
                      fieldState.error,
                    "pr-10": isPasswordField,
                  },
                )}
                inputMode={inputMode}
                placeholder={placeholder}
                {...field}
                value={value || field.value || ""}
                type={
                  isPasswordField
                    ? isPasswordVisible
                      ? "text"
                      : "password"
                    : inputType
                }
                hidden={hidden}
                readOnly={readOnly}
              />
            </FormControl>

            {isPasswordField && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
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

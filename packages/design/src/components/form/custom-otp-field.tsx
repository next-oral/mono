"use client";

import type { ClassValue } from "class-variance-authority/types";
import type { Control, FieldValues, Path } from "react-hook-form";
import React, { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { cn } from "@repo/design/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

interface CustomOtpFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  defaultValue?: never;
  value?: number;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  fieldClassName?: ClassValue;
  labelClassName?: ClassValue;
}

export default function CustomOtpField<T extends FieldValues>({
  control,
  name,
  label = "",
  inputMode = "numeric",
  defaultValue,
  value,
  disabled = false,
  hidden = false,
  readOnly = false,
  fieldClassName = "",
  labelClassName = "",
}: CustomOtpFieldProps<T>) {
  const [inputLength, setInputLength] = useState(0);
  const splitCamelCaseToWords = (str: string) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      disabled={disabled}
      render={({ field }) => (
        <FormItem
          className={cn("space-y-[0.2px]", fieldClassName)}
          hidden={hidden}
        >
          <FormLabel
            className={cn(
              "text-accent-foreground/80 text-sm font-medium capitalize",
              labelClassName,
            )}
          >
            {label || splitCamelCaseToWords(name)}
          </FormLabel>
          <div className="relative">
            <FormControl>
              <InputOTP
                pattern={REGEXP_ONLY_DIGITS}
                maxLength={4}
                {...field}
                readOnly={readOnly}
                disabled={disabled}
                value={value !== undefined ? String(value) : field.value}
                inputMode={inputMode}
                className="flex w-full justify-center"
                containerClassName="w-full"
                onInput={(e) => {
                  setInputLength(e.currentTarget.value.length);
                }}
              >
                {/* TODO: Add feature to make border blue if filled */}
                <InputOTPGroup className="flex w-full justify-between gap-[16px] ring-0 *:flex-grow *:rounded-xl *:py-8 data-[active=true]:ring-[0px]">
                  {Array.from({length: 4}).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      // Conditionally apply the border class
                      className={cn({
                        "ring-primary ring-2": inputLength > index,
                      })}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
          </div>
          <FormMessage className={cn("text-destructive text-sm")} />
        </FormItem>
      )}
    />
  );
}

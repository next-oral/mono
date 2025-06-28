"use client"

import type { ClassValue } from "class-variance-authority/types"
import type { Control, FieldValues, Path } from "react-hook-form"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { useState } from "react"

import { cn, splitCamelCaseToWords } from "@repo/design/lib/utils"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Badge } from "../ui/badge"

interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface CustomSelectFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  description?: string
  options: SelectOption[]
  emptyMessage?: string
  multiple?: boolean
  allowSearch?: boolean
  allowClear?: boolean
  maxDisplayItems?: number
  isNotLabeled?: boolean
  disabled?: boolean
  hidden?: boolean
  readOnly?: boolean
  onSelectionChange?: (value: string | string[]) => void
  fieldClassName?: ClassValue
  labelClassName?: ClassValue
  selectClassName?: ClassValue
  triggerClassName?: ClassValue
  contentClassName?: ClassValue
}

export default function CustomSelectField<T extends FieldValues>({
  control,
  name,
  label = "",
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  description = "",
  options = [],
  emptyMessage = "No options found.",
  multiple = false,
  allowSearch = false,
  allowClear = false,
  maxDisplayItems = 2,
  isNotLabeled = false,
  disabled = false,
  hidden = false,
  readOnly = false,
  onSelectionChange,
  fieldClassName = "",
  labelClassName = "",
  selectClassName = "",
  triggerClassName = "",
  contentClassName = "",
}: CustomSelectFieldProps<T>) {
  const [open, setOpen] = useState(false)

  const truncateString = (str: string, maxLength = 10) => {
    return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str
  }

  const getDisplayValue = (value: string | string[]) => {
    if (!value) return placeholder

    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder

      const selectedOptions = options.filter((option) => value.includes(option.value))
      const displayItems = selectedOptions.slice(0, maxDisplayItems)
      const remainingCount = selectedOptions.length - maxDisplayItems

      return (
        <div className="flex flex-wrap gap-1 max-w-full">
          {displayItems.map((option) => (
            <Badge key={option.value} variant="secondary" className="text-xs max-w-[120px] truncate">
              {truncateString(option.label)}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="outline" className="text-xs">
              +{remainingCount} more
            </Badge>
          )}
        </div>
      )
    }

    const selectedOption = options.find((option) => option.value === value)
    return selectedOption?.label ?? placeholder
  }

  const handleSelect = (selectedValue: string, currentValue: string | string[], onChange: (value: unknown) => void) => {
    let newValue: string | string[]

    if (multiple) {
      const currentArray = Array.isArray(currentValue) ? currentValue : []
      if (currentArray.includes(selectedValue)) {
        newValue = currentArray.filter((val) => val !== selectedValue)
      } else {
        newValue = [...currentArray, selectedValue]
      }
    } else {
      newValue = selectedValue === currentValue ? "" : selectedValue
      setOpen(false)
    }

    onChange(newValue)
    onSelectionChange?.(newValue)
  }

  const handleClearAll = (onChange: (value: unknown) => void) => {
    const newValue = multiple ? [] : ""
    onChange(newValue)
    onSelectionChange?.(newValue)
  }

  const isSelected = (optionValue: string, fieldValue: string | string[]) => {
    if (multiple && Array.isArray(fieldValue)) {
      return fieldValue.includes(optionValue)
    }
    return fieldValue === optionValue
  }

  if (multiple || allowSearch) {
    return (
      <FormField
        control={control}
        name={name}
        disabled={disabled}
        render={({ field, fieldState }) => (
          <FormItem className={cn("space-y-[0.2px]", fieldClassName)} hidden={hidden}>
            {!isNotLabeled && (
              <FormLabel className={cn("text-accent-foreground/80 text-sm font-medium capitalize", labelClassName)}>
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
                      "border-secondary-foreground/30 w-full justify-between rounded-lg border bg-transparent px-3 py-2 min-h-[2.5rem] h-auto shadow-none transition-all duration-200 hover:bg-transparent focus:border-transparent focus:ring-0 focus:outline-none focus-visible:ring-0",
                      triggerClassName,
                      {
                        "border-destructive/50 bg-destructive/5": fieldState.error,
                        "text-muted-foreground":
                          !field.value || (Array.isArray(field.value) && field.value.length === 0),
                      },
                    )}
                  >
                    <div className="flex-1 text-left overflow-hidden">{getDisplayValue(field.value)}</div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      {allowClear &&
                        field.value &&
                        (Array.isArray(field.value) ? field.value.length > 0 : field.value) && (
                          <X
                            className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleClearAll(field.onChange)
                            }}
                          />
                        )}
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </div>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className={cn("w-full p-0", contentClassName)} align="start">
                <Command className={cn(selectClassName)}>
                  {allowSearch && <CommandInput placeholder={searchPlaceholder} className="h-9" />}
                  <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          onSelect={() => handleSelect(option.value, field.value, field.onChange)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected(option.value, field.value) ? "opacity-100" : "opacity-0",
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
    )
  }

  // Single select without search
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <FormItem className={cn("space-y-[0.2px]", fieldClassName)} hidden={hidden}>
          {!isNotLabeled && (
            <FormLabel className={cn("text-accent-foreground/80 text-sm font-medium capitalize", labelClassName)}>
              {label || splitCamelCaseToWords(name)}
            </FormLabel>
          )}

          <div className="relative">
            <Select
              disabled={disabled || readOnly}
              onValueChange={(value) => {
                field.onChange(value)
                onSelectionChange?.(value)
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "border-secondary-foreground/30 w-full rounded-lg border bg-transparent px-3 py-5 shadow-none transition-all duration-200 focus:ring-0 focus:outline-none focus-visible:ring-0",
                    triggerClassName,
                    {
                      "border-destructive/50 bg-destructive/5": fieldState.error,
                    },
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={cn(contentClassName)}>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                    <div className="flex items-center">
                      {/* <Check
                        className={cn("mr-2 h-4 w-4", field.value === option.value ? "opacity-100" : "opacity-0")}
                      /> */}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {allowClear && field.value && (
              <button
                type="button"
                onClick={() => handleClearAll(field.onChange)}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
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
  )
}

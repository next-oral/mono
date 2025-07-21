"use client";

import type { Column } from "@tanstack/react-table";
import * as React from "react";
import { Check, PlusCircle, XCircle } from "lucide-react";

import type { NumericOperator } from "@repo/design/types/data-table";
import { Badge } from "@repo/design/components/ui/badge";
import { Button } from "@repo/design/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/design/components/ui/command";
import { Input } from "@repo/design/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design/components/ui/select";
import { Separator } from "@repo/design/components/ui/separator";
import { dataTableConfig } from "@repo/design/config/data-table";
import { cn } from "@repo/design/lib/utils";

interface DataTableNumberFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

interface NumberFilterSingleValue {
  id: string;
  value: string;
  operator: string;
  variant: string;
  filterId?: `${string}-single`;
}

interface NumberFilterRangeValue {
  id: string;
  value: [string, string];
  operator: string;
  variant: string;
  filterId?: `${string}-range`;
}

type NumberFilterValue = NumberFilterSingleValue | NumberFilterRangeValue;

export function DataTableNumberFilter<TData, TValue>({
  column,
  title,
}: DataTableNumberFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);

  const columnFilterValue = column?.getFilterValue() as
    | NumberFilterValue[]
    | NumberFilterValue
    | undefined;

  // Get the first filter value if it's an array, otherwise use the value directly
  const activeFilter = React.useMemo(() => {
    if (!columnFilterValue) return undefined;
    return Array.isArray(columnFilterValue)
      ? columnFilterValue[0]
      : columnFilterValue;
  }, [columnFilterValue]);

  const mode = React.useMemo(() => {
    return activeFilter?.filterId?.includes("range") ? "range" : "single";
  }, [activeFilter]);

  const value = React.useMemo(() => {
    return activeFilter?.value;
  }, [activeFilter]);

  const [rangeMin, rangeMax] = React.useMemo(() => {
    if (!activeFilter?.value) return ["", ""];
    return Array.isArray(activeFilter.value) ? activeFilter.value : ["", ""];
  }, [activeFilter]);

  const onValueChange = React.useCallback(
    (newValue: string) => {
      if (mode !== "single" || !column) return;

      column.setFilterValue(
        newValue
          ? {
              id: column.id,
              value: newValue,
              operator: activeFilter?.operator ?? "eq",
              variant: "number",
              filterId: `${column.id}-single`,
            }
          : undefined,
      );
    },
    [column, activeFilter?.operator, mode],
  );

  const onRangeChange = React.useCallback(
    (min: string, max: string) => {
      if (!column) return;

      column.setFilterValue(
        min || max
          ? {
              id: column.id,
              value: [min, max],
              operator: "isBetween",
              variant: "number",
              filterId: activeFilter?.filterId ?? `${column.id}-range`,
            }
          : undefined,
      );
    },
    [column, activeFilter],
  );

  const onOperatorSelect = React.useCallback(
    (newOperator: NumericOperator["value"]) => {
      if (!column || !value) return;

      column.setFilterValue({
        id: column.id,
        value,
        operator: newOperator,
        variant: "number",
        filterId: activeFilter?.filterId ?? `${column.id}-single`,
      });
    },
    [column, value, activeFilter],
  );

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      column?.setFilterValue(undefined);
    },
    [column],
  );

  const operator =
    activeFilter?.operator ??
    dataTableConfig.numericOperators[0]?.value ??
    "eq";

  const onModeChange = React.useCallback(
    (newMode: "single" | "range") => {
      if (!column) return;

      if (newMode === mode) {
        return;
      }

      column.setFilterValue(
        newMode === "single"
          ? {
              id: column.id,
              value: "",
              operator,
              variant: "number",
              filterId: `${column.id}-single`,
            }
          : {
              id: column.id,
              value: ["", ""],
              operator: "isBetween",
              variant: "number",
              filterId: `${column.id}-range`,
            },
      );
    },
    [column, mode, operator],
  );

  const hasFilter = Array.isArray(columnFilterValue)
    ? columnFilterValue.length > 0
    : !!columnFilterValue;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {hasFilter ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={onReset}
              className="focus-visible:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:outline-none"
            >
              <XCircle />
            </div>
          ) : (
            <PlusCircle />
          )}
          {title}
          {hasFilter && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {mode === "single"
                  ? `${dataTableConfig.numericOperators.find((op) => op.value === operator)?.label} ${value ? value.toString() : ""}`
                  : `${rangeMin ? rangeMin.toString() : ""} - ${rangeMax ? rangeMax.toString() : ""}`}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => onModeChange("single")}
                className="flex items-center gap-2"
              >
                <div
                  className={cn(
                    "border-primary flex size-3.5 items-center justify-center rounded-[4px] border",
                    mode === "single"
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible",
                  )}
                >
                  <Check className="text-primary-foreground size-3" />
                </div>
                Single Value
              </CommandItem>
              <CommandItem
                onSelect={() => onModeChange("range")}
                className="flex items-center gap-2"
              >
                <div
                  className={cn(
                    "border-primary flex size-3.5 items-center justify-center rounded-[4px] border",
                    mode === "range"
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible",
                  )}
                >
                  <Check className="text-primary-foreground size-3" />
                </div>
                Range
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {mode === "single" ? (
                <>
                  <div className="p-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Select
                          value={operator}
                          onValueChange={onOperatorSelect}
                        >
                          <SelectTrigger className="h-8 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dataTableConfig.numericOperators.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        type="number"
                        value={value ?? ""}
                        onChange={(e) => onValueChange(e.target.value)}
                        placeholder="Enter value..."
                        className="h-8"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-2">
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={rangeMin}
                      onChange={(e) =>
                        onRangeChange(e.target.value, rangeMax || "")
                      }
                      placeholder="Min value..."
                      className="h-8"
                    />
                    <Input
                      type="number"
                      value={rangeMax}
                      onChange={(e) =>
                        onRangeChange(rangeMin || "", e.target.value)
                      }
                      placeholder="Max value..."
                      className="h-8"
                    />
                  </div>
                </div>
              )}
            </CommandGroup>
            {hasFilter && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onReset()}
                    className="justify-center text-center"
                  >
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

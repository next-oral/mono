"use client";

import type { Column, Table } from "@tanstack/react-table";
import * as React from "react";
import { SearchIcon, X } from "lucide-react";

import { DataTableDateFilter } from "@repo/design/components/data-table/data-table-date-filter";
import { DataTableFacetedFilter } from "@repo/design/components/data-table/data-table-faceted-filter";
import { DataTableNumberFilter } from "@repo/design/components/data-table/data-table-number-filter";
import { DataTableSliderFilter } from "@repo/design/components/data-table/data-table-slider-filter";
import { Button } from "@repo/design/components/ui/button";
import { Input } from "@repo/design/components/ui/input";
import { cn } from "@repo/design/lib/utils";

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) =>
            column.getCanFilter() && column.columnDef.meta?.variant !== "text",
        ),
    [table],
  );

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <span className="border-r pr-2 text-sm font-medium">Filters</span>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {columns
            .filter((column) => column.columnDef.meta?.variant !== "text")
            .map((column) => (
              <DataTableToolbarFilter key={column.id} column={column} />
            ))}
          {isFiltered && (
            <Button
              aria-label="Reset filters"
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive border-dashed"
              onClick={onReset}
            >
              <X />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
  className?: string;
}

export function DataTableToolbarFilter<TData>({
  column,
  className,
}: DataTableToolbarFilterProps<TData>) {
  {
    const columnMeta = column.columnDef.meta;

    const onFilterRender = React.useCallback(() => {
      if (!columnMeta?.variant) return null;

      switch (columnMeta.variant) {
        case "text":
          return (
            <div className="*:not-first:mt-2">
              <div className="relative">
                <Input
                  id={column.id}
                  className={cn("peer ps-9", className)}
                  placeholder={columnMeta.placeholder ?? columnMeta.label}
                  // DO NOT REMOVE THIS CONDITION, IT IS IMPORTANT FOR THE FILTER TO WORK
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  value={(column.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    column.setFilterValue(event.target.value)
                  }
                  type="search"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
              </div>
            </div>
          );

        case "number":
          return (
            <DataTableNumberFilter
              column={column}
              title={columnMeta.label ?? column.id}
            />
          );

        case "range":
          return (
            <DataTableSliderFilter
              column={column}
              title={columnMeta.label ?? column.id}
            />
          );

        case "date":
        case "dateRange":
          return (
            <DataTableDateFilter
              column={column}
              title={columnMeta.label ?? column.id}
              multiple={columnMeta.variant === "dateRange"}
            />
          );

        case "select":
        case "multiSelect":
          return (
            <DataTableFacetedFilter
              column={column}
              title={columnMeta.label ?? column.id}
              options={columnMeta.options ?? []}
              multiple={columnMeta.variant === "multiSelect"}
            />
          );

        default:
          return null;
      }
    }, [column, columnMeta, className]);

    return onFilterRender();
  }
}

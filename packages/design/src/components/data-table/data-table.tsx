import type { Table as TanstackTable } from "@tanstack/react-table";
import type * as React from "react";
import { flexRender } from "@tanstack/react-table";

import { DataTablePagination } from "@repo/design/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design/components/ui/table";
import { EmptyPatients } from "@repo/design/icons";
import { getCommonPinningStyles } from "@repo/design/lib/data-table";
import { cn } from "@repo/design/lib/utils";

import { DataTableSkeleton } from "./data-table-skeleton";
import { DataTableToolbarFilter } from "./data-table-toolbar";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  isLoading?: boolean;
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
}

export function DataTable<TData>({
  isLoading,
  table,
  actionBar,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const textColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        column.getCanFilter() && column.columnDef.meta?.variant === "text",
    );

  const searchTerm = textColumns
    .map((column) => column.getFilterValue())
    .join(",");

  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
      {...props}
    >
      {children}
      <div className="bg-primary/5 space-y-2 rounded-lg border p-1">
        <div className="flex items-center gap-2">
          {textColumns.map((column) => (
            <DataTableToolbarFilter
              key={column.id}
              column={column}
              className="border-none shadow-none lg:w-80"
            />
          ))}
          <DataTableViewOptions table={table} />
        </div>
        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          ...getCommonPinningStyles({ column: cell.column }),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {isLoading ? (
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      <DataTableSkeleton
                        columnCount={table.getAllColumns().length}
                      />
                    </TableCell>
                  ) : (
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <EmptyPatients />

                        <h3 className="text-foreground mb-2 text-sm font-medium">
                          No results found for "{searchTerm}"
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Search for something else.
                        </p>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}

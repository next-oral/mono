"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { FiltersState } from "../data-table-filter/core/types";
import { DataTableFilter, useDataTableFilters } from "../data-table-filter";
import {
  createTSTColumns,
  createTSTFilters,
} from "../data-table-filter/intergrations/tanstack";
import { tstColumnDefs } from "./columns";
import { ISSUES } from "./data";
import { DataTable } from "./data-table";
import { columnsConfig } from "./filters";

// import { DataTable } from "./data-table";

export function IssuesTable({
  state,
}: {
  state: {
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  };
}) {
  const { columns, filters, actions, strategy } = useDataTableFilters({
    strategy: "client",
    data: ISSUES,
    columnsConfig,
    filters: state.filters,
    onFiltersChange: state.setFilters,
  });

  // Step 4: Extend our TanStack Table columns with custom filter functions (and more!)
  //         using our integration hook.
  const tstColumns = useMemo(
    () =>
      createTSTColumns({
        columns: tstColumnDefs,
        configs: columns,
      }),
    [columns],
  );

  const tstFilters = useMemo(() => createTSTFilters(filters), [filters]);

  // Step 5: Create our TanStack Table instance
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data: ISSUES,
    columns: tstColumns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      columnFilters: tstFilters,
    },
  });

  // Step 6: Render the table!
  return (
    <div className="col-span-2 w-full">
      <div className="flex items-center gap-2 pb-4">
        <DataTableFilter
          filters={filters}
          columns={columns}
          actions={actions}
          strategy={strategy}
        />
      </div>
      <DataTable table={table} />
    </div>
  );
}

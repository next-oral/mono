"use client";

import type { Row, Zero } from "@rocicorp/zero";
import type { SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useZero } from "@rocicorp/zero/react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, Table } from "lucide-react";

import type { Mutators } from "@repo/zero/src/mutators";
import type { Schema } from "@repo/zero/src/schema";
import { AddCsv } from "@repo/design/src/components/patients/add-csv";
import { AddManually } from "@repo/design/src/components/patients/add-manually";
import { Button } from "@repo/design/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu";
import { Plus } from "@repo/design/icons";

import type { FiltersState } from "~/components/data-table-filter/core/types";
import { authClient } from "~/auth/client";
import {
  DataTableFilter,
  useDataTableFilters,
} from "~/components/data-table-filter";
import { QuickSearchFilters } from "~/components/data-table-filter/components/filter-selector";
import { useZeroQuery } from "~/providers/zero";
import {
  createTSTColumns,
  createTSTFilters,
} from "../../../tst-query/_/integrations/tanstack-table";
import { patientColumnDefs } from "./columns";
import { DataTable } from "./data-table";
import { columnsConfig } from "./filters";

function baseQuery(zero: Zero<Schema, Mutators>, orgId: string) {
  return zero.query.patient.where("orgId", "=", orgId).related("address");
}

export type PatientRow = Row<ReturnType<typeof baseQuery>>;

export function PatientsTable({
  state,
}: {
  state: {
    filters: FiltersState;
    sorting: SortingState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  };
}) {
  const z = useZero<Schema, Mutators>();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();
  const orgId =
    activeOrganization?.id ?? organizations?.[0]?.id ?? "1XZ05MqVgRLxglUuMK";

  function buildQuery(zero: Zero<Schema, Mutators>) {
    let query = baseQuery(zero, orgId);

    for (const f of state.filters) {
      if (f.type !== "text") continue;
      const value = (f.values?.[0] as string | undefined)?.trim() ?? "";
      if (value.length === 0) continue;

      const op =
        f.operator === "does not contain"
          ? ("NOT ILIKE" as const)
          : ("ILIKE" as const);

      switch (f.columnId) {
        case "name": {
          query = query.where("firstName", op, `%${value}%`);
          break;
        }
        case "email": {
          query = query.where("email", op, `%${value}%`);
          break;
        }
        case "address": {
          // Combined address column: match when any of street/city/state matches the value.
          // NOTE: This currently applies all conditions; depending on Zero's API, OR matching may require a different method.

          query = query.related("address", (p) =>
            p.where((ops) =>
              ops.or(
                ops.cmp("street", op, `%${value}%`),
                ops.cmp("city", op, `%${value}%`),
                ops.cmp("country", op, `%${value}%`),
              ),
            ),
          );
          break;
        }
        default:
          break;
      }
    }
    for (const s of state.sorting) {
      const direction = s.desc ? "desc" : "asc";
      switch (s.id) {
        case "name": {
          query = query.orderBy("firstName", direction);
          break;
        }
        case "email": {
          query = query.orderBy("email", direction);
          break;
        }
        case "age": {
          query = query.orderBy("dob", direction);
          break;
        }
      }
    }

    return state.sorting.length > 0
      ? query
      : query.orderBy("createdAt", "desc");
  }

  const { data: patients, isPending } = useZeroQuery(buildQuery(z));

  const {
    columns,
    filters,
    actions,
    strategy,
    pagination,
    onPaginationChange,
  } = useDataTableFilters({
    strategy: "server",
    data: patients,
    columnsConfig,
    filters: state.filters,
    onFiltersChange: state.setFilters,
  });

  const [rowSelection, setRowSelection] = useState({});

  const tstColumns = useMemo(
    () =>
      createTSTColumns({
        columns: patientColumnDefs,
        configs: columns,
      }),
    [columns],
  );
  const tstFilters = useMemo(() => createTSTFilters(filters), [filters]);

  const table = useReactTable<PatientRow>({
    data: patients,
    columns: tstColumns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange: state.setSorting,
    state: {
      rowSelection,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
      sorting: state.sorting,
      columnFilters: tstFilters,
    },
  });

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <DataTableFilter
            filters={filters}
            columns={columns}
            actions={actions}
            strategy={strategy}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="ml-auto">
              <Plus className="size-4" />
              Add Patient
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-background w-fit overflow-hidden rounded-xl p-0">
            <div className="flex flex-col">
              <AddManually />
              <AddCsv />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <DataTable table={table} actions={actions} isLoading={isPending} />
    </div>
  );
}

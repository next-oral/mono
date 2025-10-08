"use client";

import { useCallback } from "react";
import { SortingState, Updater } from "@tanstack/react-table";
import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";

import { getSortingStateParser } from "@repo/design/src/lib/parsers";

import type { FiltersState } from "~/components/data-table-filter/core/types";
import { patientColumnDefs } from "./_components/columns";
import { PatientRow, PatientsTable } from "./_components/patients-table";

const filtersSchema = z.custom<FiltersState>();

export default function Page() {
  const [filters, setFilters] = useQueryState<FiltersState>(
    "filters",
    parseAsJson(filtersSchema.parse).withDefault([]),
  );
  const [sorting, setSorting] = useQueryState(
    "sort",
    getSortingStateParser<PatientRow>(
      patientColumnDefs.map((column) => column.id).filter(Boolean) as string[],
    ).withDefault([]),
  );
  const onSortingChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === "function") {
        const newSorting = updaterOrValue(sorting);
        void setSorting(newSorting);
      } else {
        void setSorting(updaterOrValue);
      }
    },
    [sorting, setSorting],
  );
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PatientsTable
        state={{ filters, setFilters, sorting, setSorting: onSortingChange }}
      />
    </div>
  );
}

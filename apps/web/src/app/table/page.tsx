"use client";

import { useState } from "react";

import type { FiltersState } from "@repo/design/src/components/data-table-filter/core/types";
import { IssuesTable } from "@repo/design/components/data-table/index";

function TablePage() {
  const [filters, setFilters] = useState<FiltersState>([]);
  return (
    <div className="p-4">
      <IssuesTable state={{ filters, setFilters }} />
    </div>
  );
}

export default TablePage;

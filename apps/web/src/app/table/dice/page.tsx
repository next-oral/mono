"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import {
  CheckCircle,
  CheckCircle2,
  DollarSign,
  MoreHorizontal,
  MoreVertical,
  Text,
  XCircle,
} from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";

import { DataTable } from "@repo/design/components/dice-data-table/data-table";
import { DataTableColumnHeader } from "@repo/design/components/dice-data-table/data-table-column-header";
import { DataTableToolbar } from "@repo/design/components/dice-data-table/data-table-toolbar";
import { Badge } from "@repo/design/components/ui/badge";
import { Button } from "@repo/design/components/ui/button";
import { Checkbox } from "@repo/design/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu";
import { useDataTable } from "@repo/design/hooks/use-data-table";

interface Project {
  id: string;
  title: string;
  status: "active" | "inactive";
  budget: number;
  location: string;
}

const data: Project[] = Array.from({ length: 60 }, (_, i) => {
  const id = (i + 1).toString();
  const titles = [
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Epsilon",
    "Zeta",
    "Eta",
    "Theta",
    "Iota",
    "Kappa",
    "Lambda",
    "Mu",
    "Nu",
    "Xi",
    "Omicron",
    "Pi",
    "Rho",
    "Sigma",
    "Tau",
    "Upsilon",
    "Phi",
    "Chi",
    "Psi",
    "Omega",
  ];
  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Miami",
  ] as const;
  const title = `Project ${titles[i % titles.length]} ${Math.floor(i / titles.length) + 1}`;
  const status = i % 3 === 0 ? "inactive" : "active";
  const budget = 20000 + ((i * 3500) % 100000);
  return {
    id,
    title,
    status,
    budget,
    location: locations[i % locations.length]!,
  };
});

export default function DataTableDemo() {
  const [title] = useQueryState("title", parseAsString.withDefault(""));
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [location] = useQueryState(
    "location",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10));

  // Ideally we would filter the data server-side, but for the sake of this example, we'll filter the data client-side

  const { filteredData, pageCount } = React.useMemo(() => {
    const filtered = data.filter((project) => {
      const matchesTitle =
        title === "" ||
        project.title.toLowerCase().includes(title.toLowerCase());
      const matchesStatus =
        status.length === 0 || status.includes(project.status);
      const matchesLocation =
        location.length === 0 || location.includes(project.location);

      return matchesTitle && matchesStatus && matchesLocation;
    });

    const pageCount = Math.ceil(filtered.length / perPage);
    const startIdx = (page - 1) * perPage;
    const endIdx = startIdx + perPage;
    const pagedData = filtered.slice(startIdx, endIdx);

    return {
      filteredData: pagedData,
      pageCount,
    };
  }, [title, status, location, perPage, page]);

  const columns = React.useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Project["title"]>()}</div>,
        meta: {
          label: "Title",
          placeholder: "Search patients, phone no, email....",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<Project["status"]>();
          const Icon = status === "active" ? CheckCircle2 : XCircle;

          return (
            <Badge variant="outline" className="capitalize">
              <Icon />
              {status}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ],
        },
        filterFn: (row, id, value) => {
          return Array.isArray(value) && value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
      },
      {
        id: "location",
        accessorKey: "location",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Location" />
        ),
        cell: ({ cell }) => cell.getValue<Project["location"]>(),
        meta: {
          label: "Location",
          variant: "multiSelect",
          options: [
            { label: "New York", value: "New York", icon: CheckCircle },
            { label: "Los Angeles", value: "Los Angeles", icon: XCircle },
            { label: "Chicago", value: "Chicago", icon: CheckCircle },
            { label: "Houston", value: "Houston", icon: XCircle },
            { label: "Miami", value: "Miami", icon: CheckCircle },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Budget" />
        ),
        cell: ({ cell }) => {
          const budget = cell.getValue<Project["budget"]>();

          return (
            <div className="flex items-center gap-1">
              <DollarSign className="size-4" />
              {budget.toLocaleString()}
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: function Cell() {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-4" />
                  <span className="sr-only">Open menu</span>
                  <div className="bg-background group-data-[state=selected]/table-row:bg-primary/2 absolute inset-0 -z-10" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    [],
  );

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "title", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="p-4">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

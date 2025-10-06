"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@repo/design/src/components/ui/button";
import { Checkbox } from "@repo/design/src/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/design/src/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "@repo/design/src/icons";

import { DataTableColumnHeader } from "./column-header";
import { PatientRow } from "./patients-zero-table";

const columnHelper = createColumnHelper<PatientRow>();

export const patientColumnDefs = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
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
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor((row) => row.firstName, {
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <span>
        {row.original.firstName} {row.original.lastName}
      </span>
    ),
  }),
  columnHelper.accessor((row) => row.email, {
    id: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.original.email}</div>,
    enableColumnFilter: true,
  }),
  columnHelper.accessor((row) => row.dob, {
    id: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dob" />
    ),
    cell: ({ row }) => <div>{format(row.original.dob, "MMM d, yyyy")}</div>,
    enableColumnFilter: true,
  }),
  columnHelper.accessor((row) => row.address?.street ?? "", {
    id: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div className="max-w-60 truncate text-sm break-all text-ellipsis text-gray-500">
        {row.original.address
          ? `${row.original.address.street}, ${row.original.address.city}, ${row.original.address.state}`
          : ""}
      </div>
    ),
    enableColumnFilter: true,
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
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
            <Link href={`/patients/${row.original.id}`}>
              <DropdownMenuItem>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem variant="destructive">
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 32,
  }),
];

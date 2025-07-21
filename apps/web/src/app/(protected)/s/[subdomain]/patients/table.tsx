"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Plus, User } from "lucide-react";

import type { ExtendedColumnFilter } from "@repo/design/src/types/data-table";
import { DataTable } from "@repo/design/components/data-table/data-table";
import { Badge } from "@repo/design/components/ui/badge";
import { Button } from "@repo/design/components/ui/button";
import { Checkbox } from "@repo/design/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@repo/design/src/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@repo/design/src/components/data-table/data-table-toolbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design/src/components/ui/popover";
import { useDataTable } from "@repo/design/src/hooks/use-data-table";
import { CheckCircle, MoreVertical, XCircle } from "@repo/design/src/icons";

import { FloatingBar } from "./floating-bar";

const treatments = [
  "Tooth Scaling",
  "Dental Implants",
  "Periodontal Therapy",
  "Teeth Whitening",
  "Root Canal Treatment",
  "Orthodontic Braces",
  "Cosmetic Dentistry",
] as const;
type Treatment = (typeof treatments)[number];
const getRandomTreatments = (): Treatment[] => {
  if (typeof window === "undefined") return [];
  // Return an array of 1-3 random treatments (no duplicates)
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...treatments].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const sampleData = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1, // This will be ignored
  avatar: "/placeholder.svg?height=40&width=40",
  age: [41, 36, 53, 18, 54, 45, 15, 48, 29, 23, 45, 54, 34, 70, 90][i % 15],
  name: [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
    "Emily Davis",
    "Chris Miller",
    "Lisa Garcia",
    "Tom Anderson",
    "Amy Taylor",
    "Kevin White",
    "Rachel Green",
    "Mark Thompson",
    "Jessica Lee",
    "Daniel Clark",
  ][i % 15],
  email: `user${i + 1}@example.com`,
  phone: `(302) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  address: [
    "123 Main St, New York, NY",
    "456 Oak Ave, Los Angeles, CA",
    "789 Pine Rd, Chicago, IL",
    "321 Elm St, Houston, TX",
    "654 Maple Dr, Phoenix, AZ",
    "789 Pine Rd, Chicago, IL",
    "321 Elm St, Houston, TX",
    "654 Maple Dr, Phoenix, AZ",
    "789 Pine Rd, Chicago, IL",
    "321 Elm St, Houston, TX",
    "654 Maple Dr, Phoenix, AZ",
    "789 Pine Rd, Chicago, IL",
  ][i % 5],
  treatments: getRandomTreatments(),
  joined: new Date(2024, 0, Math.floor(Math.random() * 30) + 1)
    .toISOString()
    .split("T")[0],
  createdAt: new Date(
    2023,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1,
  ).toISOString(),
}));

type TableData = (typeof sampleData)[0];

const columns: ColumnDef<TableData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.original.name}</div>,
    meta: {
      label: "Name",
      placeholder: "Search patients, phone no, email....",
      variant: "text",
      icon: User,
    },
    enableColumnFilter: true,
  },
  {
    id: "age",
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => <div>{row.original.age}</div>,
    meta: {
      label: "Age",
      variant: "number",
      icon: User,
      range: [0, 100],
    },
    enableColumnFilter: true,
    filterFn: (row, id, filter: ExtendedColumnFilter<typeof row.original>) => {
      const age = Number(row.getValue(id));
      if (!filter.value) return true;
      const value = filter.value;
      const operator = filter.operator;
      switch (operator) {
        case "eq":
          return age === Number(value);
        case "ne":
          return age !== Number(value);
        case "lt":
          return age < Number(value);
        case "lte":
          return age <= Number(value);
        case "gt":
          return age > Number(value);
        case "gte":
          return age >= Number(value);
        default:
          return false;
      }
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.original.email}</div>,
    meta: {
      label: "Email",
    },
  },
  {
    id: "treatments",
    accessorKey: "treatments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Treatment" />
    ),
    cell: ({ row }) => {
      const treatments = row.original.treatments;

      return (
        <div className="flex min-w-64 flex-wrap gap-2">
          {treatments.map((treatment) => (
            <Badge key={treatment} variant="outline" className="capitalize">
              {treatment}
            </Badge>
          ))}
        </div>
      );
    },
    meta: {
      label: "Treatments",
      variant: "multiSelect",
      options: treatments.map((treatment) => ({
        label: treatment,
        value: treatment,
      })),
    },
    filterFn: (row, id, value) => {
      return Array.isArray(value) && value.includes(row.getValue(id));
    },
    enableColumnFilter: true,
  },
  {
    id: "address",
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => row.original.address,
    meta: {
      label: "Address",
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
    id: "joined",
    accessorKey: "joined",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.joined}</div>;
    },
    meta: {
      label: "Joined",
      variant: "date",
    },
  },
  {
    id: "actions",
    cell: () => {
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
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 32,
  },
];

export const PatientsTable = () => {
  // TODO: Fetch data from API
  // TODO: Update pagination, sorting, filtering, etc.
  const { table } = useDataTable({
    data: sampleData,
    columns,
    pageCount: 1,
  });

  return (
    <div>
      <DataTable table={table} actionBar={<FloatingBar table={table} />}>
        <div className="flex items-center justify-between gap-2">
          <DataTableToolbar table={table} />

          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Add Patient
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-background w-fit overflow-hidden rounded-xl p-0">
              <div className="flex flex-col">
                <Button
                  variant="outline"
                  className="justify-start border-none shadow-none"
                >
                  Add Manually
                </Button>
                <Button
                  variant="outline"
                  className="justify-start border-none shadow-none"
                >
                  Upload CSV
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </DataTable>
    </div>
  );
};

export default PatientsTable;

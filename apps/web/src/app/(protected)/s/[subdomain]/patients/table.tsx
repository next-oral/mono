"use client";

import type { Row, Zero } from "@rocicorp/zero";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { Plus, User } from "lucide-react";
import { parseAsInteger, useQueryStates } from "nuqs";

import type { ExtendedColumnFilter } from "@repo/design/src/types/data-table";
import type { Mutators } from "@repo/zero/src/mutators";
import type { Schema } from "@repo/zero/src/schema";
import { DataTable } from "@repo/design/components/data-table/data-table";
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

import { authClient } from "~/auth/client";
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

export function listQuery(zero: Zero<Schema, Mutators>, q: string | undefined) {
  let query = zero.query.patient
    .orderBy("createdAt", "desc")
    .related("address");

  if (q) {
    query = query.where((ops) =>
      ops.or(
        ops.cmp("firstName", "ILIKE", `%${q}%`),
        ops.cmp("lastName", "ILIKE", `%${q}%`),
      ),
    );
  }
  return query;
}

type TableData = Row<ReturnType<typeof listQuery>>;

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
    cell: ({ row }) => (
      <div>
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
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
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => <div>{row.original.dob}</div>,
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
  // {
  //   id: "treatments",
  //   accessorKey: "treatments",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Treatment" />
  //   ),
  //   cell: ({ row }) => {
  //     const treatments = row.original.treatments;

  //     return (
  //       <div className="flex min-w-64 flex-wrap gap-2">
  //         {treatments.map((treatment) => (
  //           <Badge key={treatment} variant="outline" className="capitalize">
  //             {treatment}
  //           </Badge>
  //         ))}
  //       </div>
  //     );
  //   },
  //   meta: {
  //     label: "Treatments",
  //     variant: "multiSelect",
  //     options: treatments.map((treatment) => ({
  //       label: treatment,
  //       value: treatment,
  //     })),
  //   },
  //   filterFn: (row, id, value) => {
  //     return Array.isArray(value) && value.includes(row.getValue(id));
  //   },
  //   enableColumnFilter: true,
  // },
  {
    id: "address",
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    maxSize: 10,

    cell: ({ row }) => (
      <span className="w-10 truncate text-sm break-all text-ellipsis text-gray-500">
        {row.original.address
          ? `${row.original.address.street}, ${row.original.address.city}, ${row.original.address.state}`
          : ""}
      </span>
    ),
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
  // {
  //   id: "joined",
  //   accessorKey: "joined",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Joined" />
  //   ),
  //   cell: ({ row }) => {
  //     return <div>{row.original.joined}</div>;
  //   },
  //   meta: {
  //     label: "Joined",
  //     variant: "date",
  //   },
  // },
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
  return null;
  // TODO: Fetch data from API
  // TODO: Update pagination, sorting, filtering, etc.

  const [pagination, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  });
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const z = useZero<Schema, Mutators>();
  // const [title] = useQueryState("title", parseAsString.withDefault(""));

  function fetchPatients(z: Zero<Schema, Mutators>) {
    const query = z.query.patient.related("address");

    return query;
  }
  const [patients, { type }] = useQuery(fetchPatients(z));

  const { isPending, isError } = useZeroQueryStatus(type);

  const { table } = useDataTable({
    data: data,
    columns,
    getRowId: (originalRow) => originalRow.id,
    pageCount: meta.pageCount,
  });
  const { columnFilters: filters } = table.getState();

  // console.log(filters.map((filter) => {
  //   filter.
  // }));

  return (
    <div>
      <DataTable
        isLoading={isPending}
        table={table}
        actionBar={<FloatingBar table={table} />}
      >
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

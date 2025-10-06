import { Cake, MailIcon, MapPinIcon, UserIcon } from "@repo/design/src/icons";

import type { ColumnConfig } from "~/components/data-table-filter/core/types";
import { PatientRow as Patient } from "./patients-zero-table";

export const columnsConfig = [
  {
    id: "name",
    displayName: "Name",
    icon: UserIcon,
    type: "text",
    accessor: (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
  },
  {
    id: "email",
    displayName: "Email",
    icon: MailIcon,
    type: "text",
    accessor: (row) => row.email ?? "",
  },
  {
    id: "address",
    displayName: "Address",
    icon: MapPinIcon,
    type: "text",
    accessor: (row) =>
      row.address
        ? `${row.address.street ?? ""} ${row.address.city ?? ""} ${row.address.state ?? ""}`.trim()
        : "",
  },
  {
    id: "dob",
    displayName: "Dob",
    icon: Cake,
    type: "date",
    accessor: (row) => row.dob ?? "",
  },
] satisfies ReadonlyArray<ColumnConfig<Patient, any, any, any>>;

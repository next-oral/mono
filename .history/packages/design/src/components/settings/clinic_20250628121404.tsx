import React, { useState } from "react";
import { Plus } from "lucide-react";
import type {
  ColumnConfig,
  // PaginationConfig,
} from "../table/custom-data-table";
import CustomDataTable from "../table/custom-data-table";
import { Button } from "../ui/button";

const sampleData = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1, // This will be ignored
  avatar: "/placeholder.svg?height=40&width=40",
  age: [
    41,
    36,
    53,
   18,
    54,
    45,
    15,
    48,
    29,
    23,
    45,
    54,
    34,
    70,
    90,
  ][i % 15],
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
  phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  address: [
    "123 Main St, New York, NY",
    "456 Oak Ave, Los Angeles, CA",
    "789 Pine Rd, Chicago, IL",
    "321 Elm St, Houston, TX",
    "654 Maple Dr, Phoenix, AZ",
  ][i % 5],
  teams:  [
    "Tooth Scaling",
    "Dental Implants",
    "Periodontal Therapy",
    "Teeth Whitening",
    "Root Canal Treatment",
    "Orthodontic Braces",
    "Cosmetic Dentistry",
  ][i % 7],
  lastVisit: new Date(2024, 0, Math.floor(Math.random() * 30) + 1)
    .toISOString()
    .split("T")[0],
  status: Math.random() > 0.5 ? "active" : "inactive",
  createdAt: new Date(
    2023,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1,
  ).toISOString(),
}));

type RowDefinition = (typeof sampleData)[0];

export default function Organization() {
  const [isLoading, setisLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const pageSize = 2;
  // const totalItems = sampleData.length;

  const customColumns: ColumnConfig[] = [
    {
      key: "avatar",
      label: "Patient",
      sortable: false,
      render: (value, row: RowDefinition) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <span className="text-sm font-medium text-primary">
              {row.name?.charAt(0) ?? "?"}
            </span>
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-muted-foreground text-sm">{row.phone}</div>
          </div>
        </div>
      ),
    },
    {
      key: "age",
      label: "Age",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      maxLength: 15,
    },
    {
      key: "address",
      label: "Address",
      sortable: true,
      maxLength: 20,
    },
    {
      key: "teams",
      label: "Teams",
      sortable: true,
    },
    {
      key: "lastVisit",
      label: "Last Visit",
      sortable: true,
    },
  ];

  const handleView = (row: RowDefinition) => {
    console.log("View:", row);
    alert(`Viewing ${row.name}`);
  };

  const handleEdit = (row: RowDefinition) => {
    console.log("Edit:", row);
    alert(`Editing ${row.name}`);
  };

  const handleDelete = (row: RowDefinition) => {
    console.log("Delete:", row);
    alert(`Deleting ${row.name}`);
  };

  const handleBulkDelete = (selectedIds: string[]) => {
    console.log("Bulk delete:", selectedIds);
    alert(`Deleting ${selectedIds.length} items`);
    setSelectedRows([]);
  };

  const handleSeeAll = () => {
    console.log("See all clicked");
    alert("See all functionality");
  };

  // const paginationConfig: PaginationConfig = {
  //   currentPage,
  //   totalPages: Math.ceil(totalItems / pageSize),
  //   pageSize,
  //   totalItems,
  //   onPageChange: setCurrentPage,
  // };

  const customEmptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        <Plus className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-foreground mb-2 text-lg font-medium">
        You have no patients yet
      </h3>
      <Button className="mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Add patient
      </Button>
    </div>
  );

  return (
    <div>
      <CustomDataTable
        data={sampleData}
        loading={isLoading}
        searchPlaceholder="Search patients, phone no, email..."
        showSeeAll={false}
        hasNumberOfRows={true}
        autoDetectColumns={false}
        columns={customColumns}
        onSeeAllClick={handleSeeAll}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        // pagination={paginationConfig}
        emptyState={customEmptyState}
      />
    </div>
  );
}

import React, { useState } from "react";
import { Plus } from "lucide-react";

import type {
  ColumnConfig,
  PaginationConfig,
} from "../table/custom-data-table";
import CustomDataTable from "../table/custom-data-table";
import { Button } from "../ui/button";

const sampleData = Array.from({ length: 150 }, (_, i) => ({
  id: `custom-id-${i + 1}`, // This will be ignored
  _id: `mongo-id-${i + 1}`, // This will be ignored
  uuid: `uuid-${i + 1}`, // This will be ignored
  avatar: "/placeholder.svg?height=40&width=40",
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
  phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  address: [
    "123 Main St, New York, NY",
    "456 Oak Ave, Los Angeles, CA",
    "789 Pine Rd, Chicago, IL",
    "321 Elm St, Houston, TX",
    "654 Maple Dr, Phoenix, AZ",
  ][i % 5],
  lastTreatment: new Date(2024, 0, Math.floor(Math.random() * 30) + 1)
    .toISOString()
    .split("T")[0],
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

export default function Organization() {
  return (
    <div>Organization</div>
  );
}

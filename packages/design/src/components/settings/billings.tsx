import { useState } from "react";
import { SearchXIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { ColumnConfig } from "../table/custom-data-table";
import { CustomDataTable } from "../table/custom-data-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const sampleData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  amounts: [41, 36, 53, 18, 54, 45, 15, 48, 29, 23, 45, 54, 34, 70, 90][i % 15],
  planName: [
    "Starter plan Feb 2024",
    "Growth plan Jan 2022",
    "Enterprise plan Dec 2023",
    "starter plan Mar 2024",
    "Growth plan Apr 2024",
    "Starter plan May 2009",
    "Growth plan Dec 2021",
  ][i % 7],
  email: `user${i + 1}@example.com`,
  phone: `(302) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  address: [
    "123 Main St, New York, NY",
    "456 Oak Ave, Los Angeles, CA",
    "789 Pine Rd, Chicago, IL",
    "321 Elm St, Houston, TX",
    "654 Maple Dr, Phoenix, AZ",
  ][i % 5],
  role: ["staff", "doctor", "administrator"][i % 3],
  endDate: new Date(
    2023,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1,
  ).toISOString(),
  purchasedDate: new Date(2024, 0, Math.floor(Math.random() * 30) + 1)
    .toISOString()
    .split("T")[0],
  status: ["success", "inactive", "processing"][i % 3],
}));
type RowDefinition = (typeof sampleData)[0];

const customColumns: ColumnConfig[] = [
  {
    key: "planName",
    label: "Plan Name",
  },
  {
    key: "amounts",
    label: "Amounts",
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    maxLength: 15,
  },
  {
    key: "endDate",
    label: "End Date",
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: "purchasedDate",
    label: "Purchased Date",
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: "joined",
    label: "Joined",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: false,
    render: (value: string) => {
      const statusColors: Record<string, string> = {
        success:
          "bg-green-100 text-green-900 rounded-full py-1 px-2 capitalize text-xs",
        inactive: "bg-red-100 text-red-900 rounded-full py-1 px-2 capitalize text-xs",
        processing: "bg-orange-100 text-orange-900 rounded-full py-1 px-2 capitalize text-xs",
      };
      return (
        <span className={statusColors[value] ?? "text-gray-500"}>{value}</span>
      );
    },
  },
];

export function Billings() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const discount = billingPeriod === "yearly" ? 20 : 0; // Example discount logic
  const amount = (
    billingPeriod === "yearly" ? (79 * 12 * discount) / 100 : 79
  ).toFixed(2);

  const handleView = (row: RowDefinition) => {
    console.log("View:", row);
    alert(`Viewing ${row.planName}`);
  };

  const handleEdit = (row: RowDefinition) => {
    console.log("Edit:", row);
    alert(`Editing ${row.planName}`);
  };

  const handleDelete = (row: RowDefinition) => {
    console.log("Delete:", row);
    alert(`Deleting ${row.planName}`);
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

  const customEmptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <SearchXIcon className="h-8 w-8" />
      </div>
      <h3 className="text-foreground mb-2 text-lg font-medium">
        You have no patients yet
      </h3>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      >
        <div>
          <section className="flex flex-wrap justify-between gap-2">
            <div className="flex max-w-sm flex-grow flex-col gap-1">
              <h4 className="text-sm font-semibold sm:text-lg">Billings</h4>
              <p className="text-xs sm:text-sm">
                Keep track of your subscription details, update your billing
                information and control your account’s payment
              </p>
            </div>

            <div className="bg-primary/5 ml-auto flex size-fit items-center justify-center rounded-xl px-2 py-2">
              <Button
                variant={billingPeriod === "monthly" ? "outline" : "ghost"}
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={billingPeriod === "yearly" ? "outline" : "ghost"}
                onClick={() => setBillingPeriod("yearly")}
              >
                Yearly
              </Button>
            </div>
          </section>

          <section className="mt-10 flex flex-wrap gap-1 *:flex-1">
            <Card className="max-w-md min-w-xs p-3">
              <CardContent className="p-0">
                <Badge variant={"outline"}>Starter Plan</Badge>
                <CardHeader className="mt-3 mb-1 px-0">
                  <CardTitle className="text-3xl">Free</CardTitle>
                  <CardDescription className="sr-only">
                    Starter plan
                  </CardDescription>
                </CardHeader>

                <Button variant="secondary" className="w-full" disabled>
                  Current Plan
                </Button>

                <ul className="*:text-foreground/70 mt-3 flex flex-col gap-2 *:text-xs">
                  <li>1 doctor profile</li>
                  <li>No custom branding</li>
                  <li>Appointment Booking</li>
                  <li>Basic support (email only)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="max-w-md min-w-xs p-3">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <Badge variant={"outline"}>Growth Plan</Badge>
                  <span className="text-xs opacity-50">Pro</span>
                </div>

                <CardHeader className="mt-3 mb-1 px-0">
                  <div className="flex items-end">
                    <CardTitle className="text-3xl">${amount}</CardTitle>
                    <span className="ml-1 text-xs opacity-50">
                      /{billingPeriod.replace("ly", "")}
                    </span>
                  </div>
                  <CardDescription className="sr-only">
                    Growth plan
                  </CardDescription>
                </CardHeader>

                <Button variant="default" className="w-full">
                  Upgrade Plan
                </Button>

                <ul className="*:text-foreground/70 mt-3 flex flex-col gap-2 *:text-xs">
                  <li>1 doctor profile</li>
                  <li>No custom branding</li>
                  <li>Appointment Booking</li>
                  <li>Basic support (email only)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="max-w-md min-w-xs p-3">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <Badge variant={"outline"}>Enterprise Plan</Badge>
                  <span className="text-xs opacity-50">Advanced</span>
                </div>

                <CardHeader className="mt-3 mb-1 px-0">
                  <div className="flex items-end">
                    <CardTitle className="text-3xl">Custom</CardTitle>
                    <span className="ml-1 text-xs opacity-50">
                      /{billingPeriod.replace("ly", "")}
                    </span>
                  </div>
                  <CardDescription className="sr-only">
                    Growth plan
                  </CardDescription>
                </CardHeader>

                <Button
                  variant="default"
                  className="bg-foreground hover:bg-foreground/80 w-full"
                >
                  Contact Us
                </Button>

                <ul className="*:text-foreground/70 mt-3 flex flex-col gap-2 *:text-xs">
                  <li>1 doctor profile</li>
                  <li>No custom branding</li>
                  <li>Appointment Booking</li>
                  <li>Basic support (email only)</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="mt-10">
            <CustomDataTable
              data={sampleData}
              // loading={isLoading}
              searchable={false}
              hasNumberOfRows={true}
              autoDetectColumns={false}
              columns={customColumns}
              showSeeAll={false}
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
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

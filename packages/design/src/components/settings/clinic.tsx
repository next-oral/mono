import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircleIcon, PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn, gender } from "@repo/design/lib/utils";

import type {
  ColumnConfig,
  // PaginationConfig,
} from "../table/custom-data-table";
import CustomFileField from "../form/custom-file-field";
import CustomInputField from "../form/custom-input-field";
import CustomSelectField from "../form/custom-select-field";
import CustomDataTable from "../table/custom-data-table";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

// Generated 150 table records
const sampleData = Array.from({ length: 150 }, (_, i) => ({
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
  ][i % 5],
  teams: [
    "Tooth Scaling",
    "Dental Implants",
    "Periodontal Therapy",
    "Teeth Whitening",
    "Root Canal Treatment",
    "Orthodontic Braces",
    "Cosmetic Dentistry",
  ][i % 7],
  joined: new Date(2024, 0, Math.floor(Math.random() * 30) + 1)
    .toISOString()
    .split("T")[0],
  createdAt: new Date(
    2023,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1,
  ).toISOString(),
}));

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const staffAccountSchema = z.object({
  profile: z
    .any()
    .refine((file: File) => !!file, { message: "This file is required" })
    .refine((file: File) => file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      { message: "Only .jpg, .jpeg, .png and .webp formats are supported" },
    ),
  firstName: z
    .string()
    .min(3, { message: "First name cannot be less than 3 characters long" }),
  lastName: z
    .string()
    .min(3, { message: "Last name cannot be less than 3 characters long" }),
  phoneNumber: z
    .string()
    .trim()
    .transform((val) => {
      // Keep leading plus sign '+' if present, then remove all other non-digit characters
      if (val.startsWith("+")) {
        return "+" + val.slice(1).replace(/[^\d]/g, "");
      }
      return val.replace(/[^\d]/g, "");
    })
    .refine(
      (val) => {
        // Check regular expression: optional plus sign '+' followed by 1–15 digits, first digit that is not a 0
        const e164Regex = /^\+?[1-9]\d{1,14}$/;
        return e164Regex.test(val);
      },
      {
        message: "Invalid international phone number format",
      },
    ),
  email: z.string().email("Invalid email format"),
  gender: z.enum(["male", "female"]),
  age: z
    .string()
    .min(1, { message: "Age cannot be less than 1 character" })
    .max(3, { message: "Age cannot be more than 3 characters" })
    .refine((val) => {
      // Check if the value is a valid number between 1 and 999 incase if user is more than 99 years
      const age = parseInt(val, 10);
      return !isNaN(age) && age >= 1 && age <= 999;
    }),
  address: z
    .string()
    .min(3, { message: "Address cannot be empty" }),
  role: z.enum(["staff", "administrator", "Doctor"]),
});

type RowDefinition = (typeof sampleData)[0];
type StaffAccountForm = z.infer<typeof staffAccountSchema>;

const roles = [
  { label: "Staff", value: "staff", tooltip: "staff" },
  {
    label: "Administrator",
    value: "administrator",
    tooltip:
      "Edit treatment plans View appointment schedules Chat with patients Access medical records Add new users",
  },
  {
    label: "Doctor",
    value: "doctor",
    tooltip:
      "Edit treatment plans View appointment schedules Chat with patients Access medical records Add new users",
  },
];

const stepsCollection = ["profile", "details"] as const;

export default function Organization() {
  const [isLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [step, setStep] = useState<(typeof stepsCollection)[number]>("profile");
  // const [currentPage, setCurrentPage] = useState(1);
  // const pageSize = 2;
  // const totalItems = sampleData.length;

  const staffAccountForm = useForm<StaffAccountForm>({
    resolver: zodResolver(staffAccountSchema),
    defaultValues: {
      age: "",
      email: "",
      firstName: "",
      gender: "male",
      profile: "",
      address: "",
    },
  });

  const customColumns: ColumnConfig[] = [
    {
      key: "avatar",
      label: "Patient",
      sortable: false,
      render: (value, row: RowDefinition) => (
        <div className="flex items-center space-x-3">
          <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
            <span className="text-primary text-sm font-medium">
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
      key: "joined",
      label: "Joined",
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

  const handleAccountUpdateSubmit = (Data: StaffAccountForm) => {
    console.log(Data);
    setStep("details")
  };

  // *** For Optional Backend Integration
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
    <AnimatePresence>
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{
          duration: 0.2,
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      >
        <div>
          <div className="mb-5 grid grid-cols-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="border-r-foreground/30 border-r pr-2 font-semibold">
                Filters
              </span>
              <Button variant={"outline"}>
                <PlusCircleIcon /> Staff
              </Button>
              <Button variant={"outline"}>
                <PlusCircleIcon /> Doctor
              </Button>
              <Button variant={"outline"}>
                <PlusCircleIcon /> Administrator
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button className="ml-auto size-fit">
                  <PlusIcon /> Add Staff Member
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="min-w-md">
                <SheetHeader className="border-b">
                  <SheetTitle>Add Staff Member</SheetTitle>
                </SheetHeader>

                <ScrollArea className="max-h-[80%]">
                  <Form {...staffAccountForm}>
                    <form
                      className="px-4"
                      onSubmit={staffAccountForm.handleSubmit(
                        handleAccountUpdateSubmit,
                      )}
                    >
                      <CustomFileField
                        control={staffAccountForm.control}
                        name="profile"
                        label="Profile Picture"
                        variant="avatar"
                        accept=".jpg, .png"
                        maxSize={5} // 5mb
                        isNotLabeled={true}
                        avatarUploadButtonText="Upload DP"
                        description="formats .jpg, or .png (5mb max size)"
                        onFileSelect={(files) =>
                          console.log("Profile selected:", files)
                        }
                      />

                      <div className="mt-4 mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="">
                          <CustomInputField
                            control={staffAccountForm.control}
                            name="firstName"
                            placeholder="First Name"
                            label="First Name"
                          />
                        </div>
                        <div className="">
                          <CustomInputField
                            control={staffAccountForm.control}
                            name="lastName"
                            placeholder="Last Name"
                            label="Last Name"
                          />
                        </div>
                        <div className="">
                          <CustomInputField
                            control={staffAccountForm.control}
                            name="phoneNumber"
                            placeholder="+234 8090 0389 90"
                            label="Phone Number"
                            inputType="tel"
                            inputMode="tel"
                          />
                        </div>
                        <div className="">
                          <CustomInputField
                            control={staffAccountForm.control}
                            name="email"
                            placeholder="johndoe@example.com"
                            label="email address"
                            inputMode="email"
                          />
                        </div>
                        <div className="">
                          <CustomSelectField
                            control={staffAccountForm.control}
                            name="gender"
                            placeholder="Gender"
                            label="gender"
                            options={gender}
                          />
                        </div>
                        <div className="">
                          <CustomInputField
                            control={staffAccountForm.control}
                            name="age"
                            placeholder="18"
                            label="age"
                            inputMode="numeric"
                          />
                        </div>
                        <div className="col-span-2">
                          <CustomInputField
                            control={staffAccountForm.control}
                            name="address"
                            placeholder="15 Hill Avenue"
                            label="Address"
                          />
                        </div>
                        <div className="col-span-2">
                          <CustomSelectField
                            control={staffAccountForm.control}
                            name="role"
                            placeholder="Role"
                            label="Role"
                            options={roles}
                          />
                        </div>
                      </div>
                      <SheetFooter className="grid grid-cols-2 items-center justify-between border-t p-0">
                        <div className="flex w-full items-center gap-2">
                          {Array.from({ length: 2 }).map((_, index) => (
                            <span
                              key={index}
                              className={cn(
                                "bg-primary-foreground h-[4px] w-[15%] rounded-full p-1 transition-colors duration-500",
                                {
                                  "bg-primary": step === stepsCollection[index],
                                },
                              )}
                            ></span>
                          ))}
                        </div>
                        <Button
                          type="submit"
                          className="mt-4 ml-auto size-fit px-8"
                        >
                          Proceed
                        </Button>
                      </SheetFooter>
                    </form>
                  </Form>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

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
      </motion.div>
    </AnimatePresence>
  );
}

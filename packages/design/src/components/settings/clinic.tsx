"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Loader2,
  Plus,
  PlusCircleIcon,
  PlusIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  cn,
  DAYS_OF_WEEK,
  dentalSpecialists,
  dentalTreatmentServices,
  gender,
  parseTimeToMinutes,
  userRoles,
} from "@repo/design/lib/utils";

import type {
  ColumnConfig,
  // PaginationConfig,
} from "../table/custom-data-table";
import {CustomAccordionCheckboxGroup} from "../form/custom-accordion-checkbox-group";
import {CustomFileField} from "../form/custom-file-field";
import {CustomInputField} from "../form/custom-input-field";
import {CustomSelectField} from "../form/custom-select-field";
import {CustomSwitchField} from "../form/custom-switch-field";
import {CustomTimeField} from "../form/custom-time-field";
import CustomDataTable from "../table/custom-data-table";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

// Generated 150 table records
const sampleData = Array.from({ length: 10 }, (_, i) => ({
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
  role: ["staff", "doctor", "administrator"][i % 3],
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

const timeFieldSchema = z
  .object({
    from: z.string().optional(), // Allow initial empty state
    to: z.string().optional(), // Allow initial empty state
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        const fromMinutes = parseTimeToMinutes(data.from);
        const toMinutes = parseTimeToMinutes(data.to);
        return toMinutes > fromMinutes;
      }
      return true; // Skip if either field is empty
    },
    {
      message: "'To' time must be after 'From' time",
      path: ["to"], // Will be nested under "time" in the form
    },
  );

const daySchema = z
  .object({
    isActive: z.boolean(),
    time: timeFieldSchema.optional(), // Optional by default
  })
  .refine(
    (data) =>
      !data.isActive ||
      (data.time?.from &&
        data.time.to &&
        data.time.from.trim() !== "" &&
        data.time.to.trim() !== ""),
    {
      message: "Both 'From' and 'To' times are required when day is active",
      path: ["time"], // Applies to the entire time object
    },
  );

// Step 1: Personal and Contact Details
const staffAccountSchemaStep1 = z.object({
  profile: z
    .custom<File>((val) => val instanceof File, "Expected a file")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB",
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPEG and PNG images are allowed",
    )
    .optional(),
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" }),
  phoneNumber: z
    .string()
    .trim()
    .transform((val) =>
      val.startsWith("+")
        ? "+" + val.slice(1).replace(/[^\d]/g, "")
        : val.replace(/[^\d]/g, ""),
    )
    .refine((val) => /^\+?[1-9]\d{1,14}$/.test(val), {
      message: "Invalid international phone number format",
    }),
  email: z.string().email("Invalid email format"),
  gender: z.enum(["male", "female"]),
  age: z
    .string()
    .min(1, { message: "Age is required" })
    .max(3, { message: "Age cannot exceed 3 digits" })
    .refine(
      (val) =>
        !isNaN(parseInt(val, 10)) &&
        parseInt(val, 10) >= 1 &&
        parseInt(val, 10) <= 999,
      {
        message: "Age must be a number between 1 and 999",
      },
    ),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  role: z.enum(["staff", "administrator", "doctor"]),
});

// Step 2: Assigned Services
const staffAccountSchemaStep2 = z.object({
  specialist: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You must select at least one specialist",
    }),
  treatments: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You must select at least one treatment",
    }),
});

// Step 3: Work Hours
const staffAccountSchemaStep3 = z
  .object({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
  })
  .refine((data) => Object.values(data).some((day) => day.isActive), {
    message: "At least one day must be active",
    path: ["workHours"],
  });

// Full staff form schema
const staffFormSchema = z.object({
  doctorDetails: staffAccountSchemaStep1,
  assignedServices: staffAccountSchemaStep2,
  workHours: staffAccountSchemaStep3,
});

type StaffAccountForm = z.infer<typeof staffFormSchema>;
type RowDefinition = (typeof sampleData)[0];

const formCollection = [
  {
    label: "doctor details" as const,
    step: 1,
  },
  {
    label: "assigned services" as const,
    step: 2,
  },
  {
    label: "work hours" as const,
    step: 3,
  },
];
type FormStep = (typeof formCollection)[number];

export function Clinic() {
  const [isLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [formStep, setFormStep] = useState<FormStep | undefined>(
    formCollection[0],
  );
  const [isTransitioning, setIsTransitioning] = useState(false); // New state for loader

  const form = useForm<StaffAccountForm>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      doctorDetails: {
        age: "",
        email: "",
        firstName: "",
        lastName: "",
        gender: "male",
        profile: undefined,
        address: "",
        role: "staff",
        phoneNumber: "",
      },
      assignedServices: {
        specialist: [],
        treatments: [],
      },
      workHours: {
        monday: { isActive: false, time: { from: "", to: "" } },
        tuesday: { isActive: false, time: { from: "", to: "" } },
        wednesday: { isActive: false, time: { from: "", to: "" } },
        thursday: { isActive: false, time: { from: "", to: "" } },
        friday: { isActive: false, time: { from: "" } },
        saturday: { isActive: false, time: { from: "", to: "" } },
        sunday: { isActive: false, time: { from: "", to: "" } },
      },
    },
  });

  const customColumns: ColumnConfig[] = [
    {
      key: "avatar",
      label: "Staff",
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

  // Filter button handlers
  const toggleRoleFilter = (filterValue: string) => {
    setRoleFilter((prev) =>
      prev.includes(filterValue)
        ? prev.filter((f) => f !== filterValue)
        : [...prev, filterValue],
    );
  };

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

  const handleProceed = async () => {
    setIsTransitioning(true);
    try {
      const isValid = await form.trigger(
        formStep?.label === "doctor details"
          ? ["doctorDetails"]
          : formStep?.label === "assigned services"
            ? ["assignedServices"]
            : ["workHours"],
        {
          shouldFocus: true,
        },
      );
      if (isValid && formStep && formStep.step < 3) {
        setFormStep(formCollection[formStep.step]);
      }
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleSubmit = (values: StaffAccountForm) => {
    try {
      console.log(values);
      toast.success("");
    } catch (error) {
      console.error("Staff creation failed:", error);
      toast.error("Failed to add user");
    }
  };

  const handleInvalid = (errors: unknown) => console.log("Errors:", errors);

  const customEmptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        <Plus className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-foreground mb-2 text-lg font-medium">
        You have no patients yet
      </h3>
      <Button className="mt-4" onClick={() => setIsSheetOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add a team member
      </Button>
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
          <div className="mb-5 grid grid-cols-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="border-r-foreground/30 border-r pr-2 font-semibold">
                Filters
              </span>
              <Button
                variant={roleFilter.includes("staff") ? "default" : "outline"}
                onClick={() => toggleRoleFilter("staff")}
                className="rounded-xl border-dashed px-3 py-1.5"
              >
                <PlusCircleIcon /> Staff
              </Button>
              <Button
                variant={roleFilter.includes("doctor") ? "default" : "outline"}
                onClick={() => toggleRoleFilter("doctor")}
                className="rounded-xl border-dashed px-3 py-1.5"
              >
                <PlusCircleIcon /> Doctor
              </Button>
              <Button
                variant={
                  roleFilter.includes("administrator") ? "default" : "outline"
                }
                onClick={() => toggleRoleFilter("administrator")}
                className="rounded-xl border-dashed px-3 py-1.5"
              >
                <PlusCircleIcon /> Administrator
              </Button>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button className="ml-auto size-fit">
                  <PlusIcon /> Add Staff Member
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="min-w-full sm:min-w-md">
                <SheetHeader className="border-b">
                  <SheetTitle>Add Staff Member</SheetTitle>
                  <SheetDescription className="sr-only">
                    add new staff
                  </SheetDescription>
                  {formStep && formStep.step > 1 && (
                    <div className="flex flex-wrap items-center gap-1">
                      {formCollection.map((col, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center gap-1 text-xs opacity-70",
                            {
                              "opacity-100": col.label === formStep.label,
                            },
                          )}
                        >
                          <div className="flex items-center">
                            {col.step < formStep.step && (
                              <span className="text-muted-foreground mx-1">
                                <CheckCircle className="size-3" />
                              </span>
                            )}
                            <span className="capitalize">{col.label}</span>
                          </div>

                          {col.step < 3 && (
                            <ArrowRight className="size-3" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </SheetHeader>

                <ScrollArea className="max-h-[80%]">
                  <Form {...form}>
                    <form
                      className="px-4"
                      onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
                    >
                      {formStep?.label === "doctor details" && (
                        <div>
                          {isTransitioning && (
                            <div className="bg-opacity-75 absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                              <Loader2 className="text-primary h-8 w-8 animate-spin" />
                            </div>
                          )}
                          <CustomFileField
                            control={form.control}
                            name="doctorDetails.profile"
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

                          <div className="mt-4 mb-5 flex flex-wrap gap-4 *:min-w-1/4 *:flex-grow">
                            <div className="">
                              <CustomInputField
                                control={form.control}
                                name="doctorDetails.firstName"
                                placeholder="First Name"
                                label="First Name"
                              />
                            </div>
                            <div className="">
                              <CustomInputField
                                control={form.control}
                                name="doctorDetails.lastName"
                                placeholder="Last Name"
                                label="Last Name"
                              />
                            </div>
                            <div className="">
                              <CustomInputField
                                control={form.control}
                                name="doctorDetails.phoneNumber"
                                placeholder="+234 8090 0389 90"
                                label="Phone Number"
                                inputType="tel"
                                inputMode="tel"
                              />
                            </div>
                            <div className="">
                              <CustomInputField
                                control={form.control}
                                name="doctorDetails.email"
                                placeholder="johndoe@example.com"
                                label="email address"
                                inputMode="email"
                              />
                            </div>
                            <div className="">
                              <CustomSelectField
                                control={form.control}
                                name="doctorDetails.gender"
                                placeholder="Gender"
                                label="gender"
                                options={gender}
                              />
                            </div>
                            <div className="">
                              <CustomInputField
                                control={form.control}
                                name="doctorDetails.age"
                                placeholder="18"
                                label="age"
                                inputMode="numeric"
                              />
                            </div>
                            <div className="col-span-2">
                              <CustomInputField
                                control={form.control}
                                name="doctorDetails.address"
                                placeholder="15 Hill Avenue"
                                label="Address"
                              />
                            </div>
                            <div className="col-span-2">
                              <CustomSelectField
                                control={form.control}
                                name="doctorDetails.role"
                                placeholder="Role"
                                label="Role"
                                options={userRoles}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {formStep?.label === "assigned services" && (
                        <div className="flex flex-col gap-5">
                          <CustomAccordionCheckboxGroup
                            control={form.control}
                            name="assignedServices.specialist"
                            label="Specialist"
                            placeholder="Select specialist doctor"
                            options={dentalSpecialists}
                          />
                          <CustomAccordionCheckboxGroup
                            control={form.control}
                            name="assignedServices.treatments"
                            label="Treatment Service"
                            placeholder="Select treatment service for doctor"
                            options={dentalTreatmentServices}
                          />
                        </div>
                      )}

                      {formStep?.label === "work hours" && (
                        <div className="flex flex-col gap-4">
                          {/* Error Summary (if any errors exist in workHours) */}
                          {typeof form.formState.errors.workHours ===
                          "object" ? (
                            <div className="bg-background text-destructive shadow sticky top-0 z-10 rounded-md p-3 text-sm">
                              <p>Please fix the following issues:</p>
                              <ul className="ml-4 list-disc">
                                {Object.entries(
                                  form.formState.errors.workHours as Record<
                                    string,
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    any
                                  >,
                                ).map(([day, error]) => (
                                  <li key={day}>
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                    :
                                    {/* Handle day-level errors (e.g., isActive) */}
                                    {(error as { message?: string })
                                      .message && (
                                      <span>
                                        {" "}
                                        {
                                          (error as { message?: string })
                                            .message
                                        }
                                      </span>
                                    )}
                                    {/* Handle nested time errors */}
                                    {(
                                      error as {
                                        time?: { from?: string; to?: string };
                                      }
                                    ).time &&
                                      typeof (
                                        error as {
                                          time?: { from?: string; to?: string };
                                        }
                                      ).time === "object" && (
                                        <ul className="ml-4 list-disc">
                                          {(
                                            error as {
                                              time?: {
                                                from?: { message?: string };
                                              };
                                            }
                                          ).time?.from?.message && (
                                            <li>
                                              From:{" "}
                                              {
                                                (
                                                  error as {
                                                    time?: {
                                                      from?: {
                                                        message?: string;
                                                      };
                                                    };
                                                  }
                                                ).time?.from?.message
                                              }
                                            </li>
                                          )}
                                          {(
                                            error as {
                                              time?: {
                                                to?: { message?: string };
                                              };
                                            }
                                          ).time?.to?.message && (
                                            <li>
                                              To:{" "}
                                              {
                                                (
                                                  error as {
                                                    time?: {
                                                      to?: { message?: string };
                                                    };
                                                  }
                                                ).time?.to?.message
                                              }
                                            </li>
                                          )}
                                        </ul>
                                      )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : typeof form.formState.errors.workHours ===
                            "string" ? (
                            <div className="bg-destructive/10 text-destructive sticky top-0 z-10 rounded-md p-3 text-sm">
                              <p>{form.formState.errors.workHours}</p>
                            </div>
                          ) : null}
                          {DAYS_OF_WEEK.map((day, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div className="w-1/3">
                                <CustomSwitchField
                                  control={form.control}
                                  label={day}
                                  name={`workHours.${day}.isActive`}
                                  fieldClassName="flex-row-reverse justify-end"
                                  labelClassName="text-sm"
                                />
                              </div>
                              <div className="w-2/3">
                                <CustomTimeField
                                  control={form.control}
                                  name={`workHours.${day}.time`}
                                  timeFieldType="from-to"
                                  disabled={
                                    !form.watch(`workHours.${day}.isActive`)
                                  }
                                  isNotLabeled
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <SheetFooter className="mt-4 grid grid-cols-2 items-center justify-between px-1">
                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, index) => (
                            <span
                              key={index}
                              className={cn(
                                "bg-primary-foreground h-[2px] w-[16%] rounded-full transition-colors duration-500",
                                {
                                  "bg-primary":
                                    formStep?.step ===
                                    formCollection[index]?.step,
                                },
                              )}
                            />
                          ))}
                        </div>

                        <div className="ml-auto grid grid-cols-2 gap-1">
                          <Button
                            type="button"
                            variant="secondary"
                            className="size-fit"
                            aria-label="previous"
                            disabled={
                              formStep?.label === "doctor details" ||
                              isTransitioning
                            }
                            onClick={() => {
                              if (formStep && formStep.step > 1) {
                                setFormStep(formCollection[formStep.step - 2]);
                              }
                            }}
                          >
                            Previous
                          </Button>

                          <Button
                            type={formStep?.step === 3 ? "submit" : "button"}
                            onClick={
                              formStep && formStep.step < 3
                                ? handleProceed
                                : undefined
                            }
                            className="size-fit"
                            disabled={isTransitioning}
                          >
                            {isTransitioning
                              ? "Loading..."
                              : formStep && formStep.step < 3
                                ? "Proceed"
                                : "Submit"}
                          </Button>
                        </div>
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
            searchPlaceholder="Search staff, phone no, email..."
            hasNumberOfRows={true}
            autoDetectColumns={false}
            columns={customColumns}
            // showSeeAll={true}
            filter={roleFilter}
            filterKeys={["role"]}
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

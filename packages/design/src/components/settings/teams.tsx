import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import z from "zod";

import { CustomCheckboxField } from "../form/custom-checkbox-field";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const roles = [
  {
    role: "admin",
    description:
      "The Administrator is the top-level user responsible for managing the platform’s users, settings, and operations.",
    users: [
      { name: "John Doe", avatar: "https://github.com/evilrabbit.png" },
      { name: "John Doe", avatar: "https://github.com/leerob.png" },
      { name: "Iron Man", avatar: "" },
      { name: "Mary Moe", avatar: "https://github.com/shadcn.png" },
      { name: "John Doe", avatar: "" },
    ],
    permissions: {
      userManagement: {
        canAddEditOrRemoveUsers: true,
        canAssignAndRole: true,
        canResetUserPassword: false,
        canViewUserActivityLogs: true,
      },
      doctorManagement: {
        canApproveDoctorSchedules: true,
        canAssignPatientToDoctors: false,
      },
      patientRecords: {
        canViewAllPatientRecords: true,
        canModifyOrCancelAppointments: false,
        canViewBasicPatientInfo: true,
        canUploadCaseFiles: true,
        canAccessAppointmentAnalytics: false,
      },
      billingFinance: {
        canViewAllRecords: true,
        canExportFinancialData: false,
        canManageInsurancePolicies: true,
        canMarkPaymentAsReceived: true,
      },
      systemSettings: {
        canConfigureGlobalSettings: true,
        canManageClinicBranchesAndHours: false,
        canSetNotificationPreferences: true,
      },
      notifications: {
        canSendNotifications: true,
        canSendEmailAndSMS: true,
        canReceiveAppointmentAlert: true,
        canReceivePatientFeedback: false,
        canNotifyPatientOnAppointment: true,
        canControlAutoNotifications: false,
        canReceiveScheduleUpdates: true,
      },
      security: {
        canAccessLogs: true,
        canEnforcePasswordPolicy: true,
        canViewComplianceReports: false,
      },
    },
  },
  {
    role: "doctor",
    description:
      "The doctor is the mid-level user responsible for managing patients appointments, scheduling appointments, and prescribing medications.",
    users: [
      { name: "John Doe", avatar: "https://github.com/leerob.png" },
      { name: "Iron Man", avatar: "" },
      { name: "John Doe", avatar: "https://github.com/evilrabbit.png" },
      { name: "Mary Moe", avatar: "https://github.com/shadcn.png" },
      { name: "John Doe", avatar: "" },
    ],
    permissions: {
      userManagement: {
        canAddEditOrRemoveUsers: false,
        canAssignAndRole: false,
        canResetUserPassword: false,
        canViewUserActivityLogs: false,
      },
      doctorManagement: {
        canApproveDoctorSchedules: true,
        canAssignPatientToDoctors: true,
      },
      patientRecords: {
        canViewAllPatientRecords: true,
        canModifyOrCancelAppointments: true,
        canViewBasicPatientInfo: true,
        canUploadCaseFiles: false,
        canAccessAppointmentAnalytics: true,
      },
      billingFinance: {
        canViewAllRecords: false,
        canExportFinancialData: false,
        canManageInsurancePolicies: false,
        canMarkPaymentAsReceived: false,
      },
      systemSettings: {
        canConfigureGlobalSettings: false,
        canManageClinicBranchesAndHours: false,
        canSetNotificationPreferences: false,
      },
      notifications: {
        canSendNotifications: true,
        canSendEmailAndSMS: false,
        canReceiveAppointmentAlert: true,
        canReceivePatientFeedback: true,
        canNotifyPatientOnAppointment: true,
        canControlAutoNotifications: false,
        canReceiveScheduleUpdates: true,
      },
      security: {
        canAccessLogs: false,
        canEnforcePasswordPolicy: false,
        canViewComplianceReports: false,
      },
    },
  },
  {
    role: "staff",
    description:
      "The staff is the user responsible for managing the platform’s patients check-ins, processing payments, and viewing patient info.",
    users: [
      { name: "John Doe", avatar: "https://github.com/leerob.png" },
      { name: "John Doe", avatar: "https://github.com/evilrabbit.png" },
      { name: "John Doe", avatar: "" },
      { name: "Mary Moe", avatar: "https://github.com/shadcn.png" },
      { name: "Iron Man", avatar: "" },
    ],
    permissions: {
      userManagement: {
        canAddEditOrRemoveUsers: false,
        canAssignAndRole: false,
        canResetUserPassword: false,
        canViewUserActivityLogs: false,
      },
      doctorManagement: {
        canApproveDoctorSchedules: false,
        canAssignPatientToDoctors: false,
      },
      patientRecords: {
        canViewAllPatientRecords: true,
        canModifyOrCancelAppointments: false,
        canViewBasicPatientInfo: true,
        canUploadCaseFiles: false,
        canAccessAppointmentAnalytics: false,
      },
      billingFinance: {
        canViewAllRecords: true,
        canExportFinancialData: false,
        canManageInsurancePolicies: false,
        canMarkPaymentAsReceived: true,
      },
      systemSettings: {
        canConfigureGlobalSettings: false,
        canManageClinicBranchesAndHours: false,
        canSetNotificationPreferences: false,
      },
      notifications: {
        canSendNotifications: false,
        canSendEmailAndSMS: false,
        canReceiveAppointmentAlert: false,
        canReceivePatientFeedback: false,
        canNotifyPatientOnAppointment: false,
        canControlAutoNotifications: false,
        canReceiveScheduleUpdates: false,
      },
      security: {
        canAccessLogs: false,
        canEnforcePasswordPolicy: false,
        canViewComplianceReports: false,
      },
    },
  },
];

const userManagementSchema = z.object({
  canAddEditOrRemoveUsers: z.boolean().catch(false),
  canAssignAndChangeRole: z.boolean().catch(false),
  canResetUserPassword: z.boolean().catch(false),
  canViewUserActivityLogs: z.boolean().catch(false),
});

const doctorManagementSchema = z.object({
  canApproveDoctorSchedules: z.boolean().catch(false),
  canAssignPatientToDoctors: z.boolean().catch(false),
});

const patientRecordsSchema = z.object({
  canViewAllPatientRecords: z.boolean().catch(false),
  canModifyOrCancelAppointments: z.boolean().catch(false),
  canViewBasicPatientInfo: z.boolean().catch(false),
  canUploadCaseFiles: z.boolean().catch(false),
  canAccessAppointmentAnalytics: z.boolean().catch(false),
});

const billingFinanceSchema = z.object({
  canViewAllRecords: z.boolean().catch(false),
  canExportFinancialData: z.boolean().catch(false),
  canManageInsurancePolicies: z.boolean().catch(false),
  canMarkPaymentAsReceived: z.boolean().catch(false),
});

const systemSettingsSchema = z.object({
  canConfigureGlobalSettings: z.boolean().catch(false),
  canManageClinicBranchesAndHours: z.boolean().catch(false),
  canSetNotificationPreferences: z.boolean().catch(false),
});

const notificationsSchema = z.object({
  canSendNotifications: z.boolean().catch(false),
  canSendEmailAndSMS: z.boolean().catch(false),
  canReceiveAppointmentAlert: z.boolean().catch(false),
  canReceivePatientFeedback: z.boolean().catch(false),
  canNotifyPatientOnAppointment: z.boolean().catch(false),
  canControlAutoNotifications: z.boolean().catch(false),
  canReceiveScheduleUpdates: z.boolean().catch(false),
});

const securitySchema = z.object({
  canAccessLogs: z.boolean().catch(false),
  canEnforcePasswordPolicy: z.boolean().catch(false),
  canViewComplianceReports: z.boolean().catch(false),
});

// Combine all category schemas into one main form schema
const rolePermissionSchema = z.object({
  userManagement: userManagementSchema,
  doctorManagement: doctorManagementSchema,
  patientRecords: patientRecordsSchema,
  billingFinance: billingFinanceSchema,
  systemSettings: systemSettingsSchema,
  notifications: notificationsSchema,
  security: securitySchema,
});

const createRoleSchema = z.object({
  roleName: z.string({ message: "This field is required" }).min(1),
  permissions: rolePermissionSchema,
});

type RolePermissionSchema = z.infer<typeof rolePermissionSchema>;
type CreateRoleSchema = z.infer<typeof createRoleSchema>;

type EditStateType = Omit<(typeof roles)[0], "users">;
interface FormWrapperProps<
  TEdit extends UseFormReturn<never>,
  TCreate extends UseFormReturn<never>,
> {
  children: React.ReactNode;
  pageState: "default" | "edit" | "create";
  onSubmitEdit: (values: TEdit["getValues"]) => void;
  onSubmitCreate: (values: TCreate["getValues"]) => void;
  editForm: TEdit;
  createForm: TCreate;
}
function FormWrapper<
  TEdit extends UseFormReturn<never>,
  TCreate extends UseFormReturn<never>,
>({
  children,
  pageState,
  onSubmitEdit,
  onSubmitCreate,
  editForm,
  createForm,
}: FormWrapperProps<TEdit, TCreate>) {
  return (
    <>
      {pageState === "edit" && (
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(onSubmitEdit)}>{children}</form>
        </Form>
      )}
      {pageState === "create" && (
        <Form {...createForm}>
          <form onSubmit={createForm.handleSubmit(onSubmitCreate)}>
            {children}
          </form>
        </Form>
      )}
    </>
  );
}

export function Teams() {
  const [pageState, setPageState] = useState<"default" | "edit" | "create">(
    "default",
  );

  const [editStateInfo, setEditStateInfo] = useState<EditStateType | undefined>(
    undefined,
  );

  const editRoleForm = useForm<RolePermissionSchema>({
    resolver: zodResolver(rolePermissionSchema),
  });

  const createRoleForm = useForm<CreateRoleSchema>({
    resolver: zodResolver(createRoleSchema),
  });

  useLayoutEffect(() => {
    setPageState("default");
  }, []);

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
        {pageState !== "default" && (
          <Button
            variant={"secondary"}
            className="mb-7 rounded-xl"
            onClick={() => setPageState("default")}
          >
            <ChevronLeft /> Go Back
          </Button>
        )}

        {pageState === "default" && (
          <section>
            <div className="flex flex-col gap-5">
              {roles.map(({ role, description, users, permissions }, index) => (
                <div
                  key={index}
                  className="bg-primary/5 flex items-center gap-2 rounded-2xl p-5"
                >
                  <div className="flex flex-grow items-center justify-between">
                    <div className="flex flex-1 flex-col flex-wrap">
                      <h3 className="text-xs font-semibold capitalize">
                        {role}
                      </h3>
                      <p className="text-foreground/70 text-xs">
                        {description}
                      </p>
                    </div>

                    <div className="flex flex-row-reverse">
                      {users
                        .toReversed()
                        .slice(0, 4)
                        .map((user, index) => (
                          <Avatar
                            key={index}
                            className={
                              "border-2 border-slate-50 not-first:-mr-4"
                            }
                          >
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-primary/10 uppercase backdrop-blur-3xl">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                    </div>
                  </div>

                  <Button
                    aria-label={"Edit " + role + " roles"}
                    variant={"ghost"}
                    className="border-secondary border-b"
                    onClick={() => {
                      setEditStateInfo({ role, description, permissions });
                      setPageState("edit");
                    }}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex">
              <Button
                className="mt-4 ml-auto rounded-xl"
                onClick={() => {
                  setPageState("create");
                }}
              >
                <PlusIcon /> Create Role
              </Button>
            </div>
          </section>
        )}

        {pageState != "default" && (
          <section>
            {pageState === "edit" && (
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold capitalize sm:text-lg">
                  {editStateInfo?.role}
                </h3>
                <p className="max-w-md text-xs opacity-60 sm:text-sm">
                  {editStateInfo?.description}
                </p>
              </div>
            )}

            <FormWrapper
              pageState={pageState}
              onSubmitEdit={(values) => {
                console.log("edit", values);
              }}
              onSubmitCreate={(values) => {
                console.log("create", values);
              }}
              editForm={editRoleForm as unknown as never}
              createForm={createRoleForm as unknown as never}
            >
              <div className="flex flex-wrap gap-1 *:flex-1 mt-5 py-5 border-y border-secondary">
                <h4 className="text-sm"> User Management</h4>
                <div className="rounded-xl border p-3">
                  {pageState === "edit" ? (
                    <CustomCheckboxField
                      control={editRoleForm.control}
                      name={"userManagement.canAddEditOrRemoveUsers"}
                      label="Add, edit, or remove users"
                      labelClassName="text-xs opacity-70"
                      defaultChecked={editStateInfo?.permissions.userManagement.canAddEditOrRemoveUsers}
                    />
                  ) : (
                    <CustomCheckboxField
                      control={createRoleForm.control}
                      name={
                        "permissions.userManagement.canAddEditOrRemoveUsers"
                      }
                      label="Add, edit, or remove users"
                    />
                  )}
                  {pageState === "edit" ? (
                    <CustomCheckboxField
                      control={editRoleForm.control}
                      name={"userManagement.canAssignAndChangeRole"}
                      label="Add, edit, or remove users"
                      labelClassName="text-xs opacity-70"
                      defaultChecked={editStateInfo?.permissions.userManagement.canAddEditOrRemoveUsers}
                    />
                  ) : (
                    <CustomCheckboxField
                      control={createRoleForm.control}
                      name={
                        "permissions.userManagement.canAssignAndChangeRole"
                      }
                      label="Add, edit, or remove users"
                    />
                  )}
                </div>
              </div>
            </FormWrapper>
          </section>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

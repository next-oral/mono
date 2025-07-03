import { useLayoutEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CopyIcon, Monitor, QrCodeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AndroidBrand,
  AppleBrand,
  LinuxBrand,
  WindowsBrand,
} from "@repo/design/icons";
import { cn, handleClipBoardCopy } from "@repo/design/lib/utils";

import CustomInputField from "../form/custom-input-field";
// import CustomInputField from "../form/custom-input-field";
import CustomOtpField from "../form/custom-otp-field";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent } from "../ui/tooltip";

const currentPasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: "Current password is required" }),
});

const updatePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters long" }),
    confirmNewPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmNewPassword"],
        message: "Passwords do not match",
      });
    }
  });

const otpFormSchema = z.object({
  // matches regular-expression to check for numbers only
  code: z
    .string({ message: "Field cannot be empty" })
    .regex(/^\d+$/, { message: "Only digits are allowed" })
    .min(4, { message: "Code must be at least 4 digits" }),
});

type CurrentPasswordForm = z.infer<typeof currentPasswordSchema>;
type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;
type OtpForm = z.infer<typeof otpFormSchema>;

// 1. Array of device sessions
const deviceSessions = [
  {
    os: "Windows",
    deviceName: "John's Laptop",
    lastLogin: "2025-06-27 14:32",
  },
  {
    os: "macOS",
    deviceName: "Work MacBook",
    lastLogin: "2025-06-25 09:12",
  },
  {
    os: "Android",
    deviceName: "Pixel 7",
    lastLogin: "2025-06-20 18:45",
  },
  {
    os: "iOS",
    deviceName: "iPhone 15",
    lastLogin: "2025-06-19 21:10",
  },
  {
    os: "Linux",
    deviceName: "Ubuntu Desktop",
    lastLogin: "2025-06-15 11:00",
  },
];

function getCurrentDeviceInfo() {
  const userAgent = window.navigator.userAgent;
  let os = "Unknown";
  if (/windows/i.test(userAgent)) os = "Windows";
  else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";
  else if (/linux/i.test(userAgent)) os = "Linux";

  // If Device name is not available; fallback to platform
  const deviceName = window.navigator.platform || "Unknown Device";
  return { os, deviceName };
}

// 3. Map array and return icon
function getDeviceIcon(os: string) {
  switch (os) {
    case "Windows":
      return <WindowsBrand className="size-4" />;
    case "macOS":
      return <AppleBrand className="size-4" />;
    case "Linux":
      return <LinuxBrand className="size-4" />;
    case "Android":
      return <AndroidBrand className="size-4" />;
    case "iOS":
      return <AppleBrand className="size-4" />;
    default:
      return <Monitor className="size-4" />;
  }
}

function SecondaryPage({
  pageForm,
  setPageForm,
  setIsOtpEnabled,
  setHasCurrentPassword,
}: {
  pageForm: "default" | "password" | "otp";
  setPageForm: React.Dispatch<React.SetStateAction<typeof pageForm>>;
  setIsOtpEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setHasCurrentPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const updatePasswordForm = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleOtpSubmit = (data: OtpForm) => {
    try {
      // TODO: Implement actual OTP verification logic
      console.log(data);
      setIsOtpEnabled(true);
      setPageForm("default");
      // TODO: Show success toast
    } catch (error) {
      // TODO: Handle OTP verification errors
      console.error("OTP verification failed:", error);
    }
  };

  const handlePasswordUpdateSubmit = (data: UpdatePasswordForm) => {
    console.log(data);
    setPageForm("default");
    setHasCurrentPassword(true);
  };

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
        <section>
          <div className="mb-5 border-b">
            <Button
              variant="ghost"
              className="py-6 font-normal hover:bg-transparent"
              onClick={() => setPageForm("default")}
            >
              <ArrowLeft /> Go Back
            </Button>
          </div>
          <div
            className={cn(
              "grid grid-cols-1 justify-between gap-10 md:grid-cols-3",
              {
                "md:grid-cols-2": pageForm === "password",
              },
            )}
          >
            <div className="flex flex-grow flex-col gap-1">
              <h4 className="text-sm font-semibold sm:text-lg">
                Enable two-factor Authentication
              </h4>
              <p className="text-xs sm:text-sm">
                Use Goggle Authenticator, 1Password or any other OTP client
              </p>
            </div>

            <div
              className={cn(
                "border-secondary rounded-lg border p-2 sm:p-3 md:col-span-2",
                {
                  "md:col-span-1": pageForm === "password",
                },
              )}
            >
              {pageForm === "password" ? (
                <Form {...updatePasswordForm}>
                  <form
                    onSubmit={updatePasswordForm.handleSubmit(
                      handlePasswordUpdateSubmit,
                    )}
                  >
                    <div className="grid grid-cols-1 gap-10">
                      <div className="border-secondary flex flex-col gap-3 rounded-lg border p-2 sm:p-3">
                        <CustomInputField
                          control={updatePasswordForm.control}
                          name="newPassword"
                          placeholder="* * * * * * * * *"
                          label="New Password"
                          description="Enter new password, must be at least 8 characters"
                          isPasswordVisible={isNewPasswordVisible}
                          setIsPasswordVisible={setIsNewPasswordVisible}
                        />

                        <CustomInputField
                          control={updatePasswordForm.control}
                          name="confirmNewPassword"
                          placeholder="* * * * * * * * *"
                          label="Confirm New Password"
                          description="Repeat password, must be at least 8 characters"
                          isPasswordVisible={isConfirmPasswordVisible}
                          setIsPasswordVisible={setIsConfirmPasswordVisible}
                        />
                      </div>
                      <Button className="ml-auto">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
                    {/* Step 1 */}
                    <div className="grid items-center justify-between gap-5 md:grid-cols-2">
                      <div className="flex gap-[12px]">
                        <span className="text-sm font-semibold sm:text-base">
                          1.
                        </span>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-sm font-semibold sm:text-base">
                            Configure your two-factor client
                          </h4>
                          <p className="text-xs sm:text-sm">
                            Please scan the QR code below using an OTP
                            compatible app (such as Google Authenticator or
                            1Password).
                          </p>
                        </div>
                      </div>

                      <QrCodeIcon className="size-[100px] md:ml-auto" />
                    </div>
                    {/* Step 2 */}
                    <div className="mt-5 grid items-center justify-between gap-5 md:grid-cols-2">
                      <div className="flex gap-[12px]">
                        <span className="text-sm font-semibold sm:text-base">
                          2.
                        </span>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-sm font-semibold sm:text-base">
                            Scan the QR code with your authenticator
                          </h4>
                          <p className="text-xs sm:text-sm">
                            If you can't scan the code, you can enter this
                            secret key into you authenticator app
                          </p>
                        </div>
                      </div>
                      <div className="border-secondary/80 bg-secondary/60 flex items-center justify-between rounded-lg border px-3 py-2 lg:ml-auto">
                        <span className="flex-grow text-sm opacity-80">
                          NBCK-LDTHS-NJ1
                        </span>
                        <Tooltip>
                          <TooltipTrigger
                            className="px-2"
                            onClick={() =>
                              handleClipBoardCopy("NBCK-LDTHS-NJ1")
                            }
                            aria-label="copy secret key to clipboard"
                          >
                            <CopyIcon className="size-5 opacity-80" />
                          </TooltipTrigger>
                          <TooltipContent>Copy Code</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div className="mt-5 grid items-center justify-between gap-5 lg:ml-auto lg:grid-cols-2">
                      <div className="mt-5 flex gap-[12px]">
                        <span className="text-sm font-semibold sm:text-base">
                          3.
                        </span>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-sm font-semibold sm:text-base">
                            After scanning the QR code above, enter the
                            six-digit code generated by the authenticator
                          </h4>
                          <p className="text-xs sm:text-sm">
                            If you can't scan the code, you can enter this
                            secret key into you authenticator app
                          </p>
                        </div>
                      </div>
                      <div className="max-lg:w-[60%] max-sm:w-full">
                        <CustomOtpField
                          name="code"
                          control={otpForm.control}
                          isNotLabeled={true}
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex">
                      <Button
                        type="submit"
                        className="ml-auto size-fit px-[12px] py-[8px]"
                        aria-label="Save profile changes"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}

export function LogInSecurity() {
  const [pageState, setPageState] = useState<"default" | "password" | "otp">(
    "default",
  );
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);

  const [hasCurrentPassword, setHasCurrentPassword] = useState(false);
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);

  const currentPasswordForm = useForm<CurrentPasswordForm>({
    resolver: zodResolver(currentPasswordSchema),
    defaultValues: {
      currentPassword: "",
    },
  });

  const handleCurrentPasswordSubmit = (data: CurrentPasswordForm) => {
    console.log(data);
    setPageState("password");
    setHasCurrentPassword(true);
  };

  useLayoutEffect(() => {
    setPageState("default");
  }, []);

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
        <div className="flex w-full flex-col gap-[40px] px-2 sm:px-4">
          {pageState !== "default" ? (
            <SecondaryPage
              pageForm={pageState}
              setPageForm={setPageState}
              setIsOtpEnabled={setIsOtpEnabled}
              setHasCurrentPassword={setHasCurrentPassword}
            />
          ) : (
            <>
              {/* Password Update */}
              <section className="grid grid-cols-1 max-sm:gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold sm:text-lg">
                    Sign in using password
                  </h4>
                  <p className="text-xs sm:text-sm">
                    Set your password if you want to able to sign in using
                    password
                  </p>
                </div>

                <div className="border-secondary flex-grow rounded-lg border p-5">
                  {hasCurrentPassword ? (
                    <Form {...currentPasswordForm}>
                      <form
                        onSubmit={currentPasswordForm.handleSubmit(
                          handleCurrentPasswordSubmit,
                        )}
                      >
                        <div className="grid grid-cols-1 gap-3">
                          <CustomInputField
                            control={currentPasswordForm.control}
                            name="currentPassword"
                            placeholder="* * * * * * * * *"
                            label="Current Password"
                            description="Enter your current password"
                            isPasswordVisible={isCurrentPasswordVisible}
                            setIsPasswordVisible={setIsCurrentPasswordVisible}
                          />
                          <Button variant={"secondary"} className="size-fit">
                            Change Password
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <Button
                      variant={"secondary"}
                      onClick={() => setPageState("password")}
                    >
                      Set Password
                    </Button>
                  )}
                </div>
              </section>

              <section className="grid grid-cols-1 max-sm:gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold sm:text-lg">
                    Two-factor Authentication
                  </h4>
                  <p className="text-xs sm:text-sm">
                    Use Goggle Authenticator, 1Password or any other OTP client
                  </p>
                </div>

                <div className="border-secondary flex-grow rounded-lg border px-4 py-8">
                  <div className="">
                    <h4 className="mb-5 font-semibold">
                      Two-factor authentication is{" "}
                      {`${isOtpEnabled ? "now enabled" : "not enabled"}`}
                    </h4>

                    <Button
                      asChild
                      variant="secondary"
                      className="ring-secondary-foreground/30 px-6 py-5 opacity-60 ring"
                      onClick={() => setPageState("otp")}
                    >
                      <div className="">
                        <Switch checked={isOtpEnabled} /> Enable two-factor
                        authentication
                      </div>
                    </Button>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 max-sm:gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold sm:text-lg">
                    Active Sessions
                  </h4>
                  <p className="text-xs sm:text-sm">
                    Manage your active sessions on other devices
                  </p>
                </div>

                <div className="border-secondary flex-grow gap-2 rounded-lg border px-4 py-8 max-md:w-full">
                  <div className="grid w-full items-center gap-2 xl:grid-cols-2">
                    <fieldset className="w-full">
                      <legend className="mb-5 font-semibold">
                        Your current session
                      </legend>
                      <div className="border-secondary flex items-center gap-3 overflow-hidden rounded-full border">
                        <span className="bg-secondary px-2 py-1">
                          {getDeviceIcon(getCurrentDeviceInfo().os)}
                        </span>
                        <span className="flex flex-grow flex-wrap items-center gap-1 rounded-e-full">
                          <span className="text-sm">
                            {getCurrentDeviceInfo().os}
                          </span>
                          <span className="text-xs font-normal">
                            Start time{" "}
                            {new Date(
                              deviceSessions.find(
                                ({ os, deviceName }) =>
                                  os === getCurrentDeviceInfo().os &&
                                  deviceName ===
                                    getCurrentDeviceInfo().deviceName,
                              )?.lastLogin ?? "",
                            ).toDateString()}
                          </span>
                        </span>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

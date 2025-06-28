import { useLayoutEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { LaptopIcon, MonitorIcon, SmartphoneIcon, TabletIcon, AppleIcon, Grid2X2XIcon, Lin} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { handleClipBoardCopy } from "@repo/design/lib/utils";

import CustomInputField from "../form/custom-input-field";
import CustomOtpField from "../form/custom-otp-field";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Switch } from "../ui/switch";

const updatePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const otpFormSchema = z.object({
  // matches regular-expression to check for numbers only
  code: z
    .string({ message: "Field cannot be empty" })
    .regex(/^\d+$/, { message: "Only digits are allowed" })
    .min(4, { message: "Code must be at least 6 digits" }),
});

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
      return <Grid2X2XIcon className="mr-2" />;
    case "macOS":
      return <AppleIcon className="mr-2" />;
    case "Linux":
      return <LinuxIcon className="mr-2" />;
    case "Android":
      return <SmartphoneIcon className="mr-2" />;
    case "iOS":
      return <SmartphoneIcon className="mr-2" />;
    default:
      return <MonitorIcon className="mr-2" />;
  }
}

function EnableOtpAuth() {
  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleOtpSubmit = (data: OtpForm) => {
    console.log(data);
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
        <section className="grid grid-cols-1 justify-between gap-10 md:grid-cols-2">
          <div className="flex flex-grow flex-col gap-1">
            <h4 className="text-sm font-semibold sm:text-lg">
              Enable two-factor Authentication
            </h4>
            <p className="text-xs sm:text-sm">
              Use Goggle Authenticator, 1Password or any other OTP client
            </p>
          </div>

          <div className="border-secondary rounded-lg border p-2 sm:p-3">
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
                <div className="flex flex-col gap-3 w-full sm:w-[80%] lg:w-[60%]">
                  <div className="flex gap-[12px]">
                    <span className="text-sm font-semibold sm:text-base">
                      1.
                    </span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-semibold sm:text-base">
                        Configure your two-factor client
                      </h4>
                      <p className="text-xs sm:text-sm">
                        Please scan the QR code below using an OTP compatible
                        app (such as Google Authenticator or 1Password).
                      </p>

                      <QrCodeIcon className="mt-2 size-[50%]" />
                    </div>
                  </div>

                  <div className="flex gap-[12px]">
                    <span className="text-sm font-semibold sm:text-base">
                      2.
                    </span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-semibold sm:text-base">
                        Scan the QR code with your authenticator
                      </h4>
                      <p className="text-xs sm:text-sm">
                        If you can't scan the code, you can enter this secret
                        key into you authenticator app
                      </p>

                      <div className="border-secondary/80 bg-secondary/60 flex items-center justify-between rounded-lg border p-1.5">
                        <span className="flex-grow text-base opacity-80">
                          NBCK-LDTHS-NJ1
                        </span>
                        <Button
                          type="button"
                          variant={"ghost"}
                          onClick={() => handleClipBoardCopy("NBCK-LDTHS-NJ1")}
                          aria-label="copy secret key to clipboard"
                        >
                          <CopyIcon />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-[12px]">
                    <span className="text-sm font-semibold sm:text-base">3.</span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-semibold sm:text-base">
                        After scanning the QR code above, enter the six-digit
                        code generated by the authenticator
                      </h4>
                      <p className="text-xs sm:text-sm">
                        If you can't scan the code, you can enter this secret
                        key into you authenticator app
                      </p>

                      <div className="mt-2">
                        <CustomOtpField
                          name="code"
                          control={otpForm.control}
                          isNotLabeled={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}

export default function LogInSecurity() {
  const [showEnableOtpAuth, setShowEnableOtpAuth] = useState(false);
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);

  useLayoutEffect(() => {
    setShowEnableOtpAuth(false);
    return () => {
      console.log("LogInSecurity component unmounted");
    };
  }, []);

  const updatePasswordForm = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const handlePasswordUpdateSubmit = (data: UpdatePasswordForm) => {
    console.log(data);
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
        <div className="flex w-full flex-col gap-[40px] px-2 sm:px-4">
          {showEnableOtpAuth ? (
            <EnableOtpAuth />
          ) : (
            <>
              {/* Password Update */}
              <section className="grid grid-cols-1 sm:grid-cols-2 max-sm:gap-5">
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
                  <Form {...updatePasswordForm}>
                    <form
                      onSubmit={updatePasswordForm.handleSubmit(
                        handlePasswordUpdateSubmit,
                      )}
                    >
                      <div className="">
                        <Button variant={"secondary"}>Set Password</Button>
                        {/* <CustomInputField
                          control={updatePasswordForm.control}
                          name="newPassword"
                          placeholder="* * * * * * * * *"
                          label="New Password"
                          description="Leave blank if you want to keep your current password"
                        /> */}
                      </div>
                    </form>
                  </Form>
                </div>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 max-sm:gap-5">
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
                    <h4 className="font-semibold">
                      Two-factor authentication is not enabled
                    </h4>
                    {/* TODO: This button will be shown to users without a connected OTP client */}
                    <Button
                      variant="secondary"
                      className="ring-secondary-foreground/30 px-6 py-5 opacity-60 ring"
                      onClick={() => setShowEnableOtpAuth(true)}
                    >
                      <Switch checked={isOtpEnabled} /> Enable two-factor authentication
                    </Button>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 max-sm:gap-5">
                <div className="flex flex-grow flex-col gap-1">
                  <h4 className="text-sm font-semibold sm:text-lg">
                    Active Sessions
                  </h4>
                  <p className="text-xs sm:text-sm">
                    Manage your active sessions on other devices
                  </p>
                </div>

                <div className="border-secondary flex-grow gap-2 rounded-lg border px-4 py-8">
                  <div className="grid w-full grid-cols-2 items-center gap-2 sm:w-[80%] lg:w-[60%]">
                    <fieldset>
                      <legend>Your current session</legend>
                      <div className="flex items-center">
                      <span className="border-r bg-secondary p-1"><LaptopIcon className="size-4" /></span>
                      <span className="flex-grow ">
                        Currently Active
                      </span>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </section>
            </>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <span></span>
            <Button
              type="submit"
              className="mt-4 size-fit px-[12px] py-[8px]"
              aria-label="Save profile changes"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

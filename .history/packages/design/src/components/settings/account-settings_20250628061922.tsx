import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@repo/design/lib/utils";

import CustomCommandField from "../form/custom-command-field";
import CustomFileField from "../form/custom-file-field";
import CustomInputField from "../form/custom-input-field";
import CustomSelectField from "../form/custom-select-field";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const updateAccountSchema = z.object({
  avatar: z
    .any()
    .refine((file: File) => file.size <= MAX_FILE_SIZE, "Max file size is 3MB")
    .refine(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported",
    )
    .optional(),
  firstName: z
    .string()
    .min(3, { message: "First name cannot be less than 3 characters long" })
    .optional(),
  lastName: z
    .string()
    .min(3, { message: "Last name cannot be less than 3 characters long" })
    .optional(),
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
    )
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  gender: z.enum(["male", "female"]),
  age: z
    .string()
    .min(1, { message: "Age cannot be less than 1 character" })
    .max(3, { message: "Age cannot be more than 3 characters" })
    .refine((val) => {
      // Check if the value is a valid number between 1 and 999 incase if user is more than 99 years
      const age = parseInt(val, 10);
      return !isNaN(age) && age >= 1 && age <= 999;
    })
    .optional(),
});

const deleteAccountSchema = z.object({
  reason: z.string().min(1, { message: "Please select a reason" }),
  email: z.string().min(1, { message: "Email is required for confirmation" }),
});

type UpdateAccountForm = z.infer<typeof updateAccountSchema>;
type DeleteAccountForm = z.infer<typeof deleteAccountSchema>;

const reasons = [
  { label: "I don't find it useful anymore", value: "useful-anymore" },
  { label: "Had a bad experience", value: "bad-experience" },
  { label: "I'm a concerned about my privacy", value: "concerned-privacy" },
  { label: "Other", value: "other" },
];
const gender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export default function AccountSettings() {
  const [deleteProcessState, setDeleteProcessState] = useState(1);

  const { theme, setTheme } = useTheme();
  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  const updateAccountForm = useForm<UpdateAccountForm>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      avatar: null,
      email: "",
    },
  });

  const deleteAccountForm = useForm<DeleteAccountForm>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleAccountUpdateSubmit = (data: UpdateAccountForm) => {
    console.log(data);
  };

  const handleAccountDelete = (data: DeleteAccountForm) => {
    console.log(data);
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -300}}
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
          {/* Basic Settings*/}
          <section className="flex w-full flex-wrap justify-between gap-10">
            <div className="flex flex-grow flex-col gap-1">
              <h4 className="text-sm font-semibold sm:text-lg">
                Basic Account Information
              </h4>
              <p className="text-xs sm:text-sm">
                Update your personal information, it helps us know more about
                you.
              </p>
            </div>

            <div className="flex-grow">
              <Form {...updateAccountForm}>
                <form
                  onSubmit={updateAccountForm.handleSubmit(
                    handleAccountUpdateSubmit,
                  )}
                >
                  <CustomFileField
                    control={updateAccountForm.control}
                    name="avatar"
                    label="Profile Picture"
                    variant="avatar"
                    accept="image/*"
                    maxSize={5}
                    description="Upload your profile picture (max 5MB)"
                    onFileSelect={(files) =>
                      console.log("Avatar selected:", files)
                    }
                  />

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="">
                      <CustomInputField
                        control={updateAccountForm.control}
                        name="firstName"
                        placeholder="First Name"
                        label="First Name"
                      />
                    </div>
                    <div className="">
                      <CustomInputField
                        control={updateAccountForm.control}
                        name="lastName"
                        placeholder="Last Name"
                        label="Last Name"
                      />
                    </div>
                    <div className="">
                      <CustomInputField
                        control={updateAccountForm.control}
                        name="phoneNumber"
                        placeholder="+234 8090 0389 90"
                        label="Phone Number"
                        inputType="tel"
                        inputMode="tel"
                      />
                    </div>
                    <div className="">
                      <CustomInputField
                        control={updateAccountForm.control}
                        name="email"
                        placeholder="johndoe@example.com"
                        label="email address"
                        inputMode="email"
                      />
                    </div>
                    <div className="">
                      <CustomSelectField
                        control={updateAccountForm.control}
                        name="gender"
                        placeholder="Gender"
                        label="gender"
                        options={gender}
                      />
                    </div>
                    <div className="">
                      <CustomInputField
                        control={updateAccountForm.control}
                        name="age"
                        placeholder="18"
                        label="age"
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="mt-4 px-8"
                    aria-label="Save profile changes"
                  >
                    Save Changes
                  </Button>
                </form>
              </Form>
            </div>
          </section>

          {/* Appearance section */}
          <section className="flex w-full flex-wrap justify-between gap-10">
            <div className="flex flex-grow flex-col gap-1">
              <h4 className="text-sm font-semibold sm:text-lg">Appearance</h4>
              <p className="text-xs sm:text-sm">
                Personalize the in-app experience
              </p>
            </div>

            <div className="flex-grow">
              <div className="border-secondary flex w-full gap-5 rounded-2xl border p-5 sm:w-[90%] lg:w-[50%]">
                {/* Light Mode */}
                <div
                  className={cn(
                    "flex-1 cursor-pointer transition-transform duration-200 ease-in-out",
                    { "scale-110": theme?.toLowerCase() === "light" },
                  )}
                  onClick={() => handleThemeChange("light")}
                >
                  <div className="rounded-sm bg-slate-100 p-2">
                    <div className="mb-4 h-[70px] w-full rounded-sm bg-slate-400 p-4 opacity-50"></div>

                    <div className="flex flex-col gap-2 *:h-[8.45px] *:rounded-full">
                      <div className="w-full bg-slate-400 opacity-50"></div>
                      <div className="w-full bg-slate-400 opacity-50"></div>
                      <div className="w-[50%] bg-slate-400 opacity-50"></div>
                    </div>
                  </div>
                  <h4
                    className={cn("mt-4 text-center text-sm font-semibold", {
                      "font-semibold": theme?.toLowerCase() === "light",
                    })}
                  >
                    Light Mode
                  </h4>
                </div>
                {/* Dark Mode */}
                <div
                  className={cn(
                    "flex-1 cursor-pointer transition-transform duration-200 ease-in-out",
                    { "scale-105": theme?.toLowerCase() === "dark" },
                  )}
                  onClick={() => handleThemeChange("dark")}
                >
                  <div className="rounded-sm bg-slate-800 p-2">
                    <div className="mb-4 h-[70px] w-full rounded-sm bg-slate-400 p-4 opacity-50"></div>

                    <div className="flex flex-col gap-2 *:h-[8.45px] *:rounded-full">
                      <div className="w-full bg-slate-400 opacity-50"></div>
                      <div className="w-full bg-slate-400 opacity-50"></div>
                      <div className="w-[50%] bg-slate-400 opacity-50"></div>
                    </div>
                  </div>
                  <h4
                    className={cn("mt-4 text-center text-sm", {
                      "font-semibold": theme?.toLowerCase() === "dark",
                    })}
                  >
                    Dark Mode
                  </h4>
                </div>
              </div>
            </div>
          </section>

          {/*  Delete account section */}
          <section className="flex w-full flex-col gap-6">
            <div className="flex flex-grow flex-col gap-1">
              <h4 className="text-sm font-semibold sm:text-lg">
                Permanently delete your account
              </h4>
              <p className="flex items-center gap-2 text-xs sm:text-sm [&>svg]:size-5">
                The is a permanent action that cannot be reverted. <InfoIcon />
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className=""
                >
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:w-[50%] lg:w-[30%]"
                aria-describedby="delete account"
              >
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription className="text-center">
                    {deleteProcessState === 2
                      ? "To permanently delete your account, please confirm your identity by entering your email address below. This helps us ensure your data is securely removed from our system."
                      : "Removing your account will permanently remove you user data from Next Oral. If you wish to continue, please tell us why you are leaving."}
                  </DialogDescription>
                </DialogHeader>

                <Form {...deleteAccountForm}>
                  <form
                    onSubmit={deleteAccountForm.handleSubmit(
                      handleAccountDelete,
                    )}
                  >
                    <CustomCommandField
                      control={deleteAccountForm.control}
                      name="reason"
                      label="Reason for leaving"
                      placeholder="Select a reason"
                      options={reasons}
                      allowSearch
                      hidden={deleteProcessState === 2}
                    />

                    <CustomInputField
                      control={deleteAccountForm.control}
                      name="email"
                      placeholder="Email"
                      inputMode="email"
                      isNotLabeled={true}
                      hidden={deleteProcessState === 1}
                    />
                  </form>
                </Form>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setDeleteProcessState(1)}
                    >
                      No, Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant={
                      deleteProcessState === 2 ? "destructive" : "default"
                    }
                    type={deleteProcessState === 2 ? "submit" : "button"}
                    onClick={() => {
                      if (deleteProcessState === 1) {
                        if (deleteAccountForm.getValues().reason) {
                          setDeleteProcessState(2);
                        }
                      }
                    }}
                    className={cn("flex-1", {
                      "bg-destructive/20 text-secondary-foreground border-destructive/40 hover:bg-destructive/60":
                        deleteProcessState === 2,
                    })}
                  >
                    Proceed
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

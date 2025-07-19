"use client";

import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockIcon,
  LockKeyholeOpen,
  MailCheck,
  SmartphoneIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "../lib/utils";
import { CustomInputField } from "./form/custom-input-field";
import { CustomOtpField } from "./form/custom-otp-field";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

const emailFormSchema = z.object({
  email: z.string().email("Please provide a valid email"),
});

const otpFormSchema = z.object({
  // matches regular-expression to check for numbers only
  code: z
    .string({ message: "Field cannot be empty" })
    .regex(/^\d+$/, { message: "Only digits are allowed" })
    .min(4, { message: "Code must be at least 6 digits" }),
});

const newPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password cannot be less than 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password cannot be less than 8 characters" }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Confirm password does not match the new password",
      path: ["confirmPassword"],
    },
  );
type EmailForm = z.infer<typeof emailFormSchema>;
type OtpForm = z.infer<typeof otpFormSchema>;
type NewPasswordForm = z.infer<typeof newPasswordFormSchema>;

const bodyCollection = ["email", "otp", "new-password", "completed"] as const;
type FormStep = (typeof bodyCollection)[number];

export function ResetPasswordForm() {
  const [step, setFormStep] = useState<FormStep>(bodyCollection[0]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const newPasswordForm = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  return (
    <div className={"flex h-full w-full flex-col gap-4"}>
      {step === "email" && (
        <AnimatePresence>
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
          >
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit((data: EmailForm) => {
                  const { email } = data;
                  // Simulate sending an OTP
                  console.log("Sending OTP to:", email);
                  setFormStep("otp");
                })}
                className="flex flex-col gap-6"
              >
                <div className="bg-accent mx-auto mb-4 size-fit flex-1 rounded-full p-4">
                  <LockIcon className="" />
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-center text-xl font-semibold sm:text-2xl">
                      Forgot Password
                    </h2>
                    <p className="text-center text-sm sm:text-base">
                      Enter your email to reset it
                    </p>
                  </div>

                  <CustomInputField
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    inputType="email"
                    inputMode="email"
                    control={emailForm.control}
                  />
                  <Button className="mt-5" isLoading={false}>
                    Reset Password
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </AnimatePresence>
      )}
      {step === "otp" && (
        <AnimatePresence>
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
          >
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit((data: OtpForm) => {
                  const { code } = data;
                  // Simulate verifying the OTP
                  console.log("Verifying OTP:", code);
                  setFormStep("new-password");
                })}
                className="flex flex-col gap-6"
              >
                {/* OTP form fields go here */}
                <div className="bg-accent mx-auto mb-4 size-fit flex-1 rounded-full p-4">
                  <MailCheck />
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-center text-xl font-semibold sm:text-2xl">
                      Password Reset
                    </h2>
                    <p className="text-center text-sm sm:text-base">
                      We sent a code to
                      <strong>{emailForm.getValues("email")}</strong>
                    </p>
                  </div>

                  <CustomOtpField name="code" control={otpForm.control} />
                  <Button className="mt-5" isLoading={false}>
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </AnimatePresence>
      )}
      {step === "new-password" && (
        <AnimatePresence>
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
          >
            <Form {...newPasswordForm}>
              <form
                onSubmit={newPasswordForm.handleSubmit(
                  (data: NewPasswordForm) => {
                    const { password, confirmPassword } = data;
                    // Simulate resetting the password
                    console.log(
                      "Resetting password to:",
                      password,
                      confirmPassword,
                    );
                    setFormStep("completed");
                  },
                )}
                className="flex flex-col gap-4"
              >
                <div className="bg-accent mx-auto mb-4 size-fit flex-1 rounded-full p-4">
                  <SmartphoneIcon />
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="text-center text-xl font-semibold sm:text-2xl">
                    Set new Password
                  </h2>
                  <p className="text-center text-sm sm:text-base">
                    Password must be at least 8 characters
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <CustomInputField
                    name="password"
                    label="password"
                    placeholder="x x x x x x x x"
                    description="Enter your new password"
                    control={newPasswordForm.control}
                    isPasswordVisible={isPasswordVisible}
                    setIsPasswordVisible={setIsPasswordVisible}
                  />

                  <CustomInputField
                    name="confirmPassword"
                    label="Confirm password"
                    placeholder="x x x x x x x x"
                    description="Confirm new password"
                    control={newPasswordForm.control}
                    isPasswordVisible={isConfirmPasswordVisible}
                    setIsPasswordVisible={setIsConfirmPasswordVisible}
                  />

                  <Button className="mt-5" isLoading={false}>
                    Reset Password
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </AnimatePresence>
      )}

      {step === "completed" && (
        <AnimatePresence>
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
          >
            <div className="">
              <div className="bg-accent mx-auto mb-4 size-fit flex-1 rounded-full p-4">
                <LockKeyholeOpen className="" />
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-center text-xl font-semibold sm:text-2xl">
                  All done!
                </h2>
                <p className="text-center text-sm sm:text-base">
                  Your Password has been reset.
                </p>

                <Button asChild>
                  <Link href="/dashboard">Back to dashboard</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="align-center flex w-full justify-center gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "bg-primary-foreground h-[4px] w-[15%] rounded-full p-1 transition-colors duration-500",
              {
                "bg-primary": step === bodyCollection[index],
              },
            )}
          ></span>
        ))}
      </div>
    </div>
  );
}

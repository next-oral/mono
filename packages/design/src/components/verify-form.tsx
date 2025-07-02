import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/design/components/ui/input-otp";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const REGEX_DIGITS = "^\\d+$";

export const verifyOtpSchema = z
  .object({
    otp: z.string().min(6, {
      message: "6 Digits required",
    }),
  })
  .refine(
    (data) => {
      const otpNumber = Number(data.otp);
      return !isNaN(otpNumber) && Number.isInteger(otpNumber);
    },
    {
      message: "OTP must be a valid number",
      path: ["otp"],
    },
  );

type VerfiyForm = z.infer<typeof verifyOtpSchema>;

export function VerifyForm({
  email,
  isPending: isLoading = false,
  handleSubmit,
}: {
  email?: string;
  isPending?: boolean;
  handleSubmit: SubmitHandler<VerfiyForm>;
}) {
  const form = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-100">
          <Mail className="text-red-500" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-red-700">
          Invalid Email
        </h2>
        <p className="mb-4 max-w-xs text-center text-gray-600">
          The email address provided is invalid or missing. Please check the
          link you used or try again from the beginning.
        </p>
      </div>
    );
  }
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-neutral-100">
          <Mail />
        </div>
        <h2 className="text-center text-xl font-semibold text-gray-900">
          Check your email
        </h2>
        <p className="mt-2 mb-8 text-center text-gray-600">
          We sent an email to
          <span className="font-medium">{` ${email}`}</span>
        </p>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  pattern={REGEX_DIGITS}
                  autoComplete="one-time-code"
                  {...field}
                >
                  <InputOTPGroup className="w-full justify-center">
                    <InputOTPSlot className="h-10 w-13.25" index={0} />
                    <InputOTPSlot className="h-10 w-13.25" index={1} />
                    <InputOTPSlot className="h-10 w-13.25" index={2} />
                    <InputOTPSlot className="h-10 w-13.25" index={3} />
                    <InputOTPSlot className="h-10 w-13.25" index={4} />
                    <InputOTPSlot className="h-10 w-13.25" index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />

              
            </FormItem>
          )}
        />
        <Button isLoading={isLoading}>Continue</Button>
      </form>
    </Form>
  );
}

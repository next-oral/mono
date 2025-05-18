import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@repo/design/components/ui/input-otp"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";

const REGEX_DIGITS = "^\\d+$";

export const verifyOtpSchema = z.object({
    otp: z.string().min(6, {
        message: "6 Digits required"
    })
}).refine(
    data => {
        const otpNumber = Number(data.otp);
        return !isNaN(otpNumber) && Number.isInteger(otpNumber);
    },
    {
        message: "OTP must be a valid number",
        path: ["otp"],
    }
)

type VerfiyForm = z.infer<typeof verifyOtpSchema>

export function VerifyForm({ email,  isPending: isLoading = false, handleSubmit }: { email?:string; isPending?: boolean, handleSubmit: SubmitHandler<VerfiyForm> }) {
    const form = useForm({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            otp: "",
        }
    })

    if (!email) {
        return (
            <div className="flex flex-col items-center justify-center py-4">
                <div className="flex items-center justify-center rounded-full bg-red-100 mb-4 size-14">
                    <Mail className="text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-red-700 mb-2">Invalid Email</h2>
                <p className="text-gray-600 text-center mb-4 max-w-xs">
                    The email address provided is invalid or missing. Please check the link you used or try again from the beginning.
                </p>
            </div>
        );
    }
    return (
        <Form {...form}>
            <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-neutral-100">
                    <Mail />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 text-center">Check your email</h2>
                <p className="mt-2 text-gray-600 mb-8 text-center">
                    We sent an email to 
                    <span className="font-medium ">{email}</span>.
                </p>
                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter Code</FormLabel>
                            <InputOTP
                                maxLength={6}
                                pattern={REGEX_DIGITS}
                                autoComplete="one-time-code"
                                {...field}
                            >
                                <InputOTPGroup className="w-full justify-center">
                                    <InputOTPSlot className="w-13.25 h-10" index={0} />
                                    <InputOTPSlot className="w-13.25 h-10" index={1} />
                                    <InputOTPSlot className="w-13.25 h-10" index={2} />
                                    <InputOTPSlot className="w-13.25 h-10" index={3} />
                                    <InputOTPSlot className="w-13.25 h-10" index={4} />
                                    <InputOTPSlot className="w-13.25 h-10" index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button isLoading={isLoading}>Continue</Button>
            </form>
        </Form>
    )
}

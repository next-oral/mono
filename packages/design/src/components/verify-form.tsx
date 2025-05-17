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

export function VerifyForm({ isPending: isLoading = false, handleSubmit }: { isPending?: boolean, handleSubmit: SubmitHandler<VerfiyForm> }) {
    const form = useForm({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            otp: "",
        }
    })
    return (
        <Form {...form}>
            <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
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
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button isLoading={isLoading} >Submit</Button>
            </form>
        </Form>
    )
}

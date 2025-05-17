"use client"

import { VerifyForm } from "@repo/design/components/verify-form"
import { useSearchParams } from "next/navigation"
import { authClient } from "~/auth/client"

import { toast } from "@repo/design/src/components/ui/sonner"
import { z, ZodError } from "zod"
import { useState } from "react"

import { AnimatePresence, motion } from "motion/react"

const emailSchema = z.string().email()

export default function VerifyPage() {
    const [isPending, setIsPending] = useState(false);

    const search = useSearchParams()


    const handleSubmit = async ({ otp }: { otp: string }) => {
        try {
            setIsPending(true)
            const email = emailSchema.parse(search.get("email"))
            await authClient.signIn.emailOtp({
                email,
                otp,
            }, {
                onError: (a) => { toast.error(a.error.message) }
            })

        } catch (err) {
            console.log(err)
            if (err instanceof ZodError) {
                const { fieldErrors, formErrors } = err.flatten();
                const firstFieldError = Object.values(fieldErrors)[0]?.[0];
                toast.error(firstFieldError ?? formErrors[0] ?? "Invalid input");
            }
        }
        finally {
            setIsPending(false);
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 100, 
                    damping: 20,
                }}
            >
                <VerifyForm isPending={isPending} handleSubmit={handleSubmit} />
            </motion.div>
        </AnimatePresence>
    )
}

"use client"

import { VerifyForm } from "@repo/design/components/verify-form"
import { useSearchParams } from "next/navigation"
import { authClient } from "~/auth/client"

import { toast } from "@repo/design/src/components/ui/sonner"
import { Suspense, useState } from "react"
import { z, ZodError } from "zod"

import { Button } from "@repo/design/src/components/ui/button"
import { Mail } from "@repo/design/src/icons"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"

const emailSchema = z.string().email()

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>loading</div>}>
            <Wrapper />
        </Suspense>
    )
}


// This is because useSearchParams has to be wrapped in suspense
const Wrapper = () => {
    const search = useSearchParams()
    const [isPending, setIsPending] = useState(false);

    const { data: email, error } = emailSchema.safeParse(search.get("email"))

    const handleSubmit = async ({ otp }: { otp: string }) => {
        try {
            setIsPending(true)
            if (!email)
                throw new Error(JSON.stringify(error));
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
                <VerifyForm email={email} isPending={isPending} handleSubmit={handleSubmit} />
                {email ?
                    (<Button variant="link" asChild className="text-center my-2 w-full">
                        <Link href="/login">
                            ← Go back to signup
                        </Link>
                    </Button>)

                    : (<Button variant="destructive" className="w-full" asChild>
                        <Link href="/login">
                            ← Go Back
                        </Link>
                    </Button>)
                }
            </motion.div>
        </AnimatePresence>
    )
}


export function CheckEmail() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center max-w-sm w-full">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6EBF1]">
                    {/* Envelope Icon (you can replace with your SVG or Heroicon) */}
                    <Mail />
                </div>

                <h2 className="text-xl font-semibold text-gray-900">Check your email</h2>
                <p className="mt-2 text-gray-600">
                    We sent an email to <span className="font-medium">derekmatt@gmail.com</span>.
                    It has a link that will sign you up.
                </p>

                <div className="my-6 flex items-center text-gray-400">
                    <hr className="flex-1 border-t border-gray-300" />
                    <span className="px-2 text-sm">OR</span>
                    <hr className="flex-1 border-t border-gray-300" />
                </div>

                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Enter manually
                    </label>
                    <input
                        type="text"
                        id="code"
                        placeholder="Enter code"
                        className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition">
                        Continue with code
                    </button>
                </div>

                <button className="mt-6 text-sm text-blue-600 hover:underline" onClick={() => window.history.back()}>
                    ← Go back to signup
                </button>
            </div>
        </div>
    );
}

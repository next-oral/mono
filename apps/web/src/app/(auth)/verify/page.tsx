"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { z, ZodError } from "zod";

import { VerifyForm } from "@repo/design/components/verify-form";
import { Button } from "@repo/design/src/components/ui/button";
import { toast } from "@repo/design/src/components/ui/sonner";
import { Mail } from "@repo/design/src/icons";

import { authClient } from "~/auth/client";

const emailSchema = z.string().email();

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>loading</div>}>
      <Wrapper />
    </Suspense>
  );
}

// This is because useSearchParams has to be wrapped in suspense
const Wrapper = () => {
  const search = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  const { data: email, error } = emailSchema.safeParse(search.get("email"));

  const handleSubmit = async ({ otp }: { otp: string }) => {
    try {
      setIsPending(true);
      if (!email) throw new Error(JSON.stringify(error));
      await authClient.signIn.emailOtp(
        {
          email,
          otp,
        },
        {
          onError: (a) => {
            toast.error(a.error.message);
          },
        },
      );
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        const { fieldErrors, formErrors } = err.flatten();
        const firstFieldError = Object.values(fieldErrors)[0]?.[0];
        toast.error(firstFieldError ?? formErrors[0] ?? "Invalid input");
      }
    } finally {
      setIsPending(false);
    }
  };

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
        <VerifyForm
          email={email}
          isPending={isPending}
          handleSubmit={handleSubmit}
        />
        {email ? (
          <Button variant="link" asChild className="my-2 w-full text-center">
            <Link href="/login">← Go back to signup</Link>
          </Button>
        ) : (
          <Button variant="destructive" className="w-full" asChild>
            <Link href="/login">← Go Back</Link>
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

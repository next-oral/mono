"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { LoginForm } from "@repo/design/components/login-form";

import { authClient } from "~/auth/client";

export default function LoginPage() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [provider, setProvider] = useState<"google" | "microsoft" | null>(null);

  const handleSubmit = async ({ email }: { email: string }) => {
    try {
      setIsPending(true);
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      if (error) throw new Error(error.message);
      return router.push(`/verify?email=${email}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "microsoft") => {
    try {
      setIsPending(true);
      setProvider(provider);
      await authClient.signIn.social(
        {
          callbackURL: "/verify",
          provider,
        },
        {
          onError: (error) => console.log(error),
        },
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsPending(false);
      setProvider(null);
    }
  };
  return (
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
        login
        <LoginForm
          provider={provider}
          isPending={isPending}
          handleSubmit={handleSubmit}
          handleOAuthSignUp={handleOAuthSignUp}
        />
      </motion.div>
    </AnimatePresence>
  );
}

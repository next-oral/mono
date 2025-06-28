"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import { LoginForm } from "@repo/design/components/login-form";

import { authClient } from "~/auth/client";

export default function LoginPage() {
  const router = useRouter();

  const [provider, setProvider] = useState<"google" | "microsoft" | null>(null);

  const { mutateAsync: sendVerificationOtp, isPending: isVerificationPending } =
    useMutation({
      mutationFn: async ({ email }: { email: string }) => {
        const { error, data } = await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
        });
        if (error) throw new Error(error.message);
        return data;
      },
      onSuccess: (_, { email }) => {
        router.push(`/verify?email=${email}`);
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const { mutateAsync: OAuthSignUp, isPending: isOAuthPending } = useMutation({
    mutationFn: async ({ provider }: { provider: "google" | "microsoft" }) => {
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
    },
    onSettled: () => setProvider(null),
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async ({ email }: { email: string }) =>
    await sendVerificationOtp({ email });

  const handleOAuthSignUp = async (provider: "google" | "microsoft") =>
    await OAuthSignUp({ provider });

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
        <LoginForm
          provider={provider}
          isPending={isOAuthPending || isVerificationPending}
          handleSubmit={handleSubmit}
          handleOAuthSignUp={handleOAuthSignUp}
        />
      </motion.div>
    </AnimatePresence>
  );
}

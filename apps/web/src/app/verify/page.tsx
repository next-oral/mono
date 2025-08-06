"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { z, ZodError } from "zod";

import { VerifyForm } from "@repo/design/components/verify-form";
import { Button } from "@repo/design/src/components/ui/button";
import { toast } from "@repo/design/src/components/ui/sonner";

import { authClient } from "~/auth/client";
import { env } from "~/env";

const emailSchema = z.email();

const Loading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <span className="loader" />
    </div>
  );
};
export default function VerifyPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const { data: session } = authClient.useSession();

  const { data: organizations, isPending: isOrganizationsPending } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      return authClient.organization.list();
    },
  });

  if (isOrganizationsPending) return <Loading />;

  if (organizations?.data?.length) {
    const org = organizations.data[0];
    if (!org) return void router.replace("/onboarding");

    void authClient.organization.setActive({
      organizationId: org.id,
    });
    return void router.replace(
      `${env.NEXT_PUBLIC_PROTOCOL}://${org.slug}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    );
  }

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
          onSuccess: () => router.replace("/onboarding"),
          onError: (a) => {
            toast.error(a.error.message);
          },
        },
      );
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        const { errors } = z.treeifyError(err);
        toast.error(errors.join("\n"));
      }
    } finally {
      setIsPending(false);
    }
  };

  if (session?.user.emailVerified) {
    return void router.replace("/onboarding");
  }

  return (
    <div className="grid min-h-svh overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md"></div>
            Next Oral Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
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
                  <Button
                    variant="link"
                    asChild
                    className="my-2 w-full text-center"
                  >
                    <Link href="/login">← Go back to signup</Link>
                  </Button>
                ) : (
                  <Button variant="destructive" className="w-full" asChild>
                    <Link href="/login">← Go Back</Link>
                  </Button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

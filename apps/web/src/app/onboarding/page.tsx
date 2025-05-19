"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import type { OnboardingStep } from "@repo/design/src/components/onboarding/schema";
import { Avatar, AvatarFallback } from "@repo/design/components/ui/avatar";
import { Button } from "@repo/design/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu";
import { ChevronDownIcon, LogOutIcon } from "@repo/design/icons";
import { Onboarding } from "@repo/design/src/components/onboarding";

import { authClient } from "~/auth/client";
import { GettingStarted } from "./getting-started";
import { WelcomePage } from "./welcome-page";

const Page = () => {
  const router = useRouter();
  const { data, error } = authClient.useSession();
  const [step, setStep] = useState<OnboardingStep>("clinic");

  const session = authClient.useSession();

  const handleInvaildSession = useCallback(async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }, [router]);

  if (error) void handleInvaildSession();

  if (!data) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-white to-blue-50">
      <div className="absolute right-0 z-9999 flex w-full items-center justify-center p-2">
        <div className="mx-auto"></div>
        <UserAvatar email={data.user.email} onClick={handleInvaildSession} />
      </div>
      <AnimatePresence mode="wait">
        {step === "welcome" ? (
          <WelcomePage onClick={() => setStep("started")} />
        ) : step === "started" ? (
          <GettingStarted
            onAbort={() => setStep("welcome")}
            onProceed={() => setStep("profile")}
          />
        ) : (
          <motion.div
            key="organization"
            className="absolute flex h-screen w-full items-center justify-center"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
          >
            {step === "profile" ? (
              <Onboarding
                data={{ step, email: session.data?.user.email ?? "" }}
                title="Your profile"
                subtitle="nice things here"
                onClick={() => setStep("organization")}
              />
            ) : step === "organization" ? (
              <Onboarding
                data={{ step }}
                title="Type of Organization"
                subtitle="Select the category of clinic or organization you are operating."
                onClick={() => setStep("clinic")}
              />
            ) : step === "clinic" ? (
              <Onboarding
                data={{ step }}
                title="Setup clinics"
                subtitle="Add the details of the clinics you want to add."
                onClick={() => setStep("invite")}
              />
            ) : (
              <Onboarding
                data={{ step }}
                title="Invite teammates"
                subtitle="NextOral makes it seamless to work with your teammates in one place. "
                onClick={() => null}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;

export function UserAvatar({
  email,
  onClick,
}: {
  email: string;
  onClick: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarFallback className="capitalize">
              {email.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onClick}
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

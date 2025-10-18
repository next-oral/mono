"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useQueryState } from "nuqs";

import type { OnboardingStep } from "@repo/design/src/components/onboarding/schema";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/components/ui/avatar";
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
import { toast } from "@repo/design/src/components/ui/sonner";
import { INVALID_SLUGS_REGEX } from "@repo/validators";

import { authClient } from "~/auth/client";
import { env } from "~/env";
import { slugify } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import Loading from "../s/[subdomain]/loading";
import { GettingStarted } from "./getting-started";
import { WelcomePage } from "./welcome-page";

const Page = () => {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const { data: session, error } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [step, setStep] = useState<OnboardingStep>("welcome");

  const [slug, setQuerySlug] = useQueryState("id");

  const { data: organizations, isPending: isOrganizationsPending } =
    authClient.useListOrganizations();
  // authClient.admin.

  console.log("", organizations);

  const handleInvalidSession = useCallback(async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }, [router]);

  const trpc = useTRPC();
  const createDomainOptions = trpc.domain.create.mutationOptions();
  const createDomain = useMutation(createDomainOptions);

  const checkSlug = async (slug: string) => {
    const slugString = slugify(slug);

    if (INVALID_SLUGS_REGEX.test(slugString)) return false;
    const res = await authClient.organization.checkSlug({
      slug: slugString,
    });
    return !!res.data?.status;
  };
  if (error) void handleInvalidSession();

  if (!session) return null;

  if (activeOrg) {
    router.push(
      `${env.NEXT_PUBLIC_PROTOCOL}://${activeOrg.slug}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    );
  }

  if (organizations && organizations.length > 0) {
    const org = organizations[0];
    if (!org) return;

    void authClient.organization.setActive({
      organizationId: org.id,
    });

    router.push(
      `${env.NEXT_PUBLIC_PROTOCOL}://${org.slug}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    );
  }

  if (isOrganizationsPending) return <Loading />;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-white to-blue-50">
      <div className="absolute right-0 z-800 flex w-full items-center justify-center p-2">
        <div className="mx-auto"></div>

        <UserAvatar
          email={session.user.email}
          name={session.user.name}
          image={session.user.image ?? ""}
          onClick={handleInvalidSession}
        />
      </div>
      <AnimatePresence mode={step === "clinic" ? "wait" : "popLayout"}>
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
                step="profile"
                isPending={isPending}
                title="Your profile"
                subtitle="nice things here"
                email={session.user.email}
                name={session.user.name}
                onClick={async (values) => {
                  setIsPending(true);
                  console.log(values);

                  await authClient.updateUser({
                    name: `${values.firstName} ${values.lastName}`,
                    position: values.position,
                    locale: values.locale,
                  });

                  setIsPending(false);
                  setStep("organization");
                }}
              />
            ) : step === "organization" ? (
              <Onboarding
                step="organization"
                checkSlug={checkSlug}
                isPending={isPending}
                title="Type of Organization"
                subtitle="Select the category of clinic or organization you are operating."
                onClick={async (values) => {
                  setIsPending(true);
                  console.log(values);

                  const res = await authClient.organization.create(
                    {
                      name: values.name,
                      slug: slugify(values.name),
                    },
                    {
                      onError: ({ error }) => {
                        console.log(error);
                        setIsPending(false);

                        toast.error(
                          error.message.length
                            ? error.message
                            : "Something went wrong",
                        );
                      },
                    },
                  );
                  if (res.error) return;
                  await setQuerySlug(res.data.slug);
                  // Create a domain with that org
                  try {
                    await createDomain.mutateAsync({
                      subdomain: res.data.slug,
                    });
                    setStep("clinic");
                  } catch (error) {
                    toast.error("Error creating domain");
                    console.log(error);
                  } finally {
                    setIsPending(false);
                  }
                }}
              />
            ) : step === "clinic" ? (
              <Onboarding
                step="clinic"
                title="Setup clinics"
                isPending={isPending}
                subtitle="Add the details of the clinics you want to add."
                onClick={async (values) => {
                  setIsPending(true);
                  console.log(values);

                  await new Promise((resolve) => setTimeout(resolve, 1000));

                  const clinics = values.clinics.map((clinic) =>
                    authClient.organization.createTeam({
                      organizationId: values.orgId,
                      name: clinic.name,
                    }),
                  );
                  await Promise.allSettled(clinics);
                  setIsPending(false);
                  setStep("invite");
                }}
              />
            ) : (
              <Onboarding
                step="invite"
                title="Invite teammates"
                isPending={isPending}
                subtitle="NextOral makes it seamless to work with your teammates in one place."
                onClick={async (values) => {
                  setIsPending(true);
                  const emailInvites = values.emails.map((email) =>
                    authClient.organization.inviteMember({
                      email,
                      role: "member",
                    }),
                  );
                  await Promise.allSettled(emailInvites);
                  setIsPending(false);
                  // router.push("/dashboard");

                  router.push(
                    `${env.NEXT_PUBLIC_PROTOCOL}://${slug}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
                  );
                }}
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
  name,
  email,
  image,
  onClick,
}: {
  image: string;
  name?: string;
  email: string;
  onClick: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="@shadcn" />
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
          <span className="text-foreground truncate text-sm font-medium">
            {name}
          </span>
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

"use client";

import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";

import { cn } from "@repo/design/lib/utils";

import type { InviteForm } from "./invite";
import type {
  ClinicForm,
  OnboardingStep,
  OrganizationProps,
  OrgForm,
  ProfileForm,
} from "./schema";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Clinic } from "./clinic";
import { Invite, inviteSchema } from "./invite";
import { Organization } from "./organization";
import { Profile } from "./profile";
import { clinicSchema, orgFormSchema, profileFormSchema } from "./schema";

export function Onboarding<T extends OnboardingStep>(
  props: OrganizationProps<T>,
) {
  const [firstName, lastName] = "name" in props ? props.name.split(" ") : [];
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      locale: "en-US",
      email: props.step === "profile" ? props.email : "",
    },
  });

  const orgForm = useForm({
    resolver: zodResolver(orgFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const clinicForm = useForm({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      orgId: "",
      clinics: [
        {
          name: "",
        },
      ],
    },
  });
  const inviteForm = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      emails: [],
    },
  });

  const submitProfile: SubmitHandler<ProfileForm> = async (data) => {
    console.log("Profile form:", data);

    if (props.step === "profile") await props.onClick(data);
  };

  const submitOrg: SubmitHandler<OrgForm> = async (data) => {
    console.log("Organization form:", data);
    if (props.step === "organization") await props.onClick(data);
  };

  const submitClinics: SubmitHandler<ClinicForm> = async (data) => {
    console.log("Clinic form:", data);
    if (props.step === "clinic") await props.onClick(data);
  };

  const submitInvites: SubmitHandler<InviteForm> = async ({ emails }) => {
    console.log("Invite form", emails);
    if (props.step === "invite") await props.onClick({ emails });
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="flex h-full items-center justify-center">
        <Card className="container h-1/2 w-7xl max-w-4xl flex-1 flex-row gap-0 overflow-hidden p-0 shadow-none">
          <div className="relative flex-2 bg-radial-[at_95%_75%] from-sky-100 via-sky-200 to-sky-200 px-8 py-4">
            <CardTitle className="text-2xl">
              <motion.h3
                key={props.step}
                className="font-medium text-blue-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {props.title}
              </motion.h3>
            </CardTitle>
            <CardDescription>
              <motion.p
                key={props.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {props.subtitle}
              </motion.p>
            </CardDescription>

            <div className="mt-64 flex justify-between">
              {props.step === "invite" && <Button variant="link">Skip</Button>}
              <Button
                isLoading={props.isPending}
                type="button"
                className={cn({
                  "mt-auto h-11 w-full": props.step !== "invite",
                })}
                disabled={
                  props.step === "organization" && !orgForm.formState.isValid
                }
                onClick={async () => {
                  if (props.step === "profile")
                    await profileForm.handleSubmit(submitProfile)();
                  else if (props.step === "organization")
                    await orgForm.handleSubmit(submitOrg)();
                  else if (props.step === "invite")
                    await inviteForm.handleSubmit(submitInvites)();
                  else await clinicForm.handleSubmit(submitClinics)();
                }}
              >
                {props.step === "invite" ? "Continue" : "Proceed"}
              </Button>
            </div>
          </div>
          <CardContent className="flex flex-3 items-center justify-center overflow-y-auto">
            {props.step === "profile" ? (
              <Profile form={profileForm} handleSubmit={submitProfile} />
            ) : props.step === "organization" ? (
              <Organization form={orgForm} checkSlug={props.checkSlug} />
            ) : props.step === "clinic" ? (
              <Clinic form={clinicForm} />
            ) : (
              // @ts-expect-error asdfs
              <Invite form={inviteForm} onTypeChange={() => null} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

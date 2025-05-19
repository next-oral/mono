"use client";

import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";

import { cn } from "@repo/design/lib/utils";

import type { OnboardingData, OrgForm, ProfileForm } from "./schema";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Clinic } from "./clinic";
import { Invite } from "./invite";
import { Organization } from "./organization";
import { Profile } from "./profile";
import { clinicSchema, orgFormSchema, profileFormSchema } from "./schema";

export const Onboarding = ({
  title,
  subtitle,
  onClick,
  data,
}: {
  data: OnboardingData;
  title: string;
  subtitle: string;
  onClick: () => void;
}) => {
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      locale: "en-US",
      email: data.step === "profile" ? data.email : "",
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

  const submitProfile: SubmitHandler<ProfileForm> = (data) => {
    console.log("Profile form:", data);
    onClick();
  };

  const submitOrg: SubmitHandler<OrgForm> = (data) => {
    console.log("Organization form:", data);
    onClick();
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="flex h-full items-center justify-center">
        <Card className="container h-1/2 w-7xl max-w-4xl flex-1 flex-row gap-0 overflow-hidden p-0 shadow-none">
          <div className="relative flex-2 bg-radial-[at_95%_75%] from-sky-100 via-sky-200 to-sky-200 px-8 py-4">
            <CardTitle className="text-2xl">
              <motion.h3
                key={data.step}
                className="font-medium text-blue-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {title}
              </motion.h3>
            </CardTitle>
            <CardDescription>
              <motion.p
                key={data.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            </CardDescription>

            <div className="mt-64 flex justify-between">
              {data.step === "invite" && <Button variant="link">Skip</Button>}
              <Button
                type="button"
                className={cn({
                  "mt-auto h-11 w-full": data.step !== "invite",
                })}
                disabled={
                  data.step === "organization" && !orgForm.formState.isValid
                }
                onClick={async () => {
                  if (data.step === "profile")
                    await profileForm.handleSubmit(submitProfile)();
                  else if (data.step === "organization")
                    await orgForm.handleSubmit(submitOrg)();
                  else onClick();
                }}
              >
                {data.step === "invite" ? "Continue" : "Proceed"}
              </Button>
            </div>
          </div>
          <CardContent className="flex flex-3 items-center justify-center overflow-y-auto">
            {data.step === "profile" ? (
              <Profile form={profileForm} handleSubmit={submitProfile} />
            ) : data.step === "organization" ? (
              <Organization form={orgForm} />
            ) : data.step === "clinic" ? (
              <Clinic form={clinicForm} />
            ) : data.step === "invite" ? (
              <Invite type={"email"} onTypeChange={() => null} />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

"use client";

import { useCallback, useState } from "react";
import { useZero } from "@rocicorp/zero/react";
import { useForm } from "@tanstack/react-form";
import { motion } from "motion/react";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import * as z from "zod";

import type { Schema } from "@repo/zero/src/schema";
import { AnimatedButtonItem } from "@repo/design/components/chart/header";
import { Button } from "@repo/design/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import {
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
} from "@repo/design/components/ui/data-list";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@repo/design/components/ui/field";
import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/design/components/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/design/components/ui/resizable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design/components/ui/tabs";
import { HugeIcons, SearchIcon, XIcon } from "@repo/design/icons";

import { cn } from "~/lib/utils";
import { useZeroQuery } from "~/providers/zero";
import { DentalChart, DentalChartConfigurator } from "./dental-chart";

const items = ["All", "In progress", "Completed"] as const;

export default function ChartPage() {
  const z = useZero<Schema>();

  const [active, setActive] = useState("All");
  const { data } = useZeroQuery(z.query.patient);

  const [patients, setPatients] = useState(data.slice(0, 3));

  const [patientId, setPatientId] = useQueryState(
    "patientId",
    parseAsString
      .withDefault(patients[0]?.id ?? "")
      .withOptions({ shallow: true }),
  );

  const removePatientTab = useCallback(
    (id: string) => {
      const index = patients.findIndex((patient) => patient.id === id);
      if (index !== -1) {
        if (patientId === id) {
          const nextPatient =
            patients[index + 1]?.id ?? patients[index - 1]?.id;

          void setPatientId(nextPatient ?? null);
        }
        setPatients(patients.filter((patient) => patient.id !== id));
      } else {
        void setPatientId(null);
      }
    },
    [patients, patientId],
  );

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={75}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            <div className="h-full w-full flex-2">
              <div className="h-full">
                <Tabs
                  value={patientId}
                  className="bg-muted h-full w-full gap-0"
                >
                  <div className="border-b-primary/20 relative z-0 flex grid h-10 grid-cols-5 items-end border-b-1">
                    <TabsList
                      className={cn(
                        "relative col-span-3 w-full max-w-xl justify-start overflow-x-auto rounded-none px-0 py-0 [&>*:first-child[data-state=active]]:rounded-tl-none [&>*:first-child[data-state=active]]:border-l-0",
                        {
                          "border-b-1": patients.length === 0,
                        },
                      )}
                    >
                      {patients.map((patient) => (
                        <TabsTrigger
                          key={patient.id}
                          value={patient.id}
                          onClick={() => setPatientId(patient.id)}
                          className="group/patient-tab border-primary data-[state=active]:border-primary/20 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border-primary/20 max-w-fit rounded-none rounded-t-md pb-0 text-sm data-[state=active]:border-b-0 data-[state=active]:bg-slate-50 data-[state=active]:shadow-none data-[state=active]:before:absolute data-[state=inactive]:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-slate-900" />
                            {patient.firstName} {patient.lastName}
                          </div>

                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="group/delete-patient hover:text-destructive hover:bg-destructive w-fit p-0 transition-all duration-200 hover:bg-transparent"
                            tabIndex={-1}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removePatientTab(patient.id);
                            }}
                          >
                            <span className="relative flex">
                              <XIcon className="size-3 transition-colors duration-200" />
                            </span>
                          </Button>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <div className="col-span-2 flex items-center justify-end gap-1 rounded-tl-lg bg-white">
                      <Button variant="ghost" size="icon" className="ml-a">
                        <SearchIcon className="size-4" />
                      </Button>
                      <div className="mr-1 h-4 w-px bg-slate-200" />
                      <motion.ul
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-2"
                      >
                        {items.map((label) => (
                          <AnimatedButtonItem
                            key={label}
                            label={label}
                            active={active === label}
                            onClick={() => setActive(label)}
                          />
                        ))}
                      </motion.ul>
                      <div className="ml-1 h-4 w-px bg-slate-200" />

                      <Button variant="outline" size="icon" className="mr-2">
                        <HugeIcons.Printer className="size-4" />
                      </Button>
                    </div>
                  </div>
                  {patients.slice(0, 10).map((patient) => (
                    <TabsContent
                      key={patient.id}
                      value={patient.id}
                      className="h-full bg-slate-50 p-0"
                    >
                      <DentalChart patient={patient} />
                    </TabsContent>
                  ))}
                </Tabs>

                {patients.length === 0 && (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      No patients found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <div className="flex h-full justify-between">
              <Tabs
                defaultValue="patient-info"
                className="w-full flex-1 gap-0 space-y-2 p-2 pt-4"
              >
                <div className="item-center flex w-full justify-between bg-white">
                  <TabsList className="gap-0">
                    <TabsTrigger
                      value="patient-info"
                      className="bg-muted w-full gap-0"
                    >
                      Patient Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="patient-notes"
                      className="bg-muted w-full gap-0"
                    >
                      Patient Notes
                    </TabsTrigger>
                  </TabsList>
                  <Button className="ml-auto">New note</Button>
                </div>
                <TabsContent value="patient-info">
                  {/* Botton Patient Info */}
                  <Card className="mb-0 h-full rounded-lg bg-slate-50 shadow-none">
                    <CardHeader>
                      <CardTitle className="sr-only">Patient Info</CardTitle>
                      <CardDescription>Patient information</CardDescription>
                    </CardHeader>
                    <CardContent className="h-full">
                      <DataList
                        orientation="vertical"
                        className="grid w-full grid-cols-3"
                      >
                        <DataListItem>
                          <DataListLabel>First name</DataListLabel>
                          <DataListValue>John</DataListValue>
                        </DataListItem>
                        <DataListItem>
                          <DataListLabel>Last name</DataListLabel>
                          <DataListValue>Doe</DataListValue>
                        </DataListItem>
                        <DataListItem>
                          <DataListLabel>Phone</DataListLabel>
                          <DataListValue>Doe</DataListValue>
                        </DataListItem>
                        <DataListItem>
                          <DataListLabel>Gender</DataListLabel>
                          <DataListValue>Doe</DataListValue>
                        </DataListItem>

                        <DataListItem>
                          <DataListLabel>Date of Birth</DataListLabel>
                          <DataListValue>1990-01-01</DataListValue>
                        </DataListItem>
                        <DataListItem>
                          <DataListLabel>Address</DataListLabel>
                          <DataListValue>
                            123 Main St, Anytown, USA
                          </DataListValue>
                        </DataListItem>
                      </DataList>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="patient-notes">
                  {/* Botton Patient Info */}
                  <Card className="mb-0 rounded-lg bg-slate-50 shadow-none">
                    <CardHeader>
                      <CardTitle className="sr-only">Patient Notes</CardTitle>
                      <CardDescription>Patient notes</CardDescription>
                    </CardHeader>
                    <CardContent className="">{/* Notes table */}</CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25}>
        <div className="h-[calc(100vh-56px)]">
          <DentalChartConfigurator />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

const plans = [
  {
    id: "starter",
    title: "Starter (100K tokens/month)",
    description: "For everyday use with basic features.",
  },
  {
    id: "pro",
    title: "Pro (1M tokens/month)",
    description: "For advanced AI usage with more features.",
  },
  {
    id: "enterprise",
    title: "Enterprise (Unlimited tokens)",
    description: "For large teams and heavy usage.",
  },
] as const;

const formSchema = z.object({
  plan: z.string().min(1, "You must select a subscription plan to continue."),
});

export function FormTanstackRadioGroup() {
  const form = useForm({
    defaultValues: {
      plan: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          See pricing and features for each plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-tanstack-radiogroup"
          onSubmit={async (e) => {
            e.preventDefault();
            await form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="plan"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldSet>
                    <FieldLegend>Plan</FieldLegend>
                    <FieldDescription>
                      You can upgrade or downgrade your plan at any time.
                    </FieldDescription>
                    <RadioGroup
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      {plans.map((plan) => (
                        <FieldLabel
                          key={plan.id}
                          htmlFor={`form-tanstack-radiogroup-${plan.id}`}
                        >
                          <Field
                            orientation="horizontal"
                            data-invalid={isInvalid}
                          >
                            <FieldContent>
                              <FieldTitle>{plan.title}</FieldTitle>
                              <FieldDescription>
                                {plan.description}
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              value={plan.id}
                              id={`form-tanstack-radiogroup-${plan.id}`}
                              aria-invalid={isInvalid}
                            />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldSet>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-tanstack-radiogroup">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

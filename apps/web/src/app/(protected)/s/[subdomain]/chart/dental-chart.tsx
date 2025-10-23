import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import type { Patient } from "@repo/zero/src/schema";
import { Button } from "@repo/design/components/ui/button";
import { Calendar } from "@repo/design/components/ui/calendar";
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
import { Label } from "@repo/design/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/design/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsFooter,
  TabsList,
  TabsTrigger,
} from "@repo/design/components/ui/tabs";
import { Separator } from "@repo/design/src/components/ui/separator";

import { cn } from "~/lib/utils";

type Position = "top" | "bottom";
type Orientation = "left" | "right";

type ChartPlacement = `${Position}-${Orientation}`;

export function DentalChart({ patient }: { patient: Patient }) {
  return (
    <div className="flex h-full w-full flex-col p-2">
      <div className="grid-row-2 grid h-full w-full grid-cols-2 bg-slate-50">
        <ChartSection placement="top-left" />
        <ChartSection placement="top-right" />
      </div>
      <div className="grid-row-2 grid h-full w-full grid-cols-2 bg-slate-50">
        <ChartSection placement="bottom-left" />
        <ChartSection placement="bottom-right" />
      </div>
    </div>
  );
}

function ChartSection({ placement }: { placement: ChartPlacement }) {
  return (
    <div
      id={placement}
      data-placement={placement}
      className={cn("grid grid-cols-8 grid-rows-3 **:text-center", {
        "border-b": placement.includes("top"),
        "border-r": placement.includes("left"),
      })}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8].map((num, colIdx) =>
        [0, 1, 2].map((rowIdx) => {
          const showMidRow = placement.includes("left")
            ? colIdx < 5
            : colIdx > 2;
          return (
            <div
              key={`${num}-${rowIdx}`}
              className="col-span-1 row-span-1 flex items-center justify-center"
              style={{
                gridColumn: colIdx + 1,
                gridRow: rowIdx + 1,
              }}
            >
              <div
                className={cn(
                  "aspect-square h-6 w-6 rounded border border-gray-400 bg-white",
                  {
                    hidden: !showMidRow && rowIdx === 1,
                  },
                )}
              >
                <span className="text-xs font-semibold">{num}</span>
              </div>
            </div>
          );
        }),
      )}
    </div>
  );
}

export function DentalChartConfigurator() {
  return (
    <Tabs defaultValue="treatments" className="relative h-full w-full">
      <div className="flex h-10 items-center justify-center border-b-1">
        <TabsList className="w-96 rounded-full bg-slate-100">
          <TabsTrigger
            value="treatments"
            className="rounded-full data-[state=inactive]:text-slate-500"
          >
            Treatment
          </TabsTrigger>
          <TabsTrigger
            value="missing"
            className="rounded-full data-[state=inactive]:text-slate-500"
          >
            Missing
          </TabsTrigger>
          <TabsTrigger
            value="movements"
            className="rounded-full data-[state=inactive]:text-slate-500"
          >
            Movements
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="treatments" className="w-full">
        <FormTanstackComplex />
        <TabsFooter>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" form="treatment-form" className="flex-1">
              Save Preferences
            </Button>
          </Field>
        </TabsFooter>
      </TabsContent>
      <TabsContent value="missing">Missing</TabsContent>
      <TabsContent value="movements">Movements</TabsContent>
    </Tabs>
  );
}

export function DateSelector() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Date
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

const priorities = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
] as const;
const toothSurfaces = [
  {
    id: "buccal",
    title: "Buccal",
    description:
      "The buccal surface is the surface of the tooth that faces the cheek.",
  },
  {
    id: "lingual",
    title: "Lingual",
    description:
      "The lingual surface is the surface of the tooth that faces the tongue.",
  },
  {
    id: "mesial",
    title: "Mesial",
    description:
      "The mesial surface is the surface of the tooth that faces the mesial.",
  },
  {
    id: "distal",
    title: "Distal",
    description:
      "The distal surface is the surface of the tooth that faces the distal.",
  },
  {
    id: "occlusal",
    title: "Occlusal",
    description:
      "The occlusal surface is the surface of the tooth that faces the occlusal.",
  },
  {
    id: "facial",
    title: "Facial",
    description:
      "The facial surface is the surface of the tooth that faces the facial.",
  },
  {
    id: "incisal",
    title: "Incisal",
    description:
      "The incisal surface is the surface of the tooth that faces the incisal.",
  },
] as const;

const formSchema = z.object({
  priority: z.string({
    error: "Please select a priority",
  }),
  date: z.string({
    error: "Please select a date",
  }),
  diagnosis: z.string({
    error: "Please select a diagnosis",
  }),
  procedure: z.string({
    error: "Please select a procedure",
  }),

  toothSurface: z.string({
    error: "Please select a tooth surface",
  }),
  status: z.string({
    error: "Please select a tooth surface",
  }),
});

export function FormTanstackComplex() {
  const form = useForm({
    defaultValues: {
      status: "",
      priority: "LOW",
      procedure: "",
      toothSurface: "",
      date: new Date().toISOString(),
      diagnosis: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
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
      await Promise.resolve();
    },
  });

  return (
    <form
      id="treatment-form"
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
    >
      <FieldGroup className="p-4">
        <form.Field
          name="toothSurface"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <FieldLegend className="!text-sm">Tooth Surface</FieldLegend>
                <FieldDescription className="sr-only">
                  Select the surface of the tooth.
                </FieldDescription>
                <RadioGroup
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  className="flex gap-1.5"
                >
                  {toothSurfaces.map((surface) => (
                    <FieldLabel
                      key={surface.id}
                      htmlFor={surface.id}
                      className="dark:bg-input/30 dark:border-input dark:hover:bg-input/50 has-data-[state=checked]:bg-primary/20 !w-fit gap-0 border bg-red-500 bg-slate-100 text-xs text-slate-500 shadow-xs hover:bg-slate-200 hover:text-slate-700"
                    >
                      <Field
                        orientation="vertical"
                        className="items-center justify-center gap-0 !px-4 !py-2"
                        data-invalid={isInvalid}
                      >
                        <FieldContent className="flex w-full text-center">
                          <FieldTitle className="sr-only">
                            {surface.title}
                          </FieldTitle>
                          <FieldDescription className="sr-only">
                            {surface.description}
                          </FieldDescription>
                          <RadioGroupItem
                            value={surface.id}
                            id={surface.id}
                            className="sr-only"
                            aria-invalid={isInvalid}
                          />
                          {surface.title.charAt(0)}
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        />
      </FieldGroup>
      <FieldGroup className="p-4">
        <form.Field
          name="status"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <FieldLegend className="!text-sm">Status</FieldLegend>
                <FieldDescription className="sr-only">
                  Select the status of the treatment item.
                </FieldDescription>
                <RadioGroup
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  className="flex gap-1.5"
                >
                  {["TP", "Existing", "Referred", "Other"].map((status) => (
                    <FieldLabel
                      key={status}
                      htmlFor={status}
                      className="dark:bg-input/30 dark:border-input dark:hover:bg-input/50 has-data-[state=checked]:bg-primary/20 !w-fit gap-0 border bg-red-500 bg-slate-100 text-xs text-slate-500 shadow-xs hover:bg-slate-200 hover:text-slate-700"
                    >
                      <Field
                        orientation="vertical"
                        className="items-center justify-center gap-0 !px-4 !py-2"
                        data-invalid={isInvalid}
                      >
                        <FieldContent className="flex w-full text-center">
                          <FieldTitle className="sr-only">{status}</FieldTitle>
                          <FieldDescription className="sr-only">
                            {status}
                          </FieldDescription>
                          <RadioGroupItem
                            value={status}
                            id={status}
                            className="sr-only"
                            aria-invalid={isInvalid}
                          />
                          {status}
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        />
      </FieldGroup>
      <div className="flex gap-2 p-4">
        <FieldGroup>
          <form.Field
            name="date"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                    <FieldDescription className="sr-only">
                      Select the date of the treatment item.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                      >
                        {field.state.value !== ""
                          ? new Date(field.state.value).toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          field.state.value
                            ? new Date(field.state.value)
                            : undefined
                        }
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.handleChange(date?.toISOString() ?? "");
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              );
            }}
          />
        </FieldGroup>
        <FieldGroup>
          <form.Field
            name="priority"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name + "-select"}>
                      Priority
                    </FieldLabel>
                    <FieldDescription className="sr-only">
                      Select the priority of the treatment item.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name + "-select"}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger
                      id={field.name + "-select"}
                      aria-invalid={isInvalid}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              );
            }}
          />
        </FieldGroup>
      </div>
      <Separator className="my-4" />
      <FieldGroup className="p-4">
        <form.Field
          name="diagnosis"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Diagnosis</FieldLabel>
                  <FieldDescription>
                    Search and select the diagnoses
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />
      </FieldGroup>
      <Separator className="my-4" />
      <FieldGroup className="p-4">
        <form.Field
          name="procedure"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Procedure</FieldLabel>
                  <FieldDescription>
                    Search and select the procedure
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />
      </FieldGroup>
    </form>
  );
}

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import type { Patient } from "@repo/zero/src/schema";
import { Button } from "@repo/design/components/ui/button";
import { Calendar } from "@repo/design/components/ui/calendar";
// const formSchema = z.object({
//   language: z
//     .string()
//     .min(1, "Please select your spoken language.")
//     .refine((val) => val !== "auto", {
//       message:
//         "Auto-detection is not allowed. Please select a specific language.",
//     }),
// });

// function PrioritySelector() {
//   const form = useForm({
//     defaultValues: {
//       language: "",
//     },
//     validators: {
//       onSubmit: formSchema,
//     },
//     onSubmit: ({ value }) => {
//       toast("You submitted the following values:", {
//         description: (
//           <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
//             <code>{JSON.stringify(value, null, 2)}</code>
//           </pre>
//         ),
//         position: "bottom-right",
//         classNames: {
//           content: "flex flex-col gap-2",
//         },
//         style: {
//           "--border-radius": "calc(var(--radius)  + 4px)",
//         } as React.CSSProperties,
//       });
//     },
//   });

//   return (
//     <form
//       id="form-tanstack-select"
//       onSubmit={async (e) => {
//         e.preventDefault();
//         await form.handleSubmit();
//       }}
//     >
//       <FieldGroup>
//         <form.Field
//           name="language"
//           children={(field) => {
//             const isInvalid =
//               field.state.meta.isTouched && !field.state.meta.isValid;
//             return (
//               <Field orientation="responsive" data-invalid={isInvalid}>
//                 <FieldContent>
//                   <FieldLabel htmlFor="form-tanstack-select-language">
//                     Priority
//                   </FieldLabel>
//                   {isInvalid && <FieldError errors={field.state.meta.errors} />}
//                 </FieldContent>
//                 <Select
//                   name={field.name}
//                   value={field.state.value}
//                   onValueChange={field.handleChange}
//                 >
//                   <SelectTrigger
//                     id="form-tanstack-select-language"
//                     aria-invalid={isInvalid}
//                     className="min-w-[120px]"
//                   >
//                     <SelectValue placeholder="Select" />
//                   </SelectTrigger>
//                   <SelectContent position="item-aligned">
//                     <SelectItem value="auto">Auto</SelectItem>
//                     <SelectSeparator />
//                     {priorities.map((priority) => (
//                       <SelectItem key={priority.value} value={priority.value}>
//                         {priority.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </Field>
//             );
//           }}
//         />
//       </FieldGroup>
//     </form>
//   );
// }

import { Card, CardContent, CardFooter } from "@repo/design/components/ui/card";
import { Checkbox } from "@repo/design/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@repo/design/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
} from "@repo/design/components/ui/item";
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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@repo/design/components/ui/select";
import { Switch } from "@repo/design/components/ui/switch";
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

function TreatmentItem({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string | null;
  actions: string[];
}) {
  return (
    <Item>
      <ItemHeader className="font-medium">{title}</ItemHeader>
      <ItemContent>
        <ItemDescription className="sr-only">{description}</ItemDescription>
        <ItemActions>
          {actions.map((action) => (
            <Button
              variant="slate"
              size={title === "Treatment" ? "icon" : "default"}
              key={action}
            >
              {action}
            </Button>
          ))}
        </ItemActions>
      </ItemContent>
    </Item>
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
          const showMidRow =
            rowIdx === 1 &&
            (placement.includes("left") ? colIdx < 5 : colIdx > 2);
          return (
            <div
              key={`${num}-${rowIdx}`}
              className="col-span-1 row-span-1 flex items-center justify-center"
              style={{
                gridColumn: colIdx + 1,
                gridRow: rowIdx + 1,
              }}
            >
              <div className="aspect-square h-6 w-6 rounded border border-gray-400 bg-white">
                {/* Only show the tooth number label in the center row */}
                {showMidRow && (
                  <span className="text-xs font-semibold">{num}</span>
                )}
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
        <TreatmentItem
          title="Treatment"
          description="Treatment"
          actions={["B", "L", "M", "D", "O", "F", "I"]}
        />
        <TreatmentItem
          title="Status"
          description="Status"
          actions={["TP", "Existing", "Referred", "Other"]}
        />

        {/* <Separator className="my-2" />
        <div className="flex gap-2">
          <DateSelector />
          <PrioritySelector />
        </div>
        <FormTanstackSelect />  */}

        <div className="w-full">
          <FormTanstackComplex />
        </div>
        <TabsFooter>
          <Button className="flex-1">Cancel</Button>
          <Button className="flex-1">Save</Button>
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

const addons = [
  {
    id: "analytics",
    title: "Analytics",
    description: "Advanced analytics and reporting",
  },
  {
    id: "backup",
    title: "Backup",
    description: "Automated daily backups",
  },
  {
    id: "support",
    title: "Priority Support",
    description: "24/7 premium customer support",
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
  // addons: z
  //   .array(z.string())
  //   .min(1, "Please select at least one add-on")
  //   .max(3, "You can select up to 3 add-ons")
  //   .refine(
  //     (value) => value.every((addon) => addons.some((a) => a.id === addon)),
  //     {
  //       message: "You selected an invalid add-on",
  //     },
  //   ),
});

export function FormTanstackComplex() {
  const form = useForm({
    defaultValues: {
      priority: "LOW",
      procedure: "",
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
      id="subscription-form"
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
    >
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

      <Field orientation="horizontal" className="justify-end">
        <Button type="submit" form="subscription-form">
          Save Preferences
        </Button>
      </Field>
    </form>
  );
}

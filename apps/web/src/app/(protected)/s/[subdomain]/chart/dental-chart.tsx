import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { ChevronDownIcon } from "lucide-react";
import { parseAsJson, useQueryState } from "nuqs";
import { toast } from "sonner";
import * as z from "zod";

import type { Patient } from "@repo/zero/src/schema";
import { surfaces } from "@repo/database/src/schema";
import { Button } from "@repo/design/components/ui/button";
import { Calendar } from "@repo/design/components/ui/calendar";
import { Checkbox } from "@repo/design/components/ui/checkbox";
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
import { Separator } from "@repo/design/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsFooter,
  TabsList,
  TabsTrigger,
} from "@repo/design/components/ui/tabs";
import { Badge } from "@repo/design/src/components/ui/badge";
import {
  Canine,
  CanineBack,
  Incisor,
  IncisorBack,
  Molar,
  MolarBack,
  MolarTop,
  Premolar,
  PremolarBack,
  PremolarTop,
} from "@repo/design/tooth-icons";

import { cn } from "~/lib/utils";

type Position = "top" | "bottom";
type Orientation = "left" | "right";

type ChartPlacement = `${Position}-${Orientation}`;

const placements = [
  "top-left", // 2
  "top-right", // 1
  "bottom-left", // 3
  "bottom-right", // 4
] as const satisfies ChartPlacement[];

export function DentalChart({ patient }: { patient: Patient }) {
  return (
    <div className="flex h-full w-full flex-col p-2">
      <div className="flex h-full w-full flex-col">
        <div className="flex h-1/2 w-full">
          <ChartSection placement="top-left" />
          <ChartSection placement="top-right" />
        </div>
        <div className="flex h-1/2 w-full">
          <ChartSection placement="bottom-left" />
          <ChartSection placement="bottom-right" />
        </div>
      </div>
    </div>
  );
}

const IconMap = {
  molar: {
    top: <MolarTop />,
    front: <Molar />,
    back: <MolarBack />,
  },
  premolar: {
    top: <PremolarTop />,
    front: <Premolar />,
    back: <PremolarBack />,
  },
  canine: {
    back: <CanineBack />,
    front: <Canine />,
  },
  incisor: {
    back: <IncisorBack />,
    front: <Incisor />,
  },
} as const;

const teethOrder = [1, 2, 3, 4, 5, 6, 7, 8];
const teethOrderRight = [8, 7, 6, 5, 4, 3, 2, 1];

const schema = z.object({
  placement: z.enum(placements),
  toothNum: z.number(),
});

export interface ChartState {
  //   chart: [];
  notation: "UNS" | "FDI";
  setNotation: (notation: "UNS" | "FDI") => void;
  selected: {
    placement: ChartPlacement;
    toothNum: number;
  } | null;
  setSelected: (
    selected: {
      placement: ChartPlacement;
      toothNum: number;
    } | null,
  ) => void;
}
// const useChartStore = create<ChartState>((set, get) => ({
//   get chart() {
//     const cols = get().selected?.placement.includes("left")
//       ? teethOrder
//       : teethOrderRight;
//     return Array.from({ length: 8 }).map((_, index) => {
//       return [1, 2, 3].map((row) => {
//         return {
//           row,
//           col: cols[index]!,
//         };
//       });
//     });
//   },
//   notation: "UNS",
//   setNotation: (notation) => set({ notation }),

//   selected: null,
//   setSelected: (selected) => set({ selected }),
// }));

function ChartSection({
  placement,
  notation = "UNS",
}: {
  placement: ChartPlacement;
  notation?: "UNS" | "FDI";
}) {
  const [selected, setSelected] = useQueryState(
    "selected",
    parseAsJson(schema),
  );

  const cols = placement.includes("left") ? teethOrder : teethOrderRight;

  const rows = [1, 2, 3];
  const chart = Array.from({ length: 8 }).map((_, index) => {
    return rows.map((row) => {
      return {
        row,
        col: cols[index]!,
      };
    });
  });

  return (
    <div
      id={placement}
      data-placement={placement}
      data-notation={notation}
      className={cn(
        "group relative grid w-full grid-cols-8 gap-1 overflow-hidden border-2 border-dashed p-2",
        {
          "border-y-0": placement.includes("top"),
          "border-b-0": placement.includes("bottom"),
          "border-x-0": placement.includes("left"),
          "border-r-0": placement.includes("right"),
        },
      )}
    >
      <Badge className="absolute top-0 my-0.5 group-data-[notation=UNS]:hidden group-data-[placement=bottom-right]:right-0 group-data-[placement=top-right]:-right-2">
        {placements.indexOf(placement) + 1}
      </Badge>
      {chart.map((row, rowIdx) => {
        return (
          <div
            tabIndex={0}
            key={crypto.randomUUID()}
            className={cn(
              "group border-primary flex h-full max-h-64 max-w-12 flex-col rounded-md py-1 hover:bg-blue-50 [&:has([data-selected=true])]:border [&:has([data-selected=true])]:bg-blue-100",
              {
                "flex-col flex-col-reverse": placement.includes("bottom"),
              },
            )}
          >
            {row.map((col, colIdx) => {
              const toothNum =
                notation === "UNS"
                  ? rowIdx + 1 + placements.indexOf(placement) * 8
                  : Math.abs(col.col - 8) + 1;
              const isSelected =
                selected?.placement === placement &&
                selected.toothNum === col.col;
              const toothType =
                col.col < 4
                  ? "molar"
                  : col.col < 6
                    ? "premolar"
                    : col.col >= 7
                      ? "incisor"
                      : "canine";

              const toothIcon = IconMap[toothType];
              const toothIconElement =
                col.row === 1
                  ? toothIcon.front
                  : col.row === 2
                    ? "top" in toothIcon
                      ? toothIcon.top
                      : null
                    : "back" in toothIcon
                      ? toothIcon.back
                      : null;

              return (
                <div
                  data-selected={isSelected}
                  onClick={async () => {
                    if (col.col)
                      await setSelected({ placement, toothNum: col.col });
                  }}
                  key={`${placement}-${col.col}-${col.row}`}
                  className="group relative flex h-full flex-col gap-2"
                >
                  <span
                    className={cn(
                      "group-data-[selected=true]:bg-primary absolute left-1/2 -translate-x-1/2 rounded-md px-2 py-1 text-xs tabular-nums group-data-[selected=true]:text-white",
                      {
                        "bottom-1": placement.includes("bottom"),
                        hidden: !(placement.includes("top")
                          ? col.row === 1
                          : col.row === 1),
                      },
                    )}
                  >
                    {toothNum}
                  </span>
                  <div
                    className={cn(
                      "grid flex-1 place-items-center border-blue-500",
                      {
                        "mt-8 rotate-180": placement.includes("top"),
                        "mb-8": placement.includes("bottom"),
                        hidden:
                          ((placement.includes("left") && rowIdx > 4) ||
                            (placement.includes("right") && rowIdx < 4)) &&
                          colIdx === 1,
                      },
                    )}
                  >
                    {toothIconElement}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function HearAboutUs() {
  return (
    <form>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>How did you hear about us?</FieldLegend>
          <FieldDescription>
            Select the option that best describes how you heard about us.
          </FieldDescription>
          <FieldGroup className="flex flex-row flex-wrap gap-2 [--radius:9999rem] **:data-[slot=checkbox]:rounded-full **:data-[slot=field]:gap-2 **:data-[slot=field]:overflow-hidden **:data-[slot=field]:px-2.5 **:data-[slot=field]:py-2 *:data-[slot=field-label]:w-fit">
            <FieldLabel htmlFor="social-media-b2s">
              <Field orientation="horizontal">
                <Checkbox
                  value="social-media"
                  id="social-media-b2s"
                  className="-ml-6 -translate-x-1 transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
                />
                <FieldTitle>Social Media</FieldTitle>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="search-engine-f6h">
              <Field orientation="horizontal">
                <Checkbox
                  value="search-engine"
                  id="search-engine-f6h"
                  className="-ml-6 -translate-x-1 transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
                />
                <FieldTitle>Search Engine</FieldTitle>
              </Field>
            </FieldLabel>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </form>
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
      <TabsContent value="missing">
        Missing
        <HearAboutUs />
      </TabsContent>
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

const toothSurfaces = surfaces.map((surface) => ({
  id: surface.name,
  title: surface.name,
  description: surface.description,
}));

const formSchema = z.object({
  priority: z.string({ error: "Please select a priority" }),
  date: z.string({ error: "Please select a date" }),
  diagnosis: z.string({ error: "Please select a diagnosis" }),
  procedure: z.string({ error: "Please select a procedure" }),
  toothSurface: z.string({ error: "Please select a tooth surface" }),
  status: z.string({ error: "Please select a tooth surface" }),
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
        classNames: { content: "flex flex-col gap-2" },
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
      {/* tooth surface */}
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
                      title={surface.title}
                      key={surface.id}
                      htmlFor={surface.id}
                      className="dark:bg-input/30 dark:border-input dark:hover:bg-input/50 has-data-[state=checked]:bg-primary/20 !w-fit gap-0 border bg-slate-100 text-xs text-slate-500 shadow-xs hover:bg-slate-100 hover:text-slate-700"
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
                          {/* <RadioGroupItem
                            value={surface.id}
                            id={surface.id}
                            className="sr-only"
                            aria-invalid={isInvalid}
                          /> */}
                          <Checkbox
                            value={surface.id}
                            id={surface.id}
                            aria-invalid={isInvalid}
                            className="sr-only transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
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

      {/* status */}
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
                      className="dark:bg-input/30 dark:border-input dark:hover:bg-input/50 has-data-[state=checked]:bg-primary/20 !w-fit gap-0 border bg-slate-100 text-xs text-slate-500 shadow-xs hover:bg-slate-100 hover:text-slate-700"
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

      {/* date & priority */}
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

      {/* diagnosis */}
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

      {/* procedure */}
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
                    Search and select the procedures
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

{
  /* <ButtonGroup>
<Button className="border-secondary/40 border-r">Add Patient</Button>
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button className="!pl-2">
      <ChevronDownIcon />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="[--radius:1rem]">
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <Plus />
        Add Manually
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Table />
        Upload CSV
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
</ButtonGroup> */
}

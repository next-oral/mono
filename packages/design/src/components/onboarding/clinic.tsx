import type { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useFieldArray } from "react-hook-form";

import type { ClinicForm } from "./schema";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ClinicTypeDropdown } from "./clinic-type-dropdown";
import { CountriesDropdown } from "./countries-dropdown";

export const Clinic = ({ form }: { form: UseFormReturn<ClinicForm> }) => {
  const { fields, append, remove } = useFieldArray({
    name: "clinics",
    control: form.control,
  });

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const field = fields[current];
  const handleCurrent = (type: "prev" | "next") => {
    if (current === 0 && type === "prev") return;
    if (current === fields.length - 1 && type === "next") return;
    setDirection(type === "prev" ? -1 : 1);
    setCurrent(current + (type === "prev" ? -1 : 1));
  };

  return (
    <Form {...form}>
      <div className="flex h-full w-full flex-col gap-4 p-4">
        <div className="bg-background relative min-h-60 min-w-0 rounded-lg p-4">
          <div className="absolute top-0 right-4">
            <Button
              role="button"
              variant="ghost"
              disabled={fields.length === 1}
              onClick={() => {
                if (fields.length <= 1) return;
                remove(current);
                setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
              }}
              className="w-fit cursor-pointer rounded-md p-2 hover:bg-red-100"
            >
              <Trash2 className="size-4 text-red-500" />
            </Button>
          </div>
          {field && (
            <ClinicCard
              form={form}
              key={field.id}
              index={current}
              direction={direction}
            />
          )}
        </div>

        {/* Sidebar controls */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              // @ts-expect-error This values are valid according to the schema
              append({ name: "", country: "", speciality: "" });
              setCurrent(fields.length);
            }}
          >
            <Plus className="mr-2 size-4" /> Add clinic
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button
              size="icon"
              type="button"
              variant="secondary"
              onClick={() => handleCurrent("prev")}
              disabled={current === 0}
            >
              <ArrowLeft />
            </Button>
            <span className="w-20 text-center text-sm font-medium">
              {current + 1} / {fields.length}
            </span>
            <Button
              size="icon"
              type="button"
              variant="secondary"
              onClick={() => handleCurrent("next")}
              disabled={current === fields.length - 1}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const ClinicCard = ({
  form,
  index,
  direction,
}: {
  index: number;
  form: UseFormReturn<ClinicForm>;
  direction: number;
}) => {
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name={`clinics.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Clinic name
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name={`clinics.${index}.country`}
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Country
                <span className="text-destructive">*</span>
              </FormLabel>
              <CountriesDropdown
                value={field.value}
                onValueChange={(v) => {
                  if (fieldState.error)
                    form.clearErrors(`clinics.${index}.country`);
                  //  @ts-expect-error This value is valid according to the schema
                  form.setValue(`clinics.${index}.country`, v);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name={`clinics.${index}.speciality`}
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Clinic type
                <span className="text-destructive">*</span>
              </FormLabel>
              <ClinicTypeDropdown
                value={field.value}
                onValueChange={(v) => {
                  console.log(v);
                  if (fieldState.error)
                    form.clearErrors(`clinics.${index}.speciality`);
                  //  @ts-expect-error sfsdfd
                  form.setValue(`clinics.${index}.speciality`, v);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};

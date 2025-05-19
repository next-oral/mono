import type { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useFieldArray } from "react-hook-form";

import type { CarouselApi } from "../ui/carousel";
import type { ClinicForm } from "./schema";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
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
  const { fields, append } = useFieldArray({
    name: "clinics",
    control: form.control,
  });

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateCount = () => {
      setCount(api.scrollSnapList().length);
    };

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    // Initial setup
    updateCount();
    updateCurrent();

    // Listen for changes
    api.on("select", updateCurrent);
    api.on("reInit", updateCount);

    return () => {
      api.off("select", updateCurrent);
      api.off("reInit", updateCount);
    };
  }, [api]);

  return (
    <Form {...form}>
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {fields.map((field, index) => (
            <CarouselItem key={field.id} className="flex flex-col gap-2">
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
                render={({ fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Country
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <CountriesDropdown
                      onValueChange={(v) => {
                        if (fieldState.error)
                          form.clearErrors(`clinics.${index}.country`);
                        //  @ts-expect-error sfsdfd
                        form.setValue(`clinics.${index}.country`, v);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ClinicTypeDropdown />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => {
              //  @ts-expect-error sfsdfd
              append({ name: "", country: "" });
              // Force carousel to update after adding new item
              // api?.reInit();
              // Scroll to the last item after adding
              setTimeout(() => {
                api?.scrollTo(api.scrollSnapList().length - 1);
              }, 0);
            }}
          >
            <Plus /> Add another clinic
          </Button>
          <div className="relative">
            <CarouselNext />
            {current}/{count}
            <CarouselPrevious />
          </div>
        </div>
      </Carousel>
    </Form>
  );
};

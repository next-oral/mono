import type { UseFormReturn } from "react-hook-form";
import { useEffect, useId, useState } from "react";

import { cn } from "@repo/design/lib/utils";

import type { OrgForm } from "./schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const useDebounce = (string: string, ms = 500) => {
  const [value, setValue] = useState(string);
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(string);
    }, ms);

    return () => clearTimeout(timer);
  }, [ms, string]);

  return value;
};

export function Organization({
  form,
  checkSlug,
}: {
  form: UseFormReturn<OrgForm>;
  checkSlug: (slug: string) => Promise<boolean>;
}) {
  const radioId = useId();
  const organizationInputId = useId();

  const type = form.watch("type");
  const name = form.watch("name");
  const orgName = useDebounce(name);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        if (!orgName.length) return;
        const isAvailable = await checkSlug(orgName);
        if (!isAvailable) {
          form.setError("name", {
            message: "Organization name is already taken",
          });
        } else if (
          form.formState.errors.name?.message ===
          "Organization name is already taken"
        ) {
          form.clearErrors("name");
        }
      } catch (error) {
        console.error("Error checking slug availability:", error);
      }
    };

    void checkAvailability();

    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgName]);

  return (
    <Form {...form}>
      <form>
        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  className="gap-2"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <div>
                    <div
                      className={cn(
                        "border-input data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none",
                        {
                          "border-primary border-2 bg-sky-50/5":
                            type === "multi-clinic",
                        },
                      )}
                    >
                      <RadioGroupItem
                        value="multi-clinic"
                        id={`${radioId}-1`}
                        aria-describedby={`${radioId}-1-description`}
                        aria-controls={organizationInputId}
                        className="order-1 after:absolute after:inset-0"
                        onClick={() => form.setFocus("name")}
                      />
                      <div className="grid grow gap-2">
                        <Label htmlFor={`${radioId}-1`}>
                          Multi clinic organization
                        </Label>
                        <p
                          id={`${radioId}-1-description`}
                          className="text-muted-foreground text-sm"
                        >
                          Please choose this option if you are responsible for
                          managing more than one clinic. This will help us
                          tailor your experience and provide you with the best
                          tools to efficiently oversee all your locations.
                        </p>

                        {/* Expandable organization name field */}
                        <div
                          role="region"
                          id={organizationInputId}
                          aria-labelledby={`${radioId}-1`}
                          className="grid transition-all ease-in-out data-[state=collapsed]:grid-rows-[0fr] data-[state=collapsed]:opacity-0 data-[state=expanded]:grid-rows-[1fr] data-[state=expanded]:opacity-100"
                          data-state={
                            type === "multi-clinic" ? "expanded" : "collapsed"
                          }
                        >
                          <div className="pointer-events-none -m-2 overflow-hidden p-2">
                            <div className="pointer-events-auto mt-3">
                              <div className="my-3 w-full border border-dashed" />
                              <Label
                                htmlFor="organization-name"
                                className="mb-2 block text-sm"
                              >
                                Organization name
                              </Label>
                              {type === "multi-clinic" && (
                                <FormField
                                  name="name"
                                  control={form.control}
                                  render={({ field: nameField }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          id="organization-name"
                                          placeholder="Golden Trust HQ"
                                          aria-label="Organization name"
                                          {...nameField}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Single clinic organization */}
                  <div>
                    <div
                      onClick={() => form.setFocus("name")}
                      className={cn(
                        "border-input data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none",
                        {
                          "border-primary border-2 bg-sky-50/5":
                            type === "single-clinic",
                        },
                      )}
                    >
                      <RadioGroupItem
                        value="single-clinic"
                        id={`${radioId}-2`}
                        onClick={() => form.setFocus("name")}
                        aria-describedby={`${radioId}-2-description`}
                        aria-controls={organizationInputId + "-single"}
                        className="order-1 after:absolute after:inset-0"
                      />
                      <div className="grid grow gap-2">
                        <Label htmlFor={`${radioId}-2`}>
                          Single clinic organization
                        </Label>
                        <p
                          id={`${radioId}-2-description`}
                          className="text-muted-foreground text-sm"
                        >
                          If you are managing a single clinic, please select
                          this option. This will allow us to customize your
                          experience and equip you with the most effective tools
                          for overseeing your clinic.
                        </p>
                        {/* Expandable organization name field for single clinic */}
                        <div
                          role="region"
                          id={organizationInputId + "-single"}
                          aria-labelledby={`${radioId}-2`}
                          className="grid transition-all ease-in-out data-[state=collapsed]:grid-rows-[0fr] data-[state=collapsed]:opacity-0 data-[state=expanded]:grid-rows-[1fr] data-[state=expanded]:opacity-100"
                          data-state={
                            type === "single-clinic" ? "expanded" : "collapsed"
                          }
                        >
                          <div className="pointer-events-none -m-2 overflow-hidden p-2">
                            <div className="pointer-events-auto mt-3">
                              <div className="my-3 w-full border border-dashed" />
                              <Label
                                htmlFor="clinic-name"
                                className="mb-2 block text-sm"
                              >
                                Clinic name
                              </Label>
                              {type === "single-clinic" && (
                                <FormField
                                  name="name"
                                  control={form.control}
                                  render={({ field: nameField }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          id="clinic-name"
                                          placeholder="Golden Trust Dental"
                                          aria-label="Clinic name"
                                          {...nameField}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

"use client";

import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useState } from "react";

import type { Locale, ProfileForm } from "./schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import LocaleDropdown from "./locale-dropdown";
import PositionsDropdown from "./position-dropdown";

export const Profile = ({
  form,
  handleSubmit,
}: {
  form: UseFormReturn<ProfileForm>;
  handleSubmit: SubmitHandler<ProfileForm>;
}) => {
  const [selectedLocale, setSelectedLocale] = useState<Locale>("en-US");

  const handleLocaleChange = (locale: Locale) => {
    setSelectedLocale(locale);
    console.log("Selected locale:", locale);
    // Here you would typically update your app's locale/language settings
  };

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form className="p-8" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex w-full gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Firstname<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input className="h-10 w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Lastname<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input className="h-10 w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="position"
            control={form.control}
            render={({ fieldState }) => (
              <FormItem>
                <FormLabel>
                  Position<span className="text-destructive">*</span>
                </FormLabel>
                <PositionsDropdown
                  onValueChange={(v) => {
                    if (fieldState.error) form.clearErrors("position");
                    form.setValue("position", v);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <LocaleDropdown
            label="Preffered locale"
            defaultValue={selectedLocale}
            onValueChange={handleLocaleChange}
            showFlags={true}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Email</FormLabel>
                <FormControl>
                  <Input className="h-10" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

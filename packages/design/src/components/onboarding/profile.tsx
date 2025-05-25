"use client";

import type { SubmitHandler, UseFormReturn } from "react-hook-form";

import type { ProfileForm } from "./schema";
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Position<span className="text-destructive">*</span>
                </FormLabel>
                <PositionsDropdown onValueChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="locale"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Preffered locale<span className="text-destructive">*</span>
                </FormLabel>
                <LocaleDropdown
                  value={field.value}
                  onValueChange={field.onChange}
                  showFlags
                />
                <FormMessage />
              </FormItem>
            )}
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

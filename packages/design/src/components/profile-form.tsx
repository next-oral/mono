"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const profileFormSchema = z.object({
  firstName: z
    .string({
      required_error: "Firstname is required",
    })
    .min(1, {
      message: "Firstname must be at least 3 characters",
    }),
  lastName: z
    .string({
      required_error: "Lastname is required",
    })
    .min(1, {
      message: "Lastname must be at least 3 characters",
    }),
  email: z.string().email(),
});
type ProfileForm = z.infer<typeof profileFormSchema>;

export const ProfileForm = ({ email }: { email: string }) => {
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email,
      firstName: "",
      lastName: "",
    },
  });

  const handleSubmit = (data: ProfileForm) => console.log(data);

  return (
    <div className="h-full overflow-hidden">
      <div className="flex h-full items-center justify-center">
        <Card className="container h-1/2 max-w-4xl flex-1 flex-row gap-0 overflow-hidden p-0 shadow-none">
          <div className="relative flex-2 bg-radial-[at_95%_75%] from-sky-100 via-sky-200 to-sky-200 px-8 py-4">
            <CardTitle className="text-2xl">Your profile</CardTitle>
            <CardDescription>
              Please provide your details accurately to create your profile.
            </CardDescription>
            <div className="h-64" />
            <Button
              type="submit"
              className="mt-auto h-11 w-full"
              onClick={form.handleSubmit(handleSubmit)}
            >
              Proceed
            </Button>
          </div>
          <CardContent className="flex-3">
            <Form {...form}>
              <form className="p-8" onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Firstname<span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input className="h-10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Lastname<span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input className="h-10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Email
                        </FormLabel>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

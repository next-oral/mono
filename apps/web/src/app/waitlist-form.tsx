"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@repo/design/src/components/ui/button";
import { Form } from "@repo/design/src/components/ui/form";
import { Input } from "@repo/design/src/components/ui/input";

const waitlistFormSchema = z.object({
  email: z.string().email("Please provide a valid email"),
});

type waitlistFormSchema = z.infer<typeof waitlistFormSchema>;

export function WaitlistForm() {
  const waitlistForm = useForm<waitlistFormSchema>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleWaitlistSubmit = (values: waitlistFormSchema) => {
    try {
      console.log(values);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form {...waitlistForm}>
      <form
        onSubmit={waitlistForm.handleSubmit(handleWaitlistSubmit)}
        className="flex items-center gap-1 max-sm:flex-col max-sm:*:w-full"
      >
        <Input
          className="bg-background px-4 py-3"
          placeholder="Enter your email"
          inputMode="email"
        />
        <Button>Join The Waitlist</Button>
      </form>
    </Form>
  );
}

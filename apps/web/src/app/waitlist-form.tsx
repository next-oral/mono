"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod/v4";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { waitlistInsertSchema } from "@repo/database/src/schema/auth";
import { CustomInputField } from "@repo/design/src/components/form/custom-input-field";
import { Button } from "@repo/design/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design/src/components/ui/dialog";
import { Form } from "@repo/design/src/components/ui/form";
import { toast } from "@repo/design/src/components/ui/sonner";

import { useTRPC } from "~/trpc/react";

type WaitlistForm = z.infer<typeof waitlistInsertSchema>;
type WaitlistFormFieldProps =
  | { withDialog: true; children: React.ReactNode }
  | { withDialog?: false; children?: React.ReactNode };

function WlForm({
  waitlistForm,
  onOpenChange,
}: {
  waitlistForm: UseFormReturn<WaitlistForm>;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const trpc = useTRPC();

  const joinWaitlist = useMutation({
    ...trpc.auth.joinWaitlist.mutationOptions(),
    onSuccess: () => {
      toast.success("Thank you for joining us on this journey.", {
        description: "We'll be in touch soon!",
      });
      waitlistForm.reset();
      onOpenChange?.(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleWaitlistSubmit = async (values: WaitlistForm) => {
    try {
      await joinWaitlist.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...waitlistForm}>
      <form
        onSubmit={waitlistForm.handleSubmit(handleWaitlistSubmit)}
        className="grid grid-cols-2 gap-1"
      >
        <CustomInputField
          control={waitlistForm.control}
          name="firstName"
          placeholder="First name *"
          isNotLabeled={true}
          inputClassName="bg-background"
        />
        <CustomInputField
          control={waitlistForm.control}
          name="lastName"
          placeholder="Last name *"
          isNotLabeled={true}
          inputClassName="bg-background"
        />
        <div className="col-span-2">
          <CustomInputField
            control={waitlistForm.control}
            name="email"
            placeholder="Email *"
            isNotLabeled={true}
            inputClassName="bg-background"
          />
        </div>
        <Button
          isLoading={joinWaitlist.isPending}
          loadingMessage="Joining the waitlist..."
          className="col-span-2 mt-2 py-5"
        >
          Join the Waitlist
        </Button>
      </form>
    </Form>
  );
}

export function WaitlistForm({
  children,
  withDialog = false,
}: WaitlistFormFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const waitlistForm = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistInsertSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <>
      {withDialog ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader className="border-b py-3">
              <DialogTitle className="font-normal max-sm:text-sm">
                Enter your details below to tag along with us
              </DialogTitle>
              <DialogDescription className="sr-only">
                Join waitlist form
              </DialogDescription>
            </DialogHeader>
            <WlForm onOpenChange={setIsOpen} waitlistForm={waitlistForm} />
          </DialogContent>
        </Dialog>
      ) : (
        <WlForm waitlistForm={waitlistForm} />
      )}
    </>
  );
}

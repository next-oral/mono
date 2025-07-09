"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomInputField from "@repo/design/src/components/form/custom-input-field";
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

const waitlistFormSchema = z.object({
  firstName: z.string().min(1, { message: "Please provide your first name" }),
  lastName: z.string().min(1, { message: "Please provide your last name" }),
  email: z.string().email("Please provide a valid email"),
});

type WaitlistForm = z.infer<typeof waitlistFormSchema>;
type WaitlistFormFieldProps =
  | { withDialog: true; children: React.ReactNode }
  | { withDialog?: false; children?: React.ReactNode };

function WlForm({
  waitlistForm,
}: {
  waitlistForm: ReturnType<typeof useForm<WaitlistForm>>;
}) {
  const handleWaitlistSubmit = (values: WaitlistForm) => {
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
        <Button className="col-span-2 mt-2 py-5">Join the Waitlist</Button>
      </form>
    </Form>
  );
}

export function WaitlistForm({
  children,
  withDialog = false,
}: WaitlistFormFieldProps) {
  const waitlistForm = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <>
      {withDialog ? (
        <Dialog>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader className="border-b py-3">
              <DialogTitle className="text-center font-normal max-sm:text-sm">
                Enter your details below to tag along with us
              </DialogTitle>
              <DialogDescription className="sr-only">
                Join waitlist form
              </DialogDescription>
            </DialogHeader>
            <WlForm waitlistForm={waitlistForm} />
          </DialogContent>
        </Dialog>
      ) : (
        <WlForm waitlistForm={waitlistForm} />
      )}
    </>
  );
}

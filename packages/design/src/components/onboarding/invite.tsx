import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const inviteSchema = z.object({
  emails: z
    .union([
      z.string().transform((val) => {
        return val
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email.length > 0);
      }),
      z.array(z.string()),
    ])
    .transform((val) => {
      return Array.isArray(val) ? val : val;
    })
    .refine((emails) => emails.length > 0, {
      message: "At least one email address is required",
    })
    .refine((emails) => emails.every((email) => EMAIL_REGEX.test(email)), {
      message: "All email addresses must be valid and seperated by commas",
    }),
});

export type InviteForm = z.infer<typeof inviteSchema>;

export const Invite = ({
  form,
  type = "email",
  onTypeChange,
}: {
  form: UseFormReturn<InviteForm>;
  type: "email" | "link";
  onTypeChange: () => void;
}) => {
  return (
    <div className="h-full w-full p-6">
      <h3 className="text-lg">Invite teammates</h3>
      <p className="text-muted-foreground text-sm">
        {type === "email"
          ? "Share this link with others you'd like to join your clinic."
          : "Add the email(s) of the people you want to invite. Separate multiple emails with commas."}
      </p>
      <Form {...form}>
        <form>
          <div className="mt-4 space-y-2">
            {type === "email" ? (
              <FormField
                control={form.control}
                name="emails"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="cgeorge@gmail.com,kona@outlook.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="emails"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={onTypeChange}
                variant="link"
                className="p-0"
              >
                Invite by {` ${type === "link" ? "email" : "link"}`}
              </Button>
              <Button type="button">Copy</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

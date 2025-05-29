import { Resend } from "resend";
import { z } from "zod";

import AWSVerifyEmail from "@repo/email/templates/verify-email";

import { OrgInviteEmail } from "./templates/invite";

const key = process.env.RESEND_API_TOKEN ?? "";

export const resend = new Resend(key);

export const authTemplateSchema = z.object({
  template: z.literal("sign-up"),
  data: z.object({
    otp: z.coerce.string(),
    email: z.string().email(),
    name: z.string().min(3),
    message: z.string().min(3),
  }),
});

type AuthTemplate = z.infer<typeof authTemplateSchema>;

export const actions = {
  auth: async (options: AuthTemplate) => {
    const res = await resend.emails.send({
      from: "Next Oral <test@resend.artzkaizen.com>",
      to: [options.data.email],
      subject: "Your OTP",
      react: AWSVerifyEmail(options.data),
    });

    return res;
  },

  invite: async (opts: {
    email: string;
    inviterName: string;
    inviteLink: string;
    organizationName: string;
  }) => {
    const res = await resend.emails.send({
      from: "Next Oral <test@resend.artzkaizen.com>",
      to: [opts.email],
      subject: `${opts.inviterName} sent you an invite`,
      react: OrgInviteEmail(opts),
    });

    return res;
  },
};

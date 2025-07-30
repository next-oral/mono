import { Resend } from "resend";
import { z } from "zod";

import VerifyEmail from "@repo/email/templates/verify-email";

import { OrgInviteEmail } from "./templates/invite";
import WaitlistEmail from "./templates/waitlist";

export const resend = new Resend(process.env.RESEND_API_TOKEN);
const onBoardingEmail = "suuport@onboarding.nextoral.com" as const;

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
      from: `Next Oral <${onBoardingEmail}>`,
      to: [options.data.email],
      subject: "Your OTP",
      react: VerifyEmail(options.data),
    });

    return res;
  },
  waitlist: async (options: { email: string; name: string }) => {
    const res = await resend.emails.send({
      from: `Next Oral <${onBoardingEmail}>`,
      to: [options.email],
      subject: "You're on the waitlist",
      react: WaitlistEmail(options),
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
      from: `Next Oral <${onBoardingEmail}>`,
      to: [opts.email],
      subject: `${opts.inviterName} sent you an invite`,
      react: OrgInviteEmail(opts),
    });

    return res;
  },
};

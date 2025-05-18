import * as React from "react";
import { Resend } from "resend";
import { z } from "zod";

import AWSVerifyEmail from "./templates/verify-email";

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
      react: React.createElement(AWSVerifyEmail, options.data),
    });

    return res;
    // <ContactTemplate {...options.data} />
  },
};

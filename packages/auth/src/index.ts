import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { oAuthProxy, emailOTP, admin as adminPlugin, organization } from "better-auth/plugins";

import { db } from "@repo/database/client";
import { ac, admin, user } from "./lib/permission";

export function initAuth(options: {
  baseUrl: string;
  secret: string | undefined;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      nextCookies(),
      oAuthProxy(),
      emailOTP({
        // eslint-disable-next-line @typescript-eslint/require-await
        async sendVerificationOTP({ email, otp }) {
          console.log(email, otp);
          // Implement the sendVerificationOTP method to send the OTP to the user's email address
        },
      }),
      adminPlugin({
        ac,
        roles: {
          admin,
          user,
        }
      }),
      organization()
    ],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: "process.env.GOOGLE_CLIENT_ID!",
        clientSecret: "process.env.GOOGLE_CLIENT_SECRET!",
      },
      microsoft: {
        clientId: "env.MICROSOFT_CLIENT_ID",
        clientSecret: "env.MICROSOFT_CLIENT_SECRET",
        tenantId: 'common',
      },
    },
    trustedOrigins: ["expo://"],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];

import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  admin as adminPlugin,
  emailOTP,
  organization,
} from "better-auth/plugins";

import { db } from "@repo/database/client";
import { actions } from "@repo/email";

import { env } from "../env";
import { ac, admin, user } from "./lib/permission";

interface InitAuthOptions {
  baseUrl: string;
  secret: string | undefined;
  google: {
    clientId: string;
    clientSecret: string;
  };
  microsoft: {
    clientId: string;
    clientSecret: string;
    tenantId: string;
  };
}
// TODO: Create a PR to fix the types export on better-auth v.1.3.4
export function initAuth(options: InitAuthOptions) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    user: {
      additionalFields: {
        position: {
          type: "string",
          required: false,
        },
        locale: {
          type: "string",
          required: false,
          defaultValue: "EN",
        },
      },
    },
    // databaseHooks: {
    //   session: {
    //     create: {
    //       before: async (session) => {
    //         return {
    //           data: {
    //             ...session,
    //             activeOrganizationId: organization.id,
    //           },
    //         };
    //       },
    //     },
    //   },
    // },
    advanced: {
      cookiePrefix: "nextoral",
      crossSubDomainCookies: {
        enabled: true,
        domain: `.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      defaultCookieAttributes: {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        partitioned: true,
      },
    },
    trustedOrigins: [
      `https://${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      `https://www.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      `https://golden.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      "https://nextoral.org",
      "https://nextoral.com",
      "*.localhost:3000",
      "http://localhost:3001",
      "expo://",
    ],

    plugins: [
      // jwt(),
      emailOTP({
        async sendVerificationOTP({ email, otp }) {
          console.log(otp);
          await actions.auth({
            template: "sign-up",
            data: {
              email,
              otp,
              name: "sfsd",
              message: "dfsdfs",
            },
          });
        },
      }),
      adminPlugin({
        ac,
        roles: {
          admin,
          user,
        },
      }),
      organization({
        teams: {
          enabled: true,
        },
        cancelPendingInvitationsOnReInvite: true,
        async sendInvitationEmail(data) {
          const baseUrl =
            env.NODE_ENV === "production"
              ? `https://${env.NEXT_PUBLIC_ROOT_DOMAIN}`
              : "http://localhost:3000";
          const inviteLink = `${baseUrl}/accept-invitation/${data.id}`;
          await actions.invite({
            inviteLink,
            email: data.email,
            inviterName: data.inviter.user.name,
            organizationName: data.organization.name,
          });
        },
      }),
      nextCookies(),
    ],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: options.google,
      microsoft: options.microsoft,
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];

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

const domain =
  env.NODE_ENV === "development" ? ".localhost" : (".nextoral.com" as const);

console.log(domain);

export function initAuth(options: {
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
}) {
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

    // advanced: {
    //   crossSubDomainCookies: {
    //     enabled: true,
    //     domain, // Domain with a leading period
    //   },
    //   defaultCookieAttributes: {
    //     secure: true,
    //     httpOnly: true,
    //     sameSite: "none", // Allows CORS-based cookie sharing across subdomains
    //     partitioned: true, // New browser standards will mandate this for foreign cookies
    //   },
    // },

    advanced: {
      // ipAddress: {
      //   ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
      //   disableIpTracking: false,
      // },
      cookiePrefix: "nextoral",
      crossSubDomainCookies: {
        enabled: true,
        domain,
      },
      defaultCookieAttributes: {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        partitioned: true,
      },
    },
    trustedOrigins: [
      "https://*.nextoral.com",
      "https://nextoral.com",
      "http://*.localhost:3000",
      "http://localhost:3000",
      "http://clinic.localhost:3000",
      "expo://",
    ],
    plugins: [
      nextCookies(),
      emailOTP({
        async sendVerificationOTP({ email, otp }) {
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
              ? "https://nextoral.com"
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

export const auth = initAuth({
  baseUrl: "http://localhost:3000",
  secret: "TA9r9leBleRG6HbdqNjP1WKDdxWrTbPG",
  google: {
    clientId:
      "416856524573-3h86eemob17q8ebllms0bbs34f2q2lbv.apps.googleusercontent.com",
    clientSecret: "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",
  },
  microsoft: {
    clientId: "asdaa",
    clientSecret: "sadsadsa",
    tenantId: "asdaa",
  },
});

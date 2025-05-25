import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "./server";
import { env } from "~/env";

const baseUrl =
  env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://nextoral.com";

export const authClient = createAuthClient({
  baseURL: baseUrl,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    emailOTPClient(),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
  ],
});

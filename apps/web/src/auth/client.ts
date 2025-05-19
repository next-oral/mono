import {
  adminClient,
  emailOTPClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "~/env";

const baseUrl =
  env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://nextoral.com";

export const authClient = createAuthClient({
  baseURL: baseUrl,
  plugins: [adminClient(), emailOTPClient(), organizationClient()],
});

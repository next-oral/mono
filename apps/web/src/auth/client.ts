import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "./server";
import { env } from "~/env";

const baseURL = `${env.NEXT_PUBLIC_PROTOCOL}://${
  env.NEXT_PUBLIC_SUBDOMAIN ? `${env.NEXT_PUBLIC_SUBDOMAIN}` : ""
}${env.NEXT_PUBLIC_ROOT_DOMAIN}`;

export const authClient = createAuthClient({
  baseURL,
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

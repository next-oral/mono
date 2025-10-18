import {
  adminClient,
  emailOTPClient,
  //   inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,

  plugins: [
    // inferAdditionalFields<typeof auth>(),
    adminClient(),
    emailOTPClient(),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
  ],
});

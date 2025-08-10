import { createAuthClient } from "better-auth/client";
import {
  adminClient,
  emailOTPClient,
  organizationClient,
} from "better-auth/client/plugins";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    plugins: [adminClient(), emailOTPClient(), organizationClient()],
  },
);

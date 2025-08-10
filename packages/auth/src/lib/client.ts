import { createAuthClient } from "better-auth/client";
import {
  adminClient,
  emailOTPClient,
  organizationClient,
} from "better-auth/client/plugins";

// TODO: Create a PR to fix the types export on better-auth/client/plugins v.1.3.4
export const authClient = createAuthClient({
  plugins: [adminClient(), emailOTPClient(), organizationClient()],
});

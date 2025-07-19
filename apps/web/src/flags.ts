import { flag } from "flags/next";

import { env } from "./env";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const allowEarlyAccess = flag({
  key: "allow-early-access",
  decide() {
    return env.NODE_ENV === "development" ? true : false;
  },
});

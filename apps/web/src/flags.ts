import { flag } from "flags/next";

import { env } from "./env";

export const allowEarlyAccess = flag({
  key: "allow-early-access",
  decide() {
    return env.NODE_ENV === "development" ? true : false;
  },
});

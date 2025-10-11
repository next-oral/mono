import fs from "fs";
import { concurrently } from "concurrently";

import { env } from "../env";

concurrently(
  [
    {
      command: "pnpm dev:clean && pnpm dev:db",
      name: "db",
      prefixColor: "#32648c",
    },
    {
      command: `wait-on tcp:${env.DEV_PG_ADDRESS} && sleep 1 && pnpm -F @repo/database push && pnpm -F @repo/database seed`,
      name: "seed",
      prefixColor: "#ff5515",
    },
    {
      command: `wait-on tcp:${env.DEV_PG_ADDRESS} && sleep 2  && pnpm dev:zero`,
      name: "z0",
      prefixColor: "#ff11cc",
    },
    {
      command:
        "pnpm dlx chokidar-cli 'packages/database/src/schema/index.ts' -c 'pnpm -F @repo/database generate-zero-schema'",
      name: "gz",
      prefixColor: "#11ffcc",
    },
  ],
  // {
  //   outputStream: fs.createWriteStream("zero.log"),
  // },
);

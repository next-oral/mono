import { concurrently } from "concurrently";

const env = {
  DEV_PG_ADDRESS: process.env.DEV_PG_ADDRESS,
};

concurrently([
  {
    command: "pnpm db:up",
    name: "db",
    prefixColor: "#32648c",
  },
  {
    command:
      "pnpm dlx chokidar-cli 'schema/index.ts' -c 'pnpm generate-zero-schema'",
    name: "gz",
    prefixColor: "#11ffcc",
  },
  {
    command: `wait-on tcp:${env.DEV_PG_ADDRESS} && sleep 1 && pnpm push && pnpm seed`,
    name: "seed",
    prefixColor: "#ff5515",
  },
]);

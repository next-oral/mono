import { fileURLToPath } from "url";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@repo/api",
    "@repo/auth",
    "@repo/database",
    "@repo/design",
    "@repo/validators",
  ],
  experimental: {
    reactCompiler: {
      compilationMode: "annotation",
    },
  },

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: ["*.previewnextdental.com"],
};

export default config;

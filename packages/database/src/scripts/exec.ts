import { execSync } from "child_process";
import type { ExecSyncOptions } from "child_process";

export function exec(command: string, options?: ExecSyncOptions) {
  console.log(`> ${command}`);
  return execSync(command, { stdio: "inherit", ...options });
}
process.exit(0);
try {
  exec("docker compose -p nextoral up");
} catch (error) {
  console.error("Failed to start database container:", error);
}

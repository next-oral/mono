import { exec } from "./exec";

try {
  exec("docker compose -p nextoral up");
} catch (error) {
  console.error("Failed to start database container:", error);
  process.exit(1);
}

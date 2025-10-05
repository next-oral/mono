import { exec } from "../index";

console.log("Cleaning up resources...");

try {
  exec("rm -f .tmp/next-oral.db*");
} catch (err) {
  console.info((err as Error).message);
}

try {
  exec("docker rm -f next-oral");
} catch (err) {
  console.info((err as Error).message);
}

console.log("Cleanup complete.");

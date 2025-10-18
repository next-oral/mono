import { env } from "../env";
import { exec } from "../index";

function main() {
  try {
    console.log("Attempting to start existing next-oral container...");
    exec("docker start -a next-oral");
    console.log("next-oral container started.");
  } catch (error) {
    console.log((error as Error).message);
    console.log(
      "Existing next-oral container not found or could not be started. Creating a new one...",
    );
    try {
      exec("docker volume create next-oral-pgdata");
      exec(
        `docker run --name next-oral -e POSTGRES_PASSWORD=${env.DEV_PG_PASSWORD} -p ${env.DEV_PG_PORT}:5432 -v next-oral:/var/lib/postgresql/data postgres -c wal_level=logical`,
      );
      // exec(
      //   `docker run --rm --name next-oral -e POSTGRES_PASSWORD=${env.DEV_PG_PASSWORD} -p ${env.DEV_PG_PORT}:5432 postgres -c wal_level=logical`,
      // );
    } catch (runError) {
      console.error("Failed to create and run new container:", runError);
    }
  }
}

main();

import { redirect } from "next/navigation";

import { HydrateClient } from "~/trpc/server";

export default function HomePage() {
  return redirect("/login");
  return (
    <HydrateClient>
      <main className="container m-auto h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          Welcome to Next Oral 43
        </div>
      </main>
    </HydrateClient>
  );
}

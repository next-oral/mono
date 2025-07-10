import Image from "next/image";
import { redirect } from "next/navigation";

import { getSession } from "~/auth/server";
import { allowEarlyAccess } from "~/flags";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isEarlyAccess = await allowEarlyAccess();

  if (!isEarlyAccess) return redirect("/");

  const session = await getSession();

  if (session) return redirect("/verify");

  return (
    <div className="grid min-h-svh overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md"></div>
            Next Oral Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

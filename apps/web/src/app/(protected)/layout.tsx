import { redirect } from "next/navigation";

import { getSession } from "~/auth/server";
import { env } from "~/env";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session)
    return redirect(
      `${env.NEXT_PUBLIC_PROTOCOL}://${
        env.NEXT_PUBLIC_SUBDOMAIN ? `${env.NEXT_PUBLIC_SUBDOMAIN}` : ""
      }${env.NEXT_PUBLIC_ROOT_DOMAIN}/login`,
    );

  return children;
}

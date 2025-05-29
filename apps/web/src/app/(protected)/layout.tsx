import { getSession } from "~/auth/server";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        No session
      </div>
    );

  return children;
}

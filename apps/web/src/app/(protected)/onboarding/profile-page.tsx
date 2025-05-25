import { redirect } from "next/navigation";

import { ProfileForm } from "@repo/design/components/profile-form";

import { getSession } from "~/auth/server";

export const ProfilePage = async () => {
  const session = await getSession();

  if (!session) return redirect("/login");

  return (
    <div className="h-screen w-screen">
      <ProfileForm email={session.user.email} />
    </div>
  );
};

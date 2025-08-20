"use client";

import { AccountSettings } from "@repo/design/components/settings/account-settings";
import { Billings } from "@repo/design/components/settings/billings";
import { Clinic } from "@repo/design/components/settings/clinic";
import { LogInSecurity } from "@repo/design/components/settings/log-in-security";
import { Teams } from "@repo/design/components/settings/teams";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design/components/ui/tabs";

export default function Settings() {
  return (
    <Tabs defaultValue="account">
      {/* Added this extra div to solve the problem of overflow when screen gets smaller than the width of the tabs trigger*/}
      <div className="w-full overflow-x-auto">
        <TabsList className="no-scrollbar *:border-secondary *:data-[state=active]:bg-secondary h-fit gap-1 overflow-x-auto bg-transparent *:cursor-pointer *:border-2 *:px-3 *:py-2 *:font-medium *:opacity-80 *:data-[state=active]:opacity-100 sm:gap-3">
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="log-in-security">Log in & Security</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="clinic">Clinic</TabsTrigger>
          <TabsTrigger value="billings">Billings</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="account">
        <AccountSettings />
      </TabsContent>
      <TabsContent value="log-in-security">
        <LogInSecurity />
      </TabsContent>
      <TabsContent value="teams">
        <Teams />
      </TabsContent>
      <TabsContent value="clinic">
        <Clinic />
      </TabsContent>
      <TabsContent value="billings">
        <Billings />
      </TabsContent>
    </Tabs>
  );
}

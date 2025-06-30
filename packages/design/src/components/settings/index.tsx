"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AccountSettings from "./account-settings";
import Billings from "./billings";
import Clinic from "./clinic";
import LogInSecurity from "./log-in-security";
import Organization from "./organization";

export default function Settings() {
  return (
    <Tabs defaultValue="account">
      {/* Added this extra div to solve the problem of overflow when screen gets smaller than the width of the tabs trigger*/}
      <div className="w-full overflow-x-auto">
        <TabsList className="no-scrollbar *:border-secondary *:data-[state=active]:bg-secondary h-fit gap-1 overflow-x-auto bg-transparent *:cursor-pointer *:border-2 *:px-3 *:py-2 *:font-medium *:opacity-80 *:data-[state=active]:opacity-100 sm:gap-3">
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="log-in-security">Log in & Security</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
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
      <TabsContent value="organization">
        <Organization />
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

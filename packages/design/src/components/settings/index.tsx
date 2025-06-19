"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AccountSettings from "./account-settings";

export default function Settings() {
  return (
    <Tabs defaultValue="account">
      {/* Added this extra div to solve the problem of overflow when screen gets smaller than the width of the tabs trigger*/}
      <div className="w-full bg-blue overflow-x-auto">
        <TabsList className="overflow-x-auto no-scrollbar h-fit *:cursor-pointer gap-1 sm:gap-3 *:border-secondary *:data-[state=active]:bg-secondary bg-transparent *:border-2 *:px-3 *:py-3 *:font-medium *:opacity-80 *:data-[state=active]:opacity-100">
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
        Change your password here.
      </TabsContent>
      <TabsContent value="organization">Change your password here.</TabsContent>
      <TabsContent value="clinic">Change your password here.</TabsContent>
      <TabsContent value="billings">Change your password here.</TabsContent>
    </Tabs>
  );
}

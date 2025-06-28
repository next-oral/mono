"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AccountSettings from "./account-settings";
import LogInSecurity from "./log-in-security";
import Organization from "./organization";
import Clinic from "./clinic";
import Billings from "./billings";

export default function Settings() {
  return (
    <Tabs defaultValue="account">
      {/* Added this extra div to solve the problem of overflow when screen gets smaller than the width of the tabs trigger*/}
      <div className="w-full overflow-x-auto">
        <TabsList className="overflow-x-auto no-scrollbar h-fit *:cursor-pointer gap-1 sm:gap-3 *:border-secondary *:data-[state=active]:bg-secondary bg-transparent *:border-2 *:px-3 *:py-2 *:font-medium *:opacity-80 *:data-[state=active]:opacity-100">
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
      <TabsContent value="billings"><Billings /></TabsContent>
    </Tabs>
  );
}

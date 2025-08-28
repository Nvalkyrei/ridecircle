"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileOverview } from "./profile-overview"
import { KYCVerification } from "./kyc-verification"
import { ProfileSettings } from "./profile-settings"

export function ProfileTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <ProfileOverview />
      </TabsContent>

      <TabsContent value="kyc" className="mt-6">
        <KYCVerification />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <ProfileSettings />
      </TabsContent>
    </Tabs>
  )
}

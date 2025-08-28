"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function ProfileOverview() {
  const verificationProgress = 60 // Mock progress

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Profile Completion</CardTitle>
          <CardDescription>Complete your profile to unlock all features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{verificationProgress}%</span>
            </div>
            <Progress value={verificationProgress} className="w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Basic Information</span>
                </div>
                <Badge variant="secondary">Complete</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">KYC Verification</span>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <span className="text-sm">Biometric Verification</span>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <span className="text-sm">Video Declaration</span>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-foreground">John Doe</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
              <p className="text-foreground">+91 9876543210</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <p className="text-foreground">john.doe@example.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">User Type</label>
              <p className="text-foreground">Customer</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Phone Number</span>
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Address</span>
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Aadhaar/DL</span>
              <Badge variant="outline">Pending</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Selfie Verification</span>
              <Badge variant="outline">Pending</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Biometric E-Sign</span>
              <Badge variant="outline">Pending</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Quick Actions</CardTitle>
          <CardDescription>Complete these steps to fully activate your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm">📄</span>
              </div>
              <span className="text-sm font-medium">Complete KYC</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm">📸</span>
              </div>
              <span className="text-sm font-medium">Upload Selfie</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm">🎥</span>
              </div>
              <span className="text-sm font-medium">Record Declaration</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

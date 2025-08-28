"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent } from "@/components/ui/tabs"

export function KYCVerification() {
  const [step, setStep] = useState<"document" | "selfie" | "biometric" | "video">("document")
  const [documentType, setDocumentType] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDocumentVerification = async () => {
    if (!documentType || !documentNumber) {
      toast({
        title: "Missing Information",
        description: "Please select document type and enter document number",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // Simulate Digilocker API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Document Verification Initiated",
        description: "Please complete the OTP verification on Digilocker",
      })
      setStep("selfie")
    }, 2000)
  }

  const handleSelfieUpload = () => {
    setLoading(true)
    // Simulate selfie verification
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Selfie Uploaded Successfully",
        description: "Facial matching in progress...",
      })
      setStep("biometric")
    }, 1500)
  }

  const handleBiometricSign = () => {
    setLoading(true)
    // Simulate biometric e-signature
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Biometric Signature Captured",
        description: "Agreement signed successfully",
      })
      setStep("video")
    }, 2000)
  }

  const handleVideoDeclaration = () => {
    setLoading(true)
    // Simulate video declaration
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "KYC Verification Complete",
        description: "Your account is now fully verified!",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">KYC Verification Progress</CardTitle>
          <CardDescription>Complete all steps to verify your identity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div
              className={`flex items-center space-x-2 ${step === "document" ? "text-primary" : step !== "document" ? "text-green-600" : "text-muted-foreground"}`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${step === "document" ? "bg-primary text-primary-foreground" : step !== "document" ? "bg-green-600 text-white" : "bg-muted"}`}
              >
                1
              </div>
              <span className="text-sm font-medium">Document</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${step === "selfie" ? "text-primary" : ["biometric", "video"].includes(step) ? "text-green-600" : "text-muted-foreground"}`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${step === "selfie" ? "bg-primary text-primary-foreground" : ["biometric", "video"].includes(step) ? "bg-green-600 text-white" : "bg-muted"}`}
              >
                2
              </div>
              <span className="text-sm font-medium">Selfie</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${step === "biometric" ? "text-primary" : step === "video" ? "text-green-600" : "text-muted-foreground"}`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${step === "biometric" ? "bg-primary text-primary-foreground" : step === "video" ? "bg-green-600 text-white" : "bg-muted"}`}
              >
                3
              </div>
              <span className="text-sm font-medium">E-Sign</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${step === "video" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${step === "video" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                4
              </div>
              <span className="text-sm font-medium">Video</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Tabs value={step} className="w-full">
        <TabsContent value="document">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Document Verification</CardTitle>
              <CardDescription>Verify your identity using Aadhaar or Driving License via Digilocker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                    <SelectItem value="driving_license">Driving License</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Document Number</Label>
                <Input
                  placeholder={
                    documentType === "aadhaar" ? "Enter 12-digit Aadhaar number" : "Enter driving license number"
                  }
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Digilocker Integration</h4>
                <p className="text-sm text-blue-700">
                  We use Digilocker to securely verify your documents. You'll be redirected to Digilocker to complete
                  OTP verification and document retrieval.
                </p>
              </div>

              <Button onClick={handleDocumentVerification} disabled={loading} className="w-full">
                {loading ? "Connecting to Digilocker..." : "Verify with Digilocker"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="selfie">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Selfie Verification</CardTitle>
              <CardDescription>Take a live selfie for facial matching against your ID document</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Selfie Guidelines</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Ensure good lighting and clear visibility</li>
                  <li>• Look directly at the camera</li>
                  <li>• Remove glasses or accessories if possible</li>
                  <li>• Keep a neutral expression</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <div className="h-32 w-32 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">📸</span>
                </div>
                <p className="text-muted-foreground mb-4">Click to capture your selfie</p>
                <Button onClick={handleSelfieUpload} disabled={loading}>
                  {loading ? "Processing..." : "Capture Selfie"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biometric">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Biometric E-Signature</CardTitle>
              <CardDescription>Sign the rental agreement using your biometric fingerprint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Agreement Summary</h4>
                <p className="text-sm text-green-700">
                  By signing, you agree to Ride Circle's terms of service, privacy policy, and rental agreement
                  conditions.
                </p>
              </div>

              <div className="border border-border rounded-lg p-6 text-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👆</span>
                </div>
                <p className="text-muted-foreground mb-4">Place your finger on the sensor to sign</p>
                <Button onClick={handleBiometricSign} disabled={loading}>
                  {loading ? "Capturing Signature..." : "Sign with Biometric"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Video Declaration</CardTitle>
              <CardDescription>Record a video statement acknowledging the terms and conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Declaration Script</h4>
                <p className="text-sm text-blue-700">
                  "I, [Your Name], acknowledge that I have read and understood the terms and conditions of Ride Circle
                  car rental service. I agree to comply with all rental policies and take full responsibility for the
                  vehicle during the rental period."
                </p>
              </div>

              <div className="border border-border rounded-lg p-6 text-center">
                <div className="h-32 w-32 rounded-lg bg-muted mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">🎥</span>
                </div>
                <p className="text-muted-foreground mb-4">Record your video declaration</p>
                <Button onClick={handleVideoDeclaration} disabled={loading}>
                  {loading ? "Processing Declaration..." : "Start Recording"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setStep("otp")
      toast({
        title: "OTP Sent",
        description: `Verification code sent to +91 ${phone}`,
      })
    }, 1000)
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Login Successful",
        description: "Welcome back to Ride Circle!",
      })
      // Redirect to dashboard
    }, 1000)
  }

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `${provider} login will be implemented soon`,
    })
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
          <p className="text-sm text-muted-foreground">Code sent to +91 {phone}</p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setStep("phone")} className="flex-1">
            Back
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Verifying..." : "Verify & Sign In"}
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="w-full text-sm"
          onClick={() => handleSendOTP({ preventDefault: () => {} } as React.FormEvent)}
        >
          Resend OTP
        </Button>
      </form>
    )
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSendOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number</Label>
          <div className="flex">
            <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
              <span className="text-sm text-muted-foreground">+91</span>
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength={10}
              className="rounded-l-none"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>

      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-2 text-sm text-muted-foreground">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button type="button" variant="outline" onClick={() => handleSocialLogin("Google")} className="p-2">
          <span className="text-lg">G</span>
        </Button>
        <Button type="button" variant="outline" onClick={() => handleSocialLogin("Facebook")} className="p-2">
          <span className="text-lg">f</span>
        </Button>
        <Button type="button" variant="outline" onClick={() => handleSocialLogin("Apple")} className="p-2">
          <span className="text-lg">🍎</span>
        </Button>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const [step, setStep] = useState<"details" | "otp">("details")
  const [formData, setFormData] = useState({
    userType: "",
    name: "",
    email: "",
    phone: "",
    businessName: "",
    gst: "",
    agreeTerms: false,
  })
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.userType || !formData.name || !formData.phone || !formData.agreeTerms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and accept terms",
        variant: "destructive",
      })
      return
    }

    if (formData.phone.length !== 10) {
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
        description: `Verification code sent to +91 ${formData.phone}`,
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
        title: "Registration Successful",
        description: "Welcome to Ride Circle! Please complete your KYC verification.",
      })
      // Redirect to KYC flow
    }, 1000)
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="register-otp">Verification Code</Label>
          <Input
            id="register-otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
          <p className="text-sm text-muted-foreground">Code sent to +91 {formData.phone}</p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setStep("details")} className="flex-1">
            Back
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Verifying..." : "Complete Registration"}
          </Button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userType">I want to</Label>
        <Select value={formData.userType} onValueChange={(value) => setFormData({ ...formData, userType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Rent Cars (Customer)</SelectItem>
            <SelectItem value="host">List My Cars (Host)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-phone">Mobile Number *</Label>
        <div className="flex">
          <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
            <span className="text-sm text-muted-foreground">+91</span>
          </div>
          <Input
            id="register-phone"
            type="tel"
            placeholder="Enter mobile number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            maxLength={10}
            className="rounded-l-none"
          />
        </div>
      </div>

      {formData.userType === "host" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name (Optional)</Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Enter business name"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gst">GST Number (Optional)</Label>
            <Input
              id="gst"
              type="text"
              placeholder="Enter GST number"
              value={formData.gst}
              onChange={(e) => setFormData({ ...formData, gst: e.target.value.toUpperCase() })}
            />
          </div>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.agreeTerms}
          onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
        />
        <Label htmlFor="terms" className="text-sm">
          I agree to the{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  )
}

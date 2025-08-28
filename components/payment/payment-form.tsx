"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Wallet, Building2, CheckCircle } from "lucide-react"

interface PaymentFormProps {
  bookingDetails: {
    carName: string
    dates: string
    basePrice: number
    serviceFee: number
    insurance: number
    taxes: number
    total: number
  }
}

export function PaymentForm({ bookingDetails }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsCompleted(true)
  }

  if (isCompleted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
          <p className="text-slate-600 mb-4">Your booking has been confirmed.</p>
          <Button className="w-full">View Booking Details</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">{bookingDetails.carName}</span>
          </div>
          <div className="text-sm text-slate-600">{bookingDetails.dates}</div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base rental</span>
              <span>₹{bookingDetails.basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>₹{bookingDetails.serviceFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Insurance</span>
              <span>₹{bookingDetails.insurance}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹{bookingDetails.taxes}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{bookingDetails.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="card" id="card" />
              <CreditCard className="w-5 h-5" />
              <Label htmlFor="card" className="flex-1">
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="upi" id="upi" />
              <Wallet className="w-5 h-5" />
              <Label htmlFor="upi" className="flex-1">
                UPI
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="netbanking" id="netbanking" />
              <Building2 className="w-5 h-5" />
              <Label htmlFor="netbanking" className="flex-1">
                Net Banking
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "card" && (
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input id="cardName" placeholder="John Doe" />
              </div>
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className="pt-4">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input id="upiId" placeholder="yourname@upi" />
            </div>
          )}

          <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? "Processing..." : `Pay ₹${bookingDetails.total}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

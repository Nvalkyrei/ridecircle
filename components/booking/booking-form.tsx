"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarIcon, X } from "lucide-react"
import { format, differenceInDays, differenceInHours } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface BookingFormProps {
  car: any
  onClose: () => void
}

export function BookingForm({ car, onClose }: BookingFormProps) {
  const [bookingData, setBookingData] = useState({
    pickupDate: null as Date | null,
    dropoffDate: null as Date | null,
    pickupTime: "10:00",
    dropoffTime: "10:00",
    pickupLocation: car.address,
    dropoffLocation: car.address,
    rentalType: "daily", // daily, hourly
    addOns: [] as string[],
    agreeTerms: false,
    emergencyContact: "",
    drivingLicense: "",
  })
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addOnOptions = [
    { id: "gps", name: "GPS Navigation", price: 100 },
    { id: "child-seat", name: "Child Safety Seat", price: 200 },
    { id: "wifi", name: "Portable WiFi", price: 150 },
    { id: "fuel", name: "Full Tank Fuel", price: 500 },
  ]

  const calculatePrice = () => {
    if (!bookingData.pickupDate || !bookingData.dropoffDate) return 0

    let basePrice = 0
    let duration = 0

    if (bookingData.rentalType === "daily") {
      duration = differenceInDays(bookingData.dropoffDate, bookingData.pickupDate) || 1
      basePrice = car.pricePerDay * duration
    } else {
      duration = differenceInHours(bookingData.dropoffDate, bookingData.pickupDate) || 1
      basePrice = car.pricePerHour * duration
    }

    // Add-ons
    const addOnPrice = bookingData.addOns.reduce((total, addOnId) => {
      const addOn = addOnOptions.find((option) => option.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

    // Service fee (5%)
    const serviceFee = Math.round((basePrice + addOnPrice) * 0.05)

    // GST (18%)
    const gst = Math.round((basePrice + addOnPrice + serviceFee) * 0.18)

    return {
      basePrice,
      addOnPrice,
      serviceFee,
      gst,
      total: basePrice + addOnPrice + serviceFee + gst,
      duration,
    }
  }

  const pricing = calculatePrice()

  const handleSubmit = async () => {
    if (!bookingData.pickupDate || !bookingData.dropoffDate || !bookingData.agreeTerms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and accept terms",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // Simulate booking API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Booking Confirmed!",
        description: "Your booking request has been submitted successfully",
      })
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Book {car.make} {car.model}
          </DialogTitle>
          <Button variant="ghost" size="sm" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Trip Details</CardTitle>
                  <CardDescription>When and where do you need the car?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pickup Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bookingData.pickupDate ? format(bookingData.pickupDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={bookingData.pickupDate || undefined}
                            onSelect={(date) => setBookingData({ ...bookingData, pickupDate: date || null })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Dropoff Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bookingData.dropoffDate ? format(bookingData.dropoffDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={bookingData.dropoffDate || undefined}
                            onSelect={(date) => setBookingData({ ...bookingData, dropoffDate: date || null })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pickup Time</Label>
                      <Input
                        type="time"
                        value={bookingData.pickupTime}
                        onChange={(e) => setBookingData({ ...bookingData, pickupTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dropoff Time</Label>
                      <Input
                        type="time"
                        value={bookingData.dropoffTime}
                        onChange={(e) => setBookingData({ ...bookingData, dropoffTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Rental Type</Label>
                    <Select
                      value={bookingData.rentalType}
                      onValueChange={(value) => setBookingData({ ...bookingData, rentalType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Rental</SelectItem>
                        <SelectItem value="hourly">Hourly Rental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Pickup Location</Label>
                    <Input
                      value={bookingData.pickupLocation}
                      onChange={(e) => setBookingData({ ...bookingData, pickupLocation: e.target.value })}
                      placeholder="Enter pickup address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dropoff Location</Label>
                    <Input
                      value={bookingData.dropoffLocation}
                      onChange={(e) => setBookingData({ ...bookingData, dropoffLocation: e.target.value })}
                      placeholder="Enter dropoff address"
                    />
                  </div>

                  <Button onClick={() => setStep(2)} className="w-full">
                    Next: Add-ons & Extras
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Add-ons & Extras</CardTitle>
                  <CardDescription>Enhance your trip with optional extras</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {addOnOptions.map((addOn) => (
                      <div
                        key={addOn.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={addOn.id}
                            checked={bookingData.addOns.includes(addOn.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setBookingData({
                                  ...bookingData,
                                  addOns: [...bookingData.addOns, addOn.id],
                                })
                              } else {
                                setBookingData({
                                  ...bookingData,
                                  addOns: bookingData.addOns.filter((id) => id !== addOn.id),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={addOn.id} className="font-medium">
                            {addOn.name}
                          </Label>
                        </div>
                        <span className="font-medium">₹{addOn.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Previous
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1">
                      Next: Confirmation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Confirmation & Payment</CardTitle>
                  <CardDescription>Review your booking details and confirm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Emergency Contact Number</Label>
                    <Input
                      placeholder="Enter emergency contact number"
                      value={bookingData.emergencyContact}
                      onChange={(e) => setBookingData({ ...bookingData, emergencyContact: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Driving License Number</Label>
                    <Input
                      placeholder="Enter your driving license number"
                      value={bookingData.drivingLicense}
                      onChange={(e) => setBookingData({ ...bookingData, drivingLicense: e.target.value })}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Booking Declaration</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      By proceeding, you acknowledge that you have read and understood all terms and conditions, house
                      rules, and cancellation policies. You agree to take full responsibility for the vehicle during the
                      rental period.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agree-terms"
                        checked={bookingData.agreeTerms}
                        onCheckedChange={(checked) =>
                          setBookingData({ ...bookingData, agreeTerms: checked as boolean })
                        }
                      />
                      <Label htmlFor="agree-terms" className="text-sm text-blue-700">
                        I agree to all terms and conditions
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Previous
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                      {loading ? "Processing..." : "Confirm Booking"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="font-serif">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={car.image || "/placeholder.svg"}
                    alt={`${car.make} ${car.model}`}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">
                      {car.make} {car.model}
                    </div>
                    <div className="text-sm text-muted-foreground">{car.year}</div>
                  </div>
                </div>

                <Separator />

                {bookingData.pickupDate && bookingData.dropoffDate && (
                  <>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>
                          {bookingData.rentalType === "daily" ? "Daily rate" : "Hourly rate"} × {pricing.duration}{" "}
                          {bookingData.rentalType === "daily" ? "days" : "hours"}
                        </span>
                        <span>₹{pricing.basePrice.toLocaleString()}</span>
                      </div>

                      {pricing.addOnPrice > 0 && (
                        <div className="flex justify-between">
                          <span>Add-ons</span>
                          <span>₹{pricing.addOnPrice.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>₹{pricing.serviceFee.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>GST (18%)</span>
                        <span>₹{pricing.gst.toLocaleString()}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{pricing.total.toLocaleString()}</span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      + ₹{car.depositAmount.toLocaleString()} security deposit (refundable)
                    </div>
                  </>
                )}

                {(!bookingData.pickupDate || !bookingData.dropoffDate) && (
                  <div className="text-center text-muted-foreground py-8">Select dates to see pricing</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

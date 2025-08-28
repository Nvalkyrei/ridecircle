"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, Fuel, Settings, Users, Shield, Calendar, Clock } from "lucide-react"
import { BookingForm } from "../booking/booking-form"

interface CarDetailsProps {
  carId: string
}

// Mock car data - in real app, this would come from API
const mockCarData = {
  id: "1",
  make: "Honda",
  model: "City",
  year: 2022,
  registrationNumber: "MH01AB1234",
  fuelType: "Petrol",
  transmission: "Manual",
  seatingCapacity: 5,
  city: "Mumbai",
  address: "Bandra West, Mumbai",
  pricePerDay: 1200,
  pricePerHour: 150,
  weeklyDiscount: 10,
  monthlyDiscount: 20,
  rating: 4.8,
  reviewCount: 45,
  features: [
    "Air Conditioning",
    "GPS Navigation",
    "Bluetooth",
    "USB Charging",
    "Power Steering",
    "Central Locking",
    "ABS",
    "Airbags",
  ],
  hostName: "Rajesh Kumar",
  hostRating: 4.9,
  hostExperience: "3 years",
  distance: 2.5,
  images: ["/honda-city-silver.png", "/honda-city-silver.png", "/honda-city-silver.png", "/honda-city-silver.png"],
  instantBooking: true,
  description:
    "Well-maintained Honda City with excellent fuel efficiency. Perfect for city drives and highway trips. The car is regularly serviced and comes with comprehensive insurance coverage.",
  houseRules: ["No Smoking", "Return with Same Fuel Level", "No Off-Road Driving", "Clean Interior Required"],
  depositType: "cash",
  depositAmount: 5000,
  cancellationPolicy: "Free cancellation up to 24 hours before pickup",
  insuranceCoverage: "Comprehensive insurance included",
}

export function CarDetails({ carId }: CarDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const searchParams = useSearchParams()
  const car = mockCarData

  useEffect(() => {
    const shouldOpenBooking = searchParams.get("book") === "true"
    if (shouldOpenBooking) {
      setShowBookingForm(true)
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Images */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video relative">
                  <img
                    src={car.images[selectedImage] || "/placeholder.svg"}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {car.instantBooking && <Badge className="bg-green-100 text-green-800">Instant Booking</Badge>}
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded px-3 py-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{car.rating}</span>
                      <span className="text-muted-foreground">({car.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Image Thumbnails */}
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {car.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? "border-primary" : "border-border"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Car Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-serif text-2xl">
                      {car.make} {car.model} ({car.year})
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {car.address}
                      </div>
                      <div>{car.distance} km away</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Specifications */}
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{car.fuelType}</div>
                        <div className="text-sm text-muted-foreground">Fuel Type</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{car.transmission}</div>
                        <div className="text-sm text-muted-foreground">Transmission</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{car.seatingCapacity} Seater</div>
                        <div className="text-sm text-muted-foreground">Capacity</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{car.year}</div>
                        <div className="text-sm text-muted-foreground">Model Year</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {car.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                </div>

                <Separator />

                {/* House Rules */}
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-3">House Rules</h3>
                  <div className="space-y-2">
                    {car.houseRules.map((rule) => (
                      <div key={rule} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span className="text-sm">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Host Information */}
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-3">Your Host</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-medium">{car.hostName.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{car.hostName}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {car.hostRating} rating • {car.hostExperience} hosting
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">₹{car.pricePerDay}</div>
                      <div className="text-sm text-muted-foreground">per day</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">₹{car.pricePerHour}/hour</div>
                      <div className="text-sm text-muted-foreground">hourly rate</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Discounts */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-800">Special Offers</div>
                    <div className="text-sm text-green-700">
                      {car.weeklyDiscount}% off weekly • {car.monthlyDiscount}% off monthly
                    </div>
                  </div>

                  {/* Security Deposit */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Security Deposit</span>
                    <span className="font-medium">₹{car.depositAmount.toLocaleString()}</span>
                  </div>

                  {/* Insurance */}
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">{car.insuranceCoverage}</span>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {car.cancellationPolicy}
                  </div>

                  <Separator />

                  <Button onClick={() => setShowBookingForm(true)} className="w-full" size="lg">
                    {car.instantBooking ? "Book Now" : "Request Booking"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">You won't be charged yet</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && <BookingForm car={car} onClose={() => setShowBookingForm(false)} />}
      </div>
    </div>
  )
}

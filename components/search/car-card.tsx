"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Fuel, Zap, Users } from "lucide-react"
import { useRouter } from "next/navigation"

interface Car {
  id: string
  make: string
  model: string
  year: number
  registrationNumber: string
  fuelType: string
  transmission: string
  city: string
  pricePerDay: number
  rating: number
  reviewCount: number
  features: string[]
  hostName: string
  distance: number
  image: string
  instantBooking: boolean
}

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  const router = useRouter()

  const getTransmissionIcon = (transmission: string) => {
    return transmission.toLowerCase() === "automatic" ? Zap : Users
  }

  const TransmissionIcon = getTransmissionIcon(car.transmission)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Car Image */}
          <div className="relative aspect-video md:aspect-square">
            <img
              src={car.image || "/placeholder.svg"}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {car.instantBooking && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm">
                  Instant Book
                </Badge>
              )}
            </div>
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">{car.rating}</span>
                <span className="text-xs text-slate-500">({car.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Car Details */}
          <div className="md:col-span-2 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-slate-900 mb-1">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {car.year} • Hosted by {car.hostName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">₹{car.pricePerDay.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">per day</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Fuel className="h-4 w-4 text-slate-400" />
                    <span className="capitalize">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <TransmissionIcon className="h-4 w-4 text-slate-400" />
                    <span className="capitalize">{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>5 Seater</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{car.distance} km away</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.slice(0, 3).map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 border-0"
                    >
                      {feature}
                    </Badge>
                  ))}
                  {car.features.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 border-0"
                    >
                      +{car.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 bg-transparent"
                  onClick={() => router.push(`/cars/${car.id}`)}
                >
                  View Details
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => router.push(`/cars/${car.id}?book=true`)}
                >
                  {car.instantBooking ? "Book Now" : "Request Booking"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

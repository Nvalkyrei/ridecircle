"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarCard } from "./car-card"

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

const mockCars: Car[] = [
  {
    id: "1",
    make: "Honda",
    model: "City",
    year: 2022,
    registrationNumber: "MH01AB1234",
    fuelType: "Petrol",
    transmission: "Manual",
    city: "Mumbai",
    pricePerDay: 1200,
    rating: 4.8,
    reviewCount: 45,
    features: ["AC", "GPS", "Bluetooth"],
    hostName: "Rajesh Kumar",
    distance: 2.5,
    image: "/honda-city-silver.png",
    instantBooking: true,
  },
  {
    id: "2",
    make: "Maruti",
    model: "Swift",
    year: 2021,
    registrationNumber: "MH02CD5678",
    fuelType: "Petrol",
    transmission: "Automatic",
    city: "Mumbai",
    pricePerDay: 1000,
    rating: 4.6,
    reviewCount: 32,
    features: ["AC", "Power Steering", "Central Locking"],
    hostName: "Priya Sharma",
    distance: 1.8,
    image: "/red-swift.png",
    instantBooking: false,
  },
  {
    id: "3",
    make: "Hyundai",
    model: "Creta",
    year: 2023,
    registrationNumber: "MH03EF9012",
    fuelType: "Diesel",
    transmission: "Automatic",
    city: "Mumbai",
    pricePerDay: 1800,
    rating: 4.9,
    reviewCount: 28,
    features: ["AC", "GPS", "Sunroof", "Reverse Camera"],
    hostName: "Amit Patel",
    distance: 3.2,
    image: "/hyundai-creta-white-suv.png",
    instantBooking: true,
  },
]

interface SearchResultsProps {
  searchParams: any
  onSortChange: (sortBy: string) => void
  isSearching: boolean
}

export function SearchResults({ searchParams, onSortChange, isSearching }: SearchResultsProps) {
  const [cars] = useState<Car[]>(mockCars)

  if (isSearching) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="font-serif text-lg font-semibold mb-2">Searching for cars...</h3>
          <p className="text-muted-foreground">Finding the best options for you</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-semibold">
                {cars.length} cars available in {searchParams.city || "your area"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchParams.pickupDate && searchParams.dropoffDate
                  ? `${new Date(searchParams.pickupDate).toLocaleDateString()} - ${new Date(
                      searchParams.dropoffDate,
                    ).toLocaleDateString()}`
                  : "Select dates to see availability"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={searchParams.sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="distance">Nearest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Car Results */}
      <div className="space-y-4">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {cars.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🚗</span>
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">No cars found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or dates</p>
            <Button variant="outline">Clear Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

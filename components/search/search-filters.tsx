"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Navigation } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

interface SearchFiltersProps {
  searchParams: any
  onSearchParamsChange: (params: any) => void
  onSearch: () => void
  isSearching: boolean
}

const indianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Surat",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivali",
  "Vasai-Virar",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Amritsar",
  "Navi Mumbai",
  "Allahabad",
  "Ranchi",
  "Howrah",
  "Coimbatore",
  "Jabalpur",
  "Gwalior",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Raipur",
  "Kota",
  "Guwahati",
  "Chandigarh",
  "Solapur",
  "Hubli-Dharwad",
]

export function SearchFilters({ searchParams, onSearchParamsChange, onSearch, isSearching }: SearchFiltersProps) {
  const [locationInput, setLocationInput] = useState("")
  const [filteredCities, setFilteredCities] = useState(indianCities.slice(0, 10))

  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          console.log("[v0] Location detected:", position.coords.latitude, position.coords.longitude)
          // For demo, we'll set to Mumbai
          onSearchParamsChange({ ...searchParams, city: "mumbai" })
        },
        (error) => {
          console.log("[v0] Location detection failed:", error)
        },
      )
    }
  }

  const handleLocationSearch = (value: string) => {
    setLocationInput(value)
    if (value) {
      const filtered = indianCities.filter((city) => city.toLowerCase().includes(value.toLowerCase())).slice(0, 10)
      setFilteredCities(filtered)
    } else {
      setFilteredCities(indianCities.slice(0, 10))
    }
  }

  const carFeatures = [
    "Air Conditioning",
    "GPS Navigation",
    "Bluetooth",
    "USB Charging",
    "Sunroof",
    "Reverse Camera",
    "Automatic Transmission",
    "Power Steering",
  ]

  return (
    <div className="space-y-6">
      {/* Location & Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Location & Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>City or Location</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search city..."
                  value={locationInput}
                  onChange={(e) => handleLocationSearch(e.target.value)}
                  className="mb-2"
                />
                <Select
                  value={searchParams.city}
                  onValueChange={(value) => {
                    onSearchParamsChange({ ...searchParams, city: value })
                    setLocationInput("")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCities.map((city) => (
                      <SelectItem key={city.toLowerCase()} value={city.toLowerCase()}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon" onClick={detectCurrentLocation} title="Use current location">
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Pickup Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchParams.pickupDate ? format(new Date(searchParams.pickupDate), "MMM dd") : "Select"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={searchParams.pickupDate ? new Date(searchParams.pickupDate) : undefined}
                    onSelect={(date) =>
                      onSearchParamsChange({ ...searchParams, pickupDate: date?.toISOString() || "" })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Dropoff Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchParams.dropoffDate ? format(new Date(searchParams.dropoffDate), "MMM dd") : "Select"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={searchParams.dropoffDate ? new Date(searchParams.dropoffDate) : undefined}
                    onSelect={(date) =>
                      onSearchParamsChange({ ...searchParams, dropoffDate: date?.toISOString() || "" })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Pickup Time</Label>
              <Input
                type="time"
                value={searchParams.pickupTime}
                onChange={(e) => onSearchParamsChange({ ...searchParams, pickupTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Dropoff Time</Label>
              <Input
                type="time"
                value={searchParams.dropoffTime}
                onChange={(e) => onSearchParamsChange({ ...searchParams, dropoffTime: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={onSearch} disabled={isSearching} className="w-full">
            {isSearching ? "Searching..." : "Search Cars"}
          </Button>
        </CardContent>
      </Card>

      {/* Car Type */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Car Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={searchParams.carType}
            onValueChange={(value) => onSearchParamsChange({ ...searchParams, carType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Type</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{searchParams.priceRange[0]}</span>
              <span>₹{searchParams.priceRange[1]}</span>
            </div>
            <Slider
              value={searchParams.priceRange}
              onValueChange={(value) => onSearchParamsChange({ ...searchParams, priceRange: value })}
              max={5000}
              min={500}
              step={100}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transmission */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Transmission</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={searchParams.transmission}
            onValueChange={(value) => onSearchParamsChange({ ...searchParams, transmission: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Transmission</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Fuel Type */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Fuel Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={searchParams.fuelType}
            onValueChange={(value) => onSearchParamsChange({ ...searchParams, fuelType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Fuel Type</SelectItem>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="cng">CNG</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {carFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={searchParams.features.includes(feature)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onSearchParamsChange({
                        ...searchParams,
                        features: [...searchParams.features, feature],
                      })
                    } else {
                      onSearchParamsChange({
                        ...searchParams,
                        features: searchParams.features.filter((f: string) => f !== feature),
                      })
                    }
                  }}
                />
                <Label htmlFor={feature} className="text-sm">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

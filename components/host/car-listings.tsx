"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

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
  status: "active" | "inactive" | "pending" | "maintenance"
  verificationStatus: "verified" | "pending" | "rejected"
  bookings: number
  earnings: number
  image: string
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
    status: "active",
    verificationStatus: "verified",
    bookings: 45,
    earnings: 54000,
    image: "/honda-city-silver.png",
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
    status: "active",
    verificationStatus: "verified",
    bookings: 32,
    earnings: 32000,
    image: "/red-swift.png",
  },
  {
    id: "3",
    make: "Hyundai",
    model: "Creta",
    year: 2023,
    registrationNumber: "MH03EF9012",
    fuelType: "Diesel",
    transmission: "Automatic",
    city: "Pune",
    pricePerDay: 1800,
    status: "pending",
    verificationStatus: "pending",
    bookings: 0,
    earnings: 0,
    image: "/hyundai-creta-white-suv.png",
  },
]

export function CarListings() {
  const [cars, setCars] = useState<Car[]>(mockCars)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const handleStatusToggle = (carId: string, newStatus: "active" | "inactive") => {
    setCars(cars.map((car) => (car.id === carId ? { ...car, status: newStatus } : car)))
    toast({
      title: "Status Updated",
      description: `Car listing ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
    })
  }

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || car.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">My Car Listings</CardTitle>
          <CardDescription>Manage your fleet and track performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by make, model, or registration number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Car Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={car.image || "/placeholder.svg"}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge className={getStatusColor(car.status)}>{car.status}</Badge>
                <Badge className={getVerificationColor(car.verificationStatus)}>{car.verificationStatus}</Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold">
                    {car.make} {car.model} ({car.year})
                  </h3>
                  <p className="text-sm text-muted-foreground">{car.registrationNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Fuel:</span> {car.fuelType}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transmission:</span> {car.transmission}
                  </div>
                  <div>
                    <span className="text-muted-foreground">City:</span> {car.city}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price:</span> ₹{car.pricePerDay}/day
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Bookings:</span> {car.bookings}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Earnings:</span> ₹{car.earnings.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={car.status === "active"}
                      onCheckedChange={(checked) => handleStatusToggle(car.id, checked ? "active" : "inactive")}
                      disabled={car.verificationStatus !== "verified"}
                    />
                    <span className="text-sm text-muted-foreground">
                      {car.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🚗</span>
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">No cars found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start by adding your first car to the platform"}
            </p>
            <Button>Add Your First Car</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Booking {
  id: string
  customerName: string
  customerPhone: string
  carDetails: string
  registrationNumber: string
  startDate: string
  endDate: string
  totalAmount: number
  status: "upcoming" | "active" | "completed" | "cancelled"
  pickupLocation: string
  duration: string
}

const mockBookings: Booking[] = [
  {
    id: "1",
    customerName: "Rahul Sharma",
    customerPhone: "+91 9876543210",
    carDetails: "Honda City 2022",
    registrationNumber: "MH01AB1234",
    startDate: "2024-01-15",
    endDate: "2024-01-18",
    totalAmount: 3600,
    status: "upcoming",
    pickupLocation: "Bandra West, Mumbai",
    duration: "3 days",
  },
  {
    id: "2",
    customerName: "Priya Patel",
    customerPhone: "+91 9876543211",
    carDetails: "Maruti Swift 2021",
    registrationNumber: "MH02CD5678",
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    totalAmount: 2000,
    status: "active",
    pickupLocation: "Andheri East, Mumbai",
    duration: "2 days",
  },
  {
    id: "3",
    customerName: "Amit Kumar",
    customerPhone: "+91 9876543212",
    carDetails: "Honda City 2022",
    registrationNumber: "MH01AB1234",
    startDate: "2024-01-05",
    endDate: "2024-01-07",
    totalAmount: 2400,
    status: "completed",
    pickupLocation: "Powai, Mumbai",
    duration: "2 days",
  },
]

export function BookingManagement() {
  const [bookings] = useState<Booking[]>(mockBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carDetails.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBookingsByStatus = (status: string) => {
    return bookings.filter((booking) => booking.status === status)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{getBookingsByStatus("upcoming").length}</div>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{getBookingsByStatus("active").length}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{getBookingsByStatus("completed").length}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Booking Management</CardTitle>
          <CardDescription>Track and manage all your car bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by customer name, car, or registration number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-semibold">{booking.customerName}</h3>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Car: {booking.carDetails}</div>
                    <div>Registration: {booking.registrationNumber}</div>
                    <div>Duration: {booking.duration}</div>
                    <div>Amount: ₹{booking.totalAmount.toLocaleString()}</div>
                    <div>Pickup: {booking.pickupLocation}</div>
                    <div>Phone: {booking.customerPhone}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Period: </span>
                    {new Date(booking.startDate).toLocaleDateString()} -{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {booking.status === "upcoming" && (
                    <>
                      <Button size="sm">Contact Customer</Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </>
                  )}
                  {booking.status === "active" && (
                    <>
                      <Button size="sm">Track Trip</Button>
                      <Button size="sm" variant="outline">
                        Emergency Support
                      </Button>
                    </>
                  )}
                  {booking.status === "completed" && (
                    <>
                      <Button size="sm" variant="outline">
                        View Invoice
                      </Button>
                      <Button size="sm" variant="outline">
                        Rate Customer
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Your bookings will appear here once customers start renting your cars"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

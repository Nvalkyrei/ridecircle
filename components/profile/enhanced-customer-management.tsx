"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Search,
  Filter,
  Upload,
  FileText,
  Camera,
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  kycStatus: "pending" | "verified" | "rejected"
  documentsUploaded: string[]
  totalBookings: number
  totalSpent: number
  lastBooking: string
  rating: number
  notes: string
  createdAt: string
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    phone: "+91 9876543210",
    email: "rahul@example.com",
    address: "Bandra West, Mumbai",
    kycStatus: "verified",
    documentsUploaded: ["aadhaar", "driving_license", "selfie"],
    totalBookings: 5,
    totalSpent: 12500,
    lastBooking: "2024-01-15",
    rating: 4.8,
    notes: "Excellent customer, always returns car in good condition",
    createdAt: "2023-12-01",
  },
  {
    id: "2",
    name: "Priya Patel",
    phone: "+91 9876543211",
    email: "priya@example.com",
    address: "Andheri East, Mumbai",
    kycStatus: "pending",
    documentsUploaded: ["aadhaar"],
    totalBookings: 2,
    totalSpent: 3600,
    lastBooking: "2024-01-10",
    rating: 4.5,
    notes: "New customer, KYC pending completion",
    createdAt: "2024-01-05",
  },
]

export function EnhancedCustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showCreateBooking, setShowCreateBooking] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  })
  const { toast } = useToast()

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || customer.kycStatus === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Missing Information",
        description: "Name and phone number are required",
        variant: "destructive",
      })
      return
    }

    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      kycStatus: "pending",
      documentsUploaded: [],
      totalBookings: 0,
      totalSpent: 0,
      lastBooking: "",
      rating: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setCustomers([...customers, customer])
    setNewCustomer({ name: "", phone: "", email: "", address: "", notes: "" })
    setShowAddCustomer(false)

    toast({
      title: "Customer Added",
      description: "Customer has been added successfully. KYC verification required.",
    })
  }

  const handleKYCVerification = (customerId: string, documents: string[]) => {
    // Simulate KYC API integration
    setCustomers(
      customers.map((customer) =>
        customer.id === customerId ? { ...customer, documentsUploaded: documents, kycStatus: "verified" } : customer,
      ),
    )

    toast({
      title: "KYC Verified",
      description: "Customer KYC has been successfully verified",
    })
  }

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Customer Management</h2>
          <p className="text-muted-foreground">Manage customers, KYC verification, and create bookings</p>
        </div>
        <Button onClick={() => setShowAddCustomer(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending KYC</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(customer.kycStatus)} border-0`}>
                      {getStatusIcon(customer.kycStatus)}
                      <span className="ml-1 capitalize">{customer.kycStatus}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Bookings</span>
                      <div className="font-medium">{customer.totalBookings}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Spent</span>
                      <div className="font-medium">₹{customer.totalSpent.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Booking</span>
                      <div className="font-medium">{customer.lastBooking || "Never"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rating</span>
                      <div className="font-medium">{customer.rating > 0 ? `${customer.rating}/5` : "N/A"}</div>
                    </div>
                  </div>

                  {customer.notes && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm">{customer.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 min-w-48">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(customer)
                      setShowCreateBooking(true)
                    }}
                    disabled={customer.kycStatus !== "verified"}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Booking
                  </Button>

                  {customer.kycStatus === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleKYCVerification(customer.id, ["aadhaar", "driving_license", "selfie"])}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Complete KYC
                    </Button>
                  )}

                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="documents">Documents & KYC</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="customer@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  placeholder="Any additional notes about the customer"
                  rows={2}
                />
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="text-center py-8">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Document Upload</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload customer documents for KYC verification</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex-col bg-transparent">
                    <FileText className="h-6 w-6 mb-2" />
                    Aadhaar Card
                  </Button>
                  <Button variant="outline" className="h-24 flex-col bg-transparent">
                    <CreditCard className="h-6 w-6 mb-2" />
                    Driving License
                  </Button>
                  <Button variant="outline" className="h-24 flex-col bg-transparent">
                    <Camera className="h-6 w-6 mb-2" />
                    Selfie Photo
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddCustomer(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer} className="bg-emerald-600 hover:bg-emerald-700">
              Add Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Booking Dialog */}
      {showCreateBooking && selectedCustomer && (
        <Dialog open={showCreateBooking} onOpenChange={setShowCreateBooking}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Booking for {selectedCustomer.name}</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Booking creation interface would be integrated here with car selection, dates, pricing, and payment
                processing.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

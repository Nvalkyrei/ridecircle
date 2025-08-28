"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Star,
  Calendar,
  CreditCard,
} from "lucide-react"

export function HostCRM() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data
  const businessMetrics = {
    totalCustomers: 245,
    activeBookings: 12,
    monthlyRevenue: 185000,
    averageRating: 4.7,
    totalTrips: 1240,
    repeatCustomers: 68,
  }

  const customers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh@email.com",
      totalBookings: 8,
      totalSpent: 24000,
      lastBooking: "2024-12-15",
      rating: 4.8,
      status: "verified",
      notes: "Excellent customer, always returns car in good condition",
    },
    {
      id: 2,
      name: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya@email.com",
      totalBookings: 3,
      totalSpent: 9600,
      lastBooking: "2024-12-10",
      rating: 4.5,
      status: "verified",
      notes: "Punctual and responsible driver",
    },
    {
      id: 3,
      name: "Amit Singh",
      phone: "+91 76543 21098",
      email: "amit@email.com",
      totalBookings: 1,
      totalSpent: 2400,
      lastBooking: "2024-12-08",
      rating: 3.2,
      status: "flagged",
      notes: "Late return, minor damage reported",
    },
  ]

  const invoices = [
    {
      id: "INV-001",
      customer: "Rajesh Kumar",
      amount: 3200,
      status: "paid",
      date: "2024-12-15",
      dueDate: "2024-12-20",
    },
    {
      id: "INV-002",
      customer: "Priya Sharma",
      amount: 2800,
      status: "pending",
      date: "2024-12-10",
      dueDate: "2024-12-15",
    },
    {
      id: "INV-003",
      customer: "Amit Singh",
      amount: 2400,
      status: "overdue",
      date: "2024-12-08",
      dueDate: "2024-12-13",
    },
  ]

  const recentBookings = [
    {
      id: 1,
      customer: "Rajesh Kumar",
      car: "Honda City",
      dates: "Dec 20-22, 2024",
      amount: 3200,
      status: "ongoing",
    },
    {
      id: 2,
      customer: "Neha Patel",
      car: "Swift Dzire",
      dates: "Dec 18-20, 2024",
      amount: 2400,
      status: "completed",
    },
    {
      id: 3,
      customer: "Vikram Joshi",
      car: "Hyundai Creta",
      dates: "Dec 25-27, 2024",
      amount: 4800,
      status: "upcoming",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Host CRM</h1>
          <p className="text-slate-600">Manage your car rental business</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Business Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessMetrics.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">{businessMetrics.repeatCustomers} repeat customers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(businessMetrics.monthlyRevenue / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessMetrics.averageRating}</div>
                  <p className="text-xs text-muted-foreground">Based on {businessMetrics.totalTrips} trips</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessMetrics.activeBookings}</div>
                  <p className="text-xs text-muted-foreground">Currently ongoing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessMetrics.totalTrips}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((businessMetrics.repeatCustomers / businessMetrics.totalCustomers) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Customer retention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.customer}</p>
                          <p className="text-sm text-slate-600">
                            {booking.car} • {booking.dates}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{booking.amount}</p>
                          <Badge
                            variant={
                              booking.status === "ongoing"
                                ? "default"
                                : booking.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customers
                      .sort((a, b) => b.totalSpent - a.totalSpent)
                      .slice(0, 3)
                      .map((customer) => (
                        <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-slate-600">
                              {customer.totalBookings} bookings • ⭐ {customer.rating}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{customer.totalSpent.toLocaleString()}</p>
                            <p className="text-xs text-slate-500">Total spent</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Database</CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search customers..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div key={customer.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{customer.name}</h3>
                            <Badge variant={customer.status === "verified" ? "secondary" : "destructive"}>
                              {customer.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">
                            {customer.phone} • {customer.email}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span>{customer.totalBookings} bookings</span>
                            <span>₹{customer.totalSpent.toLocaleString()} spent</span>
                            <span>⭐ {customer.rating}</span>
                            <span>Last: {customer.lastBooking}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                      {customer.notes && (
                        <div className="bg-slate-50 p-3 rounded text-sm">
                          <strong>Notes:</strong> {customer.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Management</CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search invoices..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{invoice.id}</p>
                          <Badge
                            variant={
                              invoice.status === "paid"
                                ? "secondary"
                                : invoice.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{invoice.customer}</p>
                        <p className="text-xs text-slate-500">
                          Created: {invoice.date} • Due: {invoice.dueDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">₹{invoice.amount}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blacklist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blacklist Management</CardTitle>
                <p className="text-sm text-slate-600">
                  Check customers against pan-India blacklist and manage your own blacklist
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Input placeholder="Enter customer phone or email to check..." className="flex-1" />
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Check Blacklist
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Recent Blacklist Checks</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div>
                        <p className="font-medium">Rajesh Kumar (+91 98765 43210)</p>
                        <p className="text-sm text-slate-600">Checked on Dec 20, 2024</p>
                      </div>
                      <Badge variant="secondary">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Clear
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                      <div>
                        <p className="font-medium">Unknown User (+91 99999 99999)</p>
                        <p className="text-sm text-slate-600">Checked on Dec 19, 2024</p>
                      </div>
                      <Badge variant="destructive">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Flagged
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Monthly Revenue Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Profit & Loss Statement
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Reconciliation
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Tax Summary Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="w-4 h-4 mr-2" />
                    Customer Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="w-4 h-4 mr-2" />
                    Booking Trends
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Star className="w-4 h-4 mr-2" />
                    Rating & Reviews Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Fleet Performance
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Customers
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Bookings
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" defaultValue="Suresh Car Rentals" />
                  </div>
                  <div>
                    <Label htmlFor="gst">GST Number</Label>
                    <Input id="gst" defaultValue="27AAAAA0000A1Z5" />
                  </div>
                  <div>
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea id="address" defaultValue="123 Main Street, Mumbai, Maharashtra 400001" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invoice Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                    <Input id="invoicePrefix" defaultValue="INV-" />
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Payment Terms (days)</Label>
                    <Input id="paymentTerms" type="number" defaultValue="7" />
                  </div>
                  <div>
                    <Label htmlFor="bankDetails">Bank Details</Label>
                    <Textarea id="bankDetails" placeholder="Enter bank account details for payments" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-slate-600">Manage staff access to your CRM</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Suresh Gupta (Owner)</p>
                      <p className="text-sm text-slate-600">suresh@email.com • Full Access</p>
                    </div>
                    <Badge variant="secondary">Owner</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Ravi Kumar (Manager)</p>
                      <p className="text-sm text-slate-600">ravi@email.com • Booking Management</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

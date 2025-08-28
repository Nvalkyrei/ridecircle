"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Car,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  FileText,
  MessageSquare,
  TrendingUp,
  Shield,
  Settings,
  Download,
  Bell,
  Activity,
  Clock,
  UserCheck,
  AlertCircle,
  BarChart3,
} from "lucide-react"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const metrics = {
    totalUsers: 12450,
    activeListings: 3240,
    ongoingBookings: 156,
    monthlyRevenue: 2450000,
    pendingVerifications: 23,
    activeDisputes: 8,
    completedTrips: 8945,
    averageRating: 4.6,
    conversionRate: 12.5,
    churnRate: 3.2,
    platformFee: 245000,
    hostEarnings: 2205000,
  }

  const userStats = {
    totalCustomers: 8950,
    totalHosts: 3500,
    verifiedUsers: 11200,
    newSignups: 145,
    activeUsers: 6780,
    suspendedUsers: 23,
  }

  const financialData = {
    totalRevenue: 2450000,
    platformRevenue: 245000,
    hostPayouts: 2205000,
    pendingPayouts: 125000,
    refundsProcessed: 45000,
    taxesCollected: 441000,
  }

  const systemHealth = {
    uptime: 99.8,
    responseTime: 245,
    errorRate: 0.02,
    activeConnections: 1250,
    queuedJobs: 45,
    failedJobs: 2,
  }

  const pendingKYC = [
    {
      id: 1,
      name: "Rahul Sharma",
      type: "Customer",
      document: "Aadhaar",
      status: "pending",
      date: "2024-12-20",
      priority: "high",
    },
    {
      id: 2,
      name: "Priya Patel",
      type: "Host",
      document: "Driving License",
      status: "pending",
      date: "2024-12-20",
      priority: "medium",
    },
    {
      id: 3,
      name: "Amit Kumar",
      type: "Customer",
      document: "Aadhaar",
      status: "pending",
      date: "2024-12-19",
      priority: "low",
    },
  ]

  const pendingCars = [
    {
      id: 1,
      owner: "Suresh Gupta",
      car: "Honda City 2022",
      documents: "RC, Insurance",
      status: "pending",
      date: "2024-12-20",
      location: "Bangalore",
    },
    {
      id: 2,
      owner: "Neha Singh",
      car: "Maruti Swift 2021",
      documents: "RC, PUC",
      status: "pending",
      date: "2024-12-19",
      location: "Mumbai",
    },
  ]

  const recentBookings = [
    {
      id: 1,
      customer: "Rajesh Kumar",
      car: "Honda City",
      host: "Suresh G.",
      amount: 2400,
      status: "ongoing",
      date: "2024-12-20",
      duration: "3 days",
    },
    {
      id: 2,
      customer: "Anita Sharma",
      car: "Swift Dzire",
      host: "Priya P.",
      amount: 1800,
      status: "completed",
      date: "2024-12-19",
      duration: "2 days",
    },
    {
      id: 3,
      customer: "Vikram Singh",
      car: "Hyundai Creta",
      host: "Amit K.",
      amount: 3200,
      status: "upcoming",
      date: "2024-12-21",
      duration: "4 days",
    },
  ]

  const disputes = [
    {
      id: 1,
      customer: "Rohit Verma",
      host: "Deepak Shah",
      issue: "Car damage claim",
      priority: "high",
      date: "2024-12-18",
      amount: 15000,
      status: "investigating",
    },
    {
      id: 2,
      customer: "Kavya Reddy",
      host: "Sanjay Joshi",
      issue: "Late return dispute",
      priority: "medium",
      date: "2024-12-19",
      amount: 500,
      status: "pending",
    },
  ]

  const cityAnalytics = [
    { city: "Bangalore", bookings: 2450, revenue: 850000, hosts: 890, growth: 15.2 },
    { city: "Mumbai", bookings: 1980, revenue: 720000, hosts: 750, growth: 12.8 },
    { city: "Delhi", bookings: 1750, revenue: 650000, hosts: 680, growth: 18.5 },
    { city: "Pune", bookings: 1200, revenue: 420000, hosts: 450, growth: 22.1 },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Comprehensive platform management and analytics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="cars">Cars</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.activeListings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(metrics.monthlyRevenue / 100000).toFixed(1)}L</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.completedTrips.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Avg Rating: {metrics.averageRating}/5</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{metrics.pendingVerifications}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
                  <MessageSquare className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{metrics.activeDisputes}</div>
                  <p className="text-xs text-muted-foreground">Needs resolution</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +2.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{systemHealth.uptime}%</div>
                  <p className="text-xs text-muted-foreground">Uptime this month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            {booking.car} • {booking.host}
                          </p>
                          <p className="text-xs text-slate-500">{booking.duration}</p>
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
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Platform Revenue</span>
                      <span className="font-medium">₹{(financialData.platformRevenue / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Host Payouts</span>
                      <span className="font-medium">₹{(financialData.hostPayouts / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Pending Payouts</span>
                      <span className="font-medium text-orange-600">
                        ₹{(financialData.pendingPayouts / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Taxes Collected</span>
                      <span className="font-medium">₹{(financialData.taxesCollected / 1000).toFixed(0)}K</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Revenue</span>
                      <span className="font-bold">₹{(financialData.totalRevenue / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>System Uptime</span>
                        <span>{systemHealth.uptime}%</span>
                      </div>
                      <Progress value={systemHealth.uptime} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Time</span>
                        <span>{systemHealth.responseTime}ms</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Active Connections</span>
                      <span className="font-medium">{systemHealth.activeConnections}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Queued Jobs</span>
                      <span className="font-medium">{systemHealth.queuedJobs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Failed Jobs</span>
                      <span className="font-medium text-red-600">{systemHealth.failedJobs}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalCustomers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Active: {userStats.activeUsers.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Hosts</CardTitle>
                  <Car className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalHosts.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Verified: {Math.floor(userStats.totalHosts * 0.85).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Signups</CardTitle>
                  <UserCheck className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.newSignups}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users by name, email, or phone..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="customers">Customers</SelectItem>
                      <SelectItem value="hosts">Hosts</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>User management interface would be implemented here</p>
                  <p className="text-sm">Search and filter functionality, user details, verification status, etc.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>KYC Verification Management</CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or document..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingKYC.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-slate-600">
                            {item.type} • {item.document}
                          </p>
                          <p className="text-xs text-slate-500">Submitted: {item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.status}</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" variant="default">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cars" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Car Document Verification</CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by owner or car..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingCars.map((car) => (
                    <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{car.car}</p>
                          <p className="text-sm text-slate-600">Owner: {car.owner}</p>
                          <p className="text-xs text-slate-500">
                            Documents: {car.documents} • Submitted: {car.date} • Location: {car.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{car.status}</Badge>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-1" />
                          View Docs
                        </Button>
                        <Button size="sm" variant="default">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search bookings..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{booking.customer}</p>
                        <p className="text-sm text-slate-600">
                          {booking.car} • Host: {booking.host}
                        </p>
                        <p className="text-xs text-slate-500">
                          Date: {booking.date} • Amount: ₹{booking.amount} • Duration: {booking.duration}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
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
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dispute Management</CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search disputes..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{dispute.issue}</p>
                        <p className="text-sm text-slate-600">
                          Customer: {dispute.customer} • Host: {dispute.host}
                        </p>
                        <p className="text-xs text-slate-500">
                          Reported: {dispute.date} • Amount: ₹{dispute.amount}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={dispute.priority === "high" ? "destructive" : "secondary"}>
                          {dispute.priority} priority
                        </Badge>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>City-wise Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cityAnalytics.map((city) => (
                      <div key={city.city} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{city.city}</span>
                          <span className="text-sm text-slate-600">
                            {city.growth > 0 ? "+" : ""}
                            {city.growth}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Bookings</p>
                            <p className="font-medium">{city.bookings}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Revenue</p>
                            <p className="font-medium">₹{(city.revenue / 100000).toFixed(1)}L</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Hosts</p>
                            <p className="font-medium">{city.hosts}</p>
                          </div>
                        </div>
                        <Progress value={(city.growth + 20) * 2} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">₹{(metrics.monthlyRevenue / 100000).toFixed(1)}L</div>
                      <p className="text-sm text-slate-600">Total Monthly Revenue</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Platform Fee (10%)</span>
                        <span className="font-medium">₹{(metrics.platformFee / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Host Earnings (90%)</span>
                        <span className="font-medium">₹{(metrics.hostEarnings / 100000).toFixed(1)}L</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm">Avg. Booking Value</span>
                        <span className="font-medium">₹{Math.floor(metrics.monthlyRevenue / 1200)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Conversion Rate</span>
                        <span className="font-medium">{metrics.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{systemHealth.uptime}%</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemHealth.responseTime}ms</div>
                  <p className="text-xs text-muted-foreground">Average response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemHealth.errorRate}%</div>
                  <p className="text-xs text-muted-foreground">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Users className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemHealth.activeConnections}</div>
                  <p className="text-xs text-muted-foreground">Current connections</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Queue Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Notification Queue</span>
                      <Badge variant="outline">{systemHealth.queuedJobs} pending</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Payment Processing</span>
                      <Badge variant="outline">12 pending</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Document Verification</span>
                      <Badge variant="outline">8 pending</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Failed Jobs</span>
                      <Badge variant="destructive">{systemHealth.failedJobs} failed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      System Configuration
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export System Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Bell className="w-4 h-4 mr-2" />
                      Send System Notification
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

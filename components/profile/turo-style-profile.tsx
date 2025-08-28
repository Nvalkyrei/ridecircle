"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Car,
  Settings,
  CreditCard,
  FileText,
  Calendar,
  Camera,
  Wrench,
  Calculator,
  QrCode,
  Download,
  Share2,
  ChevronRight,
  Star,
  Shield,
  Clock,
} from "lucide-react"
import Image from "next/image"

export function TuroStyleProfile() {
  const [userType, setUserType] = useState<"guest" | "host">("guest")
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">John Doe</h1>
              <p className="text-slate-400">Member since 2024</p>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm">4.9 rating</span>
                <Badge variant="secondary" className="bg-green-900 text-green-300">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>

          {/* User Type Toggle */}
          <div className="flex space-x-2 mb-6">
            <Button
              variant={userType === "guest" ? "default" : "outline"}
              onClick={() => setUserType("guest")}
              className={userType === "guest" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-slate-300"}
            >
              Guest Mode
            </Button>
            <Button
              variant={userType === "host" ? "default" : "outline"}
              onClick={() => setUserType("host")}
              className={userType === "host" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-slate-300"}
            >
              Host Mode
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {userType === "guest" ? (
          <GuestProfile />
        ) : (
          <HostProfile activeSection={activeSection} setActiveSection={setActiveSection} />
        )}
      </div>
    </div>
  )
}

function GuestProfile() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-slate-400">Total Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">48</p>
                <p className="text-slate-400">Hours Driven</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">4.9</p>
                <p className="text-slate-400">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((booking) => (
              <div key={booking} className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                <Image
                  src="/honda-city-silver.png"
                  alt="Car"
                  width={80}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-white">Honda City 2023</h4>
                  <p className="text-slate-400">Jan 15-17, 2024</p>
                  <Badge variant="secondary" className="bg-green-900 text-green-300 mt-1">
                    Completed
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">₹4,500</p>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { icon: User, label: "Personal Information", desc: "Update your profile details" },
              { icon: Shield, label: "Verification", desc: "Complete your identity verification" },
              { icon: CreditCard, label: "Payment Methods", desc: "Manage your payment options" },
              { icon: Settings, label: "Preferences", desc: "Notification and privacy settings" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-slate-700 rounded-lg cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-white">{item.label}</p>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HostProfile({
  activeSection,
  setActiveSection,
}: { activeSection: string; setActiveSection: (section: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Host Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">5</p>
                <p className="text-slate-400">Active Cars</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">28</p>
                <p className="text-slate-400">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">₹45,000</p>
                <p className="text-slate-400">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">4.8</p>
                <p className="text-slate-400">Host Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Host Navigation */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Host Management</CardTitle>
          <CardDescription className="text-slate-400">
            Manage your fleet, bookings, and business operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Car,
                label: "Fleet Management",
                desc: "Add, edit, and manage your cars",
                section: "fleet",
              },
              {
                icon: Calendar,
                label: "Booking Management",
                desc: "View and manage reservations",
                section: "bookings",
              },
              {
                icon: Wrench,
                label: "Service & Parts",
                desc: "Track maintenance and parts pricing",
                section: "service",
              },
              {
                icon: Calculator,
                label: "Damage Assessment",
                desc: "Calculate repair costs and surveys",
                section: "damage",
              },
              {
                icon: FileText,
                label: "CRM & Invoicing",
                desc: "Customer management and billing",
                section: "crm",
              },
              {
                icon: QrCode,
                label: "Payment QR Codes",
                desc: "Generate UPI payment codes",
                section: "payments",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-slate-700 rounded-lg cursor-pointer border border-slate-600"
                onClick={() => setActiveSection(item.section)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="font-medium text-white">{item.label}</p>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Section Content */}
      {activeSection !== "overview" && <HostSectionContent section={activeSection} />}
    </div>
  )
}

function HostSectionContent({ section }: { section: string }) {
  switch (section) {
    case "fleet":
      return <FleetManagement />
    case "service":
      return <ServicePartsManagement />
    case "damage":
      return <DamageAssessment />
    case "crm":
      return <HostCRM />
    case "payments":
      return <PaymentQRCodes />
    default:
      return null
  }
}

function FleetManagement() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Fleet Management</CardTitle>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Car className="w-4 h-4 mr-2" />
          Add New Car
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((car) => (
            <div key={car} className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
              <Image
                src="/honda-city-silver.png"
                alt="Car"
                width={100}
                height={75}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-white">Honda City 2023</h4>
                <p className="text-slate-400">MH12AB1234 • Available</p>
                <div className="flex space-x-2 mt-2">
                  <Badge variant="secondary" className="bg-green-900 text-green-300">
                    Active
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-900 text-blue-300">
                    Verified
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">₹2,500/day</p>
                <div className="flex space-x-2 mt-2">
                  <Button variant="ghost" size="sm" className="text-blue-400">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400">
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ServicePartsManagement() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Service & Parts Management</CardTitle>
        <CardDescription className="text-slate-400">
          Track maintenance costs and parts pricing for damage calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="parts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="parts" className="data-[state=active]:bg-slate-600">
              Parts Pricing
            </TabsTrigger>
            <TabsTrigger value="service" className="data-[state=active]:bg-slate-600">
              Service History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="parts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { category: "Engine", items: ["Oil Filter: ₹500", "Air Filter: ₹300", "Spark Plugs: ₹800"] },
                { category: "Body", items: ["Front Bumper: ₹8,000", "Headlight: ₹3,500", "Side Mirror: ₹1,200"] },
                { category: "Interior", items: ["Seat Cover: ₹2,000", "Dashboard: ₹5,000", "Steering: ₹3,000"] },
                { category: "Tires", items: ["Front Tire: ₹4,500", "Rear Tire: ₹4,500", "Spare Tire: ₹4,000"] },
              ].map((category, index) => (
                <Card key={index} className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center">
                          <span className="text-slate-300">{item.split(":")[0]}</span>
                          <span className="text-white font-semibold">{item.split(":")[1]}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="service">
            <div className="space-y-4">
              {[1, 2, 3].map((service) => (
                <div key={service} className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white">Regular Service - Honda City</h4>
                      <p className="text-slate-400">Jan 15, 2024 • 45,000 km</p>
                      <p className="text-sm text-slate-300 mt-1">Oil change, filter replacement, general inspection</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">₹3,500</p>
                      <Badge variant="secondary" className="bg-green-900 text-green-300 mt-1">
                        Completed
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function DamageAssessment() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Damage Assessment & Survey</CardTitle>
        <CardDescription className="text-slate-400">
          Calculate repair costs and manage damage surveys with photo documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quick Calculator */}
          <div className="p-4 bg-slate-700 rounded-lg">
            <h4 className="font-semibold text-white mb-4">Quick Damage Calculator</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Damage Type</label>
                <select className="w-full p-2 bg-slate-600 border border-slate-500 rounded text-white">
                  <option>Select damage type</option>
                  <option>Scratch (Minor)</option>
                  <option>Dent (Small)</option>
                  <option>Dent (Large)</option>
                  <option>Bumper Damage</option>
                  <option>Headlight Damage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Severity</label>
                <select className="w-full p-2 bg-slate-600 border border-slate-500 rounded text-white">
                  <option>Minor</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                </select>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-600 rounded">
              <p className="text-white">
                Estimated Cost: <span className="font-bold text-yellow-400">₹2,500</span>
              </p>
              <p className="text-slate-300 text-sm">+ Downtime: 2 days (₹5,000)</p>
            </div>
          </div>

          {/* Recent Assessments */}
          <div>
            <h4 className="font-semibold text-white mb-4">Recent Damage Reports</h4>
            <div className="space-y-4">
              {[1, 2].map((report) => (
                <div key={report} className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold text-white">Honda City - MH12AB1234</h5>
                      <p className="text-slate-400">Reported: Jan 20, 2024</p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-900 text-orange-300">
                      Pending
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {[1, 2, 3, 4].map((photo) => (
                      <div
                        key={photo}
                        className="aspect-square bg-slate-600 rounded-lg flex items-center justify-center"
                      >
                        <Camera className="w-6 h-6 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-300">Front bumper scratch, minor dent</p>
                    <p className="font-semibold text-white">₹3,500</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function HostCRM() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Customer Relationship Management</CardTitle>
        <CardDescription className="text-slate-400">
          Manage customers, create bookings, and generate invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="customers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="customers" className="data-[state=active]:bg-slate-600">
              Customers
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-slate-600">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-slate-600">
              Invoices
            </TabsTrigger>
          </TabsList>
          <TabsContent value="customers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-white">Customer Database</h4>
              <Button className="bg-blue-600 hover:bg-blue-700">Add Customer</Button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((customer) => (
                <div key={customer} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Jai Karosiya</p>
                      <p className="text-sm text-slate-400">+91 9665344239 • 5 bookings</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-blue-400">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-green-400">
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="invoices" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-white">Invoice Management</h4>
              <Button className="bg-blue-600 hover:bg-blue-700">Create Invoice</Button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((invoice) => (
                <div key={invoice} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Invoice #204</p>
                    <p className="text-slate-400">Jai Karosiya • Jan 16, 2024</p>
                    <p className="text-sm text-slate-300">Triber MH03DK3320 • 2 days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">₹4,000</p>
                    <div className="flex space-x-2 mt-2">
                      <Button variant="ghost" size="sm" className="text-blue-400">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="ghost" size="sm" className="text-green-400">
                        <Share2 className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function PaymentQRCodes() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">UPI Payment QR Codes</CardTitle>
        <CardDescription className="text-slate-400">Generate QR codes for direct customer payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* QR Generator */}
          <div className="p-4 bg-slate-700 rounded-lg">
            <h4 className="font-semibold text-white mb-4">Generate Payment QR</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="4000"
                  className="w-full p-2 bg-slate-600 border border-slate-500 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Customer Name</label>
                <input
                  type="text"
                  placeholder="Jai Karosiya"
                  className="w-full p-2 bg-slate-600 border border-slate-500 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Invoice Number</label>
                <input
                  type="text"
                  placeholder="204"
                  className="w-full p-2 bg-slate-600 border border-slate-500 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">UPI ID</label>
                <input
                  type="text"
                  placeholder="carrevv25@paytm"
                  className="w-full p-2 bg-slate-600 border border-slate-500 rounded text-white"
                />
              </div>
            </div>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </Button>
          </div>

          {/* Generated QR */}
          <div className="flex justify-center">
            <div className="p-6 bg-white rounded-lg">
              <div className="w-48 h-48 bg-slate-200 rounded-lg flex items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-600" />
              </div>
              <p className="text-center text-slate-800 mt-2 font-semibold">₹4,000</p>
              <p className="text-center text-slate-600 text-sm">Invoice #204</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

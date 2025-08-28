"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Download,
  Edit,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  FileSignature,
  Printer,
  Users,
  Search,
  Eye,
  Phone,
  Mail,
  BarChart3,
  PieChart,
  Star,
  MessageCircle,
  FileText,
  Upload,
} from "lucide-react"

interface Booking {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  carModel: string
  carNumber: string
  startDate: string
  endDate: string
  amount: number
  status: "confirmed" | "active" | "completed" | "cancelled"
  paymentStatus: "paid" | "pending" | "overdue"
  specialTerms?: string
}

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  totalBookings: number
  totalSpent: number
  rating: number
  lastBooking: string
  status: "active" | "blacklisted" | "new"
  notes: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  bookingId: string
  amount: number
  tax: number
  total: number
  status: "paid" | "pending" | "overdue"
  dueDate: string
  createdDate: string
}

interface Agreement {
  id: string
  agreementNumber: string
  customerName: string
  carModel: string
  bookingId: string
  status: "draft" | "sent" | "signed" | "expired"
  createdDate: string
  signedDate?: string
  terms: string
}

export function EnhancedCRM() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showAddBooking, setShowAddBooking] = useState(false)
  const [showInvoiceEditor, setShowInvoiceEditor] = useState(false)
  const [showAgreementEditor, setShowAgreementEditor] = useState(false)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const [newBooking, setNewBooking] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    carModel: "",
    startDate: "",
    endDate: "",
    amount: "",
    specialTerms: "",
  })

  const [newInvoice, setNewInvoice] = useState({
    customerName: "",
    bookingId: "",
    amount: "",
    tax: "18",
    dueDate: "",
  })

  const [newAgreement, setNewAgreement] = useState({
    customerName: "",
    carModel: "",
    bookingId: "",
    terms: `RENTAL AGREEMENT

This agreement is made between the Host and the Customer for the rental of the vehicle.

TERMS AND CONDITIONS:
1. The customer must have a valid driving license
2. Security deposit is required before vehicle handover
3. Vehicle must be returned with same fuel level
4. Any damages will be charged separately
5. Late return charges apply after grace period

By signing this agreement, both parties agree to the above terms.`,
  })

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "BK001",
      customerName: "Rajesh Kumar",
      customerPhone: "+91 9876543210",
      customerEmail: "rajesh@email.com",
      carModel: "Honda City",
      carNumber: "MH01AB1234",
      startDate: "2024-12-25",
      endDate: "2024-12-28",
      amount: 4500,
      status: "confirmed",
      paymentStatus: "paid",
    },
    {
      id: "BK002",
      customerName: "Priya Sharma",
      customerPhone: "+91 9876543211",
      customerEmail: "priya@email.com",
      carModel: "Maruti Swift",
      carNumber: "MH02CD5678",
      startDate: "2024-12-30",
      endDate: "2025-01-02",
      amount: 3200,
      status: "active",
      paymentStatus: "paid",
    },
    {
      id: "BK003",
      customerName: "Amit Patel",
      customerPhone: "+91 9876543212",
      customerEmail: "amit@email.com",
      carModel: "Hyundai Creta",
      carNumber: "MH03EF9012",
      startDate: "2024-12-20",
      endDate: "2024-12-23",
      amount: 6000,
      status: "completed",
      paymentStatus: "paid",
    },
  ])

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CU001",
      name: "Rajesh Kumar",
      phone: "+91 9876543210",
      email: "rajesh@email.com",
      totalBookings: 5,
      totalSpent: 22500,
      rating: 4.8,
      lastBooking: "2024-12-25",
      status: "active",
      notes: "Excellent customer, always on time",
    },
    {
      id: "CU002",
      name: "Priya Sharma",
      phone: "+91 9876543211",
      email: "priya@email.com",
      totalBookings: 3,
      totalSpent: 9600,
      rating: 4.5,
      lastBooking: "2024-12-30",
      status: "active",
      notes: "Good customer, careful driver",
    },
  ])

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV001",
      invoiceNumber: "INV-2024-001",
      customerName: "Rajesh Kumar",
      bookingId: "BK001",
      amount: 4500,
      tax: 810,
      total: 5310,
      status: "paid",
      dueDate: "2024-12-30",
      createdDate: "2024-12-25",
    },
    {
      id: "INV002",
      invoiceNumber: "INV-2024-002",
      customerName: "Priya Sharma",
      bookingId: "BK002",
      amount: 3200,
      tax: 576,
      total: 3776,
      status: "pending",
      dueDate: "2025-01-05",
      createdDate: "2024-12-30",
    },
  ])

  const [agreements, setAgreements] = useState<Agreement[]>([
    {
      id: "AG001",
      agreementNumber: "AG-2024-001",
      customerName: "Rajesh Kumar",
      carModel: "Honda City",
      bookingId: "BK001",
      status: "signed",
      createdDate: "2024-12-24",
      signedDate: "2024-12-25",
      terms: "Standard rental agreement terms...",
    },
    {
      id: "AG002",
      agreementNumber: "AG-2024-002",
      customerName: "Priya Sharma",
      carModel: "Maruti Swift",
      bookingId: "BK002",
      status: "sent",
      createdDate: "2024-12-29",
      terms: "Standard rental agreement terms...",
    },
  ])

  const handleAddBooking = () => {
    if (newBooking.customerName && newBooking.customerPhone && newBooking.carModel && newBooking.amount) {
      const booking: Booking = {
        id: `BK${String(bookings.length + 1).padStart(3, "0")}`,
        customerName: newBooking.customerName,
        customerPhone: newBooking.customerPhone,
        customerEmail: newBooking.customerEmail,
        carModel: newBooking.carModel,
        carNumber: "MH04GH3456", // Auto-generated
        startDate: newBooking.startDate,
        endDate: newBooking.endDate,
        amount: Number.parseFloat(newBooking.amount),
        status: "confirmed",
        paymentStatus: "pending",
        specialTerms: newBooking.specialTerms,
      }

      setBookings([...bookings, booking])
      setNewBooking({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        carModel: "",
        startDate: "",
        endDate: "",
        amount: "",
        specialTerms: "",
      })
      setShowAddBooking(false)

      // Also add customer if new
      const existingCustomer = customers.find((c) => c.phone === newBooking.customerPhone)
      if (!existingCustomer) {
        const newCustomer: Customer = {
          id: `CU${String(customers.length + 1).padStart(3, "0")}`,
          name: newBooking.customerName,
          phone: newBooking.customerPhone,
          email: newBooking.customerEmail,
          totalBookings: 1,
          totalSpent: Number.parseFloat(newBooking.amount),
          rating: 5.0,
          lastBooking: newBooking.startDate,
          status: "new",
          notes: "New customer",
        }
        setCustomers([...customers, newCustomer])
      }
    }
  }

  const generateProfessionalInvoice = (invoice: Invoice, booking?: Booking) => {
    const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Tax Invoice - ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .invoice-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .company-info { text-align: center; margin-bottom: 20px; }
        .bill-to { margin: 20px 0; }
        .invoice-details { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total-section { margin-top: 20px; }
        .terms { margin-top: 30px; font-size: 12px; }
        .signature-section { margin-top: 50px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <h1>Tax Invoice</h1>
      </div>
      
      <div class="company-info">
        <h2>Ride Circle</h2>
        <p>Self-Drive Car Rental Platform</p>
        <p>Phone: +91-XXXXXXXXXX | Email: info@ridecircle.com</p>
        <p>GSTIN: 27XXXXX1234X1ZS | State: 27-Maharashtra</p>
      </div>

      <div class="bill-to">
        <h3>Bill To:</h3>
        <p><strong>${invoice.customerName}</strong></p>
        <p>Contact: ${booking?.customerPhone || "N/A"}</p>
        <p>Email: ${booking?.customerEmail || "N/A"}</p>
      </div>

      <div class="invoice-details">
        <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Date:</strong> ${new Date(invoice.createdDate).toLocaleDateString("en-IN")}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString("en-IN")}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>HSN/SAC</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price/Unit (₹)</th>
            <th>Discount (₹)</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${booking?.carModel || "Car Rental Service"}</td>
            <td>996511</td>
            <td>1</td>
            <td>Service</td>
            <td>₹${invoice.amount.toLocaleString()}</td>
            <td>₹0</td>
            <td>₹${invoice.amount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div class="total-section">
        <p><strong>Sub Total:</strong> ₹${invoice.amount.toLocaleString()}</p>
        <p><strong>GST (18%):</strong> ₹${invoice.tax.toLocaleString()}</p>
        <p><strong>Total:</strong> ₹${invoice.total.toLocaleString()}</p>
        <p><strong>Amount in Words:</strong> ${numberToWords(invoice.total)} Rupees Only</p>
      </div>

      <div class="terms">
        <h3>Terms and Conditions:</h3>
        <p><strong>RIDE CIRCLE VEHICLE RENTAL – TERMS AND CONDITIONS</strong></p>
        <ol>
          <li><strong>Vehicle Details:</strong> Vehicle condition recorded at handover. Renter liable for unreported damage.</li>
          <li><strong>Rental Term:</strong> Vehicle must be returned on agreed date/time. Late returns incur additional charges.</li>
          <li><strong>Payment Terms:</strong> Full rental and deposit payable in advance. Damages deducted from deposit.</li>
          <li><strong>Daily Kilometer Limit:</strong> 300 km per day. Additional usage charged at ₹5/km.</li>
          <li><strong>Fuel Policy:</strong> Return with same fuel level or pay ₹500 + fuel cost.</li>
          <li><strong>Insurance:</strong> Covers third-party liability and own damage within policy limits.</li>
          <li><strong>Jurisdiction:</strong> All disputes subject to local court jurisdiction.</li>
        </ol>
      </div>

      <div class="signature-section">
        <div style="float: left;">
          <p>Customer Signature: ___________________</p>
          <p>Date: ___________________</p>
        </div>
        <div style="float: right;">
          <p>For Ride Circle:</p>
          <p>Authorized Signatory</p>
        </div>
        <div style="clear: both;"></div>
      </div>
    </body>
    </html>
  `

    return invoiceHTML
  }

  const numberToWords = (num: number): string => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ]
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

    if (num === 0) return "Zero"
    if (num < 10) return ones[num]
    if (num < 20) return teens[num - 10]
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numberToWords(num % 100) : "")
    if (num < 100000)
      return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "")

    return num.toLocaleString()
  }

  const generatePDF = (type: "invoice" | "agreement", data: any) => {
    console.log("[v0] Generating professional PDF for:", type, data)

    let content = ""
    let filename = ""

    if (type === "invoice") {
      const booking = bookings.find((b) => b.id === data.bookingId)
      content = generateProfessionalInvoice(data, booking)
      filename = `Invoice-${data.invoiceNumber}.html`
    } else {
      content = generateAgreementContent(data)
      filename = `Agreement-${data.agreementNumber}.html`
    }

    // Create and download the file
    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Show success message
    alert(
      `${type === "invoice" ? "Invoice" : "Agreement"} downloaded successfully! You can print or convert to PDF using your browser.`,
    )
  }

  const shareOnWhatsApp = (type: "invoice" | "agreement", data: any) => {
    const booking = bookings.find((b) => b.id === data.bookingId)
    const customerPhone = booking?.customerPhone?.replace(/[^\d]/g, "")

    let message = ""
    if (type === "invoice") {
      message = `Hi ${data.customerName}, your invoice ${data.invoiceNumber} for ₹${data.total.toLocaleString()} is ready. Please find the details and make payment by ${new Date(data.dueDate).toLocaleDateString("en-IN")}. Thank you for choosing Ride Circle!`
    } else {
      message = `Hi ${data.customerName}, your rental agreement ${data.agreementNumber} for ${data.carModel} is ready for signature. Please review and sign the document. Thank you!`
    }

    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const [uploadedDocuments, setUploadedDocuments] = useState<{ [key: string]: File[] }>({})

  const handleDocumentUpload = (customerId: string, files: FileList) => {
    const fileArray = Array.from(files)
    setUploadedDocuments((prev) => ({
      ...prev,
      [customerId]: [...(prev[customerId] || []), ...fileArray],
    }))

    // Simulate cloud upload
    console.log("[v0] Uploading documents to cloud storage for customer:", customerId)
    alert(`${fileArray.length} document(s) uploaded successfully to cloud storage!`)
  }

  const generateInvoiceContent = (invoice: Invoice) => {
    return `
INVOICE: ${invoice.invoiceNumber}
Date: ${invoice.createdDate}
Due Date: ${invoice.dueDate}

Bill To:
${invoice.customerName}

Description: Car Rental Service
Amount: ₹${invoice.amount}
Tax (18%): ₹${invoice.tax}
Total: ₹${invoice.total}

Status: ${invoice.status.toUpperCase()}
    `
  }

  const generateAgreementContent = (agreement: Agreement) => {
    return `
RENTAL AGREEMENT: ${agreement.agreementNumber}
Date: ${agreement.createdDate}

Customer: ${agreement.customerName}
Vehicle: ${agreement.carModel}
Booking ID: ${agreement.bookingId}

${agreement.terms}

Status: ${agreement.status.toUpperCase()}
${agreement.signedDate ? `Signed Date: ${agreement.signedDate}` : ""}
    `
  }

  const initiateESignature = (documentType: string, id: string) => {
    console.log("[v0] Initiating e-signature for:", documentType, id)

    if (documentType.includes("Agreement")) {
      setAgreements(agreements.map((ag) => (ag.id === id ? { ...ag, status: "sent" as const } : ag)))
    }

    // Simulate sending notification
    setTimeout(() => {
      alert(`E-signature link sent to customer via SMS and Email. Document status updated to 'Sent'.`)
    }, 1000)
  }

  const handleCreateInvoice = () => {
    if (newInvoice.customerName && newInvoice.amount) {
      const invoice: Invoice = {
        id: `INV${String(invoices.length + 1).padStart(3, "0")}`,
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, "0")}`,
        customerName: newInvoice.customerName,
        bookingId: newInvoice.bookingId,
        amount: Number.parseFloat(newInvoice.amount),
        tax: Number.parseFloat(newInvoice.amount) * (Number.parseFloat(newInvoice.tax) / 100),
        total: Number.parseFloat(newInvoice.amount) * (1 + Number.parseFloat(newInvoice.tax) / 100),
        status: "pending",
        dueDate: newInvoice.dueDate,
        createdDate: new Date().toISOString().split("T")[0],
      }

      setInvoices([...invoices, invoice])
      setNewInvoice({
        customerName: "",
        bookingId: "",
        amount: "",
        tax: "18",
        dueDate: "",
      })
      setShowInvoiceEditor(false)
    }
  }

  const handleCreateAgreement = () => {
    if (newAgreement.customerName && newAgreement.carModel) {
      const agreement: Agreement = {
        id: `AG${String(agreements.length + 1).padStart(3, "0")}`,
        agreementNumber: `AG-2024-${String(agreements.length + 1).padStart(3, "0")}`,
        customerName: newAgreement.customerName,
        carModel: newAgreement.carModel,
        bookingId: newAgreement.bookingId,
        status: "draft",
        createdDate: new Date().toISOString().split("T")[0],
        terms: newAgreement.terms,
      }

      setAgreements([...agreements, agreement])
      setNewAgreement({
        customerName: "",
        carModel: "",
        bookingId: "",
        terms: newAgreement.terms,
      })
      setShowAgreementEditor(false)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "signed":
        return "bg-green-100 text-green-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Host CRM Dashboard</h1>
            <p className="text-muted-foreground">Manage your rental business operations</p>
          </div>
          <Button onClick={() => setShowAddBooking(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Manual Booking
          </Button>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% from last month
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">
                    ₹{bookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +23% from last month
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {customers.filter((c) => c.status === "active").length} active
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">4.7</p>
                  <p className="text-xs text-yellow-600 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Based on {customers.length} reviews
                  </p>
                </div>
                <Star className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Enhanced Bookings Management */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Booking Management
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Car Details</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.customerName}</p>
                            <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.carModel}</p>
                            <p className="text-sm text-muted-foreground">{booking.carNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{booking.startDate}</p>
                            <p className="text-sm text-muted-foreground">to {booking.endDate}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">₹{booking.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.paymentStatus)}>{booking.paymentStatus}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Customers Management */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">Last booking: {customer.lastBooking}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{customer.phone}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{customer.totalBookings}</TableCell>
                        <TableCell className="font-medium">₹{customer.totalSpent.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{customer.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCustomer(customer)
                                setShowCustomerDetails(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Invoicing System */}
          <TabsContent value="invoicing" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Invoice Management
                  </CardTitle>
                  <Button onClick={() => setShowInvoiceEditor(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Tax</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>₹{invoice.tax.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">₹{invoice.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        </TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        {/* Enhanced invoice actions with print, WhatsApp, and professional features */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generatePDF("invoice", invoice)}
                              title="Download Professional Invoice"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const booking = bookings.find((b) => b.id === invoice.bookingId)
                                const content = generateProfessionalInvoice(invoice, booking)
                                const printWindow = window.open("", "_blank")
                                if (printWindow) {
                                  printWindow.document.write(content)
                                  printWindow.document.close()
                                  printWindow.print()
                                }
                              }}
                              title="Print Invoice"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareOnWhatsApp("invoice", invoice)}
                              title="Share on WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" title="Edit Invoice">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Agreement Management */}
          <TabsContent value="agreements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FileSignature className="h-5 w-5" />
                    Agreement Management
                  </CardTitle>
                  <Button onClick={() => setShowAgreementEditor(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Agreement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agreement #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Signed Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agreements.map((agreement) => (
                      <TableRow key={agreement.id}>
                        <TableCell className="font-medium">{agreement.agreementNumber}</TableCell>
                        <TableCell>{agreement.customerName}</TableCell>
                        <TableCell>{agreement.carModel}</TableCell>
                        <TableCell>{agreement.createdDate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(agreement.status)}>{agreement.status}</Badge>
                        </TableCell>
                        <TableCell>{agreement.signedDate || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => generatePDF("agreement", agreement)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => initiateESignature(`Agreement ${agreement.agreementNumber}`, agreement.id)}
                            >
                              <FileSignature className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>This Month</span>
                      <span className="font-bold">
                        ₹{bookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Last Month</span>
                      <span className="font-bold">₹1,85,000</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                      <span>Growth</span>
                      <span className="font-bold">+23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Booking Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Confirmed</span>
                      <span className="font-bold">{bookings.filter((b) => b.status === "confirmed").length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active</span>
                      <span className="font-bold">{bookings.filter((b) => b.status === "active").length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Completed</span>
                      <span className="font-bold">{bookings.filter((b) => b.status === "completed").length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const csvContent = bookings
                        .map((b) => `${b.id},${b.customerName},${b.carModel},${b.amount},${b.status}`)
                        .join("\n")
                      const blob = new Blob([`ID,Customer,Car,Amount,Status\n${csvContent}`], { type: "text/csv" })
                      const url = URL.createObjectURL(blob)
                      const link = document.createElement("a")
                      link.href = url
                      link.download = "bookings-report.csv"
                      link.click()
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Bookings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const csvContent = customers
                        .map((c) => `${c.id},${c.name},${c.phone},${c.totalBookings},${c.totalSpent}`)
                        .join("\n")
                      const blob = new Blob([`ID,Name,Phone,Bookings,Spent\n${csvContent}`], { type: "text/csv" })
                      const url = URL.createObjectURL(blob)
                      const link = document.createElement("a")
                      link.href = url
                      link.download = "customers-report.csv"
                      link.click()
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Customers
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const csvContent = invoices
                        .map((i) => `${i.invoiceNumber},${i.customerName},${i.total},${i.status}`)
                        .join("\n")
                      const blob = new Blob([`Invoice,Customer,Total,Status\n${csvContent}`], { type: "text/csv" })
                      const url = URL.createObjectURL(blob)
                      const link = document.createElement("a")
                      link.href = url
                      link.download = "invoices-report.csv"
                      link.click()
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Added customer document management section */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Customer Document Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div key={customer.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h3 className="font-medium">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => e.target.files && handleDocumentUpload(customer.id, e.target.files)}
                            className="hidden"
                            id={`upload-${customer.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`upload-${customer.id}`)?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Documents
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {(uploadedDocuments[customer.id] || []).map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm truncate">{doc.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Add Booking Dialog */}
        <Dialog open={showAddBooking} onOpenChange={setShowAddBooking}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Manual Booking</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name *</Label>
                <Input
                  placeholder="Enter customer name"
                  value={newBooking.customerName}
                  onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  placeholder="Enter phone number"
                  value={newBooking.customerPhone}
                  onChange={(e) => setNewBooking({ ...newBooking, customerPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="Enter email"
                  type="email"
                  value={newBooking.customerEmail}
                  onChange={(e) => setNewBooking({ ...newBooking, customerEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Car Model *</Label>
                <Select
                  value={newBooking.carModel}
                  onValueChange={(value) => setNewBooking({ ...newBooking, carModel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select car" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Honda City">Honda City - MH01AB1234</SelectItem>
                    <SelectItem value="Maruti Swift">Maruti Swift - MH02CD5678</SelectItem>
                    <SelectItem value="Hyundai Creta">Hyundai Creta - MH03EF9012</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newBooking.startDate}
                  onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={newBooking.endDate}
                  onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Rental Amount *</Label>
                <Input
                  placeholder="Enter amount"
                  type="number"
                  value={newBooking.amount}
                  onChange={(e) => setNewBooking({ ...newBooking, amount: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Special Terms</Label>
                <Textarea
                  placeholder="Enter any special terms or conditions"
                  value={newBooking.specialTerms}
                  onChange={(e) => setNewBooking({ ...newBooking, specialTerms: e.target.value })}
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddBooking(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBooking}>Create Booking</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Invoice Editor Dialog */}
        <Dialog open={showInvoiceEditor} onOpenChange={setShowInvoiceEditor}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name *</Label>
                <Input
                  placeholder="Enter customer name"
                  value={newInvoice.customerName}
                  onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Booking ID</Label>
                <Select
                  value={newInvoice.bookingId}
                  onValueChange={(value) => setNewInvoice({ ...newInvoice, bookingId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select booking" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookings.map((booking) => (
                      <SelectItem key={booking.id} value={booking.id}>
                        {booking.id} - {booking.customerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount *</Label>
                <Input
                  placeholder="Enter amount"
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tax (%)</Label>
                <Input
                  placeholder="Enter tax percentage"
                  type="number"
                  value={newInvoice.tax}
                  onChange={(e) => setNewInvoice({ ...newInvoice, tax: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Amount</Label>
                <Input
                  placeholder="Auto-calculated"
                  value={
                    newInvoice.amount
                      ? `₹${(Number.parseFloat(newInvoice.amount) * (1 + Number.parseFloat(newInvoice.tax) / 100)).toFixed(2)}`
                      : ""
                  }
                  disabled
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowInvoiceEditor(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateInvoice}>Create Invoice</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Agreement Editor Dialog */}
        <Dialog open={showAgreementEditor} onOpenChange={setShowAgreementEditor}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Agreement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name *</Label>
                  <Input
                    placeholder="Enter customer name"
                    value={newAgreement.customerName}
                    onChange={(e) => setNewAgreement({ ...newAgreement, customerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Car Model *</Label>
                  <Input
                    placeholder="Enter car model"
                    value={newAgreement.carModel}
                    onChange={(e) => setNewAgreement({ ...newAgreement, carModel: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Booking ID</Label>
                  <Select
                    value={newAgreement.bookingId}
                    onValueChange={(value) => setNewAgreement({ ...newAgreement, bookingId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select booking" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookings.map((booking) => (
                        <SelectItem key={booking.id} value={booking.id}>
                          {booking.id} - {booking.customerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Agreement Terms *</Label>
                <Textarea
                  placeholder="Enter agreement terms"
                  value={newAgreement.terms}
                  onChange={(e) => setNewAgreement({ ...newAgreement, terms: e.target.value })}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAgreementEditor(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAgreement}>Create Agreement</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Customer Details Dialog */}
        <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="font-medium">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="font-medium">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedCustomer.status)}>{selectedCustomer.status}</Badge>
                  </div>
                  <div>
                    <Label>Total Bookings</Label>
                    <p className="font-medium">{selectedCustomer.totalBookings}</p>
                  </div>
                  <div>
                    <Label>Total Spent</Label>
                    <p className="font-medium">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedCustomer.rating}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Last Booking</Label>
                    <p className="font-medium">{selectedCustomer.lastBooking}</p>
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={selectedCustomer.notes}
                    onChange={(e) => {
                      const updatedCustomers = customers.map((c) =>
                        c.id === selectedCustomer.id ? { ...c, notes: e.target.value } : c,
                      )
                      setCustomers(updatedCustomers)
                      setSelectedCustomer({ ...selectedCustomer, notes: e.target.value })
                    }}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCustomerDetails(false)}>
                    Close
                  </Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

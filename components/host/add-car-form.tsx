"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CarFormData {
  // Basic Details
  make: string
  model: string
  year: string
  registrationNumber: string
  fuelType: string
  transmission: string
  seatingCapacity: string

  // Location & Pricing
  city: string
  primaryAddress: string
  additionalLocations: string[]
  pricePerDay: string
  pricePerHour: string
  weeklyDiscount: string
  monthlyDiscount: string
  deliveryFee: string

  // Deposit Options
  depositType: string
  depositAmount: string

  // Features & Rules
  features: string[]
  houseRules: string[]
  description: string

  // Documents
  rcDocument: File | null
  insuranceDocument: File | null
  pucDocument: File | null

  // Images
  images: File[]
}

const initialFormData: CarFormData = {
  make: "",
  model: "",
  year: "",
  registrationNumber: "",
  fuelType: "",
  transmission: "",
  seatingCapacity: "",
  city: "",
  primaryAddress: "",
  additionalLocations: [],
  pricePerDay: "",
  pricePerHour: "",
  weeklyDiscount: "",
  monthlyDiscount: "",
  deliveryFee: "",
  depositType: "",
  depositAmount: "",
  features: [],
  houseRules: [],
  description: "",
  rcDocument: null,
  insuranceDocument: null,
  pucDocument: null,
  images: [],
}

export function AddCarForm() {
  const [formData, setFormData] = useState<CarFormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState("basic")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Car Listed Successfully",
        description: "Your car has been submitted for verification. You'll be notified once approved.",
      })
      setFormData(initialFormData)
      setCurrentStep("basic")
    }, 2000)
  }

  const handleRCVerification = async () => {
    if (!formData.registrationNumber) {
      toast({
        title: "Missing Registration Number",
        description: "Please enter the registration number first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // Simulate RC verification API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "RC Verification Complete",
        description: "Vehicle details verified successfully",
      })
      // Auto-populate verified details
      setFormData({
        ...formData,
        make: "Honda",
        model: "City",
        year: "2022",
      })
    }, 2000)
  }

  const carFeatures = [
    "Air Conditioning",
    "GPS Navigation",
    "Bluetooth",
    "USB Charging",
    "Sunroof",
    "Reverse Camera",
    "Parking Sensors",
    "Automatic Transmission",
    "Power Steering",
    "Central Locking",
    "ABS",
    "Airbags",
  ]

  const houseRulesOptions = [
    "No Smoking",
    "No Pets",
    "Return with Same Fuel Level",
    "No Off-Road Driving",
    "Maximum Speed Limit 80 km/h",
    "No Modifications",
    "Clean Interior Required",
    "Report Damages Immediately",
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Add New Car</CardTitle>
          <CardDescription>List your car on Ride Circle and start earning</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep} onValueChange={setCurrentStep}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="registrationNumber"
                        placeholder="e.g., MH01AB1234"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                        className="flex-1"
                      />
                      <Button onClick={handleRCVerification} disabled={loading} variant="outline">
                        {loading ? "Verifying..." : "Verify RC"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 25 }, (_, i) => 2024 - i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make *</Label>
                    <Select value={formData.make} onValueChange={(value) => setFormData({ ...formData, make: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maruti">Maruti Suzuki</SelectItem>
                        <SelectItem value="hyundai">Hyundai</SelectItem>
                        <SelectItem value="honda">Honda</SelectItem>
                        <SelectItem value="toyota">Toyota</SelectItem>
                        <SelectItem value="tata">Tata</SelectItem>
                        <SelectItem value="mahindra">Mahindra</SelectItem>
                        <SelectItem value="kia">Kia</SelectItem>
                        <SelectItem value="mg">MG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      placeholder="e.g., City, Swift, Creta"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type *</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission *</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="cvt">CVT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seatingCapacity">Seating Capacity *</Label>
                    <Select
                      value={formData.seatingCapacity}
                      onValueChange={(value) => setFormData({ ...formData, seatingCapacity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Seater</SelectItem>
                        <SelectItem value="4">4 Seater</SelectItem>
                        <SelectItem value="5">5 Seater</SelectItem>
                        <SelectItem value="7">7 Seater</SelectItem>
                        <SelectItem value="8">8 Seater</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Car Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your car's condition, special features, or any additional information..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep("location")}>Next: Location & Pricing</Button>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Primary City *</Label>
                    <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="chennai">Chennai</SelectItem>
                        <SelectItem value="kolkata">Kolkata</SelectItem>
                        <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryAddress">Primary Pickup Address *</Label>
                  <Textarea
                    id="primaryAddress"
                    placeholder="Enter complete pickup address with landmarks"
                    value={formData.primaryAddress}
                    onChange={(e) => setFormData({ ...formData, primaryAddress: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Additional Pickup Locations (Optional)</Label>
                  <p className="text-sm text-muted-foreground">
                    Add more locations where customers can pick up the car
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    + Add Additional Location
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("basic")}>
                  Previous
                </Button>
                <Button onClick={() => setCurrentStep("pricing")}>Next: Pricing</Button>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerDay">Price per Day (₹) *</Label>
                    <Input
                      id="pricePerDay"
                      type="number"
                      placeholder="e.g., 1200"
                      value={formData.pricePerDay}
                      onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerHour">Price per Hour (₹)</Label>
                    <Input
                      id="pricePerHour"
                      type="number"
                      placeholder="e.g., 150"
                      value={formData.pricePerHour}
                      onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weeklyDiscount">Weekly Discount (%)</Label>
                    <Input
                      id="weeklyDiscount"
                      type="number"
                      placeholder="e.g., 10"
                      value={formData.weeklyDiscount}
                      onChange={(e) => setFormData({ ...formData, weeklyDiscount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyDiscount">Monthly Discount (%)</Label>
                    <Input
                      id="monthlyDiscount"
                      type="number"
                      placeholder="e.g., 20"
                      value={formData.monthlyDiscount}
                      onChange={(e) => setFormData({ ...formData, monthlyDiscount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    placeholder="e.g., 200"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">Fee for delivering the car to customer's location</p>
                </div>

                <div className="space-y-4">
                  <Label>Security Deposit Options *</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cash-deposit"
                        checked={formData.depositType === "cash"}
                        onCheckedChange={(checked) => checked && setFormData({ ...formData, depositType: "cash" })}
                      />
                      <Label htmlFor="cash-deposit">Cash Deposit</Label>
                    </div>
                    {formData.depositType === "cash" && (
                      <Input
                        type="number"
                        placeholder="Enter deposit amount (₹)"
                        value={formData.depositAmount}
                        onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                        className="ml-6"
                      />
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vehicle-deposit"
                        checked={formData.depositType === "vehicle"}
                        onCheckedChange={(checked) => checked && setFormData({ ...formData, depositType: "vehicle" })}
                      />
                      <Label htmlFor="vehicle-deposit">Two-wheeler as Collateral</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="no-deposit"
                        checked={formData.depositType === "none"}
                        onCheckedChange={(checked) => checked && setFormData({ ...formData, depositType: "none" })}
                      />
                      <Label htmlFor="no-deposit">No Deposit Required</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("location")}>
                  Previous
                </Button>
                <Button onClick={() => setCurrentStep("features")}>Next: Features</Button>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Car Features</Label>
                  <p className="text-sm text-muted-foreground">Select all features available in your car</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {carFeatures.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={formData.features.includes(feature)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, features: [...formData.features, feature] })
                            } else {
                              setFormData({ ...formData, features: formData.features.filter((f) => f !== feature) })
                            }
                          }}
                        />
                        <Label htmlFor={feature} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>House Rules</Label>
                  <p className="text-sm text-muted-foreground">Set rules for renters to follow</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {houseRulesOptions.map((rule) => (
                      <div key={rule} className="flex items-center space-x-2">
                        <Checkbox
                          id={rule}
                          checked={formData.houseRules.includes(rule)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, houseRules: [...formData.houseRules, rule] })
                            } else {
                              setFormData({ ...formData, houseRules: formData.houseRules.filter((r) => r !== rule) })
                            }
                          }}
                        />
                        <Label htmlFor={rule} className="text-sm">
                          {rule}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("pricing")}>
                  Previous
                </Button>
                <Button onClick={() => setCurrentStep("documents")}>Next: Documents</Button>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rc-document">Registration Certificate (RC) *</Label>
                    <Input
                      id="rc-document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({ ...formData, rcDocument: e.target.files?.[0] || null })}
                    />
                    <p className="text-sm text-muted-foreground">Upload clear image or PDF of RC</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insurance-document">Insurance Policy *</Label>
                    <Input
                      id="insurance-document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({ ...formData, insuranceDocument: e.target.files?.[0] || null })}
                    />
                    <p className="text-sm text-muted-foreground">Upload current insurance policy document</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="puc-document">Pollution Under Control (PUC) Certificate *</Label>
                    <Input
                      id="puc-document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({ ...formData, pucDocument: e.target.files?.[0] || null })}
                    />
                    <p className="text-sm text-muted-foreground">Upload valid PUC certificate</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-images">Car Images *</Label>
                  <Input
                    id="car-images"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files || []) })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload at least 5 high-quality images (exterior, interior, dashboard, engine bay)
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Document Verification Process</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• All documents will be verified by our admin team</li>
                    <li>• RC details will be cross-checked with government databases</li>
                    <li>• Your listing will be active only after successful verification</li>
                    <li>• You'll receive notifications about verification status</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("features")}>
                  Previous
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Submit for Verification"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { nanoid } from "nanoid"

const VehicleSearchSchema = z.object({
  location: z
    .string()
    .regex(/^-?\d+\.?\d*,-?\d+\.?\d*$/)
    .optional(),
  radius: z.number().min(1).max(50).default(10).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryId: z.string().uuid().optional(),
  makeId: z.string().uuid().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().optional(),
  transmission: z.enum(["manual", "automatic", "cvt"]).optional(),
  fuelType: z.enum(["petrol", "diesel", "cng", "electric", "hybrid"]).optional(),
  features: z.string().optional(),
  sortBy: z.enum(["price", "rating", "distance", "popularity"]).default("distance").optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(50).default(20).optional(),
})

const VehicleCreateSchema = z.object({
  modelId: z.string().uuid(),
  registrationNumber: z.string().min(1),
  year: z.number().int().min(2000).max(2025),
  color: z.string().optional(),
  fuelType: z.enum(["petrol", "diesel", "cng", "electric", "hybrid"]),
  transmission: z.enum(["manual", "automatic", "cvt"]),
  seatingCapacity: z.number().int().min(2).max(8),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  address: z.object({
    street: z.string(),
    area: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  basePricePerDay: z.number().min(500),
  basePricePerHour: z.number().min(50).optional(),
  securityDeposit: z.number().min(1000),
  features: z.array(z.string()).optional(),
  rules: z
    .object({
      smoking: z.boolean().optional(),
      pets: z.boolean().optional(),
      mileageLimit: z.number().optional(),
    })
    .optional(),
})

// GET /api/v1/vehicles - Search vehicles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    // Convert string numbers to actual numbers
    if (queryParams.radius) queryParams.radius = Number(queryParams.radius)
    if (queryParams.priceMin) queryParams.priceMin = Number(queryParams.priceMin)
    if (queryParams.priceMax) queryParams.priceMax = Number(queryParams.priceMax)
    if (queryParams.page) queryParams.page = Number(queryParams.page)
    if (queryParams.limit) queryParams.limit = Number(queryParams.limit)

    const validatedParams = VehicleSearchSchema.parse(queryParams)

    // TODO: Implement actual database search with filters
    // Mock vehicle data for demonstration
    const mockVehicles = [
      {
        id: "vehicle-1",
        make: "Honda",
        model: "City",
        year: 2020,
        registrationNumber: "MH01AB1234",
        color: "White",
        fuelType: "petrol",
        transmission: "manual",
        seatingCapacity: 5,
        basePricePerDay: 2500,
        basePricePerHour: 150,
        securityDeposit: 5000,
        rating: 4.5,
        reviewCount: 23,
        location: { lat: 19.076, lng: 72.8777 },
        address: {
          street: "123 Main Street",
          area: "Bandra West",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400050",
        },
        images: ["/honda-city-white-car.png"],
        features: ["AC", "GPS", "Bluetooth"],
        host: {
          id: "host-1",
          name: "Rajesh Kumar",
          rating: 4.8,
          responseTime: "< 1 hour",
        },
        availability: true,
        distance: 2.5,
      },
      {
        id: "vehicle-2",
        make: "Maruti",
        model: "Swift",
        year: 2019,
        registrationNumber: "MH02CD5678",
        color: "Red",
        fuelType: "petrol",
        transmission: "automatic",
        seatingCapacity: 5,
        basePricePerDay: 2000,
        basePricePerHour: 120,
        securityDeposit: 4000,
        rating: 4.2,
        reviewCount: 18,
        location: { lat: 19.0896, lng: 72.8656 },
        address: {
          street: "456 Park Road",
          area: "Andheri East",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400069",
        },
        images: ["/maruti-swift-red-car.png"],
        features: ["AC", "Music System"],
        host: {
          id: "host-2",
          name: "Priya Sharma",
          rating: 4.6,
          responseTime: "< 2 hours",
        },
        availability: true,
        distance: 5.2,
      },
    ]

    console.log("[v0] Vehicle search:", validatedParams)

    return NextResponse.json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: {
        vehicles: mockVehicles,
        pagination: {
          page: validatedParams.page || 1,
          limit: validatedParams.limit || 20,
          total: mockVehicles.length,
          totalPages: 1,
        },
        filters: {
          appliedFilters: validatedParams,
          availableFilters: {
            makes: ["Honda", "Maruti", "Hyundai", "Toyota"],
            fuelTypes: ["petrol", "diesel", "cng"],
            transmissions: ["manual", "automatic"],
            priceRange: { min: 1500, max: 5000 },
          },
        },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid search parameters",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("[v0] Vehicle search error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Vehicle search failed",
      },
      { status: 500 },
    )
  }
}

// POST /api/v1/vehicles - Create vehicle listing
export async function POST(request: NextRequest) {
  try {
    // TODO: Verify JWT token and extract user ID
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      )
    }

    const body = await request.json()
    const validatedData = VehicleCreateSchema.parse(body)

    // Create vehicle record
    const vehicle = {
      id: nanoid(),
      hostId: "current-user-id", // Would come from JWT token
      ...validatedData,
      status: "pending_approval",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // TODO: Save vehicle to database
    // TODO: Trigger admin notification for approval
    console.log("[v0] Vehicle created:", { vehicleId: vehicle.id, hostId: vehicle.hostId })

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle listing created successfully. Pending admin approval.",
        data: {
          vehicle: {
            id: vehicle.id,
            status: vehicle.status,
            registrationNumber: vehicle.registrationNumber,
            createdAt: vehicle.createdAt,
          },
        },
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("[v0] Vehicle creation error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Vehicle creation failed",
      },
      { status: 500 },
    )
  }
}

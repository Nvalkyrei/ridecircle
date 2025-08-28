import { z } from "zod"

export const VehicleSchema = z.object({
  id: z.string().uuid(),
  hostId: z.string().uuid(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  category: z.enum(["hatchback", "sedan", "suv", "luxury", "electric"]),
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
  transmission: z.enum(["manual", "automatic"]),
  seatingCapacity: z.number().min(2).max(8),
  pricePerHour: z.number().min(0),
  pricePerDay: z.number().min(0),
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  features: z.array(z.string()),
  images: z.array(z.string().url()),
  documents: z.object({
    registrationCertificate: z.string().url(),
    insurance: z.string().url(),
    puc: z.string().url(),
  }),
  availability: z.object({
    isActive: z.boolean(),
    unavailableDates: z.array(z.string().datetime()),
  }),
  status: z.enum(["pending", "approved", "rejected", "suspended"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Vehicle = z.infer<typeof VehicleSchema>

export class VehicleService {
  static async createVehicle(vehicleData: Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "status">) {
    // Validate input
    const validatedData = VehicleSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      status: true,
    }).parse(vehicleData)

    // Generate vehicle ID
    const vehicleId = crypto.randomUUID()

    // Create vehicle record
    const vehicle: Vehicle = {
      ...validatedData,
      id: vehicleId,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In production: Save to database
    console.log("[v0] Creating vehicle:", vehicle)

    // Trigger document verification workflow
    await this.initiateDocumentVerification(vehicleId)

    return vehicle
  }

  static async searchVehicles(filters: {
    city?: string
    category?: string
    priceRange?: { min: number; max: number }
    dates?: { startDate: string; endDate: string }
    features?: string[]
    location?: { latitude: number; longitude: number; radius: number }
  }) {
    console.log("[v0] Searching vehicles with filters:", filters)

    // Mock search results - in production, query database with filters
    const mockVehicles: Vehicle[] = [
      {
        id: "vehicle-1",
        hostId: "host-1",
        make: "Maruti Suzuki",
        model: "Swift",
        year: 2022,
        category: "hatchback",
        fuelType: "petrol",
        transmission: "manual",
        seatingCapacity: 5,
        pricePerHour: 150,
        pricePerDay: 2500,
        location: {
          address: "Koramangala, Bangalore",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560034",
          latitude: 12.9352,
          longitude: 77.6245,
        },
        features: ["AC", "Music System", "GPS"],
        images: ["/sporty-red-hatchback.png"],
        documents: {
          registrationCertificate: "/docs/rc-1.pdf",
          insurance: "/docs/insurance-1.pdf",
          puc: "/docs/puc-1.pdf",
        },
        availability: {
          isActive: true,
          unavailableDates: [],
        },
        status: "approved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return mockVehicles
  }

  static async getVehicleById(vehicleId: string): Promise<Vehicle | null> {
    console.log("[v0] Fetching vehicle:", vehicleId)
    // In production: Query database
    return null
  }

  static async updateVehicleAvailability(vehicleId: string, unavailableDates: string[]) {
    console.log("[v0] Updating availability for vehicle:", vehicleId, unavailableDates)
    // In production: Update database
    return true
  }

  private static async initiateDocumentVerification(vehicleId: string) {
    console.log("[v0] Initiating document verification for vehicle:", vehicleId)
    // In production: Queue document verification job
    return true
  }
}

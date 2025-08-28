import { z } from "zod"

export const BookingSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  hostId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  pickupLocation: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  dropoffLocation: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  pricing: z.object({
    basePrice: z.number(),
    taxes: z.number(),
    fees: z.number(),
    discount: z.number().default(0),
    totalAmount: z.number(),
  }),
  status: z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled", "disputed"]),
  paymentStatus: z.enum(["pending", "paid", "refunded", "failed"]),
  specialRequests: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Booking = z.infer<typeof BookingSchema>

export class BookingService {
  static async createBooking(
    bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt" | "status" | "paymentStatus">,
  ) {
    // Validate input
    const validatedData = BookingSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      paymentStatus: true,
    }).parse(bookingData)

    // Check vehicle availability
    const isAvailable = await this.checkVehicleAvailability(
      validatedData.vehicleId,
      validatedData.startDate,
      validatedData.endDate,
    )

    if (!isAvailable) {
      throw new Error("Vehicle not available for selected dates")
    }

    // Calculate pricing
    const pricing = await this.calculatePricing(validatedData.vehicleId, validatedData.startDate, validatedData.endDate)

    const bookingId = crypto.randomUUID()

    const booking: Booking = {
      ...validatedData,
      id: bookingId,
      pricing,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("[v0] Creating booking:", booking)

    // Reserve vehicle for 15 minutes
    await this.reserveVehicle(validatedData.vehicleId, validatedData.startDate, validatedData.endDate, bookingId)

    // Send notifications
    await this.sendBookingNotifications(booking)

    return booking
  }

  static async confirmBooking(bookingId: string, paymentId: string) {
    console.log("[v0] Confirming booking:", bookingId, "with payment:", paymentId)

    // Update booking status
    const booking = await this.updateBookingStatus(bookingId, "confirmed", "paid")

    // Block vehicle availability
    if (booking) {
      await this.blockVehicleAvailability(booking.vehicleId, booking.startDate, booking.endDate)
    }

    // Send confirmation notifications
    await this.sendConfirmationNotifications(bookingId)

    return booking
  }

  static async cancelBooking(bookingId: string, reason: string, cancelledBy: "customer" | "host" | "admin") {
    console.log("[v0] Cancelling booking:", bookingId, "by:", cancelledBy)

    const booking = await this.getBookingById(bookingId)
    if (!booking) {
      throw new Error("Booking not found")
    }

    // Calculate cancellation charges
    const cancellationCharges = await this.calculateCancellationCharges(booking, cancelledBy)

    // Update booking status
    await this.updateBookingStatus(bookingId, "cancelled")

    // Release vehicle availability
    await this.releaseVehicleAvailability(booking.vehicleId, booking.startDate, booking.endDate)

    // Process refund if applicable
    if (cancellationCharges.refundAmount > 0) {
      await this.processRefund(bookingId, cancellationCharges.refundAmount)
    }

    // Send cancellation notifications
    await this.sendCancellationNotifications(bookingId, reason, cancelledBy)

    return { success: true, cancellationCharges }
  }

  private static async checkVehicleAvailability(
    vehicleId: string,
    startDate: string,
    endDate: string,
  ): Promise<boolean> {
    console.log("[v0] Checking availability for vehicle:", vehicleId, "from", startDate, "to", endDate)
    // In production: Query database for conflicts
    return true
  }

  private static async calculatePricing(vehicleId: string, startDate: string, endDate: string) {
    console.log("[v0] Calculating pricing for vehicle:", vehicleId)

    // Mock pricing calculation
    const basePrice = 2500 // per day
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    const subtotal = basePrice * days
    const taxes = subtotal * 0.18 // 18% GST
    const fees = 100 // Platform fee

    return {
      basePrice: subtotal,
      taxes,
      fees,
      discount: 0,
      totalAmount: subtotal + taxes + fees,
    }
  }

  private static async reserveVehicle(vehicleId: string, startDate: string, endDate: string, bookingId: string) {
    console.log("[v0] Reserving vehicle:", vehicleId, "for booking:", bookingId)
    // In production: Create temporary reservation with expiry
    return true
  }

  private static async sendBookingNotifications(booking: Booking) {
    console.log("[v0] Sending booking notifications for:", booking.id)
    // Send to customer and host
    return true
  }

  private static async updateBookingStatus(
    bookingId: string,
    status: Booking["status"],
    paymentStatus?: Booking["paymentStatus"],
  ) {
    console.log("[v0] Updating booking status:", bookingId, "to", status)
    // In production: Update database
    return null
  }

  private static async getBookingById(bookingId: string): Promise<Booking | null> {
    console.log("[v0] Fetching booking:", bookingId)
    // In production: Query database
    return null
  }

  private static async calculateCancellationCharges(booking: Booking, cancelledBy: string) {
    console.log("[v0] Calculating cancellation charges for:", booking.id)

    // Mock cancellation policy
    const hoursUntilStart = (new Date(booking.startDate).getTime() - Date.now()) / (1000 * 60 * 60)
    let cancellationFee = 0

    if (hoursUntilStart < 24) {
      cancellationFee = booking.pricing.totalAmount * 0.5 // 50% if less than 24 hours
    } else if (hoursUntilStart < 48) {
      cancellationFee = booking.pricing.totalAmount * 0.25 // 25% if less than 48 hours
    }

    return {
      cancellationFee,
      refundAmount: booking.pricing.totalAmount - cancellationFee,
    }
  }

  private static async blockVehicleAvailability(vehicleId: string, startDate: string, endDate: string) {
    console.log("[v0] Blocking vehicle availability:", vehicleId)
    return true
  }

  private static async releaseVehicleAvailability(vehicleId: string, startDate: string, endDate: string) {
    console.log("[v0] Releasing vehicle availability:", vehicleId)
    return true
  }

  private static async processRefund(bookingId: string, amount: number) {
    console.log("[v0] Processing refund for booking:", bookingId, "amount:", amount)
    return true
  }

  private static async sendConfirmationNotifications(bookingId: string) {
    console.log("[v0] Sending confirmation notifications for:", bookingId)
    return true
  }

  private static async sendCancellationNotifications(bookingId: string, reason: string, cancelledBy: string) {
    console.log("[v0] Sending cancellation notifications for:", bookingId)
    return true
  }
}

import { z } from "zod"

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  paymentMethod: z.enum(["card", "upi", "netbanking", "wallet"]),
  gatewayProvider: z.enum(["razorpay", "payu", "ccavenue", "stripe"]),
  gatewayTransactionId: z.string().optional(),
  status: z.enum(["pending", "processing", "completed", "failed", "refunded"]),
  failureReason: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Payment = z.infer<typeof PaymentSchema>

export class PaymentService {
  static async initiatePayment(paymentData: {
    bookingId: string
    customerId: string
    amount: number
    paymentMethod: Payment["paymentMethod"]
    gatewayProvider: Payment["gatewayProvider"]
  }) {
    const paymentId = crypto.randomUUID()

    const payment: Payment = {
      id: paymentId,
      ...paymentData,
      currency: "INR",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("[v0] Initiating payment:", payment)

    // Create payment with gateway
    const gatewayResponse = await this.createGatewayPayment(payment)

    return {
      paymentId,
      gatewayOrderId: gatewayResponse.orderId,
      gatewayKey: gatewayResponse.key,
      amount: payment.amount,
      currency: payment.currency,
    }
  }

  static async handlePaymentWebhook(gatewayProvider: string, payload: any) {
    console.log("[v0] Processing payment webhook from:", gatewayProvider, payload)

    switch (gatewayProvider) {
      case "razorpay":
        return this.handleRazorpayWebhook(payload)
      case "payu":
        return this.handlePayUWebhook(payload)
      default:
        throw new Error(`Unsupported gateway: ${gatewayProvider}`)
    }
  }

  static async processRefund(paymentId: string, amount: number, reason: string) {
    console.log("[v0] Processing refund for payment:", paymentId, "amount:", amount)

    const payment = await this.getPaymentById(paymentId)
    if (!payment) {
      throw new Error("Payment not found")
    }

    // Initiate refund with gateway
    const refundResponse = await this.initiateGatewayRefund(payment, amount, reason)

    // Create refund record
    const refund = {
      id: crypto.randomUUID(),
      paymentId,
      amount,
      reason,
      status: "processing",
      gatewayRefundId: refundResponse.refundId,
      createdAt: new Date().toISOString(),
    }

    console.log("[v0] Refund initiated:", refund)

    return refund
  }

  private static async createGatewayPayment(payment: Payment) {
    console.log("[v0] Creating gateway payment:", payment.gatewayProvider)

    // Mock gateway response
    return {
      orderId: `order_${crypto.randomUUID()}`,
      key: "rzp_test_key",
      amount: payment.amount * 100, // Convert to paise for Razorpay
    }
  }

  private static async handleRazorpayWebhook(payload: any) {
    console.log("[v0] Handling Razorpay webhook:", payload)

    // Verify webhook signature
    const isValid = this.verifyRazorpaySignature(payload)
    if (!isValid) {
      throw new Error("Invalid webhook signature")
    }

    // Update payment status
    const paymentId = payload.payload.payment.entity.notes?.paymentId
    if (paymentId) {
      await this.updatePaymentStatus(paymentId, "completed", payload.payload.payment.entity.id)
    }

    return { success: true }
  }

  private static async handlePayUWebhook(payload: any) {
    console.log("[v0] Handling PayU webhook:", payload)
    // Similar implementation for PayU
    return { success: true }
  }

  private static verifyRazorpaySignature(payload: any): boolean {
    // In production: Verify webhook signature using Razorpay secret
    console.log("[v0] Verifying Razorpay signature")
    return true
  }

  private static async updatePaymentStatus(
    paymentId: string,
    status: Payment["status"],
    gatewayTransactionId?: string,
  ) {
    console.log("[v0] Updating payment status:", paymentId, "to", status)
    // In production: Update database
    return true
  }

  private static async getPaymentById(paymentId: string): Promise<Payment | null> {
    console.log("[v0] Fetching payment:", paymentId)
    // In production: Query database
    return null
  }

  private static async initiateGatewayRefund(payment: Payment, amount: number, reason: string) {
    console.log("[v0] Initiating gateway refund:", payment.gatewayProvider)

    // Mock refund response
    return {
      refundId: `rfnd_${crypto.randomUUID()}`,
      status: "processing",
    }
  }
}

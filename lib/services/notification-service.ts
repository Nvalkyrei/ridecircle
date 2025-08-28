import { z } from "zod"

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum([
    "booking_created",
    "booking_confirmed",
    "booking_cancelled",
    "payment_success",
    "payment_failed",
    "vehicle_approved",
    "vehicle_rejected",
    "trip_started",
    "trip_completed",
    "review_received",
    "system_maintenance",
    "promotional",
  ]),
  title: z.string(),
  message: z.string(),
  channels: z.array(z.enum(["push", "sms", "email", "in_app"])),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  data: z.record(z.any()).optional(),
  status: z.enum(["pending", "sent", "delivered", "failed"]),
  scheduledAt: z.string().datetime().optional(),
  sentAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
})

export type Notification = z.infer<typeof NotificationSchema>

export class NotificationService {
  static async sendNotification(notificationData: Omit<Notification, "id" | "status" | "sentAt" | "createdAt">) {
    const notification: Notification = {
      ...notificationData,
      id: crypto.randomUUID(),
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    console.log("[v0] Sending notification:", notification)

    // Send via different channels
    const results = await Promise.allSettled([
      this.sendPushNotification(notification),
      this.sendSMSNotification(notification),
      this.sendEmailNotification(notification),
      this.saveInAppNotification(notification),
    ])

    // Update status based on results
    const hasSuccess = results.some((result) => result.status === "fulfilled")
    notification.status = hasSuccess ? "sent" : "failed"
    notification.sentAt = new Date().toISOString()

    return notification
  }

  static async sendBulkNotifications(notifications: Omit<Notification, "id" | "status" | "sentAt" | "createdAt">[]) {
    console.log("[v0] Sending bulk notifications:", notifications.length)

    const results = await Promise.allSettled(notifications.map((notification) => this.sendNotification(notification)))

    return results
  }

  static async getNotificationTemplates() {
    return {
      booking_created: {
        title: "Booking Request Received",
        message: "Your booking request for {vehicleName} has been received and is pending approval.",
        channels: ["push", "in_app"],
        priority: "medium" as const,
      },
      booking_confirmed: {
        title: "Booking Confirmed!",
        message: "Your booking for {vehicleName} from {startDate} to {endDate} is confirmed.",
        channels: ["push", "sms", "email", "in_app"],
        priority: "high" as const,
      },
      payment_success: {
        title: "Payment Successful",
        message: "Payment of ₹{amount} for booking #{bookingId} was successful.",
        channels: ["push", "sms", "in_app"],
        priority: "high" as const,
      },
      trip_started: {
        title: "Trip Started",
        message: "Your trip with {vehicleName} has started. Have a safe journey!",
        channels: ["push", "in_app"],
        priority: "high" as const,
      },
    }
  }

  private static async sendPushNotification(notification: Notification) {
    if (!notification.channels.includes("push")) return

    console.log("[v0] Sending push notification to user:", notification.userId)

    // In production: Use Firebase Cloud Messaging or similar
    // await fcm.send({
    //   token: userDeviceToken,
    //   notification: {
    //     title: notification.title,
    //     body: notification.message,
    //   },
    //   data: notification.data,
    // })

    return { success: true, channel: "push" }
  }

  private static async sendSMSNotification(notification: Notification) {
    if (!notification.channels.includes("sms")) return

    console.log("[v0] Sending SMS notification to user:", notification.userId)

    // In production: Use SMS gateway (MSG91, Twilio, etc.)
    // await smsService.send({
    //   to: userPhoneNumber,
    //   message: notification.message,
    // })

    return { success: true, channel: "sms" }
  }

  private static async sendEmailNotification(notification: Notification) {
    if (!notification.channels.includes("email")) return

    console.log("[v0] Sending email notification to user:", notification.userId)

    // In production: Use email service (SendGrid, SES, etc.)
    // await emailService.send({
    //   to: userEmail,
    //   subject: notification.title,
    //   html: emailTemplate,
    // })

    return { success: true, channel: "email" }
  }

  private static async saveInAppNotification(notification: Notification) {
    if (!notification.channels.includes("in_app")) return

    console.log("[v0] Saving in-app notification for user:", notification.userId)

    // In production: Save to database for in-app display
    return { success: true, channel: "in_app" }
  }

  static async markAsRead(notificationId: string, userId: string) {
    console.log("[v0] Marking notification as read:", notificationId, "for user:", userId)
    // In production: Update database
    return true
  }

  static async getUserNotifications(userId: string, limit = 20, offset = 0) {
    console.log("[v0] Fetching notifications for user:", userId)
    // In production: Query database
    return []
  }
}

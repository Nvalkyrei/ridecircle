import { randomInt } from "crypto"
import { Redis } from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)

export class MFAManager {
  private static readonly OTP_LENGTH = 6
  private static readonly OTP_EXPIRY = 300 // 5 minutes
  private static readonly MAX_ATTEMPTS = 3

  static async generateOTP(userId: string, purpose: "login" | "registration" | "password_reset"): Promise<string> {
    const otp = randomInt(100000, 999999).toString()
    const key = `otp:${purpose}:${userId}`

    // Store OTP with expiry and attempt counter
    await redis.setex(
      key,
      this.OTP_EXPIRY,
      JSON.stringify({
        otp,
        attempts: 0,
        createdAt: Date.now(),
      }),
    )

    return otp
  }

  static async verifyOTP(
    userId: string,
    otp: string,
    purpose: "login" | "registration" | "password_reset",
  ): Promise<boolean> {
    const key = `otp:${purpose}:${userId}`
    const storedData = await redis.get(key)

    if (!storedData) {
      return false
    }

    const { otp: storedOTP, attempts } = JSON.parse(storedData)

    if (attempts >= this.MAX_ATTEMPTS) {
      await redis.del(key)
      return false
    }

    if (otp !== storedOTP) {
      // Increment attempt counter
      await redis.setex(
        key,
        this.OTP_EXPIRY,
        JSON.stringify({
          otp: storedOTP,
          attempts: attempts + 1,
          createdAt: Date.now(),
        }),
      )
      return false
    }

    // OTP verified successfully, remove from Redis
    await redis.del(key)
    return true
  }

  static async sendOTP(phone: string, otp: string, purpose: string): Promise<boolean> {
    // Integration with SMS service (MSG91, Twilio, etc.)
    try {
      const message = `Your Ride Circle ${purpose} OTP is: ${otp}. Valid for 5 minutes. Do not share with anyone.`

      // Mock SMS sending - replace with actual SMS service
      console.log(`[SMS] Sending to ${phone}: ${message}`)

      // In production, integrate with SMS gateway
      // await smsService.send(phone, message)

      return true
    } catch (error) {
      console.error("Failed to send OTP:", error)
      return false
    }
  }
}

import jwt from "jsonwebtoken"
import { randomBytes } from "crypto"
import { Redis } from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)

export interface JWTPayload {
  userId: string
  email: string
  role: string
  tenantId: string
  permissions: string[]
  sessionId: string
}

export class JWTManager {
  private static readonly ACCESS_TOKEN_EXPIRY = "15m"
  private static readonly REFRESH_TOKEN_EXPIRY = "7d"
  private static readonly JWT_SECRET = process.env.JWT_SECRET!
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

  static async generateTokenPair(payload: Omit<JWTPayload, "sessionId">) {
    const sessionId = randomBytes(32).toString("hex")
    const fullPayload = { ...payload, sessionId }

    const accessToken = jwt.sign(fullPayload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      issuer: "ridecircle",
      audience: "ridecircle-app",
    })

    const refreshToken = jwt.sign({ userId: payload.userId, sessionId }, this.REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    })

    // Store refresh token in Redis with expiry
    await redis.setex(`refresh:${sessionId}`, 7 * 24 * 60 * 60, refreshToken)

    // Store active session
    await redis.setex(`session:${sessionId}`, 7 * 24 * 60 * 60, JSON.stringify(fullPayload))

    return { accessToken, refreshToken, sessionId }
  }

  static async verifyAccessToken(token: string): Promise<JWTPayload | null> {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET) as JWTPayload

      // Check if session is still active
      const sessionExists = await redis.exists(`session:${payload.sessionId}`)
      if (!sessionExists) {
        return null
      }

      return payload
    } catch (error) {
      return null
    }
  }

  static async refreshTokens(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, this.REFRESH_SECRET) as { userId: string; sessionId: string }

      // Verify refresh token exists in Redis
      const storedToken = await redis.get(`refresh:${payload.sessionId}`)
      if (storedToken !== refreshToken) {
        throw new Error("Invalid refresh token")
      }

      // Get user data for new tokens
      const sessionData = await redis.get(`session:${payload.sessionId}`)
      if (!sessionData) {
        throw new Error("Session expired")
      }

      const userPayload = JSON.parse(sessionData)

      // Generate new token pair
      const newTokens = await this.generateTokenPair({
        userId: userPayload.userId,
        email: userPayload.email,
        role: userPayload.role,
        tenantId: userPayload.tenantId,
        permissions: userPayload.permissions,
      })

      // Invalidate old session
      await redis.del(`refresh:${payload.sessionId}`)
      await redis.del(`session:${payload.sessionId}`)

      return newTokens
    } catch (error) {
      throw new Error("Token refresh failed")
    }
  }

  static async revokeSession(sessionId: string) {
    await redis.del(`refresh:${sessionId}`)
    await redis.del(`session:${sessionId}`)
  }
}

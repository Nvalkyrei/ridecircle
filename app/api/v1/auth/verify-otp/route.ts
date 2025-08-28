import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import jwt from "jsonwebtoken"

const OTPVerificationSchema = z.object({
  contact: z.string(),
  otp: z.string().regex(/^\d{6}$/),
  purpose: z.enum(["registration", "login", "password_reset"]),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = OTPVerificationSchema.parse(body)

    // Get temp token from header
    const authHeader = request.headers.get("authorization")
    const tempToken = authHeader?.replace("Bearer ", "")

    if (!tempToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Temporary token required",
        },
        { status: 401 },
      )
    }

    // Verify temp token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET!) as any
    if (decoded.purpose !== "otp_verification") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token purpose",
        },
        { status: 401 },
      )
    }

    // TODO: Verify OTP from database
    // Mock verification for demonstration
    const storedOtp = "123456" // This would come from database
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // This would come from database

    if (validatedData.otp !== storedOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 },
      )
    }

    if (new Date() > otpExpiry) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired",
        },
        { status: 400 },
      )
    }

    // TODO: Update user verification status in database
    // TODO: Clear OTP from database
    console.log("[v0] OTP verified:", { userId: decoded.userId, purpose: validatedData.purpose })

    // Generate final access tokens for registration completion
    if (validatedData.purpose === "registration") {
      const accessToken = jwt.sign(
        {
          userId: decoded.userId,
          type: "access",
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      )

      const refreshToken = jwt.sign(
        {
          userId: decoded.userId,
          type: "refresh",
        },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" },
      )

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully. Registration completed.",
        data: {
          verified: true,
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: 3600,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      data: {
        verified: true,
      },
    })
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

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 },
      )
    }

    console.error("[v0] OTP verification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "OTP verification failed",
      },
      { status: 500 },
    )
  }
}

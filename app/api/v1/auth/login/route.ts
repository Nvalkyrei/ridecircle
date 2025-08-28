import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const LoginSchema = z.object({
  identifier: z.string(), // email or phone
  password: z.string(),
  deviceInfo: z
    .object({
      deviceId: z.string().optional(),
      platform: z.enum(["web", "ios", "android"]).optional(),
      version: z.string().optional(),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = LoginSchema.parse(body)

    // TODO: Find user by email or phone in database
    // Mock user for demonstration
    const user = {
      id: "user-123",
      email: "user@example.com",
      phone: "+919876543210",
      password: await bcrypt.hash("password123", 12), // This would come from DB
      firstName: "John",
      lastName: "Doe",
      role: "customer",
      status: "active",
      emailVerified: true,
      phoneVerified: true,
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      )
    }

    // Check if user is active
    if (user.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          message: "Account is not active. Please contact support.",
        },
        { status: 403 },
      )
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: "access",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    )

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        type: "refresh",
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    )

    // TODO: Save refresh token to database
    // TODO: Log login activity
    console.log("[v0] User login:", { userId: user.id, deviceInfo: validatedData.deviceInfo })

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600, // 1 hour
        },
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

    console.error("[v0] Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
      },
      { status: 500 },
    )
  }
}

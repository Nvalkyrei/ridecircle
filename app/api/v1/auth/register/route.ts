import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { nanoid } from "nanoid"

const RegisterSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^\+91[6-9]\d{9}$/),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(["customer", "host"]),
  referralCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = RegisterSchema.parse(body)

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Generate OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user record (would be saved to database)
    const user = {
      id: nanoid(),
      email: validatedData.email,
      phone: validatedData.phone,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      role: validatedData.role,
      referralCode: validatedData.referralCode,
      emailVerified: false,
      phoneVerified: false,
      status: "pending_verification",
      createdAt: new Date(),
      otp,
      otpExpiry,
    }

    // TODO: Save user to database
    // TODO: Send OTP via SMS/Email
    console.log("[v0] User registration:", { userId: user.id, otp })

    // Generate temporary token for OTP verification
    const tempToken = jwt.sign({ userId: user.id, purpose: "otp_verification" }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    })

    return NextResponse.json(
      {
        success: true,
        message: "Registration initiated. Please verify OTP.",
        data: {
          userId: user.id,
          tempToken,
          otpSentTo: {
            email: user.email,
            phone: user.phone.replace(/(\+91)(\d{2})(\d{4})(\d{4})/, "$1$2****$4"),
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

    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
      },
      { status: 500 },
    )
  }
}

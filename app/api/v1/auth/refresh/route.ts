import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token required",
        },
        { status: 401 },
      )
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any

    if (decoded.type !== "refresh") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token type",
        },
        { status: 401 },
      )
    }

    // TODO: Check if refresh token exists in database and is not revoked
    // TODO: Get user details from database
    const user = {
      id: decoded.userId,
      email: "user@example.com",
      role: "customer",
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: "access",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    )

    // Optionally rotate refresh token
    const newRefreshToken = jwt.sign(
      {
        userId: user.id,
        type: "refresh",
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    )

    // TODO: Update refresh token in database
    console.log("[v0] Token refreshed:", { userId: user.id })

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: 3600,
        },
      },
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid refresh token",
        },
        { status: 401 },
      )
    }

    console.error("[v0] Token refresh error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Token refresh failed",
      },
      { status: 500 },
    )
  }
}

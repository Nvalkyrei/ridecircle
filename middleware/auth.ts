import { type NextRequest, NextResponse } from "next/server"
import { JWTManager } from "@/lib/auth/jwt"
import { RBACManager, type Permission } from "@/lib/auth/rbac"

export function createAuthMiddleware(requiredPermissions: Permission[] = []) {
  return async function authMiddleware(request: NextRequest) {
    try {
      const token = request.headers.get("authorization")?.replace("Bearer ", "")

      if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      const payload = await JWTManager.verifyAccessToken(token)

      if (!payload) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }

      // Check permissions if required
      if (requiredPermissions.length > 0) {
        const hasPermission = RBACManager.hasAnyPermission(payload.role as any, requiredPermissions)

        if (!hasPermission) {
          return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
        }
      }

      // Add user info to request headers for downstream use
      const response = NextResponse.next()
      response.headers.set("x-user-id", payload.userId)
      response.headers.set("x-user-role", payload.role)
      response.headers.set("x-tenant-id", payload.tenantId)

      return response
    } catch (error) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
  }
}

// Rate limiting middleware
export function createRateLimitMiddleware(maxRequests = 100, windowMs = 60000) {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return function rateLimitMiddleware(request: NextRequest) {
    const clientId = request.ip || "unknown"
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key)
      }
    }

    const clientRequests = requests.get(clientId) || { count: 0, resetTime: now + windowMs }

    if (clientRequests.count >= maxRequests && clientRequests.resetTime > now) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": clientRequests.resetTime.toString(),
          },
        },
      )
    }

    clientRequests.count++
    requests.set(clientId, clientRequests)

    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", maxRequests.toString())
    response.headers.set("X-RateLimit-Remaining", (maxRequests - clientRequests.count).toString())
    response.headers.set("X-RateLimit-Reset", clientRequests.resetTime.toString())

    return response
  }
}

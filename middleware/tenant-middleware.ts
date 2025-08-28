import { type NextRequest, NextResponse } from "next/server"
import { TenantManager } from "@/lib/multi-tenant/tenant-manager"

export async function tenantMiddleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = request.nextUrl.clone()

  // Initialize tenants if not already done
  if (TenantManager.getAllTenants().length === 0) {
    await TenantManager.initializeTenants()
  }

  // Get tenant configuration based on domain
  const tenant = TenantManager.getTenantByDomain(hostname)

  if (!tenant) {
    // Redirect to main domain or show tenant not found page
    url.pathname = "/tenant-not-found"
    return NextResponse.rewrite(url)
  }

  if (tenant.status === "suspended") {
    url.pathname = "/maintenance"
    return NextResponse.rewrite(url)
  }

  if (tenant.status === "maintenance") {
    url.pathname = "/maintenance"
    return NextResponse.rewrite(url)
  }

  // Add tenant information to request headers
  const response = NextResponse.next()
  response.headers.set("x-tenant-id", tenant.id)
  response.headers.set("x-tenant-name", tenant.name)
  response.headers.set("x-tenant-region", tenant.region)
  response.headers.set("x-tenant-currency", tenant.settings.currency)
  response.headers.set("x-tenant-timezone", tenant.settings.timezone)

  return response
}

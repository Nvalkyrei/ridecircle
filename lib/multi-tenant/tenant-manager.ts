export interface TenantConfig {
  id: string
  name: string
  domain: string
  region: string
  databaseUrl: string
  redisUrl: string
  s3Bucket: string
  features: string[]
  settings: {
    currency: string
    timezone: string
    language: string
    paymentGateways: string[]
    maxVehiclesPerHost: number
    commissionRate: number
  }
  status: "active" | "suspended" | "maintenance"
  createdAt: Date
  updatedAt: Date
}

export class TenantManager {
  private static tenants = new Map<string, TenantConfig>()

  static async initializeTenants() {
    // Load tenant configurations from database or config files
    const tenantConfigs: TenantConfig[] = [
      {
        id: "bangalore",
        name: "Ride Circle Bangalore",
        domain: "bangalore.ridecircle.com",
        region: "ap-south-1",
        databaseUrl: process.env.DATABASE_URL_BANGALORE!,
        redisUrl: process.env.REDIS_URL_BANGALORE!,
        s3Bucket: "ridecircle-bangalore",
        features: ["vehicle_rental", "host_crm", "insurance", "roadside_assistance"],
        settings: {
          currency: "INR",
          timezone: "Asia/Kolkata",
          language: "en-IN",
          paymentGateways: ["razorpay", "payu"],
          maxVehiclesPerHost: 10,
          commissionRate: 0.1,
        },
        status: "active",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      },
      {
        id: "mumbai",
        name: "Ride Circle Mumbai",
        domain: "mumbai.ridecircle.com",
        region: "ap-south-1",
        databaseUrl: process.env.DATABASE_URL_MUMBAI!,
        redisUrl: process.env.REDIS_URL_MUMBAI!,
        s3Bucket: "ridecircle-mumbai",
        features: ["vehicle_rental", "host_crm", "insurance", "premium_support"],
        settings: {
          currency: "INR",
          timezone: "Asia/Kolkata",
          language: "en-IN",
          paymentGateways: ["razorpay", "payu", "ccavenue"],
          maxVehiclesPerHost: 15,
          commissionRate: 0.12,
        },
        status: "active",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date(),
      },
      {
        id: "delhi",
        name: "Ride Circle Delhi NCR",
        domain: "delhi.ridecircle.com",
        region: "ap-south-1",
        databaseUrl: process.env.DATABASE_URL_DELHI!,
        redisUrl: process.env.REDIS_URL_DELHI!,
        s3Bucket: "ridecircle-delhi",
        features: ["vehicle_rental", "host_crm", "insurance", "corporate_booking"],
        settings: {
          currency: "INR",
          timezone: "Asia/Kolkata",
          language: "en-IN",
          paymentGateways: ["razorpay", "payu"],
          maxVehiclesPerHost: 12,
          commissionRate: 0.11,
        },
        status: "active",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date(),
      },
    ]

    tenantConfigs.forEach((config) => {
      this.tenants.set(config.id, config)
    })

    console.log("[v0] Initialized", this.tenants.size, "tenants")
  }

  static getTenantByDomain(domain: string): TenantConfig | null {
    for (const tenant of this.tenants.values()) {
      if (tenant.domain === domain || tenant.domain.includes(domain)) {
        return tenant
      }
    }
    return null
  }

  static getTenantById(tenantId: string): TenantConfig | null {
    return this.tenants.get(tenantId) || null
  }

  static getAllTenants(): TenantConfig[] {
    return Array.from(this.tenants.values())
  }

  static async createTenant(config: Omit<TenantConfig, "createdAt" | "updatedAt">): Promise<TenantConfig> {
    const tenant: TenantConfig = {
      ...config,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.tenants.set(tenant.id, tenant)

    // In production: Save to database, create database schema, setup infrastructure
    console.log("[v0] Created new tenant:", tenant.id)

    return tenant
  }

  static async updateTenant(tenantId: string, updates: Partial<TenantConfig>): Promise<TenantConfig | null> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) return null

    const updatedTenant = {
      ...tenant,
      ...updates,
      updatedAt: new Date(),
    }

    this.tenants.set(tenantId, updatedTenant)

    console.log("[v0] Updated tenant:", tenantId)
    return updatedTenant
  }

  static async suspendTenant(tenantId: string, reason: string): Promise<boolean> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) return false

    tenant.status = "suspended"
    tenant.updatedAt = new Date()

    console.log("[v0] Suspended tenant:", tenantId, "reason:", reason)
    return true
  }
}

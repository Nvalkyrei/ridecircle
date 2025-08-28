export enum Role {
  SUPER_ADMIN = "super_admin",
  CITY_ADMIN = "city_admin",
  SUPPORT_AGENT = "support_agent",
  HOST = "host",
  CUSTOMER = "customer",
  GUEST = "guest",
}

export enum Permission {
  // User Management
  USER_CREATE = "user:create",
  USER_READ = "user:read",
  USER_UPDATE = "user:update",
  USER_DELETE = "user:delete",
  USER_VERIFY = "user:verify",

  // Vehicle Management
  VEHICLE_CREATE = "vehicle:create",
  VEHICLE_READ = "vehicle:read",
  VEHICLE_UPDATE = "vehicle:update",
  VEHICLE_DELETE = "vehicle:delete",
  VEHICLE_APPROVE = "vehicle:approve",

  // Booking Management
  BOOKING_CREATE = "booking:create",
  BOOKING_READ = "booking:read",
  BOOKING_UPDATE = "booking:update",
  BOOKING_CANCEL = "booking:cancel",
  BOOKING_APPROVE = "booking:approve",

  // Payment Management
  PAYMENT_READ = "payment:read",
  PAYMENT_PROCESS = "payment:process",
  PAYMENT_REFUND = "payment:refund",

  // Admin Functions
  ADMIN_DASHBOARD = "admin:dashboard",
  ADMIN_REPORTS = "admin:reports",
  ADMIN_SETTINGS = "admin:settings",

  // Support Functions
  SUPPORT_CHAT = "support:chat",
  SUPPORT_TICKETS = "support:tickets",
  SUPPORT_ESCALATE = "support:escalate",
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission),

  [Role.CITY_ADMIN]: [
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_VERIFY,
    Permission.VEHICLE_READ,
    Permission.VEHICLE_APPROVE,
    Permission.BOOKING_READ,
    Permission.BOOKING_APPROVE,
    Permission.PAYMENT_READ,
    Permission.ADMIN_DASHBOARD,
    Permission.ADMIN_REPORTS,
    Permission.SUPPORT_CHAT,
    Permission.SUPPORT_TICKETS,
  ],

  [Role.SUPPORT_AGENT]: [
    Permission.USER_READ,
    Permission.VEHICLE_READ,
    Permission.BOOKING_READ,
    Permission.SUPPORT_CHAT,
    Permission.SUPPORT_TICKETS,
    Permission.SUPPORT_ESCALATE,
  ],

  [Role.HOST]: [
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.VEHICLE_CREATE,
    Permission.VEHICLE_READ,
    Permission.VEHICLE_UPDATE,
    Permission.BOOKING_READ,
    Permission.BOOKING_APPROVE,
    Permission.PAYMENT_READ,
  ],

  [Role.CUSTOMER]: [
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.VEHICLE_READ,
    Permission.BOOKING_CREATE,
    Permission.BOOKING_READ,
    Permission.BOOKING_CANCEL,
    Permission.PAYMENT_READ,
  ],

  [Role.GUEST]: [Permission.VEHICLE_READ],
}

export class RBACManager {
  static hasPermission(userRole: Role, requiredPermission: Permission): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || []
    return rolePermissions.includes(requiredPermission)
  }

  static hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(userRole, permission))
  }

  static hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(userRole, permission))
  }

  static canAccessResource(userRole: Role, resource: string, action: string): boolean {
    const permission = `${resource}:${action}` as Permission
    return this.hasPermission(userRole, permission)
  }
}

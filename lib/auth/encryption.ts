import bcrypt from "bcryptjs"
import crypto from "crypto"

export class EncryptionManager {
  private static readonly SALT_ROUNDS = 12
  private static readonly ALGORITHM = "aes-256-gcm"
  private static readonly KEY = process.env.ENCRYPTION_KEY!

  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // PII encryption for sensitive data
  static encryptPII(data: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.ALGORITHM, this.KEY)
    cipher.setAAD(Buffer.from("ridecircle-pii"))

    let encrypted = cipher.update(data, "utf8", "hex")
    encrypted += cipher.final("hex")

    const tag = cipher.getAuthTag()

    return {
      encrypted,
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
    }
  }

  static decryptPII(encryptedData: { encrypted: string; iv: string; tag: string }): string {
    const decipher = crypto.createDecipher(this.ALGORITHM, this.KEY)
    decipher.setAAD(Buffer.from("ridecircle-pii"))
    decipher.setAuthTag(Buffer.from(encryptedData.tag, "hex"))

    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  }

  // Generate secure random tokens
  static generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  }
}

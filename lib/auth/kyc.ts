export interface KYCDocument {
  id: string
  userId: string
  documentType: "aadhaar" | "pan" | "driving_license" | "passport" | "voter_id"
  documentNumber: string
  documentImageUrl: string
  verificationStatus: "pending" | "verified" | "rejected"
  verificationNotes?: string
  expiryDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface KYCVerificationResult {
  isValid: boolean
  confidence: number
  extractedData: Record<string, any>
  errors: string[]
}

export class KYCManager {
  // Aadhaar validation (basic format check)
  static validateAadhaar(aadhaarNumber: string): boolean {
    const aadhaarRegex = /^\d{4}\s?\d{4}\s?\d{4}$/
    return aadhaarRegex.test(aadhaarNumber.replace(/\s/g, ""))
  }

  // PAN validation
  static validatePAN(panNumber: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return panRegex.test(panNumber.toUpperCase())
  }

  // Driving License validation (basic format)
  static validateDrivingLicense(dlNumber: string, state: string): boolean {
    // Basic format validation - in production, integrate with Vahan/Sarathi APIs
    const dlRegex = /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/
    return dlRegex.test(dlNumber.toUpperCase())
  }

  // Document verification using OCR/AI services
  static async verifyDocument(
    documentType: string,
    documentImageUrl: string,
    documentNumber: string,
  ): Promise<KYCVerificationResult> {
    try {
      // Mock verification - in production, integrate with services like:
      // - Aadhaar Verification API (UIDAI)
      // - PAN Verification API (NSDL/UTI)
      // - DigiLocker API
      // - Third-party KYC services (IDfy, Signzy, etc.)

      const mockResult: KYCVerificationResult = {
        isValid: true,
        confidence: 0.95,
        extractedData: {
          documentNumber,
          name: "John Doe",
          dateOfBirth: "1990-01-01",
          address: "Sample Address",
        },
        errors: [],
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return mockResult
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        extractedData: {},
        errors: ["Document verification failed"],
      }
    }
  }

  // Check if user has completed KYC
  static async isKYCComplete(userId: string): Promise<boolean> {
    // In production, check database for required verified documents
    // For Indian car rental, typically need:
    // - Aadhaar (identity proof)
    // - PAN (income tax proof)
    // - Driving License (for customers)
    // - Additional documents for hosts (RC, insurance, etc.)

    return false // Mock implementation
  }

  // Get KYC completion percentage
  static async getKYCProgress(userId: string): Promise<{ percentage: number; missingDocuments: string[] }> {
    // Mock implementation
    return {
      percentage: 60,
      missingDocuments: ["driving_license", "pan"],
    }
  }
}

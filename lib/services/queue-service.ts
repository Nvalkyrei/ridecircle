import { Redis } from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)

export interface QueueJob {
  id: string
  type: string
  data: any
  priority: number
  attempts: number
  maxAttempts: number
  delay?: number
  createdAt: Date
  processedAt?: Date
}

export class QueueService {
  private static readonly QUEUE_PREFIX = "queue:"
  private static readonly PROCESSING_PREFIX = "processing:"
  private static readonly FAILED_PREFIX = "failed:"

  static async addJob(
    queueName: string,
    jobType: string,
    data: any,
    options: {
      priority?: number
      delay?: number
      maxAttempts?: number
    } = {},
  ) {
    const job: QueueJob = {
      id: crypto.randomUUID(),
      type: jobType,
      data,
      priority: options.priority || 0,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      delay: options.delay,
      createdAt: new Date(),
    }

    const queueKey = `${this.QUEUE_PREFIX}${queueName}`
    const score = options.delay ? Date.now() + options.delay : Date.now() - job.priority

    await redis.zadd(queueKey, score, JSON.stringify(job))

    console.log("[v0] Added job to queue:", queueName, job.id, job.type)

    return job.id
  }

  static async processQueue(queueName: string, processor: (job: QueueJob) => Promise<void>) {
    const queueKey = `${this.QUEUE_PREFIX}${queueName}`
    const processingKey = `${this.PROCESSING_PREFIX}${queueName}`

    while (true) {
      try {
        // Get next job from queue
        const result = await redis.bzpopmin(queueKey, 5) // 5 second timeout

        if (!result) continue

        const [, , jobData] = result
        const job: QueueJob = JSON.parse(jobData)

        // Move to processing
        await redis.zadd(processingKey, Date.now(), JSON.stringify(job))

        try {
          // Process the job
          await processor(job)

          // Remove from processing on success
          await redis.zrem(processingKey, JSON.stringify(job))

          console.log("[v0] Job processed successfully:", job.id)
        } catch (error) {
          console.error("[v0] Job processing failed:", job.id, error)

          // Increment attempts
          job.attempts++

          if (job.attempts >= job.maxAttempts) {
            // Move to failed queue
            const failedKey = `${this.FAILED_PREFIX}${queueName}`
            await redis.zadd(failedKey, Date.now(), JSON.stringify(job))
            await redis.zrem(processingKey, JSON.stringify(job))
          } else {
            // Retry with exponential backoff
            const delay = Math.pow(2, job.attempts) * 1000
            const retryScore = Date.now() + delay

            await redis.zadd(queueKey, retryScore, JSON.stringify(job))
            await redis.zrem(processingKey, JSON.stringify(job))
          }
        }
      } catch (error) {
        console.error("[v0] Queue processing error:", error)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  // Predefined job processors
  static async processDocumentVerification(job: QueueJob) {
    console.log("[v0] Processing document verification:", job.data)

    const { vehicleId, documentType, documentUrl } = job.data

    // Mock document verification
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update vehicle status
    console.log("[v0] Document verified for vehicle:", vehicleId)
  }

  static async processPaymentWebhook(job: QueueJob) {
    console.log("[v0] Processing payment webhook:", job.data)

    const { gatewayProvider, payload } = job.data

    // Process payment update
    // Update booking status
    // Send notifications

    console.log("[v0] Payment webhook processed")
  }

  static async processNotificationSending(job: QueueJob) {
    console.log("[v0] Processing notification:", job.data)

    const { userId, type, data } = job.data

    // Send notification via NotificationService
    console.log("[v0] Notification sent to user:", userId)
  }
}

# Ride Circle - Webhook Specifications

## Overview

Ride Circle platform supports webhooks for real-time event notifications to external systems, payment gateways, and third-party integrations. This document defines all webhook events, payloads, and security requirements.

## Webhook Configuration

### Endpoint Requirements
- **HTTPS Only**: All webhook endpoints must use HTTPS
- **Response Time**: Must respond within 10 seconds
- **Response Codes**: Return 2xx for successful processing
- **Retry Logic**: Failed webhooks are retried up to 3 times with exponential backoff

### Security
- **Signature Verification**: All webhooks include HMAC-SHA256 signature
- **IP Whitelisting**: Webhooks sent from verified IP ranges
- **Timestamp Validation**: Requests include timestamp to prevent replay attacks

### Headers
\`\`\`
Content-Type: application/json
X-RideCircle-Signature: sha256=<signature>
X-RideCircle-Event: <event_type>
X-RideCircle-Timestamp: <unix_timestamp>
X-RideCircle-Tenant: <tenant_code>
\`\`\`

## Event Types

### 1. User Events

#### user.registered
Triggered when a new user completes registration.

\`\`\`json
{
  "event": "user.registered",
  "timestamp": "2024-01-15T10:30:00Z",
  "tenant": "mumbai",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "phone": "+919876543210",
      "role": "customer",
      "firstName": "John",
      "lastName": "Doe",
      "registeredAt": "2024-01-15T10:30:00Z"
    }
  }
}
\`\`\`

#### user.kyc_approved
Triggered when user's KYC verification is approved.

\`\`\`json
{
  "event": "user.kyc_approved",
  "timestamp": "2024-01-15T10:30:00Z",
  "tenant": "mumbai",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "role": "host"
    },
    "kyc": {
      "approvedAt": "2024-01-15T10:30:00Z",
      "approvedBy": "admin-user-id",
      "documentsVerified": ["aadhaar", "driving_license"]
    }
  }
}
\`\`\`

#### user.status_changed
Triggered when user status changes (suspended, banned, etc.).

\`\`\`json
{
  "event": "user.status_changed",
  "timestamp": "2024-01-15T10:30:00Z",
  "tenant": "mumbai",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com"
    },
    "statusChange": {
      "from": "active",
      "to": "suspended",
      "reason": "Policy violation",
      "changedBy": "admin-user-id",
      "changedAt": "2024-01-15T10:30:00Z"
    }
  }
}
\`\`\`

### 2. Vehicle Events

#### vehicle.listed
Triggered when a vehicle is approved and listed.

\`\`\`json
{
  "event": "vehicle.listed",
  "timestamp": "2024-01-15T10:30:00Z",
  "tenant": "mumbai",
  "data": {
    "vehicle": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "hostId": "550e8400-e29b-41d4-a716-446655440000",
      "make": "Honda",
      "model": "City",
      "year": 2020,
      "registrationNumber": "MH01AB1234",
      "basePricePerDay": 2500,
      "location": {
        "lat": 19.0760,
        "lng": 72.8777
      },
      "approvedAt": "2024-01-15T10:30:00Z"
    }
  }
}
\`\`\`

#### vehicle.status_changed
Triggered when vehicle status changes.

\`\`\`json
{
  "event": "vehicle.status_changed",
  "timestamp": "2024-01-15T10:30:00Z",
  "tenant": "mumbai",
  "data": {
    "vehicle": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "registrationNumber": "MH01AB1234"
    },
    "statusChange": {
      "from": "active",
      "to": "maintenance",
      "reason": "Scheduled maintenance",
      "changedAt": "2024-01-15T10:30:00Z"
    }
  }
}
\`\`\`

### 3. Booking Events

#### booking.created
Triggered when a new booking is created.

\`\`\`json
{
  "event": "booking.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "tenant": "mumbai",
  "data": {
    "booking": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "bookingNumber": "RC2024001234",
      "customerId": "550e8400-e29b-41d4-a716-446655440000",
      "hostId": "551e8400-e29b-41d4-a716-446655440000",
      "vehicleId": "660e8400-e29b-41d4-a716-446655440000",
      "startDate": "2024-01-20T09:00:00Z",
      "endDate": "2024-01-22T18:00:00Z",
      "totalAmount": 5000,
      "securityDeposit": 5000,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
\`\`\`

#### booking.confirmed
Triggered when a booking is confirmed by the host.

\`\`\`json
{
  "event": "booking.confirmed",
  "timestamp": "2024-01-15T11:00:00Z",
  "tenant": "mumbai",
  "data": {
    "booking": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "bookingNumber": "RC2024001234",
      "status": "confirmed",
      "confirmedAt": "2024-01-15T11:00:00Z"
    }
  }
}
\`\`\`

#### booking.cancelled
Triggered when a booking is cancelled.

\`\`\`json
{
  "event": "booking.cancelled",
  "timestamp": "2024-01-15T12:00:00Z",
  "tenant": "mumbai",
  "data": {
    "booking": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "bookingNumber": "RC2024001234",
      "status": "cancelled",
      "cancellationReason": "Customer request",
      "cancelledBy": "550e8400-e29b-41d4-a716-446655440000",
      "cancelledAt": "2024-01-15T12:00:00Z"
    },
    "refund": {
      "amount": 4500,
      "processingFee": 500,
      "refundMethod": "original_payment_method"
    }
  }
}
\`\`\`

#### booking.trip_started
Triggered when a trip is started.

\`\`\`json
{
  "event": "booking.trip_started",
  "timestamp": "2024-01-20T09:15:00Z",
  "tenant": "mumbai",
  "data": {
    "booking": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "bookingNumber": "RC2024001234",
      "status": "active",
      "actualStartTime": "2024-01-20T09:15:00Z",
      "startOdometer": 45230,
      "fuelLevelStart": 85
    }
  }
}
\`\`\`

#### booking.trip_completed
Triggered when a trip is completed.

\`\`\`json
{
  "event": "booking.trip_completed",
  "timestamp": "2024-01-22T18:30:00Z",
  "tenant": "mumbai",
  "data": {
    "booking": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "bookingNumber": "RC2024001234",
      "status": "completed",
      "actualEndTime": "2024-01-22T18:30:00Z",
      "endOdometer": 45580,
      "fuelLevelEnd": 75,
      "totalDistance": 350
    },
    "charges": {
      "baseAmount": 5000,
      "extraMileageCharge": 0,
      "fuelCharge": 200,
      "totalAmount": 5200
    }
  }
}
\`\`\`

### 4. Payment Events

#### payment.initiated
Triggered when a payment is initiated.

\`\`\`json
{
  "event": "payment.initiated",
  "timestamp": "2024-01-15T10:35:00Z",
  "tenant": "mumbai",
  "data": {
    "payment": {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "bookingId": "770e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "amount": 5000,
      "currency": "INR",
      "paymentMethod": "card",
      "transactionType": "booking",
      "status": "pending",
      "gatewayProvider": "razorpay",
      "gatewayTransactionId": "pay_abc123"
    }
  }
}
\`\`\`

#### payment.completed
Triggered when a payment is successfully completed.

\`\`\`json
{
  "event": "payment.completed",
  "timestamp": "2024-01-15T10:36:00Z",
  "tenant": "mumbai",
  "data": {
    "payment": {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "bookingId": "770e8400-e29b-41d4-a716-446655440000",
      "amount": 5000,
      "status": "completed",
      "processedAt": "2024-01-15T10:36:00Z",
      "gatewayTransactionId": "pay_abc123"
    }
  }
}
\`\`\`

#### payment.failed
Triggered when a payment fails.

\`\`\`json
{
  "event": "payment.failed",
  "timestamp": "2024-01-15T10:36:00Z",
  "tenant": "mumbai",
  "data": {
    "payment": {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "bookingId": "770e8400-e29b-41d4-a716-446655440000",
      "amount": 5000,
      "status": "failed",
      "failedReason": "Insufficient funds",
      "gatewayTransactionId": "pay_abc123"
    }
  }
}
\`\`\`

#### payment.refunded
Triggered when a refund is processed.

\`\`\`json
{
  "event": "payment.refunded",
  "timestamp": "2024-01-15T14:00:00Z",
  "tenant": "mumbai",
  "data": {
    "payment": {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "originalAmount": 5000,
      "refundAmount": 4500,
      "refundReason": "Booking cancellation",
      "refundedAt": "2024-01-15T14:00:00Z",
      "refundTransactionId": "rfnd_xyz789"
    }
  }
}
\`\`\`

### 5. Review Events

#### review.created
Triggered when a new review is created.

\`\`\`json
{
  "event": "review.created",
  "timestamp": "2024-01-23T10:00:00Z",
  "tenant": "mumbai",
  "data": {
    "review": {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "bookingId": "770e8400-e29b-41d4-a716-446655440000",
      "reviewerId": "550e8400-e29b-41d4-a716-446655440000",
      "revieweeId": "551e8400-e29b-41d4-a716-446655440000",
      "vehicleId": "660e8400-e29b-41d4-a716-446655440000",
      "overallRating": 5,
      "cleanlinessRating": 5,
      "communicationRating": 4,
      "vehicleConditionRating": 5,
      "title": "Excellent experience!",
      "comment": "Great car and very responsive host.",
      "createdAt": "2024-01-23T10:00:00Z"
    }
  }
}
\`\`\`

### 6. Incident Events

#### incident.reported
Triggered when an incident is reported.

\`\`\`json
{
  "event": "incident.reported",
  "timestamp": "2024-01-21T15:30:00Z",
  "tenant": "mumbai",
  "data": {
    "incident": {
      "id": "aa0e8400-e29b-41d4-a716-446655440000",
      "bookingId": "770e8400-e29b-41d4-a716-446655440000",
      "vehicleId": "660e8400-e29b-41d4-a716-446655440000",
      "reportedBy": "550e8400-e29b-41d4-a716-446655440000",
      "type": "damage",
      "title": "Minor scratch on door",
      "description": "Small scratch noticed on driver side door",
      "estimatedCost": 2000,
      "status": "reported",
      "reportedAt": "2024-01-21T15:30:00Z"
    }
  }
}
\`\`\`

#### incident.resolved
Triggered when an incident is resolved.

\`\`\`json
{
  "event": "incident.resolved",
  "timestamp": "2024-01-25T12:00:00Z",
  "tenant": "mumbai",
  "data": {
    "incident": {
      "id": "aa0e8400-e29b-41d4-a716-446655440000",
      "status": "resolved",
      "actualCost": 1800,
      "insuranceClaimNumber": "INS2024001",
      "resolvedAt": "2024-01-25T12:00:00Z",
      "resolutionNotes": "Repair completed at authorized service center"
    }
  }
}
\`\`\`

### 7. System Events

#### system.maintenance_scheduled
Triggered when system maintenance is scheduled.

\`\`\`json
{
  "event": "system.maintenance_scheduled",
  "timestamp": "2024-01-15T10:00:00Z",
  "tenant": "all",
  "data": {
    "maintenance": {
      "id": "maint_001",
      "title": "Database maintenance",
      "description": "Scheduled database optimization",
      "scheduledStart": "2024-01-20T02:00:00Z",
      "scheduledEnd": "2024-01-20T04:00:00Z",
      "affectedServices": ["bookings", "payments"],
      "severity": "medium"
    }
  }
}
\`\`\`

## Webhook Security

### Signature Verification

All webhooks include an HMAC-SHA256 signature in the `X-RideCircle-Signature` header. Verify the signature using your webhook secret:

\`\`\`javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  const receivedSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  );
}
\`\`\`

### Timestamp Validation

Verify the timestamp to prevent replay attacks:

\`\`\`javascript
function verifyTimestamp(timestamp, tolerance = 300) {
  const now = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp);
  
  return Math.abs(now - webhookTime) <= tolerance;
}
\`\`\`

## Webhook Management API

### Register Webhook Endpoint

\`\`\`http
POST /api/v1/admin/webhooks
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/ridecircle",
  "events": ["booking.created", "payment.completed"],
  "secret": "your-webhook-secret",
  "active": true
}
\`\`\`

### Update Webhook

\`\`\`http
PUT /api/v1/admin/webhooks/{webhook_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "events": ["booking.created", "booking.confirmed", "payment.completed"],
  "active": true
}
\`\`\`

### Test Webhook

\`\`\`http
POST /api/v1/admin/webhooks/{webhook_id}/test
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "event": "booking.created"
}
\`\`\`

### Webhook Logs

\`\`\`http
GET /api/v1/admin/webhooks/{webhook_id}/logs
Authorization: Bearer <admin_token>

Response:
{
  "logs": [
    {
      "id": "log_001",
      "event": "booking.created",
      "status": "success",
      "responseCode": 200,
      "responseTime": 150,
      "attempts": 1,
      "sentAt": "2024-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

## Error Handling

### Retry Logic
- **Initial Retry**: After 1 second
- **Second Retry**: After 5 seconds  
- **Third Retry**: After 25 seconds
- **Final Failure**: Webhook marked as failed after 3 attempts

### Failure Notifications
Failed webhooks trigger admin notifications and are logged for manual review.

### Webhook Deactivation
Webhooks with consistent failures (>90% failure rate over 24 hours) are automatically deactivated.

## Best Practices

1. **Idempotency**: Handle duplicate webhook deliveries gracefully
2. **Quick Response**: Respond with 2xx status code quickly, process asynchronously
3. **Validation**: Always verify signature and timestamp
4. **Logging**: Log all webhook events for debugging
5. **Monitoring**: Monitor webhook endpoint health and response times
6. **Graceful Degradation**: Handle webhook failures without affecting core functionality

## Rate Limits

- **Per Endpoint**: Maximum 1000 webhooks per minute
- **Per Event Type**: Maximum 100 webhooks per minute per event type
- **Burst Limit**: Maximum 50 webhooks in 10 seconds

## Support

For webhook integration support:
- Email: webhook-support@ridecircle.in
- Documentation: https://docs.ridecircle.in/webhooks
- Status Page: https://status.ridecircle.in

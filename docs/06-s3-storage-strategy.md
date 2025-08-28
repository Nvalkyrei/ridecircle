# S3 Storage Strategy & Lifecycle Policies

## S3 Bucket Structure

### Primary Buckets
\`\`\`
ridecircle-prod-media/
├── users/
├── vehicles/
├── documents/
├── incidents/
├── support/
├── cms/
└── temp/

ridecircle-prod-backups/
├── database/
├── logs/
└── exports/
\`\`\`

## Key Naming Strategy

### User-Related Files
\`\`\`
users/{user_id}/
├── profile/
│   ├── avatar/{timestamp}-{filename}
│   └── documents/{doc_type}/{timestamp}-{filename}
├── kyc/
│   ├── aadhaar/{timestamp}-{filename}
│   ├── pan/{timestamp}-{filename}
│   ├── driving_license/{timestamp}-{filename}
│   └── passport/{timestamp}-{filename}
└── biometric/
    ├── signatures/{timestamp}-{filename}
    └── templates/{encrypted_hash}
\`\`\`

### Vehicle-Related Files
\`\`\`
vehicles/{vehicle_id}/
├── images/
│   ├── exterior/{timestamp}-{angle}-{filename}
│   ├── interior/{timestamp}-{angle}-{filename}
│   └── documents/{timestamp}-{filename}
├── rc_documents/{timestamp}-{filename}
├── insurance/{timestamp}-{filename}
└── maintenance/
    ├── records/{timestamp}-{filename}
    └── receipts/{timestamp}-{filename}
\`\`\`

### Booking & Trip Files
\`\`\`
bookings/{booking_id}/
├── checklists/
│   ├── pre_trip/{timestamp}-{filename}
│   └── post_trip/{timestamp}-{filename}
├── video_declarations/
│   ├── pre_trip/{timestamp}-{filename}
│   └── post_trip/{timestamp}-{filename}
├── incidents/
│   ├── damage_reports/{incident_id}/{timestamp}-{filename}
│   └── evidence/{incident_id}/{timestamp}-{filename}
└── receipts/{timestamp}-{filename}
\`\`\`

### Support & CMS Files
\`\`\`
support/{ticket_id}/
├── attachments/{timestamp}-{filename}
└── screenshots/{timestamp}-{filename}

cms/
├── pages/{page_id}/{timestamp}-{filename}
├── blog/{post_id}/{timestamp}-{filename}
└── assets/
    ├── images/{category}/{timestamp}-{filename}
    └── documents/{timestamp}-{filename}
\`\`\`

### Temporary Files
\`\`\`
temp/
├── uploads/{session_id}/{timestamp}-{filename}
├── processing/{job_id}/{timestamp}-{filename}
└── exports/{user_id}/{timestamp}-{filename}
\`\`\`

## Lifecycle Policies

### Policy 1: User Documents (Long-term Retention)
\`\`\`json
{
  "Rules": [
    {
      "ID": "UserDocumentsRetention",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "users/"
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        },
        {
          "Days": 2555,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ],
      "Expiration": {
        "Days": 2920
      }
    }
  ]
}
\`\`\`

### Policy 2: Vehicle Images (Medium-term Retention)
\`\`\`json
{
  "Rules": [
    {
      "ID": "VehicleImagesRetention",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "vehicles/"
      },
      "Transitions": [
        {
          "Days": 7,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 30,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 1095
      }
    }
  ]
}
\`\`\`

### Policy 3: Booking Files (Compliance Retention)
\`\`\`json
{
  "Rules": [
    {
      "ID": "BookingFilesRetention",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "bookings/"
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 180,
          "StorageClass": "GLACIER"
        },
        {
          "Days": 1095,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ],
      "Expiration": {
        "Days": 2555
      }
    }
  ]
}
\`\`\`

### Policy 4: Temporary Files (Short-term)
\`\`\`json
{
  "Rules": [
    {
      "ID": "TempFilesCleanup",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "temp/"
      },
      "Expiration": {
        "Days": 7
      },
      "AbortIncompleteMultipartUpload": {
        "DaysAfterInitiation": 1
      }
    }
  ]
}
\`\`\`

### Policy 5: Support Files (Medium-term)
\`\`\`json
{
  "Rules": [
    {
      "ID": "SupportFilesRetention",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "support/"
      },
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 365,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 1825
      }
    }
  ]
}
\`\`\`

## Security & Access Control

### Bucket Policies
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureConnections",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::ridecircle-prod-media",
        "arn:aws:s3:::ridecircle-prod-media/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    },
    {
      "Sid": "AllowApplicationAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT:role/RideCircleAppRole"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::ridecircle-prod-media/*"
    }
  ]
}
\`\`\`

### CORS Configuration
\`\`\`json
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "https://ridecircle.com",
        "https://*.ridecircle.com"
      ],
      "AllowedMethods": [
        "GET",
        "PUT",
        "POST",
        "DELETE"
      ],
      "AllowedHeaders": [
        "*"
      ],
      "MaxAgeSeconds": 3000
    }
  ]
}
\`\`\`

## File Processing Pipeline

### Image Processing
\`\`\`typescript
// Image optimization pipeline
const processImage = async (key: string) => {
  const sizes = [
    { width: 150, height: 150, suffix: 'thumb' },
    { width: 400, height: 300, suffix: 'small' },
    { width: 800, height: 600, suffix: 'medium' },
    { width: 1200, height: 900, suffix: 'large' }
  ];
  
  // Generate optimized versions
  for (const size of sizes) {
    await generateOptimizedImage(key, size);
  }
};
\`\`\`

### Video Processing
\`\`\`typescript
// Video processing for declarations
const processVideo = async (key: string) => {
  // Generate thumbnail
  await generateVideoThumbnail(key);
  
  // Compress video
  await compressVideo(key, {
    quality: 'medium',
    maxSize: '50MB'
  });
  
  // Extract audio for voice verification
  await extractAudio(key);
};
\`\`\`

## Monitoring & Analytics

### CloudWatch Metrics
- Storage usage by prefix
- Request patterns
- Error rates
- Cost optimization opportunities

### Cost Optimization
- Regular lifecycle policy reviews
- Unused file identification
- Storage class optimization
- Duplicate file detection

## Compliance & Legal

### Data Retention Schedule
- **KYC Documents**: 7 years (RBI requirement)
- **Financial Records**: 7 years (Income Tax Act)
- **Trip Records**: 5 years (Motor Vehicle Act)
- **User Data**: As per PDPB 2023 requirements
- **Biometric Data**: Special handling with encryption

### Geographic Restrictions
- Data residency in India for Indian users
- Cross-border transfer restrictions
- Compliance with local data protection laws

This S3 strategy ensures efficient storage management, cost optimization, regulatory compliance, and scalable file handling for the Ride Circle platform.

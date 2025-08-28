# Deployment Guide - Ride Circle Platform

## Overview

This guide covers the complete deployment architecture for the Ride Circle platform, including multi-tenant setup, infrastructure provisioning, CI/CD pipelines, and monitoring.

## Architecture Overview

### Multi-Tenant Architecture
- **City-based Tenants**: Separate configurations for each city (Bangalore, Mumbai, Delhi)
- **Shared Infrastructure**: Common Kubernetes cluster with tenant isolation
- **Database Isolation**: Separate database schemas per tenant
- **Domain-based Routing**: Subdomain routing for tenant identification

### Infrastructure Components
- **AWS EKS**: Kubernetes cluster for container orchestration
- **RDS PostgreSQL**: Primary database with multi-AZ deployment
- **ElastiCache Redis**: Caching and session storage
- **S3**: File storage with city-specific buckets
- **CloudFront**: CDN for static assets
- **Route 53**: DNS management
- **Application Load Balancer**: Traffic distribution

## Deployment Environments

### 1. Development
- Local Docker Compose setup
- Single tenant configuration
- SQLite for rapid development

### 2. Staging
- AWS EKS cluster (smaller instance types)
- Single RDS instance
- Automated deployments from `develop` branch

### 3. Production
- AWS EKS cluster with auto-scaling
- Multi-AZ RDS with read replicas
- ElastiCache Redis cluster
- Automated deployments from `main` branch

## Prerequisites

### Required Tools
\`\`\`bash
# Install required tools
kubectl
helm
terraform
docker
aws-cli
\`\`\`

### AWS Setup
\`\`\`bash
# Configure AWS CLI
aws configure

# Create S3 bucket for Terraform state
aws s3 mb s3://ridecircle-terraform-state --region ap-south-1
\`\`\`

## Infrastructure Deployment

### 1. Terraform Infrastructure
\`\`\`bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var="db_password=your-secure-password"

# Apply infrastructure
terraform apply -var="db_password=your-secure-password"
\`\`\`

### 2. Kubernetes Setup
\`\`\`bash
# Update kubeconfig
aws eks update-kubeconfig --region ap-south-1 --name ridecircle-production

# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl apply -f infrastructure/kubernetes/configmap.yaml
kubectl apply -f infrastructure/kubernetes/secret.yaml
kubectl apply -f infrastructure/kubernetes/deployment.yaml
kubectl apply -f infrastructure/kubernetes/ingress.yaml
kubectl apply -f infrastructure/kubernetes/hpa.yaml
\`\`\`

### 3. Database Migration
\`\`\`bash
# Run database migrations
kubectl exec -it deployment/ridecircle-app -- npm run db:migrate

# Seed initial data
kubectl exec -it deployment/ridecircle-app -- npm run db:seed
\`\`\`

## Multi-Tenant Configuration

### Tenant Setup
Each tenant (city) has its own:
- Database schema
- S3 bucket
- Configuration settings
- Domain/subdomain

### Adding New Tenant
\`\`\`typescript
// Add to tenant-manager.ts
const newTenant: TenantConfig = {
  id: "pune",
  name: "Ride Circle Pune",
  domain: "pune.ridecircle.com",
  region: "ap-south-1",
  databaseUrl: process.env.DATABASE_URL_PUNE!,
  redisUrl: process.env.REDIS_URL_PUNE!,
  s3Bucket: "ridecircle-pune",
  features: ["vehicle_rental", "host_crm"],
  settings: {
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "en-IN",
    paymentGateways: ["razorpay"],
    maxVehiclesPerHost: 8,
    commissionRate: 0.1,
  },
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
}
\`\`\`

## CI/CD Pipeline

### GitHub Actions Workflow
1. **Test Stage**: Run unit tests, integration tests, and linting
2. **Build Stage**: Build Docker image and push to registry
3. **Deploy Stage**: Deploy to staging/production based on branch

### Deployment Process
\`\`\`bash
# Staging deployment (develop branch)
git push origin develop

# Production deployment (main branch)
git push origin main
\`\`\`

## Monitoring & Observability

### Health Checks
\`\`\`typescript
// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    tenant: req.headers['x-tenant-id']
  })
})
\`\`\`

### Metrics Collection
- **Application Metrics**: Custom metrics via Prometheus
- **Infrastructure Metrics**: CloudWatch for AWS resources
- **Log Aggregation**: CloudWatch Logs with structured logging

### Alerting
- **Uptime Monitoring**: Health check failures
- **Performance Alerts**: Response time > 2s
- **Error Rate Alerts**: Error rate > 1%
- **Resource Alerts**: CPU/Memory usage > 80%

## Security Considerations

### Network Security
- Private subnets for databases and cache
- Security groups with minimal required access
- VPC endpoints for AWS services

### Data Security
- Encryption at rest for all data stores
- TLS 1.3 for all communications
- Secrets management via AWS Secrets Manager

### Access Control
- IAM roles with least privilege
- RBAC in Kubernetes
- Multi-factor authentication for admin access

## Scaling Strategy

### Horizontal Scaling
- HPA based on CPU/Memory metrics
- Auto-scaling node groups
- Database read replicas

### Vertical Scaling
- Instance type upgrades
- Storage scaling
- Cache cluster scaling

## Disaster Recovery

### Backup Strategy
- Daily RDS snapshots with 7-day retention
- S3 cross-region replication
- Kubernetes cluster backup

### Recovery Procedures
1. Database restore from snapshot
2. Application deployment from latest image
3. DNS failover to backup region

## Cost Optimization

### Resource Optimization
- Spot instances for non-critical workloads
- Reserved instances for predictable workloads
- S3 lifecycle policies for old data

### Monitoring Costs
- AWS Cost Explorer for usage analysis
- Budget alerts for cost overruns
- Regular resource utilization reviews

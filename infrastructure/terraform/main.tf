terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }

  backend "s3" {
    bucket = "ridecircle-terraform-state"
    key    = "production/terraform.tfstate"
    region = "ap-south-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "ridecircle_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "ridecircle-vpc"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "ridecircle_igw" {
  vpc_id = aws_vpc.ridecircle_vpc.id

  tags = {
    Name        = "ridecircle-igw"
    Environment = var.environment
  }
}

# Public Subnets
resource "aws_subnet" "public_subnets" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.ridecircle_vpc.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = var.availability_zones[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name        = "ridecircle-public-subnet-${count.index + 1}"
    Environment = var.environment
    Type        = "public"
  }
}

# Private Subnets
resource "aws_subnet" "private_subnets" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.ridecircle_vpc.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "ridecircle-private-subnet-${count.index + 1}"
    Environment = var.environment
    Type        = "private"
  }
}

# EKS Cluster
resource "aws_eks_cluster" "ridecircle_cluster" {
  name     = "ridecircle-${var.environment}"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = "1.28"

  vpc_config {
    subnet_ids              = concat(aws_subnet.public_subnets[*].id, aws_subnet.private_subnets[*].id)
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = ["0.0.0.0/0"]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_resource_controller,
  ]

  tags = {
    Name        = "ridecircle-eks-${var.environment}"
    Environment = var.environment
  }
}

# EKS Node Group
resource "aws_eks_node_group" "ridecircle_nodes" {
  cluster_name    = aws_eks_cluster.ridecircle_cluster.name
  node_group_name = "ridecircle-nodes"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = aws_subnet.private_subnets[*].id

  instance_types = ["t3.medium", "t3.large"]
  capacity_type  = "ON_DEMAND"

  scaling_config {
    desired_size = 3
    max_size     = 10
    min_size     = 2
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry_policy,
  ]

  tags = {
    Name        = "ridecircle-node-group"
    Environment = var.environment
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "ridecircle_db" {
  identifier = "ridecircle-${var.environment}"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.medium"

  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = "ridecircle"
  username = "ridecircle"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.ridecircle_db_subnet_group.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = false
  final_snapshot_identifier = "ridecircle-${var.environment}-final-snapshot"

  tags = {
    Name        = "ridecircle-db-${var.environment}"
    Environment = var.environment
  }
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "ridecircle_cache_subnet_group" {
  name       = "ridecircle-cache-subnet-group"
  subnet_ids = aws_subnet.private_subnets[*].id
}

resource "aws_elasticache_replication_group" "ridecircle_redis" {
  replication_group_id       = "ridecircle-${var.environment}"
  description                = "Redis cluster for Ride Circle"
  
  node_type                  = "cache.t3.micro"
  port                       = 6379
  parameter_group_name       = "default.redis7"
  
  num_cache_clusters         = 2
  automatic_failover_enabled = true
  multi_az_enabled          = true
  
  subnet_group_name = aws_elasticache_subnet_group.ridecircle_cache_subnet_group.name
  security_group_ids = [aws_security_group.redis_sg.id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  tags = {
    Name        = "ridecircle-redis-${var.environment}"
    Environment = var.environment
  }
}

# S3 Buckets for file storage
resource "aws_s3_bucket" "ridecircle_storage" {
  for_each = toset(["bangalore", "mumbai", "delhi"])
  
  bucket = "ridecircle-${each.key}-${var.environment}"

  tags = {
    Name        = "ridecircle-${each.key}-storage"
    Environment = var.environment
    City        = each.key
  }
}

resource "aws_s3_bucket_versioning" "ridecircle_storage_versioning" {
  for_each = aws_s3_bucket.ridecircle_storage
  
  bucket = each.value.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "ridecircle_storage_encryption" {
  for_each = aws_s3_bucket.ridecircle_storage
  
  bucket = each.value.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

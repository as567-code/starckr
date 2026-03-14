variable "s3_bucket_name" {
  default     = "aditya-app-frontend"
  type        = string
  description = "Name of the S3 bucket"
}

variable "region" {
  default     = "us-east-1"
  type        = string
  description = "AWS region"
}

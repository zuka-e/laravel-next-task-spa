# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter

################################################################################
# Route53
################################################################################
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route53_zone

resource "aws_ssm_parameter" "hosted_zone_id" {
  name        = "/${var.project}/${var.stage}/HOSTED_ZONE_ID"
  type        = "SecureString"
  value       = data.aws_route53_zone.root.zone_id
  description = "The hosted zone ID for the root domain"
}

resource "aws_ssm_parameter" "domain_name" {
  name        = "/${var.project}/${var.stage}/DOMAIN_NAME"
  type        = "SecureString"
  value       = data.aws_route53_zone.root.name
  description = "The domain name for the root domain"
}

################################################################################
# ACM
################################################################################
# https://github.com/terraform-aws-modules/terraform-aws-acm/blob/master/outputs.tf

resource "aws_ssm_parameter" "certificate_name" {
  name        = "/${var.project}/${var.stage}/CERTIFICATE_ARN"
  type        = "SecureString"
  value       = module.acm.acm_certificate_arn
  description = "The certificate name for all the subdomains"
}

################################################################################
# SES SMTP credentials
################################################################################
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_access_key

resource "aws_ssm_parameter" "smtp_username" {
  name        = "/${var.project}/${var.stage}/MAIL_USERNAME"
  type        = "SecureString"
  value       = aws_iam_access_key.smtp.id
  description = "Access key ID used as the STMP username"
}

resource "aws_ssm_parameter" "smtp_password" {
  name        = "/${var.project}/${var.stage}/MAIL_PASSWORD"
  type        = "SecureString"
  value       = aws_iam_access_key.smtp.ses_smtp_password_v4
  description = "Secret access key converted into an SES SMTP password"
}

################################################################################
# RDS
################################################################################
# https://github.com/terraform-aws-modules/terraform-aws-rds/blob/master/outputs.tf

resource "aws_ssm_parameter" "db_endpoint" {
  name        = "/${var.project}/${var.stage}/DB_HOST"
  type        = "SecureString"
  value       = module.db.db_instance_endpoint
  description = "The connection endpoint"
}

resource "aws_ssm_parameter" "db_name" {
  name        = "/${var.project}/${var.stage}/DB_DATABASE"
  type        = "SecureString"
  value       = module.db.db_instance_name
  description = "The database name"
}

resource "aws_ssm_parameter" "db_username" {
  name        = "/${var.project}/${var.stage}/DB_USERNAME"
  type        = "SecureString"
  value       = module.db.db_instance_username
  description = "The master username for the database"
}

resource "aws_ssm_parameter" "db_password" {
  name        = "/${var.project}/${var.stage}/DB_PASSWORD"
  type        = "SecureString"
  value       = module.db.db_master_password
  description = "The master password to connect to the database"
}

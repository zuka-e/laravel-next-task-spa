locals {
  identifier           = "${lower(var.project)}-${var.stage}"
  engine               = "mariadb"
  major_engine_version = "10.4"
  name                 = "${lower(var.project)}_${var.stage}"
}

# https://github.com/terraform-aws-modules/terraform-aws-rds
module "db" {
  source = "terraform-aws-modules/rds/aws"

  identifier = local.identifier

  engine         = local.engine
  engine_version = "${local.major_engine_version}.13"
  instance_class = "db.t2.micro"

  storage_type          = "gp2" # General purpose SSD
  allocated_storage     = 20    # 20 GiB
  max_allocated_storage = 0     # Disable autoscaling

  name                   = local.name
  username               = "" # TODO: secret variable
  create_random_password = true
  port                   = "3306"

  subnet_ids             = module.vpc.private_subnets
  vpc_security_group_ids = [module.vote_service_sg.security_group_id]

  # Parameter group
  family = "${local.engine}${local.major_engine_version}"
  # DB option group
  major_engine_version = local.major_engine_version

  maintenance_window      = "Sat:15:00-Sat:18:00"
  backup_window           = "18:00-21:00" # Don't overlap with maintenance_window
  backup_retention_period = 7             # Enable backup and retain for X days

  # Enhanced monitoring
  create_monitoring_role = true
  monitoring_interval    = 60

  # Log
  enabled_cloudwatch_logs_exports = ["audit", "error", "general", "slowquery"]

  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.MariaDB.Parameters.html
  parameters = [
    {
      name  = "character_set_client"
      value = "utf8mb4"
    },
    {
      name  = "character_set_server"
      value = "utf8mb4"
    }
  ]

  # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.MariaDB.Options.html
  options = [
    {
      option_name = "MARIADB_AUDIT_PLUGIN"
    },
  ]
}

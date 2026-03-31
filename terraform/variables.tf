variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "key_pair_name" {
  type = string
}

variable "git_repo_url" {
  type    = string
  default = ""
}

variable "app_name" {
  type    = string
  default = "shellquest"
}

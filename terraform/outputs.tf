output "public_ip" {
  value = aws_eip.app.public_ip
}

output "public_dns" {
  value = aws_eip.app.public_dns
}

output "app_url" {
  value = "http://${aws_eip.app.public_ip}"
}

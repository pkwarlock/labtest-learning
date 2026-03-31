#!/bin/bash
set -ex
exec > /var/log/user-data.log 2>&1

dnf install -y docker
systemctl enable --now docker

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 220233744739.dkr.ecr.us-east-1.amazonaws.com

docker pull 220233744739.dkr.ecr.us-east-1.amazonaws.com/shellquest:latest

docker run -d --name shellquest --restart always -p 80:80 220233744739.dkr.ecr.us-east-1.amazonaws.com/shellquest:latest

# ShellQuest - Interactive Learning Platform

เรียนรู้ Shell Script, AWS, Azure, DevOps, GitOps และ ArgoCD ผ่านเกม 110 ด่าน

## Categories
| Category | Levels | Topics |
|----------|--------|--------|
| Basic | 1-20 | echo, variables, if/else, loops, functions, arrays |
| Advanced | 21-60 | pipes, grep, sed, awk, process management |
| AWS | 61-70 | EC2, S3, IAM, VPC, Lambda, ECS, RDS, CloudFormation |
| Azure | 71-80 | VM, Storage, App Service, AKS, Functions, SQL |
| DevOps | 81-90 | Docker, Kubernetes, Helm, Terraform, CI/CD |
| GitOps | 91-100 | Git workflow, Kustomize, Flux CD, drift detection |
| ArgoCD | 101-110 | Install, sync, auto-sync, app-of-apps, multi-cluster |

## Run Locally
```bash
docker run -d -p 80:80 pkwarlock/shellquest:latest
```

## Deploy
Set GitHub Secrets for your target platform:

**DockerHub:** `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`

**AWS ECR + EC2:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `EC2_SSH_KEY` + Variables: `AWS_ACCOUNT_ID`, `AWS_REGION`, `EC2_HOST`

**Azure:** `AZURE_CREDENTIALS`, `ACR_USERNAME`, `ACR_PASSWORD` + Variables: `ACR_REGISTRY`, `AZURE_WEBAPP_NAME`

**Kubernetes:** `KUBECONFIG` (base64) + Variables: `K8S_CLUSTER`

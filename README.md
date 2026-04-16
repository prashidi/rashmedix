# RashMedix

Pharmacy stock management system — M.Sc. DevOps CA2

## Architecture
- **Frontend:** React (Vite)
- **Backend:** Django REST Framework
- **Database:** PostgreSQL (Helm bitnami chart)
- **Orchestration:** AWS EKS (Kubernetes)
- **IaC:** Terraform
- **CI/CD:** GitHub Actions + ArgoCD
- **Deployment Strategy:** Blue/Green
- **Subdomain:** prashidi.people.aws.dev

## Repository Structure
\`\`\`
rashmedix/
├── frontend/        # React application
├── backend/         # Django REST API
├── infrastructure/  # Terraform IaC
├── k8s/             # Helm charts & Kubernetes manifests
└── .github/         # CI/CD pipelines
\`\`\`

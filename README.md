# RashMedix

Pharmacy stock management system - M.Sc. DevOps CA2

## Architecture
- Frontend: React (Vite) :single-page application served via Nginx, containerised and deployed as a Kubernetes pod on AWS EKS.
- Backend: Django REST Framework :RESTful API handling all pharmacy stock logic, served via Gunicorn, deployed as a separate Kubernetes pod communicating with the frontend over HTTP within the cluster.
- Database: PostgreSQL :deployed via the Bitnami Helm chart on EKS, providing a persistent data layer for medicines, suppliers, categories and stock transactions. RDS was provisioned via Terraform as the production database.
- Container Orchestration: AWS EKS (Kubernetes) :manages all workloads across two worker nodes in eu-west-1, with Helm used as the package manager for templated deployments, and HPA configured for automatic scaling based on CPU utilisation.
- Infrastructure as Code: Terraform :provisions the full AWS infrastructure including VPC, subnets, EKS cluster, node groups, RDS instance, ECR repositories, Secrets Manager and Route 53 configuration. Remote state is stored in S3 with DynamoDB locking.
- CI/CD: GitHub Actions :separate CI pipelines for frontend and backend triggered by path-based pushes, each performing linting, building, Trivy vulnerability scanning and pushing to ECR. The CD pipeline deploys to EKS via Helm upgrade.
- Deployment Strategy: Blue/Green:pods are labelled with version blue as the live environment, with green used for staged releases. Traffic switching is managed via the Kubernetes service selector.
- Security: Trivy scans images in the CI pipeline before push. AWS Secrets Manager stores database credentials. Kubernetes namespaces isolate workloads. The ALB Ingress exposes the application via the subdomain prashidi.people.aws.dev with no raw public IPs on pods.
- Monitoring: Prometheus and Grafana deployed for metrics collection and dashboarding, with HPA consuming cluster metrics via the metrics-server.
- Sustainability: Resource requests and limits defined on all pods to prevent overprovisioning. ECR lifecycle policies automatically expire old images. Autoscaling scales down during low traffic periods. Dive used to analyse image layer efficiency.

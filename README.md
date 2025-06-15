# Multi-Tier CI/CD Pipeline
Automated CI/CD pipeline deploying React/Node.js apps with Jenkins, Docker, and Kubernetes on AWS.

## Features
1. Automated CI/CD pipeline
2. Multi-stage Docker builds
3. Kubernetes deployment with rolling updates
4. Health checks and monitoring
5. Security scanning (npm audit)
6. Automated testing
7. Zero-downtime deployments
8. Load balancing and scaling

## Tech Stack
1. Frontend: React.js with Nginx
2. Backend: Node.js with Express
3. Containerization: Docker & Docker Compose
4. Orchestration: Kubernetes (Minikube)
5. CI/CD: Jenkins Pipeline
6. Cloud: AWS EC2
7. Monitoring: Prometheus & Grafana

## Directory Structure
```
multi-tier-cicd-pipeline/
├── frontend/                 # React frontend application
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 nginx.conf
│   └──  src/
├── backend/                  # Node.js backend API
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 server.js
│   └──  routes/
├── k8s/                      # Kubernetes manifests
│   ├── 📄 namespace.yaml
│   ├── 📄 frontend-deployment.yaml
│   ├── 📄 frontend-service.yaml
│   ├── 📄 backend-deployment.yaml
│   └── 📄 backend-service.yaml
├── scripts/                  # Setup and utility scripts
│   ├── 📄 ec2-setup.sh
│   └── 📄 jenkins-setup.sh
├── monitoring/               # Monitoring stack
│   ├── 📄 docker-compose.yml
│   └── 📄 prometheus.yml
├── 📄 Jenkinsfile              # CI/CD pipeline definition
├── 📄 docker-compose.yml       # Local development
└── 📄 README.md                
```
## Architecture Overview
```
                             ┌─────────────┐
                             │   GitHub    │
                             │ Repository  │
                             └─────┬───────┘
                                   │
                                   ▼
                             ┌──────────────┐
                             │   Jenkins    │
                             │    CI/CD     │
                             └─────┬────────┘
                                   │
                                   ▼
                             ┌─────────────-┐
                             │   Docker     │
                             │ Container    │
                             └─────┬────────┘
                                   │
                                   ▼
                             ┌──────────────┐
                             │ Kubernetes   │
                             │ Orchestration│
                             └─────┬────────┘
                                   │
                                   ▼
       ┌───────────────────────────────────────────────────────────────┐
       │                      AWS EC2 (t2.medium)                      │
       │                                                               │
       │   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
       │   │   Frontend     │  │    Backend     │  │   Monitoring   │  │
       │   │   React : 80   │  │Node.js : 3001  │  │  Prometheus    │  │
       │   └────────────────┘  └────────────────┘  └────────────────┘  │
       └───────────────────────────────────────────────────────────────┘
```
## Setup steps

### 1.Clone the Repository
    git clone https://github.com/suchithrachandrasekaran/multi-tier-cicd-pipeline.git
    cd multi-tier-cicd-pipeline

### 2. Setup AWS EC2 Instance
Make setup script executable

        chmod +x scripts/ec2-setup.sh

 Run the automated setup

        ./scripts/ec2-setup.sh

This script will install:

- 1. Docker & Docker Compose
- 2. Kubernetes (kubectl & Minikube)
- 3. Jenkins
- 4. Required dependencies

### 3. Configure Jenkins

- 1. Access Jenkins:

      http://EC2-Public IP:8080
- 2. Get initial password:

      sudo cat /var/lib/jenkins/secrets/initialAdminPassword

- 3. Install suggested plugins + required plugins
Create pipeline job pointing to this repository

### 4. Start Minikube Tunnel
Start minikube tunnel in background

      nohup minikube tunnel --bind-address 0.0.0.0 &

### 5. Deploy Application
Push code to your GitHub repository - Jenkins will automatically trigger the pipeline

#### Access URLs
After successful deployment:
- Frontend Application: http://EC2-IP:30081
- Backend API: http://EC2-IP:30080
- Jenkins Dashboard: http://EC2-IP:8080
- Prometheus: http://EC2-IP:9090 (if monitoring enabled)
- Grafana: http://EC2-IP:3000 (if monitoring enabled)

## CI/CD Pipeline
The Jenkins pipeline includes the following stages:

- Checkout: Pull latest code from GitHub
- Build: Build frontend and backend applications
- Test: Run unit tests and code quality checks
- Security Scan: Vulnerability scanning with  npm audit
- Docker Build: Create optimized Docker images
- Deploy: Deploy to Kubernetes cluster
- Health Check: Verify application health
- Notification: Send deployment status notifications

## Local Development
-1. Run with Docker Compose

    #Start all services locally
    docker-compose up -d

    #View logs
    docker-compose logs -f

    #Stop services
    docker-compose down

-2. Individual Service Development

    - Frontend:
        cd frontend
        npm install
        npm start  # Runs on http://localhost:3000

    - Backend:
        backend
        npm install
        npm run dev  # Runs on http://localhost:3001

-3. Testing

    - Unit Tests
      - Frontend tests
        cd frontend && npm test

      - Backend tests
        cd backend && npm test

      - Integration Tests
          Test API endpoints
            curl http://localhost:30080/api/health
            curl http://localhost:30080/api/users

      - Load testing
            ab -n 1000 -c 10 http://localhost:30080/api/health
## Monitoring
  - Enable Monitoring Stack
```
       cd monitoring
       docker-compose up -d
```
  - Access Monitoring:
```
      Prometheus: http://localhost:9090
      Grafana: http://localhost:3000 (admin/admin)
```
  ### Key Metrics Monitored:

- Application response times
- Error rates
- Resource utilization
- Container health
- Kubernetes cluster status

## Configuration
  Environment Variables
```
    Frontend (.env):
        envREACT_APP_BACKEND_URL=http://backend-service:3001
        REACT_APP_BUILD_NUMBER=${BUILD_NUMBER}
    Backend (.env):
        envNODE_ENV=production
        PORT=3001
        BUILD_NUMBER=${BUILD_NUMBER}
```




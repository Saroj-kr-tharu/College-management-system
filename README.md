<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" />
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" />
  <img src="https://img.shields.io/badge/SonarQube-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white" />
  <img src="https://img.shields.io/badge/Trivy-1904DA?style=for-the-badge&logo=aquasecurity&logoColor=white" />
</p>

<h1 align="center">🎓 College Management System</h1>

<p align="center">
  A full-stack, production-grade <strong>College Management System</strong> built with <strong>React 19</strong>, <strong>Express 5</strong>, and <strong>MongoDB</strong>, featuring role-based access control, automated CI/CD pipelines with <strong>Jenkins</strong>, containerized deployments via <strong>Docker</strong>, and orchestrated on <strong>Kubernetes</strong> with auto-scaling, ingress routing, and secrets management.
</p>

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Backend](#-backend)
- [Frontend](#-frontend)
- [API Endpoints](#-api-endpoints)
- [Kubernetes Infrastructure](#-kubernetes-k8s-infrastructure)
- [CI/CD Pipeline](#-cicd-pipeline--jenkins)
- [Docker Setup](#-docker-setup)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Author](#-author)

---

## 🏗 System Architecture

The system follows a **microservice-oriented, three-tier architecture** deployed on a Kubernetes cluster:

| Layer | Technology | Description |
|---|---|---|
| **Client** | React 19 + Vite + TailwindCSS | SPA served via Nginx |
| **API Server** | Express 5 + TypeScript | RESTful API with JWT authentication |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL database |
| **File Storage** | Cloudinary | Image/file uploads via cloud CDN |
| **Email** | Nodemailer + Gmail SMTP | Transactional email notifications |
| **Containerization** | Docker (multi-stage builds) | Optimized production images |
| **Orchestration** | Kubernetes (KinD cluster) | Deployments, Services, HPA, Ingress |
| **CI/CD** | Jenkins + GitHub Webhooks | Automated build, scan, push, and deploy |
| **Code Quality** | SonarQube + OWASP | Static analysis & dependency checks |
| **Security Scanning** | Trivy | Filesystem & image vulnerability scanning |
| **Reverse Proxy** | Nginx Ingress Controller | Path-based routing |

### System Design

<p align="center">
  <img src="public/cms%20system%20design.png" alt="CMS System Architecture" width="100%" />
</p>

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 (Alpine) | Runtime environment |
| Express | 5.1.0 | Web framework |
| TypeScript | ~5.8.3 | Type safety |
| Mongoose | 8.17.2 | MongoDB ODM |
| JWT | 9.0.2 | Authentication tokens |
| Bcrypt.js | 3.0.2 | Password hashing |
| Helmet | 8.1.0 | Security headers |
| Multer | 2.0.2 | File upload handling |
| Cloudinary | 2.7.0 | Cloud image storage |
| Nodemailer | 7.0.5 | Email services |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.1.1 | UI library |
| Vite | 7.1.2 | Build tool & dev server |
| TailwindCSS | 4.1.12 | Utility-first CSS |
| React Router | 7.8.2 | Client-side routing |
| TanStack React Query | 5.90.16 | Server state management |
| TanStack React Table | 8.21.3 | Data table components |
| React Hook Form | 7.62.0 | Form handling |
| Yup | 1.7.0 | Schema validation |
| Recharts | 3.6.0 | Dashboard charts |
| Axios | 1.13.2 | HTTP client |

### DevOps & Infrastructure

| Technology | Purpose |
|---|---|
| Docker | Multi-stage containerization |
| Kubernetes (KinD) | Container orchestration |
| Jenkins | CI/CD automation |
| SonarQube | Static code analysis & quality gates |
| OWASP Dependency-Check | Dependency vulnerability scanning |
| Trivy | Filesystem & image vulnerability scanning |
| Nginx | Reverse proxy & static file serving |
| GitHub Webhooks | Automated pipeline triggers |

---

## 📁 Project Structure

```
College-management-system/
│
├── college-management-system-backend/     # Express 5 API Server
│   ├── Dockerfile                         # Multi-stage Docker build
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts                      # Application entry point
│       ├── config/                        # Cloudinary & database config
│       ├── controllers/                   # Route handler logic
│       ├── middlewares/                   # Auth, error handling, uploads
│       ├── models/                        # Mongoose schemas
│       ├── routes/                        # API route definitions
│       ├── types/                         # TypeScript type definitions
│       └── utils/                         # JWT, Bcrypt, email, pagination
│
├── college-management-system-frontend/    # React 19 SPA
│   ├── Dockerfile                         # Multi-stage Docker build (Nginx)
│   ├── nginx.conf                         # Nginx SPA + caching config
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx                        # Root component with routes
│       ├── main.tsx                       # Application entry point
│       ├── api/                           # Axios API service layer
│       ├── components/                    # Reusable UI components
│       ├── context/                       # React Context (Auth)
│       ├── layouts/                       # Dashboard layouts
│       ├── pages/                         # Page components
│       ├── providers/                     # App-level providers
│       ├── schema/                        # Yup validation schemas
│       ├── skeleton/                      # Loading skeleton components
│       └── types/                         # TypeScript interfaces
│
├── k8s/                                   # Kubernetes manifests
│   ├── 00_cluster.yml                     # KinD cluster config
│   ├── 01_deployment-backend.yml          # Backend Deployment
│   ├── 02_backend-service.yml             # Backend ClusterIP Service
│   ├── 03_fortend_deployment.yml          # Frontend Deployment
│   ├── 04_fortend_service.yml             # Frontend ClusterIP Service
│   ├── 05_secrects.yml                    # Kubernetes Secrets
│   ├── configMaps.yml                     # ConfigMap (env variables)
│   ├── hpa-backend.yml                    # Backend HPA (2-8 replicas)
│   ├── hpa-fortend.yml                    # Frontend HPA (2-5 replicas)
│   ├── ingress.yml                        # Nginx Ingress (path-based)
│   └── namespace.yml                      # cms-ns namespace
│
├── public/                                # Documentation assets
├── docker-compose.yml                     # Local multi-container setup
├── Jenkinsfile                            # CI/CD pipeline definition
├── sonar-project.properties               # SonarQube configuration
└── README.md
```

---

## ⚙ Backend

### Architecture

The backend follows a **layered MVC architecture** with clear separation of concerns:

```
Request → Routes → Middleware (Auth + Validation) → Controller → Model → MongoDB
                                                         ↕
                                                  Utils (JWT, Bcrypt, Cloudinary, Email)
```

### Role-Based Access Control (RBAC)

| Role | Capabilities |
|---|---|
| **Admin** | Full CRUD on students, teachers, courses, classes. Dashboard analytics. User management. |
| **Teacher** | View/manage assigned students. Record attendance. View profile. |
| **Student** | View personal dashboard, attendance records, and profile. |

### Key Features

- **JWT Authentication** — Token-based auth via `x-access-token` header
- **Password Hashing** — Bcrypt with salt rounds for secure storage
- **CORS Configuration** — Origin whitelist with credentials support
- **Helmet Security** — HTTP security headers enabled
- **File Uploads** — Multer → Cloudinary pipeline for image storage
- **Email Notifications** — Nodemailer with Gmail SMTP integration
- **Pagination** — Server-side pagination utility for list endpoints
- **Auto-generated Passwords** — Utility for creating initial user credentials
- **Global Error Handler** — Centralized error handling with custom error classes

### Multi-Stage Docker Build

```dockerfile
# Stage 1: TypeScript compilation
FROM node:20-alpine AS builder
WORKDIR /backend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production-optimized image
FROM node:20-alpine AS runner
WORKDIR /backend
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /backend/build ./build
EXPOSE 3000
CMD ["node", "build/server.js"]
```

---

## 🎨 Frontend

### Architecture

The frontend is a **Single Page Application (SPA)** with protected route layouts per role:

```
App.tsx
  ├── /login, /signup                       → Public routes
  ├── StudentDashboardLayout                → Student-only routes
  ├── TeacherDashboardLayout                → Teacher-only routes
  └── DashboardLayout (Admin)               → Admin-only routes
```

### Key Features

- **React 19** with latest concurrent features
- **Vite 7** for lightning-fast HMR and builds
- **TailwindCSS 4** for utility-first responsive design
- **TanStack React Query** for server state caching and synchronization
- **TanStack React Table** for dynamic data tables with sorting/filtering
- **React Hook Form + Yup** for performant form validation
- **Recharts** for interactive dashboard analytics and charts
- **React Hot Toast** for non-blocking notifications
- **Auth Context** for global authentication state management

### Multi-Stage Docker Build

```dockerfile
# Stage 1: Build SPA with Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Authenticate and receive JWT |
| `GET` | `/me` | Get current authenticated user |
| `POST` | `/change-password` | Change user password |
| `POST` | `/logout` | Logout and clear session |
| `PATCH` | `/changeRole` | Update user role (Admin) |

### Students (`/api/student`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Create a new student (Admin) |
| `GET` | `/` | List all students (paginated) |
| `GET` | `/all` | List all students (unpaginated) |
| `GET` | `/chart` | Get student statistics data |
| `GET` | `/class/:classId` | Get students by class |
| `POST` | `/filter` | Filter students with criteria |
| `GET` | `/:email` | Get student by email |
| `PUT` | `/:id` | Update student details (Admin) |
| `DELETE` | `/:id` | Remove a student (Admin) |

### Teachers (`/api/teacher`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Create a new teacher (Admin) |
| `GET` | `/` | List all teachers (paginated) |
| `GET` | `/all` | List all teachers (unpaginated) |
| `GET` | `/:email` | Get teacher by email |
| `PUT` | `/:id` | Update teacher details (Admin) |
| `DELETE` | `/:id` | Remove a teacher (Admin) |

### Courses (`/api/course`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Create a new course (Admin) |
| `GET` | `/` | List all courses (paginated) |
| `GET` | `/all` | List all courses (unpaginated) |
| `GET` | `/:id` | Get course by ID |
| `PUT` | `/:id` | Update course details (Admin) |
| `DELETE` | `/:id` | Remove a course (Admin) |

### Classes (`/api/class`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Create a new class (Admin/Teacher) |
| `GET` | `/` | List all classes (paginated) |
| `GET` | `/all` | List all classes (unpaginated) |
| `GET` | `/:id` | Get class by ID |
| `PUT` | `/:id` | Update class details |
| `DELETE` | `/:id` | Remove a class |

### Attendance (`/api/attendance`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Record attendance |
| `GET` | `/` | List all attendance records |
| `GET` | `/:id` | Get attendance by ID |
| `PUT` | `/:id` | Update attendance |
| `DELETE` | `/:id` | Delete attendance |
| `GET` | `/student/:studentId` | Get attendance by student |
| `GET` | `/course/:courseId` | Get attendance by course |
| `GET` | `/class/:classId` | Get attendance by class |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get dashboard analytics data |

### Users (`/api/user`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | List all users (authenticated) |
| `GET` | `/:id` | Get user by ID |
| `PUT` | `/:id` | Update user profile |
| `DELETE` | `/:id` | Delete user |

---

## ☸ Kubernetes (K8s) Infrastructure

The application is deployed on a **KinD (Kubernetes in Docker)** cluster with production-grade configurations.

### Cluster Topology

```
KinD Cluster (Kubernetes v1.34.2)
├── Control Plane Node (1)
│   └── Ingress-ready: true (Port Mapping: 80→80, 443→443)
└── Worker Nodes (3)
```

### K8s Resources

| Resource | Name | Description |
|---|---|---|
| **Namespace** | `cms-ns` | Isolated namespace for all CMS resources |
| **Deployment** | `backend-dep` | Backend pods (2 replicas, auto-scales to 8) |
| **Deployment** | `fortend-dep` | Frontend pods (2 replicas, auto-scales to 5) |
| **Service** | `cms-svc` | ClusterIP service for backend (port 3000) |
| **Service** | `cms-fortend-svc` | ClusterIP service for frontend (port 80) |
| **Ingress** | `cms-ingress` | Nginx Ingress with path-based routing |
| **HPA** | `backend-hpa` | CPU-based autoscaler (20% threshold, 2→8 pods) |
| **HPA** | `fortend-hpa` | CPU-based autoscaler (20% threshold, 2→5 pods) |
| **ConfigMap** | `cms-config` | Non-sensitive environment variables |
| **Secret** | `cms-secrets` | Sensitive credentials (Cloudinary, SMTP) |

### Ingress Routing

```
Host: 64.227.169.144.nip.io
│
├── /server(/|$)(.*)  →  cms-svc:3000        (Backend API)
└── /()(.*)           →  cms-fortend-svc:80   (Frontend SPA)
```

### Horizontal Pod Autoscaler (HPA)

| Deployment | Min | Max | CPU Target | Scale-Down Window |
|---|---|---|---|---|
| Backend | 2 | 8 | 20% | 30s |
| Frontend | 2 | 5 | 20% | 30s |

### Resource Limits

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|---|---|---|---|---|
| Backend | 200m | 500m | 256Mi | 512Mi |
| Frontend | 200m | 500m | 256Mi | 512Mi |

---

## 🚀 CI/CD Pipeline — Jenkins

The project uses a **declarative Jenkins pipeline** that automates the entire build-scan-deploy lifecycle, triggered automatically via **GitHub Webhooks** on every push to the `main` branch.

### Pipeline Overview

<p align="center">
  <img src="public/cicd%20fig%20overall.png" alt="CI/CD Pipeline Overview" width="100%" />
</p>

### Pipeline Stages

| Stage | Action | Details |
|---|---|---|
| **Clone Code** | `git clone` | Pulls latest `main` branch from GitHub |
| **SonarQube Analysis** | Static code analysis | Scans source code for bugs, vulnerabilities, and code smells |
| **Quality Gate** | SonarQube gate check | Aborts pipeline if quality gate fails |
| **OWASP Dependency Check** | Dependency scanning | Scans project dependencies for known vulnerabilities |
| **Trivy FS Scan** | Filesystem scan | Scans filesystem for security vulnerabilities |
| **Docker Build** | `docker build` | Builds backend and frontend images |
| **Docker Image Scan** | Trivy image scan | Scans built Docker images for vulnerabilities |
| **Push to Docker Hub** | `docker push` | Pushes images to Docker Hub registry |
| **K8s Redeploy** | `kubectl rollout restart` | Rolling restart of deployments in `cms-ns` |

### Pipeline in Action

<p align="center">
  <img src="public/cicd%20details.gif" alt="CI/CD Pipeline in Action" width="100%" />
</p>

### Post-Build Notifications

- **✅ Success** — HTML email with build details, project name, build number, and trigger source
- **❌ Failure** — HTML email with failure alert and direct link to Jenkins logs
- **📎 Attachments** — Trivy scan results, OWASP dependency report attached to every notification

### GitHub Webhook Integration

```
Developer pushes to main → GitHub Webhook → Jenkins Pipeline → Build → Scan → Push → Deploy → Email
```

| Setting | Value |
|---|---|
| **Trigger Event** | Push to `main` branch |
| **Payload URL** | `http://<jenkins-server>:8080/github-webhook/` |
| **Content Type** | `application/json` |
| **Pipeline Source** | `Jenkinsfile` in repository root |

---

## 🐳 Docker Setup

### Docker Compose (Local Development)

```bash
# Build and start all services
docker-compose up -d --build

# Stop services
docker-compose down
```

| Service | Container | Port | Image |
|---|---|---|---|
| Backend | `cms-backend` | `3000:3000` | `sarojdockerworkspace/cms-backend:latest` |
| Frontend | `cms-frontend` | `80:80` | `sarojdockerworkspace/cms-fortend:latest` |

- **Network**: `cms-network` (bridge driver)
- **Health Checks**: HTTP health checks with 30s intervals on both services

---

## 🔐 Environment Variables

### Backend

| Variable | Description |
|---|---|
| `NODE_ENV` | Environment mode (`development` / `production`) |
| `PORT` | Server port (default: `3000`) |
| `DATABASE_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE_IN` | JWT token expiration (e.g., `7d`) |
| `COOKIE_EXPIRY` | Cookie expiration in days |
| `FRONT_END_LOCAL_URL` | Frontend local URL for CORS |
| `FRONT_END_LIVE_URL` | Frontend production URL for CORS |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | Cloudinary API secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_SERVICE` | SMTP service (e.g., `gmail`) |
| `SMTP_USER` | SMTP sender email |
| `SMTP_PASSWORD` | SMTP email password |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 9.x
- **MongoDB** (Atlas or local)
- **Docker** & **Docker Compose** (for containerized setup)
- **kubectl** & **KinD** (for Kubernetes deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/Saroj-kr-tharu/College-management-system.git
cd College-management-system

# ─── Backend Setup ───
cd college-management-system-backend
cp .env.example .env          # Configure environment variables
npm install
npm run dev                   # Starts on http://localhost:3000

# ─── Frontend Setup ───
cd ../college-management-system-frontend
cp .env.example .env          # Set VITE_API_URL=http://localhost:3000/api
npm install
npm run dev                   # Starts on http://localhost:5173
```

### Docker Deployment

```bash
# Build and run both services
docker-compose up -d --build

# Access:
# Frontend → http://localhost
# Backend  → http://localhost:3000
```

---

## ☁ Deployment

### Kubernetes Deployment (Production)

```bash
# 1. Create KinD cluster
kind create cluster --config k8s/00_cluster.yml

# 2. Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# 3. Apply all K8s manifests
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/05_secrects.yml
kubectl apply -f k8s/configMaps.yml
kubectl apply -f k8s/01_deployment-backend.yml
kubectl apply -f k8s/02_backend-service.yml
kubectl apply -f k8s/03_fortend_deployment.yml
kubectl apply -f k8s/04_fortend_service.yml
kubectl apply -f k8s/hpa-backend.yml
kubectl apply -f k8s/hpa-fortend.yml
kubectl apply -f k8s/ingress.yml

# 4. Verify deployment
kubectl get all -n cms-ns
kubectl get ingress -n cms-ns
```

### Useful K8s Commands

```bash
# Check pod status
kubectl get pods -n cms-ns

# View pod logs
kubectl logs -f deployment/backend-dep -n cms-ns
kubectl logs -f deployment/fortend-dep -n cms-ns

# Check HPA status
kubectl get hpa -n cms-ns

# Manual rollout restart
kubectl rollout restart deployment backend-dep -n cms-ns
kubectl rollout restart deployment fortend-dep -n cms-ns
```

---

## 👤 Author

**Saroj Kumar Tharu**

- GitHub: [@Saroj-kr-tharu](https://github.com/Saroj-kr-tharu)
- Docker Hub: [sarojdockerworkspace](https://hub.docker.com/u/sarojdockerworkspace)

---

<p align="center">
  <i>Built with ❤️ using TypeScript · Deployed with Kubernetes · Automated with Jenkins</i>
</p>

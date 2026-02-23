# DTSP — Digital Twin Service Platform

<p align="center">
  <b>Federated Digital Twin Service Platform (Fedit) Framework — Main Module</b>
</p>

<p align="center">
  <a href="#-about-the-project">About</a> •
  <a href="#%EF%B8%8F-architecture">Architecture</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-deployment-guide-aws--godaddy">Deployment</a> •
  <a href="#-troubleshooting">Troubleshooting</a> •
  <a href="#-license">License</a>
</p>

---

## 📖 About the Project

**DTSP (Digital Twin Service Platform)** is the main module of the **Fedit (Federated Digital Twin)** framework — a government-funded open-source platform developed under the Korean Ministry of Science and ICT (MSIT).

The platform enables the **reuse of registered digital twin object information**, and provides integrated tools for developing and operating new federated twin application services, including:

- **Digital Twin Authoring Tools** — Create and manage digital twin metadata, entity models, and data collection configurations
- **Predictive Analytics Engine** — AI-powered prediction tools with model training and deployment capabilities
- **Data Brokering System** — NGSI-LD compliant data broker for standardized IoT/Digital Twin data exchange
- **Service Logic Authoring** — Visual tool for composing service logic workflows
- **3D Model Viewer** — Interactive visualization of digital twin 3D models
- **Union Object Synchronization** — Engine for synchronizing federated twin objects across distributed systems
- **Physical Simulation Tools** — Pre/post-processing tools for physics-based digital twin simulations
- **Discrete Event Simulation** — Tools for combining discrete event simulations

### Key Features

| Feature | Description |
|---------|-------------|
| 🏗️ **Digital Twin Metadata Management** | Register, search, and visualize metadata for digital twin entities |
| 🔄 **Data Ingestion & Translation** | Ingest heterogeneous data sources and translate to NGSI-LD format |
| 📊 **Data Broker (NGSI-LD)** | Standards-compliant context broker for entity CRUD operations |
| 🤖 **Prediction Tool** | Build and deploy machine learning models for predictive analytics |
| 🔗 **Service Description Tool** | Manage entity types, attributes, and data collection configurations |
| 👥 **Member Management** | User authentication, authorization, and role management |
| 📋 **Board Management** | Announcements and notice board system |
| 🖥️ **Dashboard** | Customizable portal dashboard with quick-access cards |

---

## 🏛️ Architecture

The DTSP platform follows a **microservices architecture** using Spring Cloud Netflix stack for service discovery and API gateway routing.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DTSP Platform                                │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  Portal UI   │───▶│   Gateway    │───▶│   Eureka Server      │  │
│  │  (React/TS)  │    │  (SCG 8000)  │    │   (Discovery 8761)   │  │
│  │  Port: 80    │    │  Port: 54002 │    │   Port: 58761        │  │
│  └──────────────┘    └──────┬───────┘    └──────────────────────┘  │
│                             │                                       │
│         ┌───────────────────┼───────────────────┐                  │
│         │                   │                   │                  │
│         ▼                   ▼                   ▼                  │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐       │
│  │ Data Broker  │   │ Data Ingest  │   │ Data Manager     │       │
│  │ (NGSI-LD)   │   │ (ETL)        │   │ (Metadata)       │       │
│  │ Port: 54011 │   │ Port: 54003  │   │ Port: 54008      │       │
│  └─────┬───────┘   └──────┬───────┘   └──────────────────┘       │
│        │                   │                                       │
│        ▼                   ▼                                       │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐       │
│  │ Data Service │   │ NGSI         │   │ Data Auth        │       │
│  │ (Query)     │   │ Translator   │   │ (JWT/RBAC)       │       │
│  │ Port: 54007 │   │ Port: 54004  │   │ Port: 54009      │       │
│  └─────────────┘   └──────────────┘   └──────────────────┘       │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Infrastructure                            │   │
│  │  MongoDB  •  PostgreSQL  •  Redis  •  Kafka  •  Zookeeper   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Architecture Diagram

![Federated Digital Twin Framework](https://github.com/user-attachments/assets/91f2cbcd-73f2-43fd-868c-f39799a546f6)

### Portal Dashboard

![Framework Dashboard](https://github.com/user-attachments/assets/640a2d62-8926-4f18-8034-e8e49be17088)

---

## 🛠 Technology Stack

### Frontend (Portal UI — `union-twin-fe`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2 | UI framework |
| **TypeScript** | 4.8 | Type-safe JavaScript |
| **TailwindCSS** | 3.4 | Utility-first CSS framework |
| **React Router** | 6.4 | Client-side routing |
| **Recoil** | 0.7 | State management |
| **TanStack React Query** | 5.x | Server state management & caching |
| **Axios** | 1.1 | HTTP client for API calls |
| **Chart.js / react-chartjs-2** | 4.4 | Data visualization charts |
| **React Quill** | 2.0 | Rich text editor |
| **CodeMirror** | 6.x | Code editor component |
| **FullCalendar** | 6.x | Calendar UI component |
| **Framer Motion** | 11.x | Animation library |
| **SASS** | 1.58 | CSS preprocessor |
| **Jest** | 29.x | Unit testing |
| **ESLint + Prettier** | 8.x / 3.x | Code linting & formatting |
| **Husky** | 8.x | Git hooks for pre-commit checks |
| **Nginx** | 1.25 (Alpine) | Static file serving & reverse proxy (Docker) |

### Backend (Microservices — Java/Spring Boot)

| Technology | Purpose |
|-----------|---------|
| **Java (Spring Boot)** | Core backend framework |
| **Spring Cloud Gateway** | API Gateway for routing and load balancing |
| **Netflix Eureka** | Service discovery and registry |
| **Spring Cloud** | Microservices orchestration |
| **Gradle** | Build automation |
| **JWT** | Authentication tokens |
| **Zipkin** | Distributed tracing |
| **Logstash** | Log aggregation |

### Infrastructure & Databases

| Technology | Purpose |
|-----------|---------|
| **MongoDB** | Document store for NGSI-LD entity data |
| **PostgreSQL** | Relational database for user/config data |
| **Redis** | Caching and session store |
| **Apache Kafka** | Message streaming for event-driven architecture |
| **Apache Zookeeper** | Kafka cluster coordination |
| **Docker / Docker Compose** | Containerization and orchestration |
| **Nginx** | Reverse proxy and SSL termination |

### Data Standards

| Standard | Description |
|----------|-------------|
| **NGSI-LD** | ETSI standard context information model for IoT/Digital Twin data |
| **JSON-LD** | Linked Data serialization format |

---

## 📁 Project Structure

```
DTSP/
├── README.md                          # This file
├── LICENSE                            # LGPL-2.1 License
├── docker-compose.yml                 # Quick-start portal deployment
│
├── docker/                            # Docker configurations
│   ├── Dockerfile
│   └── docker-compose-portal.yml      # Portal-only compose file
│
├── design/                            # UI/UX design documents (PowerPoint)
│
├── docs/                              # Project documentation
│
├── translator/                        # NGSI-LD Translator implementations (Java)
│   ├── FdtTwin0003.java
│   ├── FdtTwin0004.java
│   ├── FdtTwin0007.java
│   └── FdtTwin0008.java
│
└── src/
    └── DTSP_e8ight/                   # Main source code directory
        │
        ├── union-twin-fe/             # 🖥️  Portal Frontend (React + TypeScript)
        │   ├── package.json           #     Dependencies & scripts
        │   ├── Dockerfile             #     Multi-stage Docker build (Node → Nginx)
        │   ├── docker-compose.yml     #     Frontend compose config
        │   ├── default.conf           #     Nginx configuration
        │   ├── env.sh                 #     Runtime environment injection script
        │   ├── tailwind.config.js     #     TailwindCSS configuration
        │   ├── tsconfig.json          #     TypeScript configuration
        │   ├── jest.config.js         #     Test configuration
        │   ├── public/                #     Static assets
        │   └── src/                   #     React application source
        │
        ├── EurekaServer/              # 🔍 Service Discovery (Netflix Eureka)
        │   ├── build.gradle           #     Gradle build config
        │   └── src/                   #     Java source code
        │
        ├── GatewayServer/             # 🚪 API Gateway (Spring Cloud Gateway)
        │   ├── build.gradle
        │   └── src/
        │
        ├── dataBroker/                # 📦 NGSI-LD Data Broker
        │   ├── build.gradle           #     Context broker for entity management
        │   ├── Dockerfile
        │   └── src/
        │
        ├── dataIngest/                # 📥 Data Ingestion Pipeline
        │   └── src/                   #     ETL for heterogeneous data sources
        │
        ├── dataManager/               # 📋 Data Model Manager
        │   └── src/                   #     Metadata & data model management
        │
        ├── dataService/               # 🔎 Data Query Service
        │   └── src/                   #     Entity query & retrieval API
        │
        ├── dataAuth/                  # 🔐 Authentication & Authorization
        │   └── src/                   #     JWT-based auth with RBAC
        │
        ├── NGSITranslator/            # 🔄 NGSI-LD Data Translator
        │   └── src/                   #     Format translation to NGSI-LD
        │
        ├── translatorBuilder/         # 🏗️  Translator Builder Tool
        │   └── src/                   #     Dynamic translator generation
        │
        ├── fdt-service-backend/       # ⚙️  FDT Backend Services
        │   ├── docker-compose-ndxpro.yml  # Full backend stack compose
        │   ├── docker-compose-fdt.yml     # FDT service compose
        │   ├── docker-compose-file.yml    # File service compose
        │   ├── .env                       # Environment configuration
        │   ├── infra/                     # Infrastructure (MongoDB, PostgreSQL, Redis)
        │   ├── kafka/                     # Kafka & Zookeeper setup
        │   └── readme.md
        │
        └── fdt-service-frontend/      # 🎨 FDT Service Frontend
            ├── docker-compose.yml
            └── readme.md
```

### Microservice Port Mapping

| Service | Container Name | Port (Host) | Port (Internal) | Description |
|---------|---------------|-------------|-----------------|-------------|
| Portal UI | union-twin-fe | 50031 | 80 | Main dashboard web interface |
| Eureka Server | eureka | 58761 | 8761 | Service discovery registry |
| API Gateway | gateway | 54002 | 8000 | API routing & load balancing |
| Data Ingest | data-ingest | 54003 | 8080 | Data ingestion pipeline |
| NGSI Translator | ngsi-translator | 54004 | 8080 | Data format translator |
| Translator Builder | translator-builder | 54005 | 8080 | Dynamic translator creation |
| Data Service | data-service | 54007 | 8080 | Entity query API |
| Data Manager | data-manager | 54008 | 8080 | Metadata management |
| Data Auth | data-auth | 54009 | 8080 | Authentication & Authorization |
| Data Broker | data-broker-1 | 54011 | 8080 | NGSI-LD context broker |
| NGSI Context | ngsi-context | 53005 | 80 | JSON-LD context server |

---

## 🚀 Getting Started

### Prerequisites

| Software | Minimum Version | Install Guide |
|----------|----------------|---------------|
| Docker | 20.10+ | [docs.docker.com](https://docs.docker.com/get-docker/) |
| Docker Compose | 2.0+ | Included with Docker Desktop |
| Git | 2.0+ | [git-scm.com](https://git-scm.com/) |

### Quick Start (Portal Only)

The fastest way to get the portal running — pulls a pre-built Docker image:

```bash
# 1. Clone the repository
git clone https://github.com/Fedit-3Sub/DTSP.git
cd DTSP

# 2. Create the Docker network
docker network create ndxpro

# 3. Start the portal
docker compose up -d

# 4. Open in browser
open http://localhost:50031
```

The portal will be available at **http://localhost:50031**.

### Full Stack Deployment (All Backend Services)

To run the complete platform with all microservices, databases, and message broker:

```bash
# 1. Clone & enter the project
git clone https://github.com/Fedit-3Sub/DTSP.git
cd DTSP

# 2. Create Docker network
docker network create ndxpro

# 3. Start infrastructure (MongoDB, PostgreSQL, Redis)
cd src/DTSP_e8ight/fdt-service-backend/infra
docker compose up -d

# 4. Start Kafka & Zookeeper
cd ../kafka
sh install_images.sh
# Update .env file HOST to your server IP
docker compose -f docker-compose-zookeeper.yml up -d
docker compose -f docker-compose-kafka.yml up -d
docker compose -f docker-compose-ui.yml up -d

# 5. Start all backend microservices
cd ..
docker compose -f docker-compose-ndxpro.yml up -d
docker compose -f docker-compose-file.yml up -d
docker compose -f docker-compose-fdt.yml up -d

# 6. Start the portal frontend
cd ../../..
docker compose up -d
```

### Common Management Commands

```bash
# View running containers
docker ps

# View real-time logs
docker logs dtsp-union-twin-fe-1 -f

# Stop the portal
docker compose down

# Restart the portal
docker compose up -d

# Update to latest image
docker compose pull && docker compose up -d
```

---

## 🌐 Deployment Guide (AWS + GoDaddy)

This section explains how to deploy DTSP to production at **twinorchestrator.com** using an AWS VPS with the domain managed on GoDaddy.

### Architecture Overview

```
┌──────────────────────┐         ┌────────────────────────────────────┐
│     GoDaddy DNS      │         │          AWS EC2 / Lightsail       │
│                      │  DNS    │                                    │
│ twinorchestrator.com ├────────▶│  Nginx (SSL/TLS)  ──▶  Port 443   │
│ A Record → AWS IP    │         │         │                          │
│                      │         │         ▼                          │
└──────────────────────┘         │  Docker Container                  │
                                 │  union-twin-fe ──▶ Port 50031      │
                                 │                                    │
                                 │  Let's Encrypt (auto-renew)       │
                                 └────────────────────────────────────┘
```

### Recommended AWS Instance

| Option | Instance | vCPU | RAM | Storage | Cost/Month | Notes |
|--------|----------|------|-----|---------|------------|-------|
| 🆓 **Free Tier** | EC2 t2.micro | 1 | 1 GB | 30 GB | **$0** | Free for 12 months (new accounts) |
| 💰 **Budget** | EC2 t3.micro | 2 | 1 GB | 20 GB | ~$11 | Good for portal-only deployment |
| ⭐ **Recommended** | Lightsail | 1 | 1 GB | 40 GB | **$5** | Fixed price, 2TB bandwidth included |
| 💪 **Comfortable** | EC2 t3.small | 2 | 2 GB | 30 GB | ~$21 | Room for backend services |

### Step 1: Set Up AWS Instance

1. Log in to [AWS Console](https://console.aws.amazon.com)
2. Launch an **EC2** instance or create a **Lightsail** instance
3. Choose **Ubuntu 22.04 LTS** or **Ubuntu 24.04 LTS**
4. Select instance type (see table above)
5. Configure Security Group: allow ports **22 (SSH)**, **80 (HTTP)**, **443 (HTTPS)**
6. Save your key pair (`.pem` file) for SSH access

### Step 2: Configure DNS on GoDaddy

1. Log in to [GoDaddy](https://www.godaddy.com) → **My Products** → **DNS Management** for `twinorchestrator.com`
2. Add/Edit DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `<YOUR_AWS_PUBLIC_IP>` | 600 |
| **A** | `www` | `<YOUR_AWS_PUBLIC_IP>` | 600 |

3. Verify DNS propagation:

```bash
nslookup twinorchestrator.com
# or
dig twinorchestrator.com
```

> ⏳ DNS propagation typically takes 5–30 minutes (up to 48 hours in some cases).

### Step 3: Install Server Dependencies

```bash
# SSH into the VPS
ssh -i your-key.pem ubuntu@<YOUR_AWS_PUBLIC_IP>

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Install Nginx
sudo apt install -y nginx
sudo systemctl enable nginx && sudo systemctl start nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx

# Verify installations
docker --version
docker compose version
nginx -v
```

### Step 4: Deploy the Application

```bash
# Create project directory
sudo mkdir -p /opt/dtsp && cd /opt/dtsp

# Clone repository
sudo git clone https://github.com/Fedit-3Sub/DTSP.git .

# Create Docker network
docker network create ndxpro

# Start the portal
docker compose up -d

# Verify container is running
docker ps
curl -I http://127.0.0.1:50031
```

### Step 5: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/twinorchestrator.com
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name twinorchestrator.com www.twinorchestrator.com;

    location / {
        proxy_pass http://127.0.0.1:50031;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable the configuration:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/twinorchestrator.com /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test & reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

> ✅ At this point, **http://twinorchestrator.com** should be accessible.

### Step 6: Enable HTTPS (SSL Certificate)

```bash
sudo certbot --nginx -d twinorchestrator.com -d www.twinorchestrator.com
```

When prompted:
- Enter your **email address**
- Agree to **Terms of Service** → `Y`
- Choose **redirect HTTP to HTTPS** → `2`

Certbot will automatically:
1. Verify domain ownership
2. Generate SSL certificate
3. Update Nginx configuration for HTTPS
4. Set up auto-renewal (certificate valid for 90 days)

Verify auto-renewal:

```bash
sudo certbot renew --dry-run
```

> ✅ **https://twinorchestrator.com** is now live with SSL! 🔒

### Step 7: Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Expected output:

```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
```

> ⚠️ Do **NOT** expose port 50031 externally. Nginx proxies traffic from 80/443 to 50031 internally.

---

## 🔧 Troubleshooting

### Container fails to start

```bash
# Check container logs
docker logs dtsp-union-twin-fe-1

# Check Docker network exists
docker network ls | grep ndxpro

# Recreate network if missing
docker network create ndxpro
```

### Cannot access via domain

```bash
# 1. Verify DNS is pointing correctly
dig twinorchestrator.com

# 2. Test Nginx configuration
sudo nginx -t
sudo systemctl status nginx

# 3. Verify container is running
docker ps

# 4. Test internal connectivity
curl -I http://127.0.0.1:50031
```

### SSL certificate issues

```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew

# View Nginx SSL config
cat /etc/nginx/sites-available/twinorchestrator.com
```

### Platform mismatch warning (Apple Silicon)

If running on macOS with Apple Silicon (M1/M2/M3/M4), you may see:

```
The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8)
```

This is just a warning — Docker Desktop emulates `amd64` successfully on ARM. No action needed.

### Server maintenance commands

```bash
# Update application to latest version
cd /opt/dtsp
git pull origin main
docker compose pull
docker compose up -d

# View Docker disk usage
docker system df

# Clean up unused Docker resources
docker system prune -af

# Check service statuses
sudo systemctl status nginx docker

# View SSL certificate expiry
sudo certbot certificates
```

---

## 📄 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NDXPRO_ENV_TOKEN` | JWT authentication token | `eyJhbGci...` |
| `NDXPRO_ENV_API_URL` | Internal API gateway URL | `http://220.124.222.90:54002` |
| `NDXPRO_ENV_API_OUTSIDE_URL` | External API gateway URL | `http://220.124.222.90:54002` |
| `NDXPRO_ENV_DIGITAL_TWIN_SEARCH_URL` | Digital twin metadata search endpoint | `http://220.124.222.86:8084/meta/exsearch/list` |
| `NDXPRO_ENV_VIEWER_URL` | 3D model viewer URL | `http://220.124.222.90:50038` |
| `NDXPRO_ENV_PREDICTOR_TOOL_URL` | AI prediction tool URL | `http://220.124.222.82:18080` |
| `NDXPRO_ENV_DISCRETE_SIMULATOR_URL` | Discrete event simulator URL | `http://220.124.222.89` |
| `NDXPRO_ENV_SERVICE_LOGIC_TOOL_URL` | Service logic authoring tool URL | `http://bigsoft.iptime.org:9900/keti` |
| `NDXPRO_ENV_DIGITAL_TWIN_METADATA_REGISTRATION` | Metadata registration portal URL | `http://220.124.222.86:8084/loginpass?to=/meta/exmanage/dt` |
| `NDXPRO_ENV_METADATA_VISUALIZATION_GRAPH` | Metadata visualization graph URL | `http://220.124.222.86:8084/loginpass?to=/meta/exmedatagraph` |
| `NDXPRO_ENV_UNION_OBJECT_SYNC_ENGINE_MANAGEMENT` | Union object sync engine URL | `http://220.124.222.84:5173` |
| `NDXPRO_ENV_VERIFICATION_DATA_ADDITION_MANAGEMENT` | Data verification tool URL | `http://220.124.222.85:9102` |

---

## 💰 Funding

This work was supported by the **Institute of Information & Communications Technology Planning & Evaluation (IITP)** grant funded by the **Korea government (MSIT)**

> **Grant No. 2022-0-00431** — *Development of open service platform and creation technology of federated intelligent digital twin*, 100%

---

## 📜 License

This project is licensed under the **LGPL-2.1 License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

This is a government-funded open-source project. Contributions are welcome via pull requests to the [main repository](https://github.com/Fedit-3Sub/DTSP).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

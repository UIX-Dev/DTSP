# 📘 DTSP Portal — Complete Page Guide & Deployment Manual

> **Digital Twin Service Platform (DTSP)** — A comprehensive guide to every page in the Union Twin Framework portal, plus full server deployment configuration.
>
> Portal URL: `http://localhost:50031`

---

## Table of Contents

- [Part 1: System Architecture](#part-1-system-architecture)
- [Part 2: Page Guide](#part-2-page-guide)
  - [1. User Management](#1-user-management)
  - [2. Notice Board Management](#2-notice-board-management)
  - [3. Digital Twin Metadata Management](#3-digital-twin-metadata-management)
  - [4. Digital Twin Processing Management](#4-digital-twin-processing-management)
  - [5. Service Description Tool](#5-service-description-tool)
  - [6. Predictor Creator Tool](#6-predictor-creator-tool)
  - [7. Physical Simulation Processing Tool](#7-physical-simulation-processing-tool)
  - [8. Discrete-Continuous Simulation Merge Tool](#8-discrete-continuous-simulation-merge-tool)
  - [9. API & Document Links](#9-api--document-links)
  - [10. Dynamic Data / Event Tracking Process](#10-dynamic-data--event-tracking-process)
  - [11. 3D Model Viewer](#11-3d-model-viewer)
- [Part 3: Deployment Guide](#part-3-deployment-guide)
- [Part 4: Bug Fix History](#part-4-bug-fix-history)

---

## Part 1: System Architecture

### Overview Diagram

```mermaid
graph TB
    subgraph User["End User"]
        BROWSER["Web Browser"]
    end

    subgraph Frontend["Frontend Layer"]
        PORTAL["Portal UI<br/>union-twin-fe<br/>port 50031"]
        MUI["Metadata UI<br/>Express.js<br/>port 8084"]
    end

    subgraph Gateway["API Gateway"]
        GW["Gateway Server<br/>Spring Cloud Gateway<br/>port 54002"]
        EUR["Eureka Server<br/>Service Discovery<br/>port 58761"]
    end

    subgraph Services["Microservices"]
        DM["Data Manager<br/>port 54008"]
        DS["Data Service<br/>port 54007"]
        DA["Data Auth<br/>port 54009"]
        DI["Data Ingest<br/>port 54003"]
        DB["Data Broker<br/>port 54011"]
        NT["NGSI Translator<br/>port 54004"]
        TB["Translator Builder<br/>port 54005"]
        FDT["FDT Service<br/>port 50038"]
    end

    subgraph Infrastructure["Infrastructure"]
        PG["PostgreSQL<br/>port 55432"]
        MG["MongoDB<br/>port 57017"]
        RD["Redis<br/>port 56379"]
        KF["Kafka<br/>port 19092"]
        ZK["Zookeeper<br/>port 22181"]
        CTX["NGSI Context<br/>httpd:alpine<br/>port 53005"]
    end

    BROWSER --> PORTAL
    PORTAL -->|iframe| MUI
    PORTAL -->|API calls| GW
    MUI -->|proxy| GW
    MUI -->|proxy| DA
    MUI -->|proxy| FDT
    GW --> EUR
    GW --> DM
    GW --> DS
    GW --> DA
    GW --> DI
    GW --> DB
    GW --> NT
    GW --> TB
    DM --> MG
    DA --> PG
    DI --> PG
    DI --> KF
    DB --> MG
    DB --> RD
    DB --> KF
    NT --> PG
    NT --> KF
    KF --> ZK
```

### All Running Services

| Service | Container Name | Docker Image | Host Port | Internal Port | Memory Usage |
|---------|---------------|--------------|-----------|---------------|-------------|
| Portal UI | dtsp-union-twin-fe-1 | `fdttwin/union-twin-fe:latest` | 50031 | 80 | ~22 MB |
| Metadata UI | — (Node.js) | — (not containerized) | 8084 | 8084 | ~50 MB |
| Gateway | gateway | `fdttwin/gatewayserver:v1.1` | 54002 | 8000 | ~590 MB |
| Eureka | eureka | `fdttwin/eurekaserver:v1.1` | 58761 | 8761 | ~590 MB |
| Data Manager | data-manager | `fdttwin/datamanager:v1.1` | 54008 | 8080 | ~570 MB |
| Data Service | data-service | `fdttwin/dataservice:v1.1` | 54007 | 8080 | ~550 MB |
| Data Auth | data-auth | `fdttwin/authorization:v1.1` | 54009 | 8080 | ~950 MB |
| Data Ingest | data-ingest | `fdttwin/dataingest:v1.1.1` | 54003 | 8080 | ~585 MB |
| Data Broker | data-broker-1 | `fdttwin/core-databroker:v1.1.2` | 54011 | 8080 | ~760 MB |
| NGSI Translator | ngsi-translator | `fdttwin/ngsi-translator:v1.1.1` | 54004 | 8080 | ~630 MB |
| Translator Builder | translator-builder | `fdttwin/translatorbuilder:v1.1.1` | 54005 | 8080 | ~540 MB |
| FDT Service | fdt-service | `fdttwin/fdt-service:v1.1` | 50038 | 8050 | ~330 MB |
| NGSI Context | ngsi-context | `httpd:alpine` | 53005 | 80 | ~4 MB |
| PostgreSQL | postgres | `postgres:14.1` | 55432 | 5432 | ~88 MB |
| MongoDB | mongodb | `mongo` | 57017 | 27017 | ~130 MB |
| Redis | redis | `redis:6.2` | 56379 | 6379 | ~5 MB |
| Kafka | pipeline-kafka-1 | `confluentinc/cp-kafka:7.4.0` | 19092 | 19092 | ~207 MB |
| Zookeeper | pipeline-zookeeper-a | `confluentinc/cp-zookeeper:7.4.0` | 22181 | 2181 | ~61 MB |

> **Total Memory**: ~6.5 GB across all containers

---

## Part 2: Page Guide

### Page Overview

| # | Menu Name | Route | Type | Source |
|---|-----------|-------|------|--------|
| 1 | User Management | `/user-management/users-list` | React component | Internal |
| 2 | Notice Board | `/notice-board-management/announcement` | React component | Internal |
| 3 | DT Metadata Search | `/digital-twin-metadata-management/digital-twin-search` | iframe | metadata-ui |
| 3b | DT Metadata Registration | `.../digital-twin-metadata-registration` | iframe | metadata-ui |
| 3c | Metadata Graph | `.../metadata-visualization-graph` | iframe | metadata-ui |
| 4 | Sync Engine Mgmt | `/digital-twin-processing-management/union-object-sync-engine-management` | iframe | metadata-ui |
| 4b | Verification Mgmt | `.../verification-data-addition-management` | iframe | metadata-ui |
| 5 | Service Description Tool | `/service-description-tool/*` | React component | Internal |
| 6 | Predictor Creator Tool | `/predictor-creator-tool` | iframe | metadata-ui |
| 7 | Physical Simulation Tool | `/physical-simulation-processing-tool` | React component | Internal |
| 8 | Simulation Merge Tool | `/discrete-continuous-simulation-merge-tool` | iframe | metadata-ui |
| 9 | Jeju Air Quality API | `/api-document/jeju-api` | iframe | metadata-ui |
| 10 | Event Tracking Process | `/dynamic-data-event-tracking-process` | React component | Internal |
| 11 | 3D Model Viewer | `/model-information-viewer` | iframe | External |

---

### 1. User Management

| Property | Detail |
|----------|--------|
| **Route** | `/user-management/users-list` |
| **Auth** | Admin only |
| **Type** | React internal component |

**Description:** Manages registered user accounts in the DTSP platform.

**Features:**
- 👤 View complete list of registered users
- 🔍 Search and filter users by name, role, or status
- ✏️ Edit user information (name, email, role)
- 🗑️ Delete user accounts
- 🔐 Role-based access control (Admin / User)

**Backend API:** Data Auth Service → `POST /ndxpro/v1/auth/login`, `GET /ndxpro/v1/auth/users`

---

### 2. Notice Board Management

| Property | Detail |
|----------|--------|
| **Route** | `/notice-board-management/announcement` |
| **Auth** | All users |
| **Type** | React internal component |

**Description:** Announcement and notice board system for platform-wide communication.

**Sub-pages:**

| Page | Route | Description |
|------|-------|-------------|
| Announcements | `/announcement` | View list of announcements (read-only) |
| Announcement Management | `/announcement-management` | Create, edit, delete announcements (admin mode) |

**Features:**
- 📋 List all announcements with pagination
- 📝 Create new announcements with title, content, and attachments
- ✏️ Edit existing announcements
- 🗑️ Delete announcements
- 📄 View announcement detail page

---

### 3. Digital Twin Metadata Management

| Property | Detail |
|----------|--------|
| **Route** | `/digital-twin-metadata-management` |
| **Auth** | All users |
| **Type** | iframe (metadata-ui server) |

**Description:** Core module for searching, registering, and visualizing Digital Twin metadata based on the NGSI-LD standard.

**Sub-pages:**

| Page | Route | iframe Source | Description |
|------|-------|-------------|-------------|
| **Metadata Search** | `/digital-twin-search` | `http://localhost:8084/meta/exsearch/list` | Search registered entities and data models |
| **Metadata Registration** | `/digital-twin-metadata-registration` | `http://localhost:8084/loginpass?to=/meta/exmanage/dt` | Register and edit metadata definitions |
| **Visualization Graph** | `/metadata-visualization-graph` | `http://localhost:8084/loginpass?to=/meta/exmedatagraph` | Interactive graph of metadata relationships |

**Features:**

#### 🔍 Metadata Search
- Full-text search across all NGSI-LD entities
- Filter by data model, context, entity type
- Results displayed in sortable table format
- Click-through to entity detail view

#### 📝 Metadata Registration
- Define new Digital Twin entity types
- Set up NGSI-LD attributes (Property, Relationship, GeoProperty)
- Configure context URIs
- Map attributes to data sources

#### 📊 Visualization Graph
- Interactive node-link graph showing entity type relationships
- Hover to see entity details
- Zoom and pan navigation
- Relationship type highlighting

**Backend APIs:**
- Gateway → `/ndxpro/v1/manager/data-models` (Data Manager)
- Gateway → `/ndxpro/v1/manager/contexts` (Data Manager)
- Gateway → `/ndxpro/v1/manager/attributes` (Data Manager)

---

### 4. Digital Twin Processing Management

| Property | Detail |
|----------|--------|
| **Route** | `/digital-twin-processing-management` |
| **Auth** | All users |
| **Type** | iframe (metadata-ui server) |

**Description:** Manages the synchronization engine and data validation processes for Digital Twin data.

**Sub-pages:**

| Page | Route | iframe Source | Description |
|------|-------|-------------|-------------|
| **Sync Engine Management** | `/union-object-sync-engine-management` | `http://localhost:8084/sync-engine` | Manage data synchronization |
| **Verification Management** | `/verification-data-addition-management` | `http://localhost:8084/verification` | Data validation and augmentation |

**Features:**

#### 🔄 Union Object Sync Engine Management
- Dashboard showing synchronization status across data models, contexts, and attributes
- Real-time sync status monitoring (synced / pending / failed)
- Trigger manual synchronization jobs
- View sync history and error logs
- Integration with Data Auth Service for sync target management

#### ✅ Verification & Data Addition Management
- Define data validation rules
- Manage verification member lists
- View pending verification items
- Review verification results and history
- Graceful error handling for 404 responses

---

### 5. Service Description Tool

| Property | Detail |
|----------|--------|
| **Route** | `/service-description-tool` |
| **Auth** | All users |
| **Type** | React internal component |

**Description:** The **core toolset** of the DTSP platform. Provides data model design, entity management, data collection configuration, and service logic authoring — all based on the NGSI-LD standard. This section contains the most sub-pages.

**Sub-pages:**

| Page | Route | Description |
|------|-------|-------------|
| **Model Management** | `/model-management` | Define and manage NGSI-LD attributes |
| **Entity Type Modeling** | `/object-data-model-management` | Design entity type structures |
| **Entity Management** | `/entity-management` | Browse and manage entity instances |
| **Collection Settings** | `/agent` | Configure data collection agents |
| **Collection Status** | `/statistics` | Monitor data collection statistics |
| **Service Logic Tool** | `/service-logic-tool` | Visual service logic flow designer |

**Features:**

#### 📐 Model Management (Attribute Management)
- Define NGSI-LD attributes with types: Property, Relationship, GeoProperty
- Set value ranges and data types (String, Integer, Double, Boolean, DateTime)
- Create attribute hierarchies
- Manage attribute schemas

#### 🏗️ Entity Type Modeling (Object Data Model Management)
- Visual entity type designer with tree structure
- Assign attributes to entity types
- Configure context URIs
- Preview JSON-LD output
- Import/export data model definitions

#### 📋 Entity Management
- Browse all registered entity instances
- Tabbed multi-entity view (via `ActiveEntityTabProvider`)
- Full entity detail with attribute values
- Tree navigation with history (via `TreeHistoryProvider`)
- Entity route information tracking (via `EntityRouteInfoProvider`)

#### ⚙️ Collection Settings (Agent)
- Configure data collection agents
- Set data sources (REST API, Kafka topic, MQTT, etc.)
- Define collection intervals and rules
- Start / pause / stop agent controls
- Agent health monitoring

#### 📊 Collection Status (Statistics)
- Real-time data collection monitoring dashboard
- Per-agent collection statistics (hourly, daily)
- Error rate tracking
- Data throughput visualization

#### 🧩 Service Logic Tool
- Visual node-based service logic flow designer
- Hosted on external server: `http://bigsoft.iptime.org:9900/keti`
- Loaded via iframe in the portal
- Define trigger conditions and response actions
- Connect data sources to output actions

**Backend APIs:**
- Gateway → `/ndxpro/v1/manager/*` (Data Manager)
- Gateway → `/ndxpro/v1/service/*` (Data Service)

---

### 6. Predictor Creator Tool

| Property | Detail |
|----------|--------|
| **Route** | `/predictor-creator-tool` |
| **Auth** | All users |
| **Type** | iframe (metadata-ui server → `/predictor`) |

**Description:** Machine learning prediction model creation and integration tool for Digital Twin systems.

**Features:**
- 🔮 **Predictor List** — View all registered ML prediction models
- 📈 **Create New Predictor** — Supports 4 model types:
  - Regression
  - Classification
  - Time Series Forecasting
  - Anomaly Detection
- ⚙️ **Algorithm Selection** — Linear Regression, Random Forest, XGBoost, LSTM, ARIMA, Prophet, Isolation Forest
- 🔗 **API Information** — API endpoint documentation for predictor services
- 📡 **Connection Settings** — Backend service connectivity status check

**Environment Variable:** `NDXPRO_ENV_PREDICTOR_TOOL_URL=http://localhost:8084/predictor`

---

### 7. Physical Simulation Processing Tool

| Property | Detail |
|----------|--------|
| **Route** | `/physical-simulation-processing-tool` |
| **Auth** | All users |
| **Type** | React internal component |

**Description:** Download page for the desktop LBM (Lattice Boltzmann Method) physics simulation pre/post-processing tool.

**Features:**
- 📥 **Download DTEditor.zip** — Desktop tool for physics simulation
- 📊 **Download Progress** — Real-time circular progress bar during download
- 📋 **Capabilities Overview:**
  - Pre-processing for physics simulation analysis (mesh setup, boundary conditions)
  - 3D visualization of LBM analysis results with stream output

**Download Process:**
1. Fetch file UFID via `getLogicalFilesUFID('DTEditor.zip')`
2. Download file binary via `getDownloadFiles(ufId)` with progress tracking
3. Trigger browser download

**Backend API:** FDT Service → file download endpoints

---

### 8. Discrete-Continuous Simulation Merge Tool

| Property | Detail |
|----------|--------|
| **Route** | `/discrete-continuous-simulation-merge-tool` |
| **Auth** | All users |
| **Type** | iframe (metadata-ui server → `/discrete-simulator`) |

**Description:** Hybrid simulation tool that merges discrete (event-based) and continuous (differential equation-based) simulations for integrated analysis.

**Features:**
- 🔀 **5-Step Workflow Visualization:**
  1. Data Collection (load entity data)
  2. Discrete Simulation (event-driven modeling — DEVS, Petri Net)
  3. Continuous Simulation (ODE/PDE-based modeling)
  4. Merge & Combine (integrated analysis)
  5. Result Output (simulation report)
- 📋 **Simulation List** — Manage created simulations
- 🆕 **Create New Simulation** — 3 simulation types:
  - Discrete Simulation (DEVS, Petri Net)
  - Continuous Simulation (Linear ODE, Nonlinear ODE, Heat PDE, Wave PDE)
  - Hybrid (combined)
- 📡 **Connection Settings** — Service connectivity status

**Environment Variable:** `NDXPRO_ENV_DISCRETE_SIMULATOR_URL=http://localhost:8084/discrete-simulator`

---

### 9. API & Document Links

| Property | Detail |
|----------|--------|
| **Route** | `/api-document` |
| **Auth** | All users |
| **Type** | iframe (metadata-ui server → `/jeju-api`) |

**Description:** External API documentation and reference guides.

**Sub-pages:**

| Page | Route | Description |
|------|-------|-------------|
| **Jeju Air Quality API** | `/api-document/jeju-api` | Swagger-style API docs for Jeju City air quality data |

**Features — Jeju Air Quality API:**

Swagger UI-style documentation with 3 API groups:

#### 🌊 AirQuality (Air Quality Data)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/airquality` | List all air quality readings (paginated) |
| GET | `/api/airquality/{id}` | Get specific reading by ID |
| GET | `/api/airquality/station/{stationId}` | Get readings by station |
| GET | `/api/airquality/latest` | Get latest readings |
| GET | `/api/airquality/statistics` | Get aggregated statistics |

#### 🏢 Station (Station Management)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stations` | List all monitoring stations |
| GET | `/api/stations/{stationId}` | Get station details |
| POST | `/api/stations` | Register new station |

#### 🚨 Alert (Air Quality Alerts)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | List alerts (filter by level, active status) |
| POST | `/api/alerts/subscribe` | Subscribe to alert notifications |

> [!NOTE]
> The original Swagger UI server (`dev.jinwoosi.co.kr:8083`) is currently offline. A local cached version of the API documentation is displayed instead.

---

### 10. Dynamic Data / Event Tracking Process

| Property | Detail |
|----------|--------|
| **Route** | `/dynamic-data-event-tracking-process` |
| **Auth** | All users |
| **Type** | React internal component |

**Description:** Interface for defining and sending real-time data/event tracking commands to the visualization service module.

**Features:**
- 📋 **Interface Definition** — HTTP-based Tracking Command specification:
  - URL: `http://serviceIP:8002/fdt/detrck/rcv/tracking-commands`
  - Method: POST
  - Content-Type: application/json
- 📝 **Tracking Request Definition** — Command structure:
  - `requestIdentifier` — Unique identifier for each tracking request
  - `callBackURL` — Callback URL for receiving tracking events
  - `trckProcInfo[]` — Array of tracking process configurations (type, topic, group, interval, filter)
- 📨 **Tracking Form** — Interactive form to compose and send tracking commands

**Backend API:** FDT Service → `/fdt/detrck/rcv/tracking-commands`

---

### 11. 3D Model Viewer

| Property | Detail |
|----------|--------|
| **Route** | `/model-information-viewer` |
| **Auth** | All users |
| **Type** | iframe (external VIZWide3D server) |

**Description:** Web-based 3D model viewer using the VIZWide3D engine for visualizing Digital Twin 3D models directly in the browser.

**Features:**
- 🏗️ **Real-time 3D Model Rendering** — WebGL-based VIZWide3D engine
- 📊 **Model Information Panel** — Displays metadata of the loaded model
- ⏱️ **Loading Time Measurement:**
  - Loading start time
  - Loading completion time
  - Total duration in seconds
- 🎯 **Tour-based Model Loading** — URL parameter `?tour_id=XX` to load specific models

**Technical Details:**
- iframe source: `http://220.124.222.87/VIZWide3D/?tour_id=03` (default)
- Uses `postMessage` for iframe communication (detects model loading completion)
- 3.5-second delayed iframe load for performance optimization

> [!WARNING]
> The VIZWide3D server is hosted externally at `220.124.222.87`. Network access to this IP is required for the 3D viewer to function.

---

## Part 3: Deployment Guide

### Minimum Server Requirements

| Resource | Minimum | Recommended | Notes |
|----------|---------|-------------|-------|
| **CPU** | 4 cores | 8+ cores | Java microservices are CPU-intensive |
| **RAM** | 8 GB | 16 GB+ | All containers use ~6.5 GB total |
| **Storage** | 50 GB | 100 GB+ | For databases, logs, and Docker images |
| **OS** | Ubuntu 20.04+ / CentOS 8+ | Ubuntu 22.04 LTS | Any Linux with Docker support |
| **Docker** | 20.10+ | 24.0+ | Docker Compose v2 required |
| **Node.js** | 16.x | 18.x LTS | For metadata-ui server only |

### Network Ports

The following ports must be open on the server:

| Port | Service | Access Level |
|------|---------|-------------|
| **50031** | Portal UI | 🌐 Public (user-facing) |
| **8084** | Metadata UI | 🌐 Public (iframe source) |
| **54002** | Gateway | 🔒 Internal only |
| **58761** | Eureka | 🔒 Internal only |
| **54003** | Data Ingest | 🔒 Internal only |
| **54004** | NGSI Translator | 🔒 Internal only |
| **54005** | Translator Builder | 🔒 Internal only |
| **54007** | Data Service | 🔒 Internal only |
| **54008** | Data Manager | 🔒 Internal only |
| **54009** | Data Auth | 🔒 Internal only |
| **54011** | Data Broker | 🔒 Internal only |
| **50038** | FDT Service | 🔒 Internal only |
| **53005** | NGSI Context | 🔒 Internal only |
| **55432** | PostgreSQL | 🔒 Internal only |
| **57017** | MongoDB | 🔒 Internal only |
| **56379** | Redis | 🔒 Internal only |
| **19092** | Kafka | 🔒 Internal only |
| **22181** | Zookeeper | 🔒 Internal only |

### Directory Structure on Server

```
/opt/dtsp/                              # Project root
├── docker-compose.yml                  # Portal UI container
├── .env                                # Global environment variables
│
├── src/DTSP_e8ight/
│   ├── fdt-service-backend/
│   │   ├── .env                        # Backend environment variables
│   │   ├── docker-compose-ndxpro.yml   # Core microservices
│   │   ├── docker-compose-fdt.yml      # FDT service
│   │   ├── infra/
│   │   │   ├── .env                    # Infra environment variables
│   │   │   └── docker-compose.yml      # PostgreSQL, MongoDB, Redis
│   │   └── kafka/
│   │       ├── .env                    # Kafka environment variables
│   │       ├── docker-compose-kafka.yml
│   │       └── docker-compose-zookeeper.yml
│   │
│   └── metadata-ui/
│       ├── server.js                   # Express server
│       ├── package.json
│       └── public/
│           ├── search.html
│           ├── manage.html
│           ├── graph.html
│           ├── sync-engine.html
│           ├── verification.html
│           ├── predictor.html
│           ├── discrete-simulator.html
│           └── jeju-api.html
│
├── logs/                               # Application logs
│   ├── data-ingest/
│   ├── data-manager/
│   ├── data-service/
│   ├── data-auth/
│   ├── data-broker-1/
│   ├── ngsi-translator/
│   └── translator-builder/
│
├── ngsi-context/                       # NGSI-LD context files
└── translatorJars/                     # Translator JAR files
```

### Step-by-Step Deployment

#### Step 1: Prepare the Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose v2 (if not included with Docker)
sudo apt install docker-compose-plugin -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
docker --version
docker compose version
node --version
npm --version
```

#### Step 2: Create Docker Network

```bash
docker network create ndxpro
```

#### Step 3: Configure Environment Variables

Create `/opt/dtsp/src/DTSP_e8ight/fdt-service-backend/.env`:

```env
TZ=Asia/Seoul

# === Paths ===
REPO=/tmp/ndxpro
HOST=host.docker.internal            # Change to server IP for production

# === Docker Image Registry ===
IMAGE_REPO_URL=fdttwin               # Docker Hub organization

# === Monitoring (optional) ===
LOGSTASH_URL=172.16.28.222:50000     # Update or remove if not using ELK
ZIPKIN_URL=http://172.16.28.222:59411/

# === Service Discovery ===
EUREKA_URL=http://eureka:8761/eureka
GATEWAY_URL=http://gateway:8000

# === NGSI-LD Context ===
FDT_CONTEXT=http://220.124.222.90:53005/fdt-twin-context-v1.0.1.jsonld

# === PostgreSQL ===
DATASOURCE_URL=jdbc:postgresql://postgres:5432/ndxpro
POSTGRES_USER=ndxpro
POSTGRES_PASSWORD=ndxpro123!

# === MongoDB ===
MONGODB_URI=mongodb://ndxpro:ndxpro123!@mongodb:27017/
MONGODB_DATABASE_NAME=ndxpro

# === Redis ===
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=ndxpro123!

# === Kafka ===
KAFKA_URL=pipeline-kafka-1:19092

# === Auth Token ===
AUTH_TOKEN={TOKEN}
```

> [!IMPORTANT]
> For production deployment:
> - Change `HOST` from `host.docker.internal` to your actual server IP or hostname
> - Update `POSTGRES_PASSWORD`, `REDIS_PASSWORD`, and MongoDB credentials
> - Generate a new `AUTH_TOKEN` via the Data Auth service
> - Update or remove `LOGSTASH_URL` and `ZIPKIN_URL` if not using monitoring

#### Step 4: Start Infrastructure

```bash
cd /opt/dtsp/src/DTSP_e8ight/fdt-service-backend

# 1. Start Zookeeper
docker compose -f kafka/docker-compose-zookeeper.yml up -d
sleep 10

# 2. Start Kafka
docker compose -f kafka/docker-compose-kafka.yml up -d
sleep 15

# 3. Start databases (PostgreSQL, MongoDB, Redis)
docker compose -f infra/docker-compose.yml up -d
sleep 10
```

#### Step 5: Start Core Microservices

```bash
cd /opt/dtsp/src/DTSP_e8ight/fdt-service-backend

# Start all NDXPRO services (Eureka, Gateway, Data Manager, etc.)
docker compose -f docker-compose-ndxpro.yml up -d

# Wait for Eureka to be ready (usually ~30-60 seconds)
echo "Waiting for Eureka to start..."
until curl -sf http://localhost:58761/eureka/apps > /dev/null 2>&1; do
    sleep 5
    echo "  Still waiting..."
done
echo "Eureka is ready!"

# Start FDT Service
docker compose -f docker-compose-fdt.yml up -d
```

#### Step 6: Start Metadata UI

```bash
cd /opt/dtsp/src/DTSP_e8ight/metadata-ui

# Install dependencies
npm install

# Start the server (background)
nohup node server.js > /tmp/metadata-ui.log 2>&1 &

# Verify it's running
curl -s http://localhost:8084/ && echo " ✅ Metadata UI is running"
```

#### Step 7: Start Portal UI

```bash
cd /opt/dtsp

# Start the portal container
docker compose up -d

# Verify
curl -s -o /dev/null -w "%{http_code}" http://localhost:50031 && echo " ✅ Portal is running"
```

#### Step 8: Verify All Services

```bash
echo "=== Service Health Check ==="
echo -n "Portal (50031):     "; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:50031
echo -n "Metadata UI (8084): "; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8084
echo -n "Gateway (54002):    "; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:54002
echo -n "Eureka (58761):     "; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:58761
echo -n "Data Manager:       "; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:54008/actuator/health
echo -n "Data Service:       "; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:54007/actuator/health
echo -n "Data Auth:          "; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:54009/actuator/health
```

### Portal Environment Variables (docker-compose.yml)

When deploying, update `localhost` references to your actual server IP or domain:

```yaml
version: '3.8'

services:
  union-twin-fe:
    image: fdttwin/union-twin-fe:latest
    restart: always
    environment:
      # --- Auth ---
      - NDXPRO_ENV_TOKEN=<YOUR_JWT_TOKEN>

      # --- API Gateway ---
      - NDXPRO_ENV_API_URL=http://<SERVER_IP>:54002
      - NDXPRO_ENV_API_OUTSIDE_URL=http://<SERVER_IP>:54002

      # --- Metadata UI pages (port 8084) ---
      - NDXPRO_ENV_DIGITAL_TWIN_SEARCH_URL=http://<SERVER_IP>:8084/meta/exsearch/list
      - NDXPRO_ENV_PREDICTOR_TOOL_URL=http://<SERVER_IP>:8084/predictor
      - NDXPRO_ENV_DISCRETE_SIMULATOR_URL=http://<SERVER_IP>:8084/discrete-simulator
      - NDXPRO_ENV_DIGITAL_TWIN_METADATA_REGISTRATION=http://<SERVER_IP>:8084/loginpass?to=/meta/exmanage/dt
      - NDXPRO_ENV_METADATA_VISUALIZATION_GRAPH=http://<SERVER_IP>:8084/loginpass?to=/meta/exmedatagraph
      - NDXPRO_ENV_UNION_OBJECT_SYNC_ENGINE_MANAGEMENT=http://<SERVER_IP>:8084/sync-engine
      - NDXPRO_ENV_VERIFICATION_DATA_ADDITION_MANAGEMENT=http://<SERVER_IP>:8084/verification

      # --- External services ---
      - NDXPRO_ENV_VIEWER_URL=http://<SERVER_IP>:50038
      - NDXPRO_ENV_SERVICE_LOGIC_TOOL_URL=http://bigsoft.iptime.org:9900/keti
    ports:
      - '50031:80'

networks:
  default:
    name: ndxpro
    external: true
```

> [!CAUTION]
> Replace all `<SERVER_IP>` placeholders with your actual server IP address or domain name before deploying.

### Metadata UI Server Configuration

The metadata-ui `server.js` routes and API proxy configuration:

#### Routes

| Route | File Served | Description |
|-------|------------|-------------|
| `/` | — | Health check endpoint |
| `/meta/exsearch/list` | `search.html` | Metadata search |
| `/meta/exmanage/dt` | `manage.html` | Metadata registration |
| `/meta/exmedatagraph` | `graph.html` | Visualization graph |
| `/sync-engine` | `sync-engine.html` | Sync engine management |
| `/verification` | `verification.html` | Verification management |
| `/predictor` | `predictor.html` | Predictor tool |
| `/discrete-simulator` | `discrete-simulator.html` | Simulation merge tool |
| `/jeju-api` | `jeju-api.html` | Jeju air quality API docs |
| `/loginpass?to=...` | — | Auth token injection + redirect |

#### API Proxies

| Proxy Path | Target | Actual Path |
|------------|--------|-------------|
| `/api/manager/*` | Gateway (54002) | `/ndxpro/v1/manager/*` |
| `/api/service/*` | Gateway (54002) | `/ndxpro/v1/service/*` |
| `/api/auth/*` | Data Auth (54009) | `/ndxpro/v1/auth/*` |
| `/api/auth-docs` | Data Auth (54009) | `/v3/api-docs` |
| `/api/fdt/health` | FDT Service (50038) | `/` |
| `/api/fdt/api-docs` | FDT Service (50038) | `/v3/api-docs` |
| `/api/fdt/tour/*` | FDT Service (50038) | `/api/fdt/tour/*` |

### Running metadata-ui as a systemd Service (Production)

Create `/etc/systemd/system/metadata-ui.service`:

```ini
[Unit]
Description=DTSP Metadata UI Server
After=network.target docker.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/dtsp/src/DTSP_e8ight/metadata-ui
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=8084

# Logging
StandardOutput=append:/var/log/metadata-ui/stdout.log
StandardError=append:/var/log/metadata-ui/stderr.log

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo mkdir -p /var/log/metadata-ui
sudo systemctl daemon-reload
sudo systemctl enable metadata-ui
sudo systemctl start metadata-ui
sudo systemctl status metadata-ui
```

### Nginx Reverse Proxy (Optional — Production)

For production with a domain name and SSL:

```nginx
# /etc/nginx/sites-available/dtsp.conf

# Portal UI
server {
    listen 80;
    server_name dtsp.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:50031;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Metadata UI (needed for iframes)
server {
    listen 80;
    server_name metadata.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8084;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/dtsp.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

> [!TIP]
> For SSL, use Certbot:
> ```bash
> sudo certbot --nginx -d dtsp.yourdomain.com -d metadata.yourdomain.com
> ```

### Automated Startup Script

Create `/opt/dtsp/start-all.sh`:

```bash
#!/bin/bash
set -e

DTSP_ROOT="/opt/dtsp"
BACKEND_DIR="$DTSP_ROOT/src/DTSP_e8ight/fdt-service-backend"
METADATA_UI_DIR="$DTSP_ROOT/src/DTSP_e8ight/metadata-ui"

echo "========================================="
echo "  DTSP Platform — Starting All Services  "
echo "========================================="

# 1. Docker network
echo "[1/7] Ensuring Docker network exists..."
docker network inspect ndxpro >/dev/null 2>&1 || docker network create ndxpro

# 2. Infrastructure
echo "[2/7] Starting infrastructure (Zookeeper, Kafka, DB)..."
docker compose -f "$BACKEND_DIR/kafka/docker-compose-zookeeper.yml" up -d
sleep 5
docker compose -f "$BACKEND_DIR/kafka/docker-compose-kafka.yml" up -d
sleep 10
docker compose -f "$BACKEND_DIR/infra/docker-compose.yml" up -d
sleep 5

# 3. Core services
echo "[3/7] Starting core microservices..."
docker compose -f "$BACKEND_DIR/docker-compose-ndxpro.yml" up -d
sleep 30

# 4. FDT Service
echo "[4/7] Starting FDT Service..."
docker compose -f "$BACKEND_DIR/docker-compose-fdt.yml" up -d
sleep 5

# 5. Metadata UI
echo "[5/7] Starting Metadata UI server..."
cd "$METADATA_UI_DIR"
pkill -f "node server.js" 2>/dev/null || true
sleep 1
nohup node server.js > /tmp/metadata-ui.log 2>&1 &
sleep 3

# 6. Portal
echo "[6/7] Starting Portal UI..."
cd "$DTSP_ROOT"
docker compose up -d
sleep 3

# 7. Health check
echo "[7/7] Running health checks..."
echo ""
echo "=== Service Status ==="
services=(
    "Portal:50031"
    "Metadata UI:8084"
    "Gateway:54002"
    "Eureka:58761"
    "Data Manager:54008"
    "Data Service:54007"
    "Data Auth:54009"
    "Data Ingest:54003"
    "Data Broker:54011"
    "NGSI Translator:54004"
    "Translator Builder:54005"
    "FDT Service:50038"
)

for svc in "${services[@]}"; do
    name="${svc%%:*}"
    port="${svc##*:}"
    status=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 3 "http://localhost:$port" 2>/dev/null || echo "000")
    if [ "$status" -ge 200 ] && [ "$status" -lt 500 ]; then
        echo "  ✅ $name (port $port) — HTTP $status"
    else
        echo "  ❌ $name (port $port) — HTTP $status"
    fi
done

echo ""
echo "========================================="
echo "  🚀 DTSP Platform is ready!            "
echo "  Portal: http://localhost:50031         "
echo "========================================="
```

```bash
chmod +x /opt/dtsp/start-all.sh
```

### Stop All Services

Create `/opt/dtsp/stop-all.sh`:

```bash
#!/bin/bash
DTSP_ROOT="/opt/dtsp"
BACKEND_DIR="$DTSP_ROOT/src/DTSP_e8ight/fdt-service-backend"

echo "Stopping all DTSP services..."

# Stop Portal
docker compose -f "$DTSP_ROOT/docker-compose.yml" down

# Stop metadata-ui
pkill -f "node server.js" 2>/dev/null || true

# Stop core services
docker compose -f "$BACKEND_DIR/docker-compose-fdt.yml" down
docker compose -f "$BACKEND_DIR/docker-compose-ndxpro.yml" down

# Stop infrastructure
docker compose -f "$BACKEND_DIR/infra/docker-compose.yml" down
docker compose -f "$BACKEND_DIR/kafka/docker-compose-kafka.yml" down
docker compose -f "$BACKEND_DIR/kafka/docker-compose-zookeeper.yml" down

echo "✅ All services stopped."
```

---

## Part 4: Bug Fix History

Issues discovered and resolved while setting up the platform locally:

| # | Page | Problem | Root Cause | Solution |
|---|------|---------|-----------|----------|
| 1 | Digital Twin Search | 404 error on iframe load | metadata-ui server was not running | Built Express server with routes and API proxies |
| 2 | Sync Engine Management | iframe failed to load | No URL configured; no HTML page existed | Created `sync-engine.html` and added env var |
| 3 | Verification Management | iframe failed; Members API 404 | No HTML page; backend returned 404 for members | Created `verification.html` with graceful 404 handling |
| 4 | Metadata Registration | Blank page in portal | Route path typo: `registeration` vs `registration` | Fixed route path in `routePath.ts` + Docker sed patch |
| 5 | Service Description Tool sub-pages | "Cannot GET" error | Sub-routes (model-management, entity-management, etc.) not registered | Added missing React Router sub-routes |
| 6 | Predictor Creator Tool | Whitelabel Error Page (404) | iframe URL pointed to Gateway root (no UI there) | Created `predictor.html`, updated env var to metadata-ui |
| 7 | Simulation Merge Tool | Whitelabel Error Page (404) | iframe URL pointed to Gateway root (no UI there) | Created `discrete-simulator.html`, updated env var |
| 8 | Jeju Air Quality API | Infinite loading spinner | External Swagger server (`dev.jinwoosi.co.kr:8083`) offline | Created local `jeju-api.html` with cached API docs |

---

> **Document generated:** 2026-02-28  
> **Platform version:** DTSP v1.1  
> **Docker images:** fdttwin/* v1.1 — v1.1.2

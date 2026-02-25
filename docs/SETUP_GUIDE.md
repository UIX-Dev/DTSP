# DTSP — Local Setup Guide

## Prerequisites

- Docker Desktop (20.10+)
- Git
- **Windows:** Use Git Bash or WSL to run the commands below

## Before You Start

### 1. Clone & Create Network

```bash
git clone https://github.com/Fedit-3Sub/DTSP.git
cd DTSP
docker network create ndxpro
```

### 2. Configure `.env` Files

**File `src/DTSP_e8ight/fdt-service-backend/.env`** — set `HOST`:

| OS | HOST value |
|----|-----------|
| macOS / Windows | `host.docker.internal` |
| Linux | `172.17.0.1` |

**File `src/DTSP_e8ight/fdt-service-backend/kafka/.env`** — set `HOST` and `REPO`:

```env
REPO=/tmp/ndxpro
HOST=host.docker.internal   # or 172.17.0.1 for Linux
```

### 3. Create Volume Directories

```bash
mkdir -p /tmp/ndxpro/docker-volumes
mkdir -p /tmp/ndxpro/ngsi-context
mkdir -p /tmp/ndxpro/logs
mkdir -p /tmp/ndxpro/translatorJars
mkdir -p /tmp/ndxpro/file-service/data
mkdir -p /tmp/ndxpro/file-service/logs
```

> **Windows (CMD):** Replace `mkdir -p` with `mkdir` and `/tmp/ndxpro` with `C:\tmp\ndxpro`. Update `REPO` in `.env` files accordingly.

---

## Start the System (in order)

### Step 1: Infrastructure — MongoDB, PostgreSQL, Redis

```bash
cd src/DTSP_e8ight/fdt-service-backend/infra
docker compose up -d
```

Wait ~10s for databases to initialize.

### Step 2: Kafka & Zookeeper

```bash
cd ../kafka

# Build images (first time only)
sh install_images.sh

# Start Zookeeper first, wait 10s, then Kafka
docker compose -f docker-compose-zookeeper.yml up -d
sleep 10
docker compose -f docker-compose-kafka.yml up -d
```

### Step 3: Backend Microservices

```bash
cd ..
docker compose -f docker-compose-ndxpro.yml up -d
docker compose -f docker-compose-file.yml up -d
docker compose -f docker-compose-fdt.yml up -d
```

Wait ~60s for all services to register with Eureka.  
Verify at: http://localhost:58761

### Step 4: Frontend Portal

```bash
cd ../../..
docker compose up -d
```

### Step 5: Open Browser

👉 http://localhost:50031

---

## Stop

```bash
docker stop $(docker ps -q)
```

## Restart (after initial setup)

```bash
cd DTSP/src/DTSP_e8ight/fdt-service-backend/infra && docker compose up -d
cd ../kafka && docker compose -f docker-compose-zookeeper.yml up -d && sleep 10 && docker compose -f docker-compose-kafka.yml up -d
cd .. && docker compose -f docker-compose-ndxpro.yml up -d && docker compose -f docker-compose-file.yml up -d && docker compose -f docker-compose-fdt.yml up -d
cd ../../.. && docker compose up -d
```

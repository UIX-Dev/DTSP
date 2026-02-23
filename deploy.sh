#!/bin/bash
#=============================================================
# DTSP Auto Deploy Script
# VPS: 103.118.28.17 (Ubuntu 22.04)
# Domain: twinorchestrator.com
#=============================================================

set -e

echo "========================================="
echo "  DTSP - Auto Deploy Script"
echo "  $(date)"
echo "========================================="

# ----- STEP 1: Update system -----
echo ""
echo "[1/7] Updating system packages..."
apt update -y && apt upgrade -y

# ----- STEP 2: Install Docker -----
echo ""
echo "[2/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo "Docker installed: $(docker --version)"
else
    echo "Docker already installed: $(docker --version)"
fi

# Install Docker Compose plugin (if not included)
if ! docker compose version &> /dev/null; then
    apt install -y docker-compose-plugin
fi
echo "Docker Compose: $(docker compose version)"

# ----- STEP 3: Install Nginx -----
echo ""
echo "[3/7] Installing Nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx
echo "Nginx installed: $(nginx -v 2>&1)"

# ----- STEP 4: Install Certbot for SSL -----
echo ""
echo "[4/7] Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# ----- STEP 5: Clone & Run DTSP -----
echo ""
echo "[5/7] Deploying DTSP application..."

# Create project directory
mkdir -p /opt/dtsp
cd /opt/dtsp

# Clone if not exists, pull if exists
if [ -d ".git" ]; then
    echo "Repository exists, pulling latest..."
    git pull origin main
else
    git clone https://github.com/UIX-Dev/DTSP.git .
fi

# Create Docker network
docker network create ndxpro 2>/dev/null || echo "Network ndxpro already exists"

# Start the portal
docker compose pull
docker compose up -d

echo "Container status:"
docker ps

# ----- STEP 6: Configure Nginx Reverse Proxy -----
echo ""
echo "[6/7] Configuring Nginx reverse proxy..."

# Create Nginx config for twinorchestrator.com
cat > /etc/nginx/sites-available/twinorchestrator.com << 'NGINX_EOF'
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

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINX_EOF

# Also create a config for direct IP access
cat > /etc/nginx/sites-available/default << 'NGINX_DEFAULT_EOF'
server {
    listen 80 default_server;
    server_name _;

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
    }
}
NGINX_DEFAULT_EOF

# Enable twinorchestrator.com site
ln -sf /etc/nginx/sites-available/twinorchestrator.com /etc/nginx/sites-enabled/

# Test and reload Nginx
nginx -t
systemctl reload nginx

# ----- STEP 7: Configure Firewall -----
echo ""
echo "[7/7] Configuring firewall..."

# Install and configure UFW
apt install -y ufw
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status

# ----- DONE -----
echo ""
echo "========================================="
echo "  ✅ DEPLOYMENT COMPLETE!"
echo "========================================="
echo ""
echo "  Portal is running at:"
echo "  → http://103.118.28.17"
echo ""
echo "  After DNS setup on GoDaddy:"
echo "  → http://twinorchestrator.com"
echo ""
echo "  To enable SSL (after DNS is pointed):"
echo "  → certbot --nginx -d twinorchestrator.com -d www.twinorchestrator.com"
echo ""
echo "  Container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "========================================="

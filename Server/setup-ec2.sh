#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=========================================="
echo "🚀 FashionStoreApp EC2 Setup Automation Script"
echo "=========================================="

# Ensure script is run with sudo
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run this script with sudo (e.g., sudo ./setup-ec2.sh)"
  exit 1
fi

# 1. Update package list
echo "🔄 Updating system packages..."
apt update && apt upgrade -y

# 2. Install Docker if not present
if ! [ -x "$(command -v docker)" ]; then
  echo "🐳 Installing Docker Engine..."
  apt install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release
  mkdir -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt update
  apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  
  # Allow the default ubuntu user to run docker commands
  if id -u ubuntu >/dev/null 2>&1; then
    usermod -aG docker ubuntu
    echo "✅ Docker installed. User 'ubuntu' added to docker group."
  fi
else
  echo "✅ Docker is already installed."
fi

# 3. Install Nginx if not present
if ! [ -x "$(command -v nginx)" ]; then
  echo "🌐 Installing Nginx..."
  apt install -y nginx
else
  echo "✅ Nginx is already installed."
fi

# 4. Get input from the user
echo "------------------------------------------"
read -p "👉 Enter your API Domain (e.g., api.yourdomain.com): " API_DOMAIN
if [ -z "$API_DOMAIN" ]; then
  echo "❌ Domain cannot be empty. Exiting."
  exit 1
fi

read -p "👉 Enter your Email for SSL/Certbot notifications: " EMAIL_ADDR
if [ -z "$EMAIL_ADDR" ]; then
  echo "❌ Email cannot be empty. Exiting."
  exit 1
fi
echo "------------------------------------------"

# 5. Configure Nginx Reverse Proxy
NGINX_CONF="/etc/nginx/sites-available/fashion-api"
echo "🔧 Configuring Nginx block at $NGINX_CONF..."

cat <<EOT > $NGINX_CONF
server {
    listen 80;
    server_name $API_DOMAIN;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOT

# Enable config and disable default site if active
if [ -f "/etc/nginx/sites-enabled/default" ]; then
  rm -f /etc/nginx/sites-enabled/default
fi

# Symlink it
if [ ! -f "/etc/nginx/sites-enabled/fashion-api" ]; then
  ln -s $NGINX_CONF /etc/nginx/sites-enabled/
fi

# Test and reload Nginx
echo "🔄 Restarting Nginx..."
nginx -t
systemctl restart nginx

# 6. Certbot for SSL (HTTPS)
echo "🔒 Requesting SSL Certificate from Let's Encrypt using Certbot..."
apt install -y certbot python3-certbot-nginx

# Request cert and auto-configure Nginx redirect
certbot --nginx -d "$API_DOMAIN" --non-interactive --agree-tos -m "$EMAIL_ADDR" --redirect

echo "=========================================="
echo "✅ SETUP COMPLETED SUCCESSFULLY!"
echo "=========================================="
echo "1. Make sure your domain '$API_DOMAIN' points to this server's Elastic IP."
echo "2. Your API Gateway is now secured with HTTPS: https://$API_DOMAIN/health"
echo "3. Change directory to 'Server' and configure your .env file."
echo "4. Build and start containers: docker compose up --build -d"
echo "=========================================="

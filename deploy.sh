#!/bin/bash

# EC2 Deployment Script for React App
echo "🚀 Starting deployment..."

# Update system
sudo yum update -y

# Install Node.js and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16

# Install PM2 for process management
npm install -g pm2

# Install nginx
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Create app directory
sudo mkdir -p /var/www/html
sudo chown -R $USER:$USER /var/www/html

# Copy built files to nginx directory
sudo cp -r dist/* /var/www/html/

# Configure nginx
sudo tee /etc/nginx/conf.d/react-app.conf > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html;

    # Handle React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Configure firewall
sudo yum install -y firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"

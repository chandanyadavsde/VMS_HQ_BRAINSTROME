#!/bin/bash

# EC2 Setup Script for CI/CD
echo "🚀 Setting up EC2 for CI/CD deployment..."

# Update system
sudo yum update -y

# Install Node.js and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16

# Install nginx
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Create app directory
sudo mkdir -p /var/www/html
sudo chown -R ec2-user:ec2-user /var/www/html

# Configure nginx for React app
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

# Create deployment user (optional, for better security)
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG wheel deploy
echo "deploy:deploy123" | sudo chpasswd

# Set up SSH for deployment user
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys

echo "✅ EC2 setup completed!"
echo "📝 Next steps:"
echo "1. Get your EC2 public IP"
echo "2. Set up GitHub repository secrets"
echo "3. Push to prod branch to trigger deployment"

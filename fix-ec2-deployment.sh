#!/bin/bash

echo "🔧 Fixing EC2 Deployment..."

# Stop any running development servers
pkill -f "npm run dev" || true
pkill -f "vite" || true

# Build the production version
echo "📦 Building production version..."
npm run build

# Install and configure nginx
echo "🌐 Setting up nginx..."
sudo yum update -y
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Copy built files
echo "📁 Copying files to nginx directory..."
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# Configure nginx
echo "⚙️ Configuring nginx..."
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
}
EOF

# Test and restart nginx
echo "🔄 Restarting nginx..."
sudo nginx -t
sudo systemctl restart nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo yum install -y firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R nginx:nginx /var/www/html/
sudo chmod -R 755 /var/www/html/

echo "✅ Deployment fixed!"
echo "🌐 Your app should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"

# Show status
echo ""
echo "📊 Status Check:"
echo "Nginx Status:"
sudo systemctl status nginx --no-pager -l
echo ""
echo "Files in /var/www/html/:"
ls -la /var/www/html/
echo ""
echo "Firewall Status:"
sudo firewall-cmd --list-all

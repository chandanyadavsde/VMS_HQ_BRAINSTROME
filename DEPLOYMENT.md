# 🚀 Quick EC2 Deployment Guide

## **Step 1: Launch EC2 Instance**
1. Go to AWS Console → EC2
2. Launch Instance → Amazon Linux 2
3. Instance Type: t2.micro (free tier)
4. Security Group: Allow HTTP (80) and HTTPS (443)
5. Launch and note the public IP

## **Step 2: Connect to EC2**
```bash
# Using SSH key
ssh -i your-key.pem ec2-user@YOUR_EC2_IP

# Or using AWS Systems Manager
aws ssm start-session --target i-1234567890abcdef0
```

## **Step 3: Deploy Application**

### **Option A: One-Command Deployment**
```bash
# On your local machine
npm run build
scp -r dist/* ec2-user@YOUR_EC2_IP:/tmp/react-app/
ssh ec2-user@YOUR_EC2_IP 'bash -s' < deploy.sh
```

### **Option B: Manual Deployment**
```bash
# On EC2 instance
sudo yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo mkdir -p /var/www/html
sudo cp -r /tmp/react-app/* /var/www/html/
```

## **Step 4: Configure Nginx**
```bash
# Create nginx config
sudo tee /etc/nginx/conf.d/react-app.conf > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html;
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

## **Step 5: Configure Firewall**
```bash
sudo yum install -y firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## **Step 6: Access Your App**
Your app will be available at: `http://YOUR_EC2_IP`

## **🔧 Quick Commands**

### **Update Application**
```bash
# On local machine
npm run build
scp -r dist/* ec2-user@YOUR_EC2_IP:/tmp/react-app/

# On EC2
sudo cp -r /tmp/react-app/* /var/www/html/
sudo systemctl restart nginx
```

### **Check Status**
```bash
# Nginx status
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Troubleshooting**
```bash
# Fix permissions
sudo chown -R nginx:nginx /var/www/html/
sudo chmod -R 755 /var/www/html/

# Check nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## **🌐 SSL Certificate (Optional)**
```bash
sudo yum install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## **📊 Monitoring**
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check nginx processes
ps aux | grep nginx
```

Your React app is now deployed and accessible via HTTP! 🎉

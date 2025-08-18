# 🚀 Complete CI/CD Pipeline Setup Guide

## **Step-by-Step Setup from Scratch**

### **Phase 1: AWS EC2 Setup**

#### **1.1 Launch EC2 Instance**
```bash
# Go to AWS Console → EC2 → Launch Instance
# Choose: Amazon Linux 2 AMI
# Instance Type: t2.micro (free tier)
# Storage: 8GB (default)
# Security Group: Create new
#   - Name: react-app-sg
#   - Description: Security group for React app
#   - Inbound Rules:
#     - HTTP (80) from anywhere (0.0.0.0/0)
#     - HTTPS (443) from anywhere (0.0.0.0/0)
#     - SSH (22) from your IP
# Key Pair: Create new or use existing
```

#### **1.2 Connect to EC2**
```bash
# Download your .pem key file
# Connect via SSH
ssh -i your-key.pem ec2-user@YOUR_EC2_IP

# Or using AWS Systems Manager (no key needed)
aws ssm start-session --target i-1234567890abcdef0
```

#### **1.3 Set Up EC2 for CI/CD**
```bash
# On your local machine, upload the setup script
scp -i your-key.pem setup-ec2.sh ec2-user@YOUR_EC2_IP:/tmp/

# On EC2, run the setup script
ssh -i your-key.pem ec2-user@YOUR_EC2_IP
chmod +x /tmp/setup-ec2.sh
sudo /tmp/setup-ec2.sh
```

### **Phase 2: GitHub Repository Setup**

#### **2.1 Create GitHub Repository**
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository
# Go to GitHub.com → New Repository
# Name: vms-vehicle-approval
# Make it private or public
# Don't initialize with README (we already have one)

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/vms-vehicle-approval.git
git branch -M main
git push -u origin main
```

#### **2.2 Create Production Branch**
```bash
# Create and switch to prod branch
git checkout -b prod
git push -u origin prod

# Switch back to main for development
git checkout main
```

### **Phase 3: AWS IAM User Setup**

#### **3.1 Create IAM User for GitHub Actions**
```bash
# Go to AWS Console → IAM → Users → Create User
# User Name: github-actions
# Access Type: Programmatic access

# Attach policies:
# - AmazonEC2FullAccess
# - AmazonS3FullAccess (if using S3 for assets)
```

#### **3.2 Get Access Keys**
```bash
# After creating user, download the CSV file
# Note down:
# - Access Key ID
# - Secret Access Key
```

### **Phase 4: GitHub Secrets Setup**

#### **4.1 Go to Repository Settings**
```bash
# GitHub.com → Your Repository → Settings → Secrets and variables → Actions
```

#### **4.2 Add Repository Secrets**
Add these secrets:

1. **AWS_ACCESS_KEY_ID**
   - Value: Your IAM user access key ID

2. **AWS_SECRET_ACCESS_KEY**
   - Value: Your IAM user secret access key

3. **AWS_REGION**
   - Value: Your AWS region (e.g., us-east-1)

4. **EC2_HOST**
   - Value: Your EC2 public IP address

5. **EC2_SSH_KEY**
   - Value: Your private key content (the .pem file content)

#### **4.3 Get SSH Key Content**
```bash
# On your local machine, get the private key content
cat your-key.pem
# Copy the entire content (including BEGIN and END lines)
```

### **Phase 5: Test the Pipeline**

#### **5.1 Make a Change and Deploy**
```bash
# Make a small change to your code
# For example, update a comment or add a console.log

# Commit and push to prod branch
git checkout prod
git merge main
git push origin prod
```

#### **5.2 Monitor Deployment**
```bash
# Go to GitHub.com → Your Repository → Actions
# You should see the deployment workflow running
# Check the logs for any errors
```

### **Phase 6: Verify Deployment**

#### **6.1 Check Your App**
```bash
# Open your browser and go to:
http://YOUR_EC2_IP

# Your React app should be live!
```

#### **6.2 Check EC2 Logs**
```bash
# SSH to your EC2 instance
ssh -i your-key.pem ec2-user@YOUR_EC2_IP

# Check nginx status
sudo systemctl status nginx

# Check nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## **🔧 Troubleshooting**

### **Common Issues**

#### **1. SSH Connection Failed**
```bash
# Check security group
# Make sure port 22 is open for your IP

# Check key permissions
chmod 400 your-key.pem
```

#### **2. GitHub Actions Failed**
```bash
# Check secrets are set correctly
# Verify AWS credentials
# Check EC2 IP is correct
```

#### **3. App Not Loading**
```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx config
sudo nginx -t

# Check firewall
sudo firewall-cmd --list-all
```

#### **4. Permission Issues**
```bash
# Fix nginx permissions
sudo chown -R nginx:nginx /var/www/html/
sudo chmod -R 755 /var/www/html/
```

## **🚀 Usage After Setup**

### **Development Workflow**
```bash
# 1. Make changes on main branch
git checkout main
# ... make your changes ...
git add .
git commit -m "Your changes"
git push origin main

# 2. Deploy to production
git checkout prod
git merge main
git push origin prod
# This automatically triggers deployment!
```

### **Manual Deployment**
```bash
# If you need to deploy manually
# Go to GitHub.com → Your Repository → Actions
# Click "Deploy to EC2" workflow
# Click "Run workflow" → "Run workflow"
```

## **📊 Monitoring**

### **GitHub Actions**
- Go to Actions tab to see deployment history
- Check logs for any errors
- Monitor deployment times

### **EC2 Monitoring**
```bash
# Check system resources
htop
df -h
free -h

# Check nginx logs
sudo tail -f /var/log/nginx/access.log
```

## **🔒 Security Best Practices**

1. **Use IAM Roles instead of Access Keys** (for production)
2. **Restrict Security Group** to specific IPs
3. **Enable AWS CloudTrail** for audit logs
4. **Use HTTPS** with SSL certificate
5. **Regular security updates**

## **💰 Cost Optimization**

1. **Use t2.micro** for development (free tier)
2. **Stop instance** when not in use
3. **Use Spot Instances** for cost savings
4. **Monitor AWS Billing** dashboard

Your CI/CD pipeline is now ready! 🎉

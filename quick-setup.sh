#!/bin/bash

# Quick Setup Script for CI/CD Pipeline
echo "🚀 Quick Setup for CI/CD Pipeline"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if GitHub remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo "🔗 Please add your GitHub repository as remote:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/vms-vehicle-approval.git"
    echo ""
    read -p "Enter your GitHub repository URL: " github_url
    git remote add origin "$github_url"
    echo "✅ GitHub remote added"
else
    echo "✅ GitHub remote already exists"
fi

# Create prod branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/prod; then
    echo "🌿 Creating prod branch..."
    git checkout -b prod
    git push -u origin prod
    git checkout main
    echo "✅ Prod branch created and pushed"
else
    echo "✅ Prod branch already exists"
fi

echo ""
echo "📋 Next Steps:"
echo "==============="
echo "1. 🖥️  Launch EC2 instance (Amazon Linux 2, t2.micro)"
echo "2. 🔑 Create IAM user for GitHub Actions"
echo "3. 🔐 Set up GitHub repository secrets"
echo "4. 🚀 Run setup-ec2.sh on your EC2 instance"
echo "5. 📝 Push to prod branch to test deployment"
echo ""
echo "📖 See CI-CD-SETUP.md for detailed instructions"
echo ""
echo "🎯 Your CI/CD pipeline will be ready!"

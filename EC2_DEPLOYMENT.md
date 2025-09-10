# EC2 Deployment Guide for Lamhey

## Prerequisites
- AWS Account with EC2 access
- Domain name (optional, can use EC2 public IP)
- GitHub repository with your code

## Step 1: Launch EC2 Instance

### Instance Configuration
- **Instance Type**: t3.medium or t3.large (recommended for React + Node.js)
- **AMI**: Ubuntu Server 20.04 LTS or 22.04 LTS
- **Storage**: 20-30 GB GP3
- **Key Pair**: Create or use existing key pair

### Security Groups
Create security group with these rules:

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS traffic |
| Custom | TCP | 3000 | 0.0.0.0/0 | React app (temporary) |
| Custom | TCP | 3001 | 0.0.0.0/0 | Node.js API (temporary) |

## Step 2: Connect to EC2 Instance

```bash
# Replace with your key file and EC2 public IP
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

## Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

## Step 4: Clone Repository

```bash
# Clone your repository
git clone https://github.com/neelkamalrana/Lamhey.git
cd Lamhey

# Make scripts executable
chmod +x setup.sh deploy.sh
```

## Step 5: Configure Environment Variables

### Update client/.env for production:
```bash
# Production environment variables
REACT_APP_COGNITO_USER_POOL_ID=us-east-2_GOHDcj0J4
REACT_APP_COGNITO_CLIENT_ID=v3be3ikb1s1d6eaaulkvbv5f1
REACT_APP_COGNITO_REGION=us-east-2
REACT_APP_COGNITO_DOMAIN=us-east-2gohdcj0j4.auth.us-east-2.amazoncognito.com
REACT_APP_COGNITO_REDIRECT_SIGNIN=https://your-domain.com/callback
REACT_APP_COGNITO_REDIRECT_SIGNOUT=https://your-domain.com/
REACT_APP_COGNITO_SCOPES=email openid phone
REACT_APP_COGNITO_RESPONSE_TYPE=code
REACT_APP_COGNITO_HOSTED_UI_URL=https://us-east-2gohdcj0j4.auth.us-east-2.amazoncognito.com/login?client_id=v3be3ikb1s1d6eaaulkvbv5f1&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fyour-domain.com%2Fcallback
```

### Update server/.env for production:
```bash
# Server environment variables
NODE_ENV=production
PORT=3001
```

## Step 6: Build and Deploy

```bash
# Run the deployment script
./deploy.sh

# Or manually:
npm run build:all
sudo docker-compose up -d
```

## Step 7: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/lamhey

# Add the configuration from nginx.conf
# Then enable the site
sudo ln -s /etc/nginx/sites-available/lamhey /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Step 9: Update AWS Cognito

1. Go to AWS Cognito Console
2. Update your App Client settings:
   - **Callback URL**: `https://your-domain.com/callback`
   - **Sign out URL**: `https://your-domain.com/`

## Step 10: Test Deployment

1. Visit `https://your-domain.com` or `http://your-ec2-ip`
2. Test the login/signup flow
3. Verify dashboard access after authentication

## Monitoring and Maintenance

### View Logs
```bash
# Docker logs
sudo docker-compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
# Restart application
sudo docker-compose restart

# Restart Nginx
sudo systemctl restart nginx
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
./deploy.sh
```

## Troubleshooting

### Common Issues:
1. **Port conflicts**: Check if ports 80, 443, 3000, 3001 are free
2. **Permission issues**: Ensure ubuntu user has docker permissions
3. **Nginx errors**: Check configuration syntax with `sudo nginx -t`
4. **Cognito redirects**: Verify callback URLs match exactly

### Useful Commands:
```bash
# Check running containers
sudo docker ps

# Check Nginx status
sudo systemctl status nginx

# Check disk space
df -h

# Check memory usage
free -h
```

## Security Considerations

1. **Firewall**: Only open necessary ports
2. **SSL**: Always use HTTPS in production
3. **Updates**: Keep system and dependencies updated
4. **Monitoring**: Set up CloudWatch or similar monitoring
5. **Backups**: Regular backups of application data

## Cost Optimization

1. **Instance Type**: Start with t3.medium, scale as needed
2. **Storage**: Use GP3 for better price/performance
3. **Reserved Instances**: Consider for long-term usage
4. **Auto Scaling**: Implement if traffic varies significantly

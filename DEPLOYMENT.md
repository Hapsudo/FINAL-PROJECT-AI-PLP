# 🚀 AGRIWISE AI - Deployment Guide

## **Complete Platform Deployment Instructions**

This guide will help you deploy the entire AGRIWISE AI platform with all its components.

---

## **📋 Prerequisites**

### **System Requirements**
- **OS**: Linux, macOS, or Windows 10/11
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: 20GB free space
- **CPU**: Multi-core processor

### **Software Requirements**
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: For cloning the repository

### **Install Docker**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# macOS
brew install --cask docker

# Windows
# Download from https://www.docker.com/products/docker-desktop
```

---

## **🚀 Quick Start Deployment**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/agriwise-ai.git
cd agriwise-ai
```

### **2. Make Deployment Script Executable**
```bash
chmod +x deploy.sh
```

### **3. Deploy the Platform**
```bash
./deploy.sh development deploy
```

### **4. Access the Platform**
- **Mobile App**: http://localhost:19000
- **API Documentation**: http://localhost:8000/docs
- **Web Dashboard**: http://localhost:3000
- **Monitoring**: http://localhost:3001 (Grafana)

---

## **🔧 Manual Deployment**

### **Step 1: Environment Setup**
```bash
# Create environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### **Step 2: Build Images**
```bash
# Build all services
docker-compose build

# Or build individually
docker-compose build backend
docker-compose build frontend
docker-compose build web-dashboard
```

### **Step 3: Start Services**
```bash
# Start all services
docker-compose up -d

# Start core services first
docker-compose up -d postgres redis
sleep 10
docker-compose up -d backend
sleep 15
docker-compose up -d
```

### **Step 4: Verify Deployment**
```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs -f

# Health check
curl http://localhost:8000/health
```

---

## **🏗️ Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │  Web Dashboard  │    │   API Gateway   │
│   (React Native)│    │    (React.js)   │    │   (Nginx)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Backend API    │
                    │   (FastAPI)     │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │   AI Models     │
│   Database      │    │     Cache       │    │  (TensorFlow)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## **🔍 Service Details**

### **Backend API (Port 8000)**
- **Framework**: FastAPI
- **Language**: Python 3.11
- **Features**: 
  - Disease detection AI
  - Weather forecasting
  - Market price analysis
  - Voice processing
  - Loan assessment

### **Frontend Mobile App (Port 19000)**
- **Framework**: React Native with Expo
- **Features**:
  - Cross-platform mobile app
  - Offline functionality
  - Camera integration
  - Voice commands
  - Real-time updates

### **Web Dashboard (Port 3000)**
- **Framework**: React.js
- **Features**:
  - Analytics dashboard
  - User management
  - System monitoring
  - Data visualization

### **Database (Port 5432)**
- **Type**: PostgreSQL 15
- **Features**:
  - User data storage
  - Disease detection history
  - Market price data
  - Analytics data

### **Cache (Port 6379)**
- **Type**: Redis 7
- **Features**:
  - Session storage
  - API response caching
  - Real-time data

---

## **📊 Monitoring & Analytics**

### **Grafana (Port 3001)**
- **Username**: admin
- **Password**: agriwise_admin
- **Features**:
  - System metrics
  - User analytics
  - AI model performance
  - Custom dashboards

### **Prometheus (Port 9090)**
- **Features**:
  - Metrics collection
  - Alerting
  - Time-series data

### **MLflow (Port 5000)**
- **Features**:
  - Model tracking
  - Experiment management
  - Model versioning

---

## **🔧 Configuration**

### **Environment Variables**
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/db
POSTGRES_DB=agriwise_db
POSTGRES_USER=agriwise_user
POSTGRES_PASSWORD=agriwise_password

# Redis
REDIS_URL=redis://redis:6379

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API
API_HOST=0.0.0.0
API_PORT=8000

# Frontend
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=production
```

### **AI Model Configuration**
```python
# Disease Detection Models
DISEASE_MODELS = {
    'maize': 'models/maize_disease_model.h5',
    'beans': 'models/beans_disease_model.h5',
    'tomatoes': 'models/tomatoes_disease_model.h5'
}

# Voice Processing
VOICE_LANGUAGES = ['swahili', 'english', 'kikuyu', 'luo']
```

---

## **🛠️ Management Commands**

### **Service Management**
```bash
# Start services
./deploy.sh start

# Stop services
./deploy.sh stop

# Restart services
./deploy.sh restart

# View logs
./deploy.sh logs

# Check status
./deploy.sh status

# Health check
./deploy.sh health
```

### **Development Commands**
```bash
# Build images
./deploy.sh build

# Clean up
./deploy.sh cleanup

# Full deployment
./deploy.sh deploy
```

### **Docker Commands**
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Execute commands in container
docker-compose exec backend python manage.py migrate
docker-compose exec frontend npm install

# Scale services
docker-compose up -d --scale celery-worker=3
```

---

## **🔒 Security Configuration**

### **SSL/TLS Setup**
```bash
# Generate SSL certificates
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/nginx.key \
    -out nginx/ssl/nginx.crt
```

### **Firewall Configuration**
```bash
# Allow required ports
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8000
sudo ufw allow 3000
sudo ufw allow 19000
```

### **Environment Security**
```bash
# Generate secure secret key
openssl rand -hex 32

# Set secure passwords
export POSTGRES_PASSWORD=$(openssl rand -base64 32)
export REDIS_PASSWORD=$(openssl rand -base64 32)
```

---

## **📈 Scaling & Performance**

### **Horizontal Scaling**
```bash
# Scale backend workers
docker-compose up -d --scale backend=3

# Scale Celery workers
docker-compose up -d --scale celery-worker=5

# Load balancer configuration
# Add to nginx.conf
upstream backend {
    server backend:8000;
    server backend:8001;
    server backend:8002;
}
```

### **Performance Optimization**
```bash
# Enable Redis caching
# Add to backend settings
CACHE_TTL = 3600
CACHE_PREFIX = "agriwise"

# Database optimization
# Add indexes for frequently queried fields
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_detection_date ON disease_detections(created_at);
```

---

## **🐛 Troubleshooting**

### **Common Issues**

#### **1. Port Already in Use**
```bash
# Check what's using the port
sudo lsof -i :8000

# Kill the process
sudo kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "8001:8000"
```

#### **2. Database Connection Issues**
```bash
# Check database status
docker-compose exec postgres pg_isready

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

#### **3. AI Model Loading Issues**
```bash
# Check model files
docker-compose exec backend ls -la /app/models

# Rebuild AI service
docker-compose build backend
docker-compose up -d backend
```

#### **4. Memory Issues**
```bash
# Increase Docker memory limit
# In Docker Desktop settings:
# Resources > Memory: 8GB

# Or use swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### **Log Analysis**
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f

# Search logs
docker-compose logs | grep "ERROR"
```

---

## **🔄 Updates & Maintenance**

### **Updating the Platform**
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
./deploy.sh build
./deploy.sh restart
```

### **Backup & Restore**
```bash
# Backup database
docker-compose exec postgres pg_dump -U agriwise_user agriwise_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U agriwise_user agriwise_db < backup.sql

# Backup volumes
docker run --rm -v agriwise_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

### **Monitoring & Alerts**
```bash
# Set up monitoring alerts
# In Grafana:
# 1. Create alert rules
# 2. Configure notification channels
# 3. Set up email/SMS alerts

# Health check script
#!/bin/bash
curl -f http://localhost:8000/health || echo "Backend is down!"
```

---

## **📞 Support**

### **Getting Help**
- **Documentation**: Check this guide and README.md
- **Issues**: Create GitHub issue with detailed description
- **Community**: Join our Discord/Slack channel

### **Useful Commands**
```bash
# System information
docker system df
docker system prune

# Service information
docker-compose config
docker-compose top

# Resource usage
docker stats
```

---

## **🎯 Production Checklist**

- [ ] SSL certificates configured
- [ ] Environment variables secured
- [ ] Database backups scheduled
- [ ] Monitoring alerts configured
- [ ] Load balancer configured
- [ ] Auto-scaling rules set
- [ ] Security patches applied
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Team trained on deployment

---

**🌱 AGRIWISE AI - Empowering Kenyan Farmers with AI Technology** 
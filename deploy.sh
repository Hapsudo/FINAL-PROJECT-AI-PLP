#!/bin/bash

# AGRIWISE AI - Deployment Script
# This script deploys the entire AGRIWISE AI platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="agriwise-ai"
DOCKER_COMPOSE_FILE="docker-compose.yml"
ENVIRONMENT=${1:-development}

echo -e "${BLUE}🌱 AGRIWISE AI - Deployment Script${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Environment: ${GREEN}$ENVIRONMENT${NC}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed."
}

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    required_files=(
        "docker-compose.yml"
        "backend/requirements.txt"
        "backend/main.py"
        "frontend/package.json"
        "README.md"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file not found: $file"
            exit 1
        fi
    done
    
    print_status "All required files found."
}

# Create environment file
create_env_file() {
    print_status "Creating environment configuration..."
    
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# AGRIWISE AI Environment Configuration
ENVIRONMENT=$ENVIRONMENT

# Database Configuration
DATABASE_URL=postgresql://agriwise_user:agriwise_password@postgres:5432/agriwise_db
POSTGRES_DB=agriwise_db
POSTGRES_USER=agriwise_user
POSTGRES_PASSWORD=agriwise_password

# Redis Configuration
REDIS_URL=redis://redis:6379

# Security
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=$ENVIRONMENT

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001

# MLflow
MLFLOW_TRACKING_URI=sqlite:///mlflow.db
MLFLOW_PORT=5000
EOF
        print_status "Environment file created: .env"
    else
        print_warning "Environment file already exists: .env"
    fi
}

# Build Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Build backend
    print_status "Building backend image..."
    docker-compose build backend
    
    # Build frontend
    print_status "Building frontend image..."
    docker-compose build frontend
    
    # Build web dashboard (if exists)
    if [ -d "web-dashboard" ]; then
        print_status "Building web dashboard image..."
        docker-compose build web-dashboard
    fi
    
    print_status "All Docker images built successfully."
}

# Start services
start_services() {
    print_status "Starting AGRIWISE AI services..."
    
    # Start core services first
    docker-compose up -d postgres redis
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Start backend
    docker-compose up -d backend
    
    # Wait for backend to be ready
    print_status "Waiting for backend to be ready..."
    sleep 15
    
    # Start other services
    docker-compose up -d
    
    print_status "All services started successfully."
}

# Check service health
check_health() {
    print_status "Checking service health..."
    
    services=(
        "postgres:5432"
        "redis:6379"
        "backend:8000"
        "frontend:19000"
    )
    
    for service in "${services[@]}"; do
        host=$(echo $service | cut -d: -f1)
        port=$(echo $service | cut -d: -f2)
        
        print_status "Checking $host:$port..."
        
        # Wait for service to be ready
        timeout=30
        while [ $timeout -gt 0 ]; do
            if docker-compose exec -T $host nc -z localhost $port 2>/dev/null; then
                print_status "$host:$port is ready"
                break
            fi
            sleep 1
            timeout=$((timeout - 1))
        done
        
        if [ $timeout -eq 0 ]; then
            print_warning "$host:$port might not be ready yet"
        fi
    done
}

# Initialize database
init_database() {
    print_status "Initializing database..."
    
    # Wait for database to be ready
    sleep 5
    
    # Run database migrations (if any)
    if [ -f "backend/alembic.ini" ]; then
        print_status "Running database migrations..."
        docker-compose exec backend alembic upgrade head
    fi
    
    print_status "Database initialized successfully."
}

# Show service status
show_status() {
    print_status "AGRIWISE AI Platform Status:"
    echo ""
    docker-compose ps
    echo ""
    
    print_status "Service URLs:"
    echo -e "  ${BLUE}Backend API:${NC} http://localhost:8000"
    echo -e "  ${BLUE}API Documentation:${NC} http://localhost:8000/docs"
    echo -e "  ${BLUE}Frontend (Expo):${NC} http://localhost:19000"
    echo -e "  ${BLUE}Web Dashboard:${NC} http://localhost:3000"
    echo -e "  ${BLUE}Grafana:${NC} http://localhost:3001"
    echo -e "  ${BLUE}MLflow:${NC} http://localhost:5000"
    echo -e "  ${BLUE}Prometheus:${NC} http://localhost:9090"
    echo ""
    
    print_status "Default Credentials:"
    echo -e "  ${BLUE}Grafana:${NC} admin / agriwise_admin"
    echo -e "  ${BLUE}Database:${NC} agriwise_user / agriwise_password"
    echo ""
}

# Stop services
stop_services() {
    print_status "Stopping AGRIWISE AI services..."
    docker-compose down
    print_status "Services stopped successfully."
}

# Clean up
cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_status "Cleanup completed."
}

# Show logs
show_logs() {
    print_status "Showing service logs..."
    docker-compose logs -f
}

# Main deployment function
deploy() {
    print_status "Starting AGRIWISE AI deployment..."
    
    check_docker
    check_files
    create_env_file
    build_images
    start_services
    init_database
    check_health
    show_status
    
    print_status "🎉 AGRIWISE AI deployment completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "  1. Access the mobile app at: http://localhost:19000"
    echo "  2. View API documentation at: http://localhost:8000/docs"
    echo "  3. Monitor services at: http://localhost:3001 (Grafana)"
    echo "  4. Check logs with: ./deploy.sh logs"
    echo ""
}

# Command line interface
case "${2:-deploy}" in
    "deploy")
        deploy
        ;;
    "start")
        start_services
        show_status
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        start_services
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "build")
        build_images
        ;;
    "health")
        check_health
        ;;
    *)
        echo "Usage: $0 [environment] [command]"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment (default)"
        echo "  start    - Start services"
        echo "  stop     - Stop services"
        echo "  restart  - Restart services"
        echo "  logs     - Show service logs"
        echo "  status   - Show service status"
        echo "  cleanup  - Clean up containers and volumes"
        echo "  build    - Build Docker images"
        echo "  health   - Check service health"
        echo ""
        echo "Environments:"
        echo "  development (default)"
        echo "  production"
        echo "  staging"
        exit 1
        ;;
esac 
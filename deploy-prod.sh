#!/bin/bash

# AGRIWISE AI - Production Deployment Script
# This script deploys the AGRIWISE AI platform to production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="agriwise-ai"
PRODUCTION_SERVER="your-production-server.com"
SSH_USER="ubuntu"
SSH_KEY="~/.ssh/agriwise-prod.pem"

echo -e "${BLUE}🚀 AGRIWISE AI - Production Deployment${NC}"
echo -e "${BLUE}=====================================${NC}"
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

# Check if required tools are installed
check_requirements() {
    print_status "Checking deployment requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    if ! command -v ssh &> /dev/null; then
        print_error "SSH is not installed"
        exit 1
    fi
    
    print_status "All requirements met."
}

# Backup production database
backup_database() {
    print_status "Creating database backup..."
    
    ssh -i $SSH_KEY $SSH_USER@$PRODUCTION_SERVER << 'EOF'
        cd /opt/agriwise-ai
        docker-compose exec -T postgres pg_dump -U agriwise_user agriwise_db > backup_$(date +%Y%m%d_%H%M%S).sql
        echo "Database backup created successfully"
EOF
}

# Deploy to production server
deploy_to_production() {
    print_status "Deploying to production server..."
    
    # Copy deployment files
    scp -i $SSH_KEY docker-compose.prod.yml $SSH_USER@$PRODUCTION_SERVER:/opt/agriwise-ai/
    scp -i $SSH_KEY nginx/nginx.prod.conf $SSH_USER@$PRODUCTION_SERVER:/opt/agriwise-ai/nginx/
    scp -i $SSH_KEY .env.production $SSH_USER@$PRODUCTION_SERVER:/opt/agriwise-ai/.env
    
    # Deploy on production server
    ssh -i $SSH_KEY $SSH_USER@$PRODUCTION_SERVER << 'EOF'
        cd /opt/agriwise-ai
        
        # Pull latest images
        docker-compose -f docker-compose.prod.yml pull
        
        # Stop existing services
        docker-compose -f docker-compose.prod.yml down
        
        # Start services with new images
        docker-compose -f docker-compose.prod.yml up -d
        
        # Wait for services to be ready
        sleep 30
        
        # Check service health
        docker-compose -f docker-compose.prod.yml ps
        
        echo "Production deployment completed!"
EOF
}

# Run health checks
health_check() {
    print_status "Running health checks..."
    
    # Check if services are responding
    if curl -f https://$PRODUCTION_SERVER/health; then
        print_status "✅ Health check passed"
    else
        print_error "❌ Health check failed"
        exit 1
    fi
}

# Monitor deployment
monitor_deployment() {
    print_status "Monitoring deployment..."
    
    ssh -i $SSH_KEY $SSH_USER@$PRODUCTION_SERVER << 'EOF'
        cd /opt/agriwise-ai
        
        # Check service logs
        echo "=== Service Logs ==="
        docker-compose -f docker-compose.prod.yml logs --tail=50
        
        # Check resource usage
        echo "=== Resource Usage ==="
        docker stats --no-stream
        
        # Check service status
        echo "=== Service Status ==="
        docker-compose -f docker-compose.prod.yml ps
EOF
}

# Rollback if needed
rollback() {
    print_warning "Rolling back deployment..."
    
    ssh -i $SSH_KEY $SSH_USER@$PRODUCTION_SERVER << 'EOF'
        cd /opt/agriwise-ai
        
        # Stop current services
        docker-compose -f docker-compose.prod.yml down
        
        # Restore previous version
        docker-compose -f docker-compose.prod.yml up -d
        
        echo "Rollback completed"
EOF
}

# Main deployment function
main() {
    check_requirements
    backup_database
    deploy_to_production
    health_check
    monitor_deployment
    
    print_status "🎉 AGRIWISE AI production deployment completed successfully!"
    echo ""
    print_status "Production URLs:"
    echo -e "  ${BLUE}Main Application:${NC} https://$PRODUCTION_SERVER"
    echo -e "  ${BLUE}API Documentation:${NC} https://$PRODUCTION_SERVER/docs"
    echo -e "  ${BLUE}Monitoring:${NC} https://$PRODUCTION_SERVER/monitoring"
    echo ""
}

# Command line interface
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "backup")
        backup_database
        ;;
    "health")
        health_check
        ;;
    "monitor")
        monitor_deployment
        ;;
    "rollback")
        rollback
        ;;
    *)
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full production deployment (default)"
        echo "  backup   - Create database backup"
        echo "  health   - Run health checks"
        echo "  monitor  - Monitor deployment"
        echo "  rollback - Rollback to previous version"
        exit 1
        ;;
esac 
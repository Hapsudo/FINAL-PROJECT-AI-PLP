# AGRIWISE AI - PowerShell Deployment Script
# This script deploys the AGRIWISE AI platform on Windows

param(
    [string]$Environment = "development",
    [string]$Command = "deploy"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Check if Docker is installed
function Test-Docker {
    Write-Status "Checking Docker installation..."
    try {
        docker --version | Out-Null
        Write-Status "Docker is installed."
        return $true
    }
    catch {
        Write-Error "Docker is not installed. Please install Docker Desktop first."
        return $false
    }
}

# Check if Docker Compose is installed
function Test-DockerCompose {
    Write-Status "Checking Docker Compose installation..."
    try {
        docker-compose --version | Out-Null
        Write-Status "Docker Compose is installed."
        return $true
    }
    catch {
        Write-Error "Docker Compose is not installed."
        return $false
    }
}

# Create environment file
function New-EnvironmentFile {
    Write-Status "Creating environment configuration..."
    
    if (-not (Test-Path ".env")) {
        $envContent = @"
# AGRIWISE AI Environment Configuration
ENVIRONMENT=$Environment

# Database Configuration
DATABASE_URL=postgresql://agriwise_user:agriwise_password@postgres:5432/agriwise_db
POSTGRES_DB=agriwise_db
POSTGRES_USER=agriwise_user
POSTGRES_PASSWORD=agriwise_password

# Redis Configuration
REDIS_URL=redis://redis:6379

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=$Environment

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001

# MLflow
MLFLOW_TRACKING_URI=sqlite:///mlflow.db
MLFLOW_PORT=5000
"@
        $envContent | Out-File -FilePath ".env" -Encoding UTF8
        Write-Status "Environment file created: .env"
    }
    else {
        Write-Warning "Environment file already exists: .env"
    }
}

# Build Docker images
function Build-DockerImages {
    Write-Status "Building Docker images..."
    
    # Build backend
    Write-Status "Building backend image..."
    docker-compose build backend
    
    # Build frontend
    Write-Status "Building frontend image..."
    docker-compose build frontend
    
    Write-Status "All Docker images built successfully."
}

# Start services
function Start-Services {
    Write-Status "Starting AGRIWISE AI services..."
    
    # Start core services first
    docker-compose up -d postgres redis
    
    # Wait for database to be ready
    Write-Status "Waiting for database to be ready..."
    Start-Sleep -Seconds 10
    
    # Start backend
    docker-compose up -d backend
    
    # Wait for backend to be ready
    Write-Status "Waiting for backend to be ready..."
    Start-Sleep -Seconds 15
    
    # Start other services
    docker-compose up -d
    
    Write-Status "All services started successfully."
}

# Check service health
function Test-ServiceHealth {
    Write-Status "Checking service health..."
    
    $services = @(
        @{Name="postgres"; Port="5432"},
        @{Name="redis"; Port="6379"},
        @{Name="backend"; Port="8000"},
        @{Name="frontend"; Port="19000"}
    )
    
    foreach ($service in $services) {
        Write-Status "Checking $($service.Name):$($service.Port)..."
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)" -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Status "$($service.Name):$($service.Port) is ready"
            }
        }
        catch {
            Write-Warning "$($service.Name):$($service.Port) might not be ready yet"
        }
    }
}

# Show service status
function Show-Status {
    Write-Status "AGRIWISE AI Platform Status:"
    Write-Host ""
    docker-compose ps
    Write-Host ""
    
    Write-Status "Service URLs:"
    Write-Host "  Backend API: http://localhost:8000" -ForegroundColor $Blue
    Write-Host "  API Documentation: http://localhost:8000/docs" -ForegroundColor $Blue
    Write-Host "  Frontend (Expo): http://localhost:19000" -ForegroundColor $Blue
    Write-Host "  Web Dashboard: http://localhost:3000" -ForegroundColor $Blue
    Write-Host "  Grafana: http://localhost:3001" -ForegroundColor $Blue
    Write-Host "  MLflow: http://localhost:5000" -ForegroundColor $Blue
    Write-Host "  Prometheus: http://localhost:9090" -ForegroundColor $Blue
    Write-Host ""
    
    Write-Status "Default Credentials:"
    Write-Host "  Grafana: admin / agriwise_admin" -ForegroundColor $Blue
    Write-Host "  Database: agriwise_user / agriwise_password" -ForegroundColor $Blue
    Write-Host ""
}

# Stop services
function Stop-Services {
    Write-Status "Stopping AGRIWISE AI services..."
    docker-compose down
    Write-Status "Services stopped successfully."
}

# Clean up
function Remove-All {
    Write-Status "Cleaning up..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    Write-Status "Cleanup completed."
}

# Show logs
function Show-Logs {
    Write-Status "Showing service logs..."
    docker-compose logs -f
}

# Main deployment function
function Deploy-Platform {
    Write-Status "Starting AGRIWISE AI deployment..."
    
    if (-not (Test-Docker)) { exit 1 }
    if (-not (Test-DockerCompose)) { exit 1 }
    
    New-EnvironmentFile
    Build-DockerImages
    Start-Services
    Test-ServiceHealth
    Show-Status
    
    Write-Status "🎉 AGRIWISE AI deployment completed successfully!"
    Write-Host ""
    Write-Status "Next steps:"
    Write-Host "  1. Access the mobile app at: http://localhost:19000"
    Write-Host "  2. View API documentation at: http://localhost:8000/docs"
    Write-Host "  3. Monitor services at: http://localhost:3001 (Grafana)"
    Write-Host "  4. Check logs with: .\deploy.ps1 logs"
    Write-Host ""
}

# Command line interface
switch ($Command.ToLower()) {
    "deploy" {
        Deploy-Platform
    }
    "start" {
        Start-Services
        Show-Status
    }
    "stop" {
        Stop-Services
    }
    "restart" {
        Stop-Services
        Start-Services
        Show-Status
    }
    "logs" {
        Show-Logs
    }
    "status" {
        Show-Status
    }
    "cleanup" {
        Remove-All
    }
    "build" {
        Build-DockerImages
    }
    "health" {
        Test-ServiceHealth
    }
    default {
        Write-Host "Usage: .\deploy.ps1 [environment] [command]"
        Write-Host ""
        Write-Host "Commands:"
        Write-Host "  deploy   - Full deployment (default)"
        Write-Host "  start    - Start services"
        Write-Host "  stop     - Stop services"
        Write-Host "  restart  - Restart services"
        Write-Host "  logs     - Show service logs"
        Write-Host "  status   - Show service status"
        Write-Host "  cleanup  - Clean up containers and volumes"
        Write-Host "  build    - Build Docker images"
        Write-Host "  health   - Check service health"
        Write-Host ""
        Write-Host "Environments:"
        Write-Host "  development (default)"
        Write-Host "  production"
        Write-Host "  staging"
        exit 1
    }
} 
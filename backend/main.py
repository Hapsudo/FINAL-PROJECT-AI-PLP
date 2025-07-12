from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import logging
from typing import List, Optional
import json
from datetime import datetime, timedelta

# Import our modules
from app.core.config import settings
from app.core.database import engine, SessionLocal
from app.models import models
from app.schemas import schemas
from app.api.v1.api import api_router
from app.core.security import create_access_token, verify_token
from app.services.ai_service import AIService
from app.services.weather_service import WeatherService
from app.services.market_service import MarketService
from app.services.voice_service import VoiceService

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AGRIWISE AI API",
    description="AI-Powered Agricultural Intelligence Platform for Kenyan Farmers",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize services
ai_service = AIService()
weather_service = WeatherService()
market_service = MarketService()
voice_service = VoiceService()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = verify_token(credentials.credentials)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0",
        "service": "AGRIWISE AI Backend"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to AGRIWISE AI API",
        "description": "AI-Powered Agricultural Intelligence Platform",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# Disease Detection Endpoint
@app.post("/api/v1/disease-detection")
async def detect_disease(
    file: UploadFile = File(...),
    crop_type: str = "maize",
    current_user: str = Depends(get_current_user)
):
    """
    Detect crop diseases using AI
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Process image with AI
        result = await ai_service.detect_disease(file, crop_type)
        
        # Log the detection
        logger.info(f"Disease detection completed for user {current_user}, crop: {crop_type}")
        
        return {
            "success": True,
            "result": result,
            "timestamp": datetime.utcnow()
        }
    
    except Exception as e:
        logger.error(f"Error in disease detection: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing image")

# Weather Forecast Endpoint
@app.get("/api/v1/weather/{location}")
async def get_weather_forecast(
    location: str,
    current_user: str = Depends(get_current_user)
):
    """
    Get weather forecast for a specific location
    """
    try:
        weather_data = await weather_service.get_forecast(location)
        return {
            "success": True,
            "location": location,
            "weather": weather_data,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Error getting weather data: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching weather data")

# Market Prices Endpoint
@app.get("/api/v1/market-prices")
async def get_market_prices(
    crop: Optional[str] = None,
    location: Optional[str] = None,
    current_user: str = Depends(get_current_user)
):
    """
    Get current market prices for crops
    """
    try:
        prices = await market_service.get_prices(crop, location)
        return {
            "success": True,
            "prices": prices,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Error getting market prices: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching market data")

# Voice Assistant Endpoint
@app.post("/api/v1/voice-assistant")
async def process_voice_command(
    audio_file: UploadFile = File(...),
    language: str = "swahili",
    current_user: str = Depends(get_current_user)
):
    """
    Process voice commands in local languages
    """
    try:
        # Validate audio file
        if not audio_file.content_type.startswith("audio/"):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Process voice command
        response = await voice_service.process_voice(audio_file, language)
        
        return {
            "success": True,
            "response": response,
            "language": language,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Error processing voice command: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing voice command")

# Loan Assessment Endpoint
@app.post("/api/v1/loan-assessment")
async def assess_loan_eligibility(
    assessment_data: schemas.LoanAssessmentRequest,
    current_user: str = Depends(get_current_user)
):
    """
    Assess loan eligibility using AI
    """
    try:
        # Process loan assessment
        result = await ai_service.assess_loan(assessment_data)
        
        return {
            "success": True,
            "assessment": result,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Error in loan assessment: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing loan assessment")

# Farming Tips Endpoint
@app.get("/api/v1/farming-tips")
async def get_farming_tips(
    crop_type: Optional[str] = None,
    season: Optional[str] = None,
    current_user: str = Depends(get_current_user)
):
    """
    Get personalized farming tips
    """
    try:
        tips = await ai_service.get_farming_tips(crop_type, season)
        
        return {
            "success": True,
            "tips": tips,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Error getting farming tips: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching farming tips")

# Analytics Endpoint
@app.get("/api/v1/analytics")
async def get_analytics(
    current_user: str = Depends(get_current_user)
):
    """
    Get user analytics and insights
    """
    try:
        analytics = await ai_service.get_user_analytics(current_user)
        
        return {
            "success": True,
            "analytics": analytics,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Error getting analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching analytics")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "timestamp": datetime.utcnow()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "timestamp": datetime.utcnow()
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting AGRIWISE AI Backend...")
    logger.info("Initializing AI services...")
    
    # Initialize AI models
    await ai_service.initialize_models()
    
    logger.info("AGRIWISE AI Backend started successfully!")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down AGRIWISE AI Backend...")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 
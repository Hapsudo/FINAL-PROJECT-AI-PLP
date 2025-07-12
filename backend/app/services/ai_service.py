import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io
import logging
from typing import Dict, List, Optional, Any
import json
import os
from datetime import datetime
import asyncio

# Import transformers for NLP tasks
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.disease_model = None
        self.voice_model = None
        self.sentiment_analyzer = None
        self.text_classifier = None
        self.models_loaded = False
        
        # Disease detection classes for different crops
        self.disease_classes = {
            'maize': [
                'healthy', 'northern_leaf_blight', 'common_rust', 'gray_leaf_spot',
                'southern_leaf_blight', 'bacterial_leaf_streak'
            ],
            'beans': [
                'healthy', 'angular_leaf_spot', 'bean_rust', 'bacterial_blight',
                'anthracnose', 'mosaic_virus'
            ],
            'tomatoes': [
                'healthy', 'early_blight', 'late_blight', 'leaf_mold',
                'septoria_leaf_spot', 'spider_mites', 'target_spot'
            ],
            'potatoes': [
                'healthy', 'early_blight', 'late_blight', 'blackleg',
                'bacterial_wilt', 'virus_y'
            ]
        }
        
        # Treatment recommendations
        self.treatments = {
            'northern_leaf_blight': {
                'description': 'A fungal disease that causes long, elliptical lesions on maize leaves.',
                'treatment': 'Apply fungicides containing azoxystrobin or pyraclostrobin. Remove infected debris.',
                'prevention': 'Plant resistant varieties. Practice crop rotation. Monitor weather conditions.',
                'severity': 'high'
            },
            'common_rust': {
                'description': 'A fungal disease characterized by reddish-brown pustules on leaves.',
                'treatment': 'Apply fungicides with active ingredients like tebuconazole or azoxystrobin.',
                'prevention': 'Plant early. Use resistant varieties. Avoid dense planting.',
                'severity': 'medium'
            },
            'early_blight': {
                'description': 'A fungal disease causing dark brown spots with concentric rings.',
                'treatment': 'Apply copper-based fungicides. Remove infected leaves.',
                'prevention': 'Improve air circulation. Avoid overhead irrigation.',
                'severity': 'medium'
            },
            'late_blight': {
                'description': 'A devastating fungal disease that can destroy entire crops quickly.',
                'treatment': 'Apply fungicides immediately. Remove and destroy infected plants.',
                'prevention': 'Use resistant varieties. Monitor weather forecasts.',
                'severity': 'high'
            }
        }

    async def initialize_models(self):
        """Initialize AI models asynchronously"""
        try:
            logger.info("Initializing AI models...")
            
            # Load disease detection model (simulated for now)
            await self._load_disease_model()
            
            # Load NLP models
            await self._load_nlp_models()
            
            self.models_loaded = True
            logger.info("AI models initialized successfully!")
            
        except Exception as e:
            logger.error(f"Error initializing AI models: {str(e)}")
            raise

    async def _load_disease_model(self):
        """Load the disease detection model"""
        try:
            # In a real implementation, you would load a pre-trained model
            # For now, we'll simulate the model loading
            logger.info("Loading disease detection model...")
            
            # Simulate model loading time
            await asyncio.sleep(2)
            
            # Create a simple CNN model for demonstration
            self.disease_model = self._create_disease_model()
            
            logger.info("Disease detection model loaded successfully!")
            
        except Exception as e:
            logger.error(f"Error loading disease model: {str(e)}")
            raise

    async def _load_nlp_models(self):
        """Load NLP models for text processing"""
        try:
            logger.info("Loading NLP models...")
            
            # Load sentiment analyzer
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest"
            )
            
            # Load text classifier for loan assessment
            self.text_classifier = pipeline(
                "text-classification",
                model="distilbert-base-uncased"
            )
            
            logger.info("NLP models loaded successfully!")
            
        except Exception as e:
            logger.error(f"Error loading NLP models: {str(e)}")
            raise

    def _create_disease_model(self):
        """Create a simple CNN model for disease detection"""
        model = tf.keras.Sequential([
            tf.keras.layers.Conv2D(32, 3, activation='relu', input_shape=(224, 224, 3)),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation='relu'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation='relu'),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(len(self.disease_classes['maize']), activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model

    async def detect_disease(self, image_file, crop_type: str = "maize") -> Dict[str, Any]:
        """
        Detect diseases in crop images using AI
        """
        try:
            if not self.models_loaded:
                raise Exception("AI models not initialized")
            
            # Read and preprocess image
            image_data = await image_file.read()
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image to model input size
            image = image.resize((224, 224))
            
            # Convert to numpy array and normalize
            image_array = np.array(image) / 255.0
            image_array = np.expand_dims(image_array, axis=0)
            
            # Get disease classes for the crop type
            classes = self.disease_classes.get(crop_type, self.disease_classes['maize'])
            
            # Simulate model prediction (in real implementation, use actual model)
            predictions = await self._simulate_disease_prediction(image_array, classes)
            
            # Get the most likely disease
            predicted_class = classes[np.argmax(predictions)]
            confidence = float(np.max(predictions) * 100)
            
            # Get treatment information
            treatment_info = self.treatments.get(predicted_class, {
                'description': 'Disease detected but treatment information not available.',
                'treatment': 'Consult with agricultural extension officer.',
                'prevention': 'Practice good crop management and monitoring.',
                'severity': 'medium'
            })
            
            result = {
                'disease': predicted_class.replace('_', ' ').title(),
                'confidence': round(confidence, 2),
                'description': treatment_info['description'],
                'treatment': treatment_info['treatment'],
                'prevention': treatment_info['prevention'],
                'severity': treatment_info['severity'],
                'crop_type': crop_type,
                'all_predictions': dict(zip(classes, predictions[0].tolist()))
            }
            
            logger.info(f"Disease detection completed: {predicted_class} ({confidence:.2f}%)")
            return result
            
        except Exception as e:
            logger.error(f"Error in disease detection: {str(e)}")
            raise

    async def _simulate_disease_prediction(self, image_array, classes):
        """Simulate disease prediction (replace with actual model inference)"""
        # Simulate processing time
        await asyncio.sleep(1)
        
        # Generate random predictions (in real implementation, use actual model)
        np.random.seed(int(datetime.now().timestamp()))
        predictions = np.random.dirichlet(np.ones(len(classes)))
        
        # Bias towards common diseases
        if 'northern_leaf_blight' in classes:
            blight_idx = classes.index('northern_leaf_blight')
            predictions[blight_idx] *= 2
        
        # Normalize
        predictions = predictions / np.sum(predictions)
        
        return np.expand_dims(predictions, axis=0)

    async def assess_loan(self, assessment_data) -> Dict[str, Any]:
        """
        Assess loan eligibility using AI
        """
        try:
            # Extract features from assessment data
            features = self._extract_loan_features(assessment_data)
            
            # Calculate risk score using AI
            risk_score = await self._calculate_risk_score(features)
            
            # Determine eligibility
            eligibility = risk_score < 0.7  # Threshold for approval
            
            # Calculate recommended loan amount
            recommended_amount = self._calculate_loan_amount(features, risk_score)
            
            result = {
                'eligible': eligibility,
                'risk_score': round(risk_score, 3),
                'recommended_amount': recommended_amount,
                'confidence': round(0.85 + (1 - risk_score) * 0.15, 3),
                'factors': self._get_risk_factors(features),
                'recommendations': self._get_loan_recommendations(features, risk_score)
            }
            
            logger.info(f"Loan assessment completed: Eligible={eligibility}, Risk={risk_score:.3f}")
            return result
            
        except Exception as e:
            logger.error(f"Error in loan assessment: {str(e)}")
            raise

    def _extract_loan_features(self, assessment_data):
        """Extract features for loan assessment"""
        return {
            'farm_size': assessment_data.farm_size,
            'crop_type': assessment_data.crop_type,
            'experience_years': assessment_data.experience_years,
            'previous_loans': assessment_data.previous_loans,
            'credit_score': assessment_data.credit_score,
            'income_level': assessment_data.income_level,
            'location': assessment_data.location
        }

    async def _calculate_risk_score(self, features):
        """Calculate risk score using AI"""
        # Simulate AI risk calculation
        await asyncio.sleep(0.5)
        
        # Simple risk calculation (replace with ML model)
        risk_factors = [
            features['farm_size'] < 2,  # Small farm
            features['experience_years'] < 3,  # Low experience
            features['previous_loans'] > 2,  # Many previous loans
            features['credit_score'] < 600,  # Low credit score
            features['income_level'] == 'low'  # Low income
        ]
        
        risk_score = sum(risk_factors) / len(risk_factors)
        return min(risk_score + np.random.normal(0, 0.1), 1.0)

    def _calculate_loan_amount(self, features, risk_score):
        """Calculate recommended loan amount"""
        base_amount = features['farm_size'] * 50000  # KES per acre
        
        # Adjust based on risk
        if risk_score < 0.3:
            multiplier = 1.5
        elif risk_score < 0.6:
            multiplier = 1.0
        else:
            multiplier = 0.5
        
        return int(base_amount * multiplier)

    def _get_risk_factors(self, features):
        """Get risk factors for the assessment"""
        factors = []
        
        if features['farm_size'] < 2:
            factors.append("Small farm size")
        if features['experience_years'] < 3:
            factors.append("Limited farming experience")
        if features['credit_score'] < 600:
            factors.append("Low credit score")
        if features['income_level'] == 'low':
            factors.append("Low income level")
        
        return factors

    def _get_loan_recommendations(self, features, risk_score):
        """Get recommendations for improving loan eligibility"""
        recommendations = []
        
        if features['experience_years'] < 3:
            recommendations.append("Consider farming training programs")
        if features['credit_score'] < 600:
            recommendations.append("Improve credit history with small loans")
        if features['farm_size'] < 2:
            recommendations.append("Consider expanding farm size gradually")
        
        return recommendations

    async def get_farming_tips(self, crop_type: Optional[str] = None, season: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get personalized farming tips
        """
        try:
            # Simulate AI-generated tips
            await asyncio.sleep(0.5)
            
            tips = [
                {
                    'title': 'Water Conservation',
                    'content': 'Use drip irrigation systems to reduce water wastage by up to 60%.',
                    'category': 'irrigation',
                    'priority': 'high',
                    'applicable_crops': ['maize', 'beans', 'tomatoes']
                },
                {
                    'title': 'Soil Health',
                    'content': 'Practice crop rotation and use organic fertilizers to maintain soil fertility.',
                    'category': 'soil_management',
                    'priority': 'high',
                    'applicable_crops': ['all']
                },
                {
                    'title': 'Pest Management',
                    'content': 'Use integrated pest management techniques to reduce chemical use.',
                    'category': 'pest_control',
                    'priority': 'medium',
                    'applicable_crops': ['tomatoes', 'beans']
                },
                {
                    'title': 'Market Timing',
                    'content': 'Monitor market prices and plan harvest timing for maximum profit.',
                    'category': 'marketing',
                    'priority': 'medium',
                    'applicable_crops': ['all']
                }
            ]
            
            # Filter tips based on crop type
            if crop_type:
                tips = [tip for tip in tips if crop_type in tip['applicable_crops'] or 'all' in tip['applicable_crops']]
            
            return tips
            
        except Exception as e:
            logger.error(f"Error getting farming tips: {str(e)}")
            raise

    async def get_user_analytics(self, user_id: str) -> Dict[str, Any]:
        """
        Get user analytics and insights
        """
        try:
            # Simulate analytics generation
            await asyncio.sleep(0.5)
            
            analytics = {
                'total_detections': 15,
                'diseases_found': ['northern_leaf_blight', 'common_rust'],
                'accuracy_improvement': 0.12,
                'cost_savings': 45000,  # KES
                'yield_improvement': 0.25,  # 25%
                'recommendations': [
                    'Consider planting resistant varieties',
                    'Implement crop rotation',
                    'Monitor weather conditions more closely'
                ],
                'trends': {
                    'disease_incidence': 'decreasing',
                    'yield_trend': 'increasing',
                    'market_prices': 'stable'
                }
            }
            
            return analytics
            
        except Exception as e:
            logger.error(f"Error getting user analytics: {str(e)}")
            raise

    async def process_voice_command(self, audio_file, language: str = "swahili") -> Dict[str, Any]:
        """
        Process voice commands in local languages
        """
        try:
            # Simulate voice processing
            await asyncio.sleep(1)
            
            # Mock response based on language
            responses = {
                'swahili': {
                    'text': 'Umechagua ukaguzi wa magonjwa ya mazao. Tafadhali piga picha ya mmea.',
                    'action': 'disease_detection',
                    'confidence': 0.92
                },
                'english': {
                    'text': 'You selected disease detection. Please take a photo of the plant.',
                    'action': 'disease_detection',
                    'confidence': 0.95
                },
                'kikuyu': {
                    'text': 'Wahitire kugeria magonjwa ma mbembe. Thikira picha ya mbeu.',
                    'action': 'disease_detection',
                    'confidence': 0.88
                }
            }
            
            return responses.get(language, responses['english'])
            
        except Exception as e:
            logger.error(f"Error processing voice command: {str(e)}")
            raise 
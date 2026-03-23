"""
AI Twin of Germany - Backend API
Created by AMAN SINGH KANDARI
A real-time digital twin for societal optimization
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import uvicorn
from datetime import datetime, timedelta
import json

# Import our modules
from data_ingestion.destatis_client import DestatisClient
from data_ingestion.weather_client import WeatherClient
from data_ingestion.mobility_client import MobilityClient
from models.predictor import DemandPredictor
from simulation.digital_twin import DigitalTwin

app = FastAPI(
    title="AI Twin of Germany API",
    description="Real-time digital twin for German societal optimization",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
destatis = DestatisClient()
weather = WeatherClient()
mobility = MobilityClient()
predictor = DemandPredictor()
digital_twin = DigitalTwin()

# Data models
class PredictionRequest(BaseModel):
    city: str
    metric: str  # 'energy', 'healthcare', 'transport', 'housing'
    days: int = 30

class SimulationRequest(BaseModel):
    scenario: str  # 'migration', 'climate', 'economic'
    parameters: Dict[str, Any]
    duration_days: int = 365

class PolicyRecommendation(BaseModel):
    category: str
    action: str
    impact_score: float
    confidence: float
    reasoning: str

# Routes
@app.get("/")
async def root():
    return {
        "message": "AI Twin of Germany API",
        "version": "1.0.0",
        "created_by": "AMAN SINGH KANDARI",
        "status": "operational"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "destatis": "connected",
            "weather": "connected",
            "mobility": "connected",
            "ml_models": "loaded"
        }
    }

# Data endpoints
@app.get("/api/data/population/{city}")
async def get_population_data(city: str):
    """Get population statistics for a city"""
    try:
        data = await destatis.get_population(city)
        return {"city": city, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/data/employment/{city}")
async def get_employment_data(city: str):
    """Get employment statistics for a city"""
    try:
        data = await destatis.get_employment(city)
        return {"city": city, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/data/weather/{city}")
async def get_weather_data(city: str):
    """Get current weather and pollution data"""
    try:
        data = await weather.get_current(city)
        return {"city": city, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/data/transport/{city}")
async def get_transport_data(city: str):
    """Get mobility and transport data"""
    try:
        data = await mobility.get_congestion(city)
        return {"city": city, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ML Prediction endpoints
@app.post("/api/predict")
async def predict_demand(request: PredictionRequest):
    """Predict future demand for various metrics"""
    try:
        prediction = predictor.predict(
            city=request.city,
            metric=request.metric,
            days=request.days
        )
        return {
            "city": request.city,
            "metric": request.metric,
            "prediction": prediction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/predict/energy/{city}")
async def predict_energy(city: str, days: int = 30):
    """Predict energy demand for a city"""
    try:
        prediction = predictor.predict_energy_demand(city, days)
        return {"city": city, "prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/predict/healthcare/{city}")
async def predict_healthcare(city: str, days: int = 30):
    """Predict healthcare demand for a city"""
    try:
        prediction = predictor.predict_healthcare_demand(city, days)
        return {"city": city, "prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/predict/congestion/{city}")
async def predict_congestion(city: str, days: int = 30):
    """Predict traffic congestion for a city"""
    try:
        prediction = predictor.predict_congestion(city, days)
        return {"city": city, "prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Digital Twin Simulation endpoints
@app.post("/api/simulate")
async def run_simulation(request: SimulationRequest):
    """Run a digital twin simulation"""
    try:
        result = digital_twin.simulate(
            scenario=request.scenario,
            parameters=request.parameters,
            duration=request.duration_days
        )
        return {
            "scenario": request.scenario,
            "duration": request.duration_days,
            "results": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/simulate/migration/{city}")
async def simulate_migration(city: str, incoming_population: int):
    """Simulate migration impact on a city"""
    try:
        result = digital_twin.simulate_migration(city, incoming_population)
        return {"city": city, "simulation": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/simulate/climate/{city}")
async def simulate_climate_impact(city: str, temperature_rise: float):
    """Simulate climate change impact on a city"""
    try:
        result = digital_twin.simulate_climate_impact(city, temperature_rise)
        return {"city": city, "simulation": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Policy recommendations
@app.get("/api/recommendations/{city}")
async def get_recommendations(city: str):
    """Get AI-powered policy recommendations for a city"""
    try:
        recommendations = digital_twin.get_policy_recommendations(city)
        return {"city": city, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Alerts and monitoring
@app.get("/api/alerts")
async def get_alerts():
    """Get current system alerts and warnings"""
    try:
        alerts = digital_twin.get_active_alerts()
        return {"alerts": alerts, "count": len(alerts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Dashboard data
@app.get("/api/dashboard/overview")
async def get_dashboard_overview():
    """Get overview data for the main dashboard"""
    try:
        overview = {
            "timestamp": datetime.now().isoformat(),
            "cities_monitored": 16,
            "data_sources": 5,
            "active_predictions": 48,
            "last_update": datetime.now().isoformat(),
            "system_status": "operational"
        }
        return overview
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/cities")
async def get_cities():
    """Get list of monitored cities with status"""
    cities = [
        {"name": "Berlin", "population": 3669495, "status": "active", "risk_level": "medium"},
        {"name": "Munich", "population": 1488202, "status": "active", "risk_level": "low"},
        {"name": "Hamburg", "population": 1847253, "status": "active", "risk_level": "medium"},
        {"name": "Cologne", "population": 1087863, "status": "active", "risk_level": "low"},
        {"name": "Frankfurt", "population": 764104, "status": "active", "risk_level": "medium"},
        {"name": "Stuttgart", "population": 635911, "status": "active", "risk_level": "low"},
        {"name": "Dusseldorf", "population": 629047, "status": "active", "risk_level": "low"},
        {"name": "Leipzig", "population": 601866, "status": "active", "risk_level": "medium"},
    ]
    return {"cities": cities}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

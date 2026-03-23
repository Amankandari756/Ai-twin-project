"""
Weather and Environmental Data Client
Handles pollution, climate, and weather data from Umweltbundesamt
"""

import asyncio
import aiohttp
import random
from datetime import datetime, timedelta
from typing import Dict, List

class WeatherClient:
    """Client for fetching weather and environmental data"""
    
    def __init__(self):
        self.session = None
        
    async def _get_session(self):
        if self.session is None:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def get_current(self, city: str) -> Dict:
        """Get current weather and pollution data"""
        # Simulated data - in production, would call actual APIs
        base_data = {
            "Berlin": {"temp": 15, "humidity": 65, "aqi": 45},
            "Munich": {"temp": 12, "humidity": 70, "aqi": 35},
            "Hamburg": {"temp": 14, "humidity": 75, "aqi": 40},
            "Cologne": {"temp": 16, "humidity": 68, "aqi": 50},
            "Frankfurt": {"temp": 17, "humidity": 62, "aqi": 48},
            "Stuttgart": {"temp": 18, "humidity": 60, "aqi": 55},
            "Dusseldorf": {"temp": 15, "humidity": 67, "aqi": 42},
            "Leipzig": {"temp": 14, "humidity": 72, "aqi": 38}
        }
        
        base = base_data.get(city, {"temp": 15, "humidity": 65, "aqi": 45})
        
        # Add some randomness to simulate real-time updates
        temp_variation = random.uniform(-2, 2)
        aqi_variation = random.uniform(-5, 5)
        
        return {
            "city": city,
            "temperature_c": round(base["temp"] + temp_variation, 1),
            "humidity_percent": base["humidity"],
            "air_quality_index": max(0, round(base["aqi"] + aqi_variation)),
            "pm25": round(random.uniform(8, 25), 1),
            "pm10": round(random.uniform(15, 40), 1),
            "no2": round(random.uniform(20, 50), 1),
            "o3": round(random.uniform(30, 70), 1),
            "weather_condition": random.choice(["sunny", "cloudy", "rainy", "partly_cloudy"]),
            "wind_speed_kmh": round(random.uniform(5, 25), 1),
            "timestamp": datetime.now().isoformat()
        }
    
    async def get_pollution_history(self, city: str, days: int = 30) -> List[Dict]:
        """Get historical pollution data"""
        history = []
        base_aqi = {"Berlin": 45, "Munich": 35, "Hamburg": 40, "Cologne": 50,
                   "Frankfurt": 48, "Stuttgart": 55, "Dusseldorf": 42, "Leipzig": 38}.get(city, 45)
        
        for i in range(days):
            date = datetime.now() - timedelta(days=i)
            history.append({
                "date": date.strftime("%Y-%m-%d"),
                "aqi": max(0, round(base_aqi + random.uniform(-15, 15))),
                "pm25": round(random.uniform(5, 30), 1),
                "pm10": round(random.uniform(10, 50), 1)
            })
        
        return list(reversed(history))
    
    async def get_climate_risk(self, city: str) -> Dict:
        """Get climate risk assessment for a city"""
        risk_data = {
            "Berlin": {"flood_risk": "medium", "drought_risk": "low", "heatwave_risk": "medium"},
            "Munich": {"flood_risk": "high", "drought_risk": "low", "heatwave_risk": "medium"},
            "Hamburg": {"flood_risk": "high", "drought_risk": "low", "heatwave_risk": "low"},
            "Cologne": {"flood_risk": "medium", "drought_risk": "low", "heatwave_risk": "medium"},
            "Frankfurt": {"flood_risk": "medium", "drought_risk": "medium", "heatwave_risk": "medium"},
            "Stuttgart": {"flood_risk": "low", "drought_risk": "medium", "heatwave_risk": "high"},
            "Dusseldorf": {"flood_risk": "medium", "drought_risk": "low", "heatwave_risk": "medium"},
            "Leipzig": {"flood_risk": "low", "drought_risk": "medium", "heatwave_risk": "medium"}
        }
        
        return {
            "city": city,
            "risks": risk_data.get(city, {"flood_risk": "low", "drought_risk": "low", "heatwave_risk": "low"}),
            "last_assessment": datetime.now().isoformat()
        }
    
    async def close(self):
        if self.session:
            await self.session.close()

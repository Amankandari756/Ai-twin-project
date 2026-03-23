"""
Destatis (German Federal Statistical Office) Data Client
Handles population, employment, and economic data
"""

import asyncio
import aiohttp
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import json

class DestatisClient:
    """Client for fetching data from Destatis API"""
    
    BASE_URL = "https://www-genesis.destatis.de/genesisWS/rest/2020"
    
    def __init__(self):
        self.session = None
        self.cache = {}
        self.cache_timeout = 3600  # 1 hour
        
    async def _get_session(self):
        if self.session is None:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def get_population(self, city: str) -> Dict:
        """Get population statistics for a city"""
        # Simulated data - in production, this would call actual Destatis API
        population_data = {
            "Berlin": {
                "total": 3669495,
                "growth_rate": 0.002,
                "age_distribution": {
                    "0-18": 16.5,
                    "18-65": 64.2,
                    "65+": 19.3
                },
                "density": 4227,
                "foreign_population_percent": 20.1,
                "last_updated": datetime.now().isoformat()
            },
            "Munich": {
                "total": 1488202,
                "growth_rate": 0.012,
                "age_distribution": {
                    "0-18": 14.8,
                    "18-65": 68.5,
                    "65+": 16.7
                },
                "density": 4700,
                "foreign_population_percent": 27.3,
                "last_updated": datetime.now().isoformat()
            },
            "Hamburg": {
                "total": 1847253,
                "growth_rate": 0.005,
                "age_distribution": {
                    "0-18": 15.2,
                    "18-65": 65.8,
                    "65+": 19.0
                },
                "density": 2437,
                "foreign_population_percent": 17.8,
                "last_updated": datetime.now().isoformat()
            },
            "Cologne": {
                "total": 1087863,
                "growth_rate": 0.008,
                "age_distribution": {
                    "0-18": 15.5,
                    "18-65": 65.1,
                    "65+": 19.4
                },
                "density": 2700,
                "foreign_population_percent": 19.2,
                "last_updated": datetime.now().isoformat()
            },
            "Frankfurt": {
                "total": 764104,
                "growth_rate": 0.015,
                "age_distribution": {
                    "0-18": 14.5,
                    "18-65": 69.2,
                    "65+": 16.3
                },
                "density": 3000,
                "foreign_population_percent": 31.2,
                "last_updated": datetime.now().isoformat()
            },
            "Stuttgart": {
                "total": 635911,
                "growth_rate": 0.006,
                "age_distribution": {
                    "0-18": 15.8,
                    "18-65": 64.5,
                    "65+": 19.7
                },
                "density": 3100,
                "foreign_population_percent": 24.5,
                "last_updated": datetime.now().isoformat()
            },
            "Dusseldorf": {
                "total": 629047,
                "growth_rate": 0.004,
                "age_distribution": {
                    "0-18": 15.0,
                    "18-65": 65.5,
                    "65+": 19.5
                },
                "density": 2800,
                "foreign_population_percent": 22.8,
                "last_updated": datetime.now().isoformat()
            },
            "Leipzig": {
                "total": 601866,
                "growth_rate": 0.018,
                "age_distribution": {
                    "0-18": 15.3,
                    "18-65": 64.8,
                    "65+": 19.9
                },
                "density": 1900,
                "foreign_population_percent": 12.5,
                "last_updated": datetime.now().isoformat()
            }
        }
        
        # Default data for unknown cities
        default_data = {
            "total": 500000,
            "growth_rate": 0.005,
            "age_distribution": {
                "0-18": 15.0,
                "18-65": 65.0,
                "65+": 20.0
            },
            "density": 2500,
            "foreign_population_percent": 15.0,
            "last_updated": datetime.now().isoformat()
        }
        
        return population_data.get(city, default_data)
    
    async def get_employment(self, city: str) -> Dict:
        """Get employment statistics for a city"""
        employment_data = {
            "Berlin": {
                "unemployment_rate": 8.2,
                "workforce_total": 1850000,
                "sectors": {
                    "services": 78.5,
                    "industry": 16.2,
                    "agriculture": 0.3,
                    "other": 5.0
                },
                "avg_salary": 42000,
                "job_openings": 45000,
                "last_updated": datetime.now().isoformat()
            },
            "Munich": {
                "unemployment_rate": 3.8,
                "workforce_total": 950000,
                "sectors": {
                    "services": 72.0,
                    "industry": 26.5,
                    "agriculture": 0.2,
                    "other": 1.3
                },
                "avg_salary": 58000,
                "job_openings": 38000,
                "last_updated": datetime.now().isoformat()
            },
            "Hamburg": {
                "unemployment_rate": 6.5,
                "workforce_total": 920000,
                "sectors": {
                    "services": 82.0,
                    "industry": 15.0,
                    "agriculture": 0.1,
                    "other": 2.9
                },
                "avg_salary": 48000,
                "job_openings": 32000,
                "last_updated": datetime.now().isoformat()
            },
            "Cologne": {
                "unemployment_rate": 7.8,
                "workforce_total": 550000,
                "sectors": {
                    "services": 80.5,
                    "industry": 17.0,
                    "agriculture": 0.2,
                    "other": 2.3
                },
                "avg_salary": 45000,
                "job_openings": 18000,
                "last_updated": datetime.now().isoformat()
            },
            "Frankfurt": {
                "unemployment_rate": 5.2,
                "workforce_total": 420000,
                "sectors": {
                    "services": 85.0,
                    "industry": 12.5,
                    "agriculture": 0.1,
                    "other": 2.4
                },
                "avg_salary": 62000,
                "job_openings": 22000,
                "last_updated": datetime.now().isoformat()
            },
            "Stuttgart": {
                "unemployment_rate": 4.5,
                "workforce_total": 350000,
                "sectors": {
                    "services": 68.0,
                    "industry": 30.5,
                    "agriculture": 0.2,
                    "other": 1.3
                },
                "avg_salary": 55000,
                "job_openings": 15000,
                "last_updated": datetime.now().isoformat()
            },
            "Dusseldorf": {
                "unemployment_rate": 6.8,
                "workforce_total": 340000,
                "sectors": {
                    "services": 83.0,
                    "industry": 14.5,
                    "agriculture": 0.1,
                    "other": 2.4
                },
                "avg_salary": 50000,
                "job_openings": 14000,
                "last_updated": datetime.now().isoformat()
            },
            "Leipzig": {
                "unemployment_rate": 7.5,
                "workforce_total": 310000,
                "sectors": {
                    "services": 75.0,
                    "industry": 22.5,
                    "agriculture": 0.3,
                    "other": 2.2
                },
                "avg_salary": 40000,
                "job_openings": 12000,
                "last_updated": datetime.now().isoformat()
            }
        }
        
        default_data = {
            "unemployment_rate": 6.0,
            "workforce_total": 300000,
            "sectors": {
                "services": 75.0,
                "industry": 22.0,
                "agriculture": 0.5,
                "other": 2.5
            },
            "avg_salary": 43000,
            "job_openings": 10000,
            "last_updated": datetime.now().isoformat()
        }
        
        return employment_data.get(city, default_data)
    
    async def get_housing_data(self, city: str) -> Dict:
        """Get housing market data for a city"""
        housing_data = {
            "Berlin": {
                "avg_rent_per_sqm": 12.5,
                "vacancy_rate": 0.8,
                "new_constructions": 18500,
                "housing_pressure_index": 8.5,
                "avg_wait_time_months": 8
            },
            "Munich": {
                "avg_rent_per_sqm": 18.5,
                "vacancy_rate": 0.4,
                "new_constructions": 8200,
                "housing_pressure_index": 9.8,
                "avg_wait_time_months": 12
            },
            "Hamburg": {
                "avg_rent_per_sqm": 13.0,
                "vacancy_rate": 1.2,
                "new_constructions": 11200,
                "housing_pressure_index": 7.2,
                "avg_wait_time_months": 6
            },
            "Frankfurt": {
                "avg_rent_per_sqm": 15.0,
                "vacancy_rate": 0.9,
                "new_constructions": 6500,
                "housing_pressure_index": 8.8,
                "avg_wait_time_months": 9
            }
        }
        
        default_data = {
            "avg_rent_per_sqm": 10.0,
            "vacancy_rate": 2.0,
            "new_constructions": 3000,
            "housing_pressure_index": 5.0,
            "avg_wait_time_months": 4
        }
        
        return housing_data.get(city, default_data)
    
    async def close(self):
        if self.session:
            await self.session.close()

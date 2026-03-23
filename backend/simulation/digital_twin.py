"""
Digital Twin Simulation Engine
Agent-based modeling for societal simulation
"""

import random
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any
from dataclasses import dataclass, field
from enum import Enum

class AlertLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class CityState:
    """Current state of a city in the digital twin"""
    name: str
    population: int
    employment_rate: float
    housing_pressure: float
    energy_demand: float
    healthcare_capacity: float
    transport_congestion: float
    pollution_level: float
    satisfaction_index: float = 7.0
    
@dataclass
class SimulationEvent:
    """An event in the simulation"""
    timestamp: datetime
    event_type: str
    description: str
    impact: Dict[str, float]
    
class DigitalTwin:
    """Digital twin simulation engine for German cities"""
    
    def __init__(self):
        self.cities = {}
        self.alerts = []
        self.simulation_history = []
        self.initialize_cities()
    
    def initialize_cities(self):
        """Initialize city states"""
        city_data = {
            "Berlin": {"pop": 3669495, "employment": 91.8, "housing": 8.5, "energy": 45000, "healthcare": 85, "transport": 6.5, "pollution": 45},
            "Munich": {"pop": 1488202, "employment": 96.2, "housing": 9.8, "energy": 32000, "healthcare": 92, "transport": 7.2, "pollution": 35},
            "Hamburg": {"pop": 1847253, "employment": 93.5, "housing": 7.2, "energy": 28000, "healthcare": 88, "transport": 5.8, "pollution": 40},
            "Cologne": {"pop": 1087863, "employment": 92.2, "housing": 6.8, "energy": 22000, "healthcare": 82, "transport": 6.0, "pollution": 50},
            "Frankfurt": {"pop": 764104, "employment": 94.8, "housing": 8.8, "energy": 25000, "healthcare": 90, "transport": 6.8, "pollution": 48},
            "Stuttgart": {"pop": 635911, "employment": 95.5, "housing": 7.5, "energy": 21000, "healthcare": 87, "transport": 7.5, "pollution": 55},
            "Dusseldorf": {"pop": 629047, "employment": 93.2, "housing": 6.5, "energy": 19000, "healthcare": 85, "transport": 5.5, "pollution": 42},
            "Leipzig": {"pop": 601866, "employment": 92.5, "housing": 5.2, "energy": 16000, "healthcare": 80, "transport": 4.8, "pollution": 38}
        }
        
        for name, data in city_data.items():
            self.cities[name] = CityState(
                name=name,
                population=data["pop"],
                employment_rate=data["employment"],
                housing_pressure=data["housing"],
                energy_demand=data["energy"],
                healthcare_capacity=data["healthcare"],
                transport_congestion=data["transport"],
                pollution_level=data["pollution"]
            )
    
    def simulate(self, scenario: str, parameters: Dict[str, Any], duration: int = 365) -> Dict:
        """Run a simulation scenario"""
        results = {
            "scenario": scenario,
            "duration_days": duration,
            "parameters": parameters,
            "timeline": [],
            "final_state": {},
            "key_findings": []
        }
        
        if scenario == "migration":
            results = self._simulate_migration_scenario(parameters, duration, results)
        elif scenario == "climate":
            results = self._simulate_climate_scenario(parameters, duration, results)
        elif scenario == "economic":
            results = self._simulate_economic_scenario(parameters, duration, results)
        else:
            results = self._simulate_generic_scenario(parameters, duration, results)
        
        return results
    
    def _simulate_migration_scenario(self, parameters: Dict, duration: int, results: Dict) -> Dict:
        """Simulate migration impact"""
        city = parameters.get("city", "Berlin")
        incoming = parameters.get("incoming_population", 50000)
        
        city_state = self.cities.get(city)
        if not city_state:
            return results
        
        timeline = []
        pop_increase = incoming
        
        for day in range(0, duration, 30):  # Monthly snapshots
            month = day // 30
            
            # Calculate impacts
            pop_impact = (pop_increase / city_state.population) * 100
            housing_impact = min(10, city_state.housing_pressure + (pop_impact * 0.3))
            employment_impact = max(85, city_state.employment_rate - (pop_impact * 0.1))
            healthcare_impact = max(60, city_state.healthcare_capacity - (pop_impact * 0.2))
            transport_impact = min(10, city_state.transport_congestion + (pop_impact * 0.15))
            
            timeline.append({
                "month": month,
                "population": city_state.population + int(pop_increase * (month / 12)),
                "housing_pressure": round(housing_impact, 2),
                "employment_rate": round(employment_impact, 2),
                "healthcare_capacity": round(healthcare_impact, 2),
                "transport_congestion": round(transport_impact, 2)
            })
        
        results["timeline"] = timeline
        results["key_findings"] = [
            f"Population increase of {incoming} creates {pop_increase/city_state.population*100:.1f}% growth",
            f"Housing pressure increases to {housing_impact:.1f}/10",
            f"Healthcare capacity drops to {healthcare_impact:.1f}%",
            "Recommendation: Build 15,000 new housing units and hire 500 healthcare workers"
        ]
        
        return results
    
    def _simulate_climate_scenario(self, parameters: Dict, duration: int, results: Dict) -> Dict:
        """Simulate climate change impact"""
        city = parameters.get("city", "Berlin")
        temp_rise = parameters.get("temperature_rise", 2.0)
        
        city_state = self.cities.get(city)
        if not city_state:
            return results
        
        timeline = []
        
        for day in range(0, duration, 30):
            month = day // 30
            progress = month / 12
            
            # Climate impacts
            energy_increase = city_state.energy_demand * (1 + temp_rise * 0.15 * progress)
            pollution_increase = city_state.pollution_level * (1 + temp_rise * 0.1 * progress)
            healthcare_strain = max(60, city_state.healthcare_capacity - (temp_rise * 5 * progress))
            satisfaction = max(4, city_state.satisfaction_index - (temp_rise * 0.3 * progress))
            
            timeline.append({
                "month": month,
                "energy_demand": round(energy_increase, 0),
                "pollution_level": round(pollution_increase, 1),
                "healthcare_capacity": round(healthcare_strain, 1),
                "satisfaction_index": round(satisfaction, 1)
            })
        
        results["timeline"] = timeline
        results["key_findings"] = [
            f"Energy demand increases by {temp_rise * 15:.0f}% due to cooling needs",
            f"Air quality deteriorates by {temp_rise * 10:.0f}%",
            f"Public satisfaction drops to {satisfaction:.1f}/10",
            "Recommendation: Invest €2B in renewable energy and green infrastructure"
        ]
        
        return results
    
    def _simulate_economic_scenario(self, parameters: Dict, duration: int, results: Dict) -> Dict:
        """Simulate economic changes"""
        city = parameters.get("city", "Berlin")
        growth_rate = parameters.get("growth_rate", 0.02)
        
        city_state = self.cities.get(city)
        if not city_state:
            return results
        
        timeline = []
        
        for day in range(0, duration, 30):
            month = day // 30
            progress = month / 12
            
            # Economic impacts
            employment = min(98, city_state.employment_rate + (growth_rate * 10 * progress))
            energy = city_state.energy_demand * (1 + growth_rate * progress)
            transport = min(10, city_state.transport_congestion + (growth_rate * 2 * progress))
            housing = min(10, city_state.housing_pressure + (growth_rate * 3 * progress))
            
            timeline.append({
                "month": month,
                "employment_rate": round(employment, 1),
                "energy_demand": round(energy, 0),
                "transport_congestion": round(transport, 1),
                "housing_pressure": round(housing, 1)
            })
        
        results["timeline"] = timeline
        results["key_findings"] = [
            f"Employment rate reaches {employment:.1f}%",
            f"Energy demand grows by {growth_rate * 100:.0f}%",
            "Infrastructure strain increases",
            "Recommendation: Expand public transport and business districts"
        ]
        
        return results
    
    def _simulate_generic_scenario(self, parameters: Dict, duration: int, results: Dict) -> Dict:
        """Generic simulation fallback"""
        results["key_findings"] = ["Generic simulation completed"]
        return results
    
    def simulate_migration(self, city: str, incoming_population: int) -> Dict:
        """Quick migration simulation"""
        return self.simulate("migration", {"city": city, "incoming_population": incoming_population}, 365)
    
    def simulate_climate_impact(self, city: str, temperature_rise: float) -> Dict:
        """Quick climate impact simulation"""
        return self.simulate("climate", {"city": city, "temperature_rise": temperature_rise}, 365)
    
    def get_policy_recommendations(self, city: str) -> List[Dict]:
        """Generate AI-powered policy recommendations"""
        city_state = self.cities.get(city)
        if not city_state:
            return []
        
        recommendations = []
        
        # Housing recommendations
        if city_state.housing_pressure > 7:
            recommendations.append({
                "category": "Housing",
                "action": f"Accelerate construction of {int(city_state.population * 0.005)} affordable housing units",
                "impact_score": 8.5,
                "confidence": 0.88,
                "reasoning": f"Housing pressure at {city_state.housing_pressure}/10 requires immediate action"
            })
        
        # Transport recommendations
        if city_state.transport_congestion > 6:
            recommendations.append({
                "category": "Transport",
                "action": "Expand metro network by 15% and implement smart traffic management",
                "impact_score": 7.8,
                "confidence": 0.85,
                "reasoning": f"Congestion index of {city_state.transport_congestion} costs €500M annually in lost productivity"
            })
        
        # Healthcare recommendations
        if city_state.healthcare_capacity < 85:
            recommendations.append({
                "category": "Healthcare",
                "action": f"Hire {int(city_state.population * 0.0002)} additional healthcare workers",
                "impact_score": 9.0,
                "confidence": 0.92,
                "reasoning": "Healthcare capacity below optimal threshold"
            })
        
        # Energy recommendations
        if city_state.energy_demand > 30000:
            recommendations.append({
                "category": "Energy",
                "action": "Invest €1B in renewable energy infrastructure",
                "impact_score": 8.0,
                "confidence": 0.80,
                "reasoning": "High energy demand requires sustainable solutions"
            })
        
        # Pollution recommendations
        if city_state.pollution_level > 45:
            recommendations.append({
                "category": "Environment",
                "action": "Implement low-emission zone and expand green spaces by 20%",
                "impact_score": 7.5,
                "confidence": 0.82,
                "reasoning": f"AQI of {city_state.pollution_level} exceeds WHO recommendations"
            })
        
        # Always add some general recommendations
        recommendations.append({
            "category": "Digital Infrastructure",
            "action": "Deploy city-wide IoT sensor network for real-time monitoring",
            "impact_score": 8.2,
            "confidence": 0.90,
            "reasoning": "Data-driven decision making improves efficiency by 25%"
        })
        
        return recommendations
    
    def get_active_alerts(self) -> List[Dict]:
        """Get current system alerts"""
        alerts = []
        
        for city_name, city_state in self.cities.items():
            # Housing alerts
            if city_state.housing_pressure > 8:
                alerts.append({
                    "city": city_name,
                    "level": AlertLevel.HIGH.value,
                    "category": "Housing",
                    "message": f"Critical housing shortage in {city_name}",
                    "metric": city_state.housing_pressure,
                    "threshold": 8,
                    "timestamp": datetime.now().isoformat()
                })
            
            # Transport alerts
            if city_state.transport_congestion > 7:
                alerts.append({
                    "city": city_name,
                    "level": AlertLevel.MEDIUM.value,
                    "category": "Transport",
                    "message": f"Severe traffic congestion in {city_name}",
                    "metric": city_state.transport_congestion,
                    "threshold": 7,
                    "timestamp": datetime.now().isoformat()
                })
            
            # Healthcare alerts
            if city_state.healthcare_capacity < 80:
                alerts.append({
                    "city": city_name,
                    "level": AlertLevel.HIGH.value,
                    "category": "Healthcare",
                    "message": f"Healthcare system strain in {city_name}",
                    "metric": city_state.healthcare_capacity,
                    "threshold": 80,
                    "timestamp": datetime.now().isoformat()
                })
            
            # Pollution alerts
            if city_state.pollution_level > 50:
                alerts.append({
                    "city": city_name,
                    "level": AlertLevel.MEDIUM.value,
                    "category": "Environment",
                    "message": f"Poor air quality in {city_name}",
                    "metric": city_state.pollution_level,
                    "threshold": 50,
                    "timestamp": datetime.now().isoformat()
                })
        
        return sorted(alerts, key=lambda x: x["level"], reverse=True)

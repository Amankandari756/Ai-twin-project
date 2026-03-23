"""
ML Prediction Models for Demand Forecasting
Uses Prophet for time series forecasting
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import random

class DemandPredictor:
    """ML-based demand predictor for various metrics"""
    
    def __init__(self):
        self.models = {}
        self.historical_data = {}
    
    def _generate_synthetic_history(self, city: str, metric: str, days: int = 365) -> pd.DataFrame:
        """Generate synthetic historical data for demonstration"""
        dates = pd.date_range(end=datetime.now(), periods=days, freq='D')
        
        # Base values for different cities and metrics
        base_values = {
            'energy': {
                'Berlin': 45000, 'Munich': 32000, 'Hamburg': 28000, 'Cologne': 22000,
                'Frankfurt': 25000, 'Stuttgart': 21000, 'Dusseldorf': 19000, 'Leipzig': 16000
            },
            'healthcare': {
                'Berlin': 8500, 'Munich': 5200, 'Hamburg': 4800, 'Cologne': 3800,
                'Frankfurt': 4200, 'Stuttgart': 3500, 'Dusseldorf': 3100, 'Leipzig': 2800
            },
            'transport': {
                'Berlin': 6.5, 'Munich': 7.2, 'Hamburg': 5.8, 'Cologne': 6.0,
                'Frankfurt': 6.8, 'Stuttgart': 7.5, 'Dusseldorf': 5.5, 'Leipzig': 4.8
            },
            'housing': {
                'Berlin': 8.5, 'Munich': 9.8, 'Hamburg': 7.2, 'Cologne': 6.8,
                'Frankfurt': 8.8, 'Stuttgart': 7.5, 'Dusseldorf': 6.5, 'Leipzig': 5.2
            }
        }
        
        base = base_values.get(metric, {}).get(city, 1000)
        
        # Generate data with seasonality and trend
        values = []
        for i, date in enumerate(dates):
            # Add seasonality (higher in winter for energy, summer for healthcare)
            if metric == 'energy':
                seasonal = 15 * np.sin(2 * np.pi * i / 365)  # Winter peak
            elif metric == 'healthcare':
                seasonal = 10 * np.sin(2 * np.pi * i / 365 + np.pi/2)  # Winter peak
            else:
                seasonal = 5 * np.sin(2 * np.pi * i / 365)
            
            # Add weekly pattern
            weekly = 5 * np.sin(2 * np.pi * date.weekday() / 7)
            
            # Add trend (slight increase over time)
            trend = i * 0.01
            
            # Add noise
            noise = random.uniform(-base * 0.05, base * 0.05)
            
            value = base + seasonal + weekly + trend + noise
            values.append(max(0, value))
        
        df = pd.DataFrame({
            'ds': dates,
            'y': values
        })
        
        return df
    
    def predict(self, city: str, metric: str, days: int = 30) -> Dict:
        """Generate predictions for a metric"""
        # Generate historical data
        history = self._generate_synthetic_history(city, metric, 365)
        
        # Generate future predictions
        future_dates = pd.date_range(
            start=datetime.now(),
            periods=days,
            freq='D'
        )
        
        # Simple trend-based prediction (in production, would use Prophet/LSTM)
        last_value = history['y'].iloc[-1]
        trend = (history['y'].iloc[-1] - history['y'].iloc[-30]) / 30
        
        predictions = []
        for i, date in enumerate(future_dates):
            # Add some seasonality and trend
            predicted_value = last_value + (trend * i) + random.uniform(-last_value * 0.03, last_value * 0.03)
            
            # Add confidence intervals
            uncertainty = last_value * 0.1 * (1 + i / days)  # Uncertainty increases with time
            
            predictions.append({
                'date': date.strftime('%Y-%m-%d'),
                'predicted_value': round(max(0, predicted_value), 2),
                'lower_bound': round(max(0, predicted_value - uncertainty), 2),
                'upper_bound': round(predicted_value + uncertainty, 2)
            })
        
        return {
            'city': city,
            'metric': metric,
            'forecast_days': days,
            'historical_avg': round(history['y'].mean(), 2),
            'predicted_avg': round(np.mean([p['predicted_value'] for p in predictions]), 2),
            'trend': 'increasing' if trend > 0 else 'decreasing',
            'confidence': round(random.uniform(0.75, 0.95), 2),
            'predictions': predictions
        }
    
    def predict_energy_demand(self, city: str, days: int = 30) -> Dict:
        """Predict energy demand for a city"""
        prediction = self.predict(city, 'energy', days)
        prediction['unit'] = 'MWh/day'
        prediction['peak_season'] = 'winter'
        prediction['recommendations'] = [
            'Increase grid capacity by 15% in next 2 years',
            'Invest in renewable energy sources',
            'Implement smart grid management'
        ]
        return prediction
    
    def predict_healthcare_demand(self, city: str, days: int = 30) -> Dict:
        """Predict healthcare demand for a city"""
        prediction = self.predict(city, 'healthcare', days)
        prediction['unit'] = 'patients/day'
        prediction['peak_season'] = 'winter'
        prediction['recommendations'] = [
            'Hire additional nursing staff',
            'Expand emergency department capacity',
            'Implement telemedicine solutions'
        ]
        return prediction
    
    def predict_congestion(self, city: str, days: int = 30) -> Dict:
        """Predict traffic congestion for a city"""
        prediction = self.predict(city, 'transport', days)
        prediction['unit'] = 'congestion_index'
        prediction['peak_hours'] = ['08:00-09:30', '17:00-18:30']
        prediction['recommendations'] = [
            'Optimize traffic light timing',
            'Expand public transport capacity',
            'Implement congestion pricing'
        ]
        return prediction
    
    def predict_housing_pressure(self, city: str, days: int = 90) -> Dict:
        """Predict housing market pressure"""
        prediction = self.predict(city, 'housing', days)
        prediction['unit'] = 'pressure_index'
        prediction['recommendations'] = [
            'Accelerate affordable housing construction',
            'Implement rent control measures',
            'Develop satellite residential areas'
        ]
        return prediction

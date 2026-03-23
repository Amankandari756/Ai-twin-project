// API Service for AI Twin of Germany
// Created by AMAN SINGH KANDARI

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-twin-project.onrender.com';

export interface City {
  name: string;
  population: number;
  status: string;
  risk_level: string;
}

export interface PredictionData {
  date: string;
  predicted_value: number;
  lower_bound?: number;
  upper_bound?: number;
}

export interface Alert {
  city: string;
  level: string;
  category: string;
  message: string;
  metric: number;
  threshold: number;
  timestamp: string;
}

export interface SimulationResult {
  scenario: string;
  duration_days: number;
  timeline: Array<{
    month: number;
    [key: string]: number;
  }>;
  key_findings: string[];
}

class ApiService {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<any> {
    return this.fetch('/api/health');
  }

  async getDashboardOverview(): Promise<any> {
    return this.fetch('/api/dashboard/overview');
  }

  async getCities(): Promise<{ cities: City[] }> {
    return this.fetch('/api/dashboard/cities');
  }

  async getPopulationData(city: string): Promise<any> {
    return this.fetch(`/api/data/population/${city}`);
  }

  async predictEnergy(city: string, days: number = 30): Promise<{ prediction: { predictions: PredictionData[] } }> {
    return this.fetch(`/api/predict/energy/${city}?days=${days}`);
  }

  async predictHealthcare(city: string, days: number = 30): Promise<{ prediction: { predictions: PredictionData[] } }> {
    return this.fetch(`/api/predict/healthcare/${city}?days=${days}`);
  }

  async predictCongestion(city: string, days: number = 30): Promise<{ prediction: { predictions: PredictionData[] } }> {
    return this.fetch(`/api/predict/congestion/${city}?days=${days}`);
  }

  async simulateMigration(city: string, incomingPopulation: number): Promise<SimulationResult> {
    return this.fetch(`/api/simulate/migration/${city}?incoming_population=${incomingPopulation}`);
  }

  async simulateClimate(city: string, temperatureRise: number): Promise<SimulationResult> {
    return this.fetch(`/api/simulate/climate/${city}?temperature_rise=${temperatureRise}`);
  }

  async getAlerts(): Promise<{ alerts: Alert[] }> {
    return this.fetch('/api/alerts');
  }
}

export const api = new ApiService();
export default api;

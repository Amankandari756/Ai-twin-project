import { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Users, 
  Car, 
  Wind,
  Brain,
  Map as MapIcon,
  BarChart3,
  Settings,
  Github,
  Linkedin,
  Mail,
  ChevronRight,
  Activity,
  Building2,
  Lightbulb,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import GermanyMap3D from './components/3d/GermanyMap3D';
import MetricCard from './components/dashboard/MetricCard';
import PredictionChart from './components/dashboard/PredictionChart';
import SimulationPanel from './components/dashboard/SimulationPanel';
import api from './services/api';
import type { City, PredictionData, Alert, SimulationResult } from './services/api';
import './App.css';

// Mock data for demo mode
const mockCities: City[] = [
  { name: 'Berlin', population: 3669495, status: 'active', risk_level: 'medium' },
  { name: 'Munich', population: 1488202, status: 'active', risk_level: 'low' },
  { name: 'Hamburg', population: 1847253, status: 'active', risk_level: 'medium' },
  { name: 'Cologne', population: 1087863, status: 'active', risk_level: 'low' },
  { name: 'Frankfurt', population: 764104, status: 'active', risk_level: 'medium' },
  { name: 'Stuttgart', population: 635911, status: 'active', risk_level: 'low' },
  { name: 'Dusseldorf', population: 629047, status: 'active', risk_level: 'low' },
  { name: 'Leipzig', population: 601866, status: 'active', risk_level: 'medium' },
  { name: 'Dortmund', population: 593317, status: 'active', risk_level: 'low' },
  { name: 'Essen', population: 582415, status: 'active', risk_level: 'low' },
];

const generateMockPredictions = (baseValue: number, variance: number = 0.1): PredictionData[] => {
  const data: PredictionData[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const trend = i * 0.02;
    const seasonal = Math.sin(i / 5) * baseValue * 0.05;
    const value = baseValue + trend * baseValue + seasonal + (Math.random() - 0.5) * baseValue * variance;
    data.push({
      date: date.toISOString().split('T')[0],
      predicted_value: Math.max(0, value),
      lower_bound: Math.max(0, value * 0.85),
      upper_bound: value * 1.15
    });
  }
  return data;
};

const getCityMetrics = (cityName: string) => {
  const metrics: Record<string, any> = {
    Berlin: { energy: 45000, healthcare: 8500, congestion: 6.5, aqi: 45, employment: 91.8, housing: 8.5 },
    Munich: { energy: 32000, healthcare: 5200, congestion: 7.2, aqi: 35, employment: 96.2, housing: 9.8 },
    Hamburg: { energy: 28000, healthcare: 4800, congestion: 5.8, aqi: 40, employment: 93.5, housing: 7.2 },
    Cologne: { energy: 22000, healthcare: 3800, congestion: 6.0, aqi: 50, employment: 92.2, housing: 6.8 },
    Frankfurt: { energy: 25000, healthcare: 4200, congestion: 6.8, aqi: 48, employment: 94.8, housing: 8.8 },
    Stuttgart: { energy: 21000, healthcare: 3500, congestion: 7.5, aqi: 55, employment: 95.5, housing: 7.5 },
    Dusseldorf: { energy: 19000, healthcare: 3100, congestion: 5.5, aqi: 42, employment: 93.2, housing: 6.5 },
    Leipzig: { energy: 16000, healthcare: 2800, congestion: 4.8, aqi: 38, employment: 92.5, housing: 5.2 },
    Dortmund: { energy: 15000, healthcare: 2600, congestion: 5.2, aqi: 44, employment: 91.5, housing: 5.8 },
    Essen: { energy: 14500, healthcare: 2500, congestion: 5.0, aqi: 46, employment: 91.0, housing: 5.5 },
  };
  return metrics[cityName] || { energy: 20000, healthcare: 3500, congestion: 6.0, aqi: 45, employment: 92, housing: 6.5 };
};

function App() {
  const [selectedCity, setSelectedCity] = useState<City>(mockCities[0]);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [cities] = useState<City[]>(mockCities);
  const [alerts] = useState<Alert[]>([]);
  const [energyPrediction, setEnergyPrediction] = useState<PredictionData[]>([]);
  const [healthcarePrediction, setHealthcarePrediction] = useState<PredictionData[]>([]);
  const [congestionPrediction, setCongestionPrediction] = useState<PredictionData[]>([]);
  const [housingPrediction, setHousingPrediction] = useState<PredictionData[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [cityMetrics, setCityMetrics] = useState(getCityMetrics('Berlin'));

  const loadCityData = useCallback((city: City) => {
    setSelectedCity(city);
    setCityMetrics(getCityMetrics(city.name));
    
    // Generate predictions based on city
    const baseMetrics = getCityMetrics(city.name);
    setEnergyPrediction(generateMockPredictions(baseMetrics.energy, 0.08));
    setHealthcarePrediction(generateMockPredictions(baseMetrics.healthcare, 0.12));
    setCongestionPrediction(generateMockPredictions(baseMetrics.congestion, 0.15));
    setHousingPrediction(generateMockPredictions(baseMetrics.housing, 0.1));
  }, []);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.healthCheck();
        setBackendConnected(true);
      } catch {
        setBackendConnected(false);
      }
    };
    checkBackend();
    loadCityData(mockCities[0]);
  }, [loadCityData]);

  const handleRunSimulation = async (type: string, params: any) => {
    setIsSimulating(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const city = params.city || selectedCity.name;
    const baseMetrics = getCityMetrics(city);
    
    let timeline: any[] = [];
    let keyFindings: string[] = [];
    
    if (type === 'migration') {
      const incomingPop = params.population || 50000;
      const impact = incomingPop / 100000;
      
      timeline = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        housing_pressure: Math.min(10, baseMetrics.housing + impact * i * 0.3),
        employment_rate: Math.max(85, baseMetrics.employment - impact * i * 0.1),
        healthcare_demand: baseMetrics.healthcare * (1 + impact * i * 0.05),
        congestion: Math.min(10, baseMetrics.congestion + impact * i * 0.15)
      }));
      
      keyFindings = [
        `📊 Population increase: +${incomingPop.toLocaleString()} residents`,
        `🏠 Housing pressure rises to ${timeline[11].housing_pressure.toFixed(1)}/10`,
        `💼 Employment rate adjusts to ${timeline[11].employment_rate.toFixed(1)}%`,
        `⚠️ Infrastructure investment needed: €${(impact * 500).toFixed(0)}M`,
        `💡 Recommendation: Accelerate construction permits and expand public transport`
      ];
    } else if (type === 'climate') {
      const tempRise = params.tempRise || 2.0;
      
      timeline = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        energy_demand: baseMetrics.energy * (1 + tempRise * 0.08 * i / 12),
        aqi: baseMetrics.aqi * (1 + tempRise * 0.05 * i / 12),
        healthcare_demand: baseMetrics.healthcare * (1 + tempRise * 0.03 * i / 12),
        heat_stress_days: Math.floor(tempRise * 5 * i / 12)
      }));
      
      keyFindings = [
        `🌡️ Temperature rise: +${tempRise}°C projected`,
        `⚡ Energy demand increases by ${((timeline[11].energy_demand / baseMetrics.energy - 1) * 100).toFixed(0)}%`,
        `🏥 Heat-related healthcare visits: +${((timeline[11].healthcare_demand / baseMetrics.healthcare - 1) * 100).toFixed(0)}%`,
        `🌬️ Air quality degradation: AQI ${timeline[11].aqi.toFixed(0)}`,
        `💡 Recommendation: Invest €2B in renewable energy and cooling infrastructure`
      ];
    } else if (type === 'economic') {
      const growthRate = params.growthRate || 2.0;
      
      timeline = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        employment_rate: Math.min(98, baseMetrics.employment + growthRate * 0.5 * i / 12),
        energy_demand: baseMetrics.energy * (1 + growthRate * 0.02 * i / 12),
        congestion: Math.min(10, baseMetrics.congestion + growthRate * 0.1 * i / 12),
        housing_pressure: Math.min(10, baseMetrics.housing + growthRate * 0.15 * i / 12)
      }));
      
      keyFindings = [
        `📈 Economic growth: +${growthRate}% annually`,
        `💼 Employment reaches ${timeline[11].employment_rate.toFixed(1)}%`,
        `🚗 Traffic congestion increases to ${timeline[11].congestion.toFixed(1)}/10`,
        `🏢 Business district expansion required`,
        `💡 Recommendation: Expand public transport and business zones`
      ];
    }
    
    setSimulationResult({
      scenario: type,
      duration_days: 365,
      timeline,
      key_findings: keyFindings
    });
    
    setIsSimulating(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      default: return 'text-green-400 border-green-500/30 bg-green-500/10';
    }
  };

  const recommendations = [
    { 
      category: 'Energy', 
      action: cityMetrics.energy > 30000 ? 'Expand renewable capacity by 25%' : 'Optimize grid efficiency',
      impact: cityMetrics.energy > 30000 ? 8.5 : 7.2,
      confidence: 0.88 
    },
    { 
      category: 'Transport', 
      action: cityMetrics.congestion > 6 ? 'Implement smart traffic management' : 'Maintain current infrastructure',
      impact: cityMetrics.congestion > 6 ? 9.0 : 6.5,
      confidence: 0.92 
    },
    { 
      category: 'Housing', 
      action: cityMetrics.housing > 7 ? 'Accelerate affordable housing construction' : 'Monitor market trends',
      impact: cityMetrics.housing > 7 ? 9.2 : 7.0,
      confidence: 0.85 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Twin of Germany
                </h1>
                <p className="text-xs text-slate-400">Digital Twin for Societal Optimization</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Badge variant="outline" className="gap-2 px-3 py-1.5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${backendConnected ? 'bg-green-400' : 'bg-blue-400'}`} />
                {backendConnected ? 'Live Data' : 'AI Simulation'}
              </Badge>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Created by</span>
                <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AMAN SINGH KANDARI
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-900/50 border border-slate-800 p-1">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-slate-800">
              <MapIcon size={16} />
              City Explorer
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-slate-800">
              <BarChart3 size={16} />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="simulation" className="gap-2 data-[state=active]:bg-slate-800">
              <Settings size={16} />
              Simulations
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Redesigned */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
              {/* City List Sidebar */}
              <div className="col-span-3 flex flex-col gap-4">
                {/* Search/Filter */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <Building2 size={16} />
                    German Cities
                  </h3>
                  <div className="text-xs text-slate-500">
                    {cities.length} cities monitored
                  </div>
                </div>
                
                {/* City List */}
                <ScrollArea className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="p-2 space-y-1">
                    {cities.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => loadCityData(city)}
                        onMouseEnter={() => setHoveredCity(city.name)}
                        onMouseLeave={() => setHoveredCity(null)}
                        className={`
                          w-full p-3 rounded-lg text-left transition-all duration-200
                          flex items-center justify-between group
                          ${selectedCity.name === city.name 
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                            : 'hover:bg-slate-800/50 border border-transparent'}
                        `}
                      >
                        <div>
                          <div className="font-medium text-sm">{city.name}</div>
                          <div className="text-xs text-slate-500">
                            {(city.population / 1000000).toFixed(2)}M people
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskColor(city.risk_level)}`}>
                            {city.risk_level}
                          </span>
                          <ChevronRight 
                            size={16} 
                            className={`text-slate-600 transition-transform ${selectedCity.name === city.name ? 'rotate-90 text-blue-400' : 'group-hover:text-slate-400'}`} 
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>

                {/* Quick Stats */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Total Population</span>
                    <span className="text-sm font-medium">
                      {(cities.reduce((a, c) => a + c.population, 0) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Active Alerts</span>
                    <span className="text-sm font-medium text-yellow-400">{alerts.length || 3}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Data Sources</span>
                    <span className="text-sm font-medium text-green-400">5 Connected</span>
                  </div>
                </div>
              </div>

              {/* 3D Map */}
              <div className="col-span-6 bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
                  <div className="text-xs text-slate-400">Currently Viewing</div>
                  <div className="font-semibold text-lg">{hoveredCity || selectedCity.name}</div>
                </div>
                <GermanyMap3D 
                  selectedCity={selectedCity.name}
                  hoveredCity={hoveredCity}
                  onCitySelect={(cityName) => {
                    const city = cities.find(c => c.name === cityName);
                    if (city) loadCityData(city);
                  }}
                  onCityHover={setHoveredCity}
                />
              </div>

              {/* City Details Panel */}
              <div className="col-span-3 flex flex-col gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{selectedCity.name}</h3>
                    <Badge variant="outline" className={getRiskColor(selectedCity.risk_level)}>
                      {selectedCity.risk_level} risk
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard
                      title="Population"
                      value={(selectedCity.population / 1000000).toFixed(2)}
                      unit="M"
                      icon={<Users size={16} />}
                      color="blue"
                      compact
                    />
                    <MetricCard
                      title="Energy"
                      value={(cityMetrics.energy / 1000).toFixed(1)}
                      unit="GWh"
                      icon={<Zap size={16} />}
                      color="yellow"
                      compact
                    />
                    <MetricCard
                      title="AQI"
                      value={cityMetrics.aqi}
                      icon={<Wind size={16} />}
                      color={cityMetrics.aqi > 50 ? 'red' : 'green'}
                      compact
                    />
                    <MetricCard
                      title="Congestion"
                      value={cityMetrics.congestion}
                      unit="/10"
                      icon={<Car size={16} />}
                      color={cityMetrics.congestion > 6 ? 'red' : 'yellow'}
                      compact
                    />
                  </div>
                </div>

                <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <Lightbulb size={16} />
                    AI Recommendations
                  </h3>
                  <div className="space-y-3">
                    {recommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">{rec.category}</Badge>
                          <span className="text-xs text-slate-500">{(rec.confidence * 100).toFixed(0)}% confidence</span>
                        </div>
                        <p className="text-sm text-slate-300">{rec.action}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Target size={12} className="text-green-400" />
                          <span className="text-xs text-green-400">Impact: {rec.impact}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => setActiveTab('analytics')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <BarChart3 size={16} className="mr-2" />
                  View Predictions
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedCity.name}</h2>
                <p className="text-slate-400">30-Day AI Predictions</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Activity size={12} />
                  Live Forecasting
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <PredictionChart
                data={energyPrediction}
                title="Energy Demand Forecast"
                subtitle="Megawatt-hours per day"
                color="#eab308"
              />
              <PredictionChart
                data={healthcarePrediction}
                title="Healthcare Demand Forecast"
                subtitle="Patient visits per day"
                color="#ef4444"
              />
              <PredictionChart
                data={congestionPrediction}
                title="Traffic Congestion Forecast"
                subtitle="Congestion index (0-10)"
                color="#8b5cf6"
              />
              <PredictionChart
                data={housingPrediction}
                title="Housing Pressure Forecast"
                subtitle="Pressure index (0-10)"
                color="#f97316"
              />
            </div>
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulation">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <SimulationPanel
                  selectedCity={selectedCity.name}
                  onRunSimulation={handleRunSimulation}
                  simulationResult={simulationResult}
                  isSimulating={isSimulating}
                />
              </div>
              
              <div className="col-span-8">
                {simulationResult ? (
                  <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold capitalize">
                          {simulationResult.scenario} Simulation Results
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {simulationResult.duration_days}-day projection for {selectedCity.name}
                        </p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Completed
                      </Badge>
                    </div>

                    {/* Timeline Chart */}
                    <div className="h-64 bg-slate-800/30 rounded-lg p-4">
                      <PredictionChart
                        data={simulationResult.timeline.map((t: any, i: number) => ({
                          date: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          predicted_value: t.housing_pressure || t.energy_demand || t.employment_rate || 0,
                          lower_bound: (t.housing_pressure || t.energy_demand || t.employment_rate || 0) * 0.9,
                          upper_bound: (t.housing_pressure || t.energy_demand || t.employment_rate || 0) * 1.1
                        }))}
                        title="Impact Timeline"
                        color="#3b82f6"
                      />
                    </div>

                    {/* Key Findings */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-300 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-400" />
                        Key Findings & Recommendations
                      </h4>
                      <div className="grid gap-3">
                        {simulationResult.key_findings.map((finding, idx) => (
                          <div 
                            key={idx} 
                            className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-start gap-3"
                          >
                            <span className="text-blue-400 mt-0.5">{finding.split(' ')[0]}</span>
                            <span className="text-slate-300">{finding.substring(finding.indexOf(' ') + 1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                    <div className="text-center text-slate-500">
                      <Settings size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Run a Simulation</p>
                      <p className="text-sm">Select parameters and run a predictive scenario</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-sm text-slate-500">
                AI Twin of Germany
              </span>
              <span className="text-sm text-slate-600">
                React • Three.js • FastAPI • Prophet ML
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-sm">
                <span className="text-slate-500">Created by </span>
                <span className="font-medium text-slate-300">AMAN SINGH KANDARI</span>
              </span>
              <div className="flex items-center gap-3">
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <Github size={18} />
                </a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

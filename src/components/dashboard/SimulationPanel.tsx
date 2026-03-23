import { useState } from 'react';
import { Play, RotateCcw, Users, Thermometer, TrendingUp, Building2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface SimulationPanelProps {
  selectedCity: string;
  onRunSimulation: (type: string, params: any) => void;
  simulationResult: any;
  isSimulating: boolean;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
  selectedCity,
  onRunSimulation,
  isSimulating
}) => {
  const [activeTab, setActiveTab] = useState('migration');
  const [migrationPop, setMigrationPop] = useState(50000);
  const [tempRise, setTempRise] = useState(2.0);
  const [growthRate, setGrowthRate] = useState(2.0);

  const runSimulation = () => {
    if (activeTab === 'migration') {
      onRunSimulation('migration', { city: selectedCity, population: migrationPop });
    } else if (activeTab === 'climate') {
      onRunSimulation('climate', { city: selectedCity, tempRise });
    } else if (activeTab === 'economic') {
      onRunSimulation('economic', { city: selectedCity, growthRate });
    }
  };

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 h-full">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Building2 size={18} className="text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold">Digital Twin Simulation</h3>
          <p className="text-xs text-slate-500">Predictive scenario modeling</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-5 bg-slate-800/50">
          <TabsTrigger value="migration" className="text-xs gap-1">
            <Users size={12} />
            Migration
          </TabsTrigger>
          <TabsTrigger value="climate" className="text-xs gap-1">
            <Thermometer size={12} />
            Climate
          </TabsTrigger>
          <TabsTrigger value="economic" className="text-xs gap-1">
            <TrendingUp size={12} />
            Economic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="migration" className="space-y-5 mt-0">
          <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Population Influx</span>
            </div>
            <p className="text-xs text-slate-400">
              Simulate the impact of new residents on housing, employment, and infrastructure.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Target City</span>
              <Badge variant="secondary">{selectedCity}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Incoming Population</span>
                <span className="text-sm font-medium text-blue-400">
                  {migrationPop.toLocaleString()}
                </span>
              </div>
              <Slider
                value={[migrationPop]}
                onValueChange={([v]) => setMigrationPop(v)}
                min={10000}
                max={200000}
                step={10000}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>10K</span>
                <span>200K</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="climate" className="space-y-5 mt-0">
          <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer size={16} className="text-orange-400" />
              <span className="text-sm font-medium">Temperature Rise</span>
            </div>
            <p className="text-xs text-slate-400">
              Model the effects of climate change on energy demand and public health.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Target City</span>
              <Badge variant="secondary">{selectedCity}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Temperature Increase</span>
                <span className="text-sm font-medium text-orange-400">
                  +{tempRise}°C
                </span>
              </div>
              <Slider
                value={[tempRise]}
                onValueChange={([v]) => setTempRise(v)}
                min={0.5}
                max={4.0}
                step={0.5}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>+0.5°C</span>
                <span>+4.0°C</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="economic" className="space-y-5 mt-0">
          <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-400" />
              <span className="text-sm font-medium">Economic Growth</span>
            </div>
            <p className="text-xs text-slate-400">
              Forecast the impact of economic expansion on employment and infrastructure.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Target City</span>
              <Badge variant="secondary">{selectedCity}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Annual Growth Rate</span>
                <span className="text-sm font-medium text-green-400">
                  {growthRate}%
                </span>
              </div>
              <Slider
                value={[growthRate]}
                onValueChange={([v]) => setGrowthRate(v)}
                min={0}
                max={5}
                step={0.5}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>0%</span>
                <span>5%</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 space-y-3">
        <Button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isSimulating ? (
            <>
              <RotateCcw className="animate-spin mr-2" size={16} />
              Running Simulation...
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              Run Simulation
            </>
          )}
        </Button>
        
        <div className="flex items-start gap-2 p-3 bg-slate-800/30 rounded-lg">
          <AlertCircle size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            Simulations use agent-based modeling with real German demographic data for predictive estimates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;

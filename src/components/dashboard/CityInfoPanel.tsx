import React from 'react';
import { 
  Users, 
  Briefcase, 
  Home, 
  Activity, 
  Car, 
  Wind,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface CityData {
  name: string;
  population?: number;
  employment_rate?: number;
  housing_pressure?: number;
  healthcare_capacity?: number;
  transport_congestion?: number;
  pollution_level?: number;
  risk?: string;
  congestion?: number;
}

interface CityInfoPanelProps {
  city: CityData | null;
}

const CityInfoPanel: React.FC<CityInfoPanelProps> = ({ city }) => {
  if (!city) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 h-full">
        <div className="flex items-center justify-center h-full text-slate-500">
          <div className="text-center">
            <Wind size={48} className="mx-auto mb-4 opacity-50" />
            <p>Hover over a city to view details</p>
            <p className="text-sm mt-2 opacity-60">Explore Germany's digital twin</p>
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Population',
      value: city.population?.toLocaleString() || 'N/A',
      icon: <Users size={18} />,
      color: 'blue'
    },
    {
      label: 'Employment',
      value: city.employment_rate ? `${city.employment_rate}%` : 'N/A',
      icon: <Briefcase size={18} />,
      color: 'green'
    },
    {
      label: 'Housing Pressure',
      value: city.housing_pressure ? `${city.housing_pressure}/10` : 'N/A',
      icon: <Home size={18} />,
      color: city.housing_pressure && city.housing_pressure > 7 ? 'red' : 'yellow'
    },
    {
      label: 'Healthcare',
      value: city.healthcare_capacity ? `${city.healthcare_capacity}%` : 'N/A',
      icon: <Activity size={18} />,
      color: city.healthcare_capacity && city.healthcare_capacity < 80 ? 'red' : 'green'
    },
    {
      label: 'Congestion',
      value: city.congestion ? `${city.congestion}/10` : city.transport_congestion ? `${city.transport_congestion}/10` : 'N/A',
      icon: <Car size={18} />,
      color: (city.congestion || city.transport_congestion || 0) > 6 ? 'red' : 'yellow'
    },
    {
      label: 'Air Quality',
      value: city.pollution_level ? `${city.pollution_level} AQI` : 'N/A',
      icon: <Wind size={18} />,
      color: city.pollution_level && city.pollution_level > 50 ? 'red' : 'green'
    }
  ];

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[risk as keyof typeof colors] || colors.low;
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{city.name}</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time city metrics</p>
        </div>
        {city.risk && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskBadge(city.risk)}`}>
            {city.risk.toUpperCase()} RISK
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, idx) => (
          <div 
            key={idx}
            className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-${metric.color}-400`}>{metric.icon}</span>
              <span className="text-xs text-slate-400">{metric.label}</span>
            </div>
            <span className="text-lg font-semibold text-white">{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={18} className="text-blue-400" />
          <span className="text-sm font-medium text-blue-400">AI Insight</span>
        </div>
        <p className="text-sm text-slate-300">
          {city.name} shows stable growth patterns. Predictive models suggest 
          continued urban development with manageable infrastructure strain.
        </p>
      </div>

      {(city.housing_pressure && city.housing_pressure > 7) || (city.congestion && city.congestion > 6) ? (
        <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-400" />
            <span className="text-sm font-medium text-red-400">Alert</span>
          </div>
          <p className="text-sm text-slate-300">
            {(city.housing_pressure && city.housing_pressure > 7) 
              ? 'Housing pressure exceeds recommended threshold. Consider accelerated construction programs.'
              : 'Traffic congestion at critical levels. Public transport expansion recommended.'}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default CityInfoPanel;

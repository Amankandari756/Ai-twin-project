import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
  compact?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = 'blue',
  onClick,
  compact = false
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';

  if (compact) {
    return (
      <div 
        onClick={onClick}
        className={`
          p-3 rounded-lg border backdrop-blur-sm
          transition-all duration-200 hover:scale-[1.02]
          ${colorClasses[color as keyof typeof colorClasses]}
          ${onClick ? 'cursor-pointer' : ''}
        `}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="opacity-70">{icon}</span>
          <span className="text-xs opacity-70">{title}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold">{value}</span>
          {unit && <span className="text-xs opacity-60">{unit}</span>}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`
        p-4 rounded-xl border backdrop-blur-sm
        transition-all duration-300 hover:scale-105 hover:shadow-lg
        ${colorClasses[color as keyof typeof colorClasses]}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/5">
            {icon}
          </div>
          <span className="text-sm font-medium opacity-80">{title}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-sm ml-1 opacity-60">{unit}</span>}
      </div>
    </div>
  );
};

export default MetricCard;

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';

interface PredictionData {
  date: string;
  predicted_value: number;
  lower_bound?: number;
  upper_bound?: number;
}

interface PredictionChartProps {
  data: PredictionData[];
  title: string;
  subtitle?: string;
  color?: string;
}

const PredictionChart: React.FC<PredictionChartProps> = ({
  data,
  title,
  subtitle,
  color = '#3b82f6'
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const avgValue = data.length > 0 
    ? data.reduce((acc, d) => acc + d.predicted_value, 0) / data.length 
    : 0;

  return (
    <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value.toFixed(0)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
              formatter={(value: number) => [value.toFixed(1), 'Predicted']}
              labelFormatter={(label) => formatDate(label as string)}
            />
            <ReferenceLine y={avgValue} stroke="#475569" strokeDasharray="3 3" opacity={0.5} />
            <Area
              type="monotone"
              dataKey="predicted_value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
            AI Forecast
          </span>
          <span>Avg: {avgValue.toFixed(1)}</span>
        </div>
        <span>30 days</span>
      </div>
    </div>
  );
};

export default PredictionChart;

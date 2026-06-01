import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import type { HourlyData } from '../types/weather';

interface HourlyChartProps {
  hourly: HourlyData;
}

export function TemperatureChart({ hourly }: HourlyChartProps) {
  const now = new Date();
  const data = hourly.time
    .map((t, i) => {
      const dt = new Date(t);
      return {
        time: dt,
        label: `${String(dt.getHours()).padStart(2, '0')}:00`,
        temp: hourly.temperature2m[i],
        isNow: Math.abs(dt.getTime() - now.getTime()) < 3600000,
      };
    })
    .slice(0, 24);

  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis
          dataKey="label"
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          domain={['dataMin - 2', 'dataMax + 2']}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-slate-800/90 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white">
                {payload[0]?.payload.label} — {payload[0]?.value}°C
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PrecipitationChart({ hourly }: HourlyChartProps) {
  const data = hourly.time
    .map((t, i) => {
      const dt = new Date(t);
      return {
        time: dt,
        label: `${String(dt.getHours()).padStart(2, '0')}:00`,
        precip: hourly.precipitationProbability[i],
      };
    })
    .slice(0, 24);

  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          unit="%"
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-slate-800/90 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white">
                {payload[0]?.payload.label} — {payload[0]?.value}% 降水概率
              </div>
            );
          }}
        />
        <Bar dataKey="precip" fill="rgba(96, 165, 250, 0.6)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

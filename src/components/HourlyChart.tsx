import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          domain={['dataMin - 2', 'dataMax + 2']}
          width={30}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-white border border-[#E2E4E9] rounded-lg px-3 py-1.5 text-xs text-[#1A1D23] shadow-md">
                {payload[0]?.payload.label} — <span className="font-semibold">{payload[0]?.value}°C</span>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="temp"
          stroke="#3B82F6"
          strokeWidth={2}
          fill="url(#tempGradient)"
          dot={false}
          activeDot={{ r: 3, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
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
      <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          unit="%"
          width={32}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-white border border-[#E2E4E9] rounded-lg px-3 py-1.5 text-xs text-[#1A1D23] shadow-md">
                {payload[0]?.payload.label} — <span className="font-semibold">{payload[0]?.value}%</span> precip
              </div>
            );
          }}
        />
        <Bar dataKey="precip" fill="#06B6D4" radius={[3, 3, 0, 0]} maxBarSize={12} />
      </BarChart>
    </ResponsiveContainer>
  );
}

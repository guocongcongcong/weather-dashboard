import type { DailyData } from '../types/weather';
import { getWeatherInfo } from '../types/weather';

interface DailyForecastProps {
  daily: DailyData;
}

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default function DailyForecast({ daily }: DailyForecastProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {daily.time.map((dateStr, i) => {
        const date = new Date(dateStr);
        const info = getWeatherInfo(daily.weatherCode[i]);
        const isToday = i === 0;
        return (
          <div
            key={dateStr}
            className={`flex-shrink-0 glass rounded-2xl px-4 py-3 min-w-[90px] text-center
              ${isToday ? 'ring-1 ring-white/30' : ''}`}
          >
            <div className="text-xs text-white/50 mb-1">
              {isToday ? '今天' : DAY_NAMES[date.getDay()]}
            </div>
            <div className="text-2xl my-1">{info.icon}</div>
            <div className="text-sm font-semibold text-white">
              {Math.round(daily.temperature2mMax[i])}°
            </div>
            <div className="text-xs text-white/50">
              {Math.round(daily.temperature2mMin[i])}°
            </div>
            {daily.precipitationSum[i] > 0 && (
              <div className="text-xs text-blue-300 mt-0.5">
                {daily.precipitationSum[i].toFixed(1)}mm
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

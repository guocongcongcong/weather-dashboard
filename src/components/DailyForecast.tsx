import type { DailyData } from '../types/weather';
import { getWeatherInfo } from '../types/weather';

interface DailyForecastProps {
  daily: DailyData;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DailyForecast({ daily }: DailyForecastProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {daily.time.map((dateStr, i) => {
        const date = new Date(dateStr);
        const info = getWeatherInfo(daily.weatherCode[i]);
        const isToday = i === 0;

        return (
          <div
            key={dateStr}
            className={`card card-hover flex-shrink-0 px-5 py-3.5 min-w-[100px] text-center cursor-default
              ${isToday ? 'ring-1 ring-[#E2E4E9] bg-[#F9FAFB]' : ''}`}
          >
            <div className="text-xs font-medium text-[#9CA3AF] mb-2 tracking-wide uppercase">
              {isToday ? 'Today' : DAY_NAMES[date.getDay()]}
            </div>
            <div className="text-2xl my-1.5">{info.icon}</div>
            <div className="text-sm font-semibold text-[#1A1D23]">
              {Math.round(daily.temperature2mMax[i])}°
            </div>
            <div className="text-xs text-[#9CA3AF] mt-0.5">
              {Math.round(daily.temperature2mMin[i])}°
            </div>
            {daily.precipitationSum[i] > 0 && (
              <div className="text-xs text-[#06B6D4] mt-1 font-medium">
                {daily.precipitationSum[i].toFixed(1)}mm
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import type { WeatherData } from '../types/weather';
import { getWeatherInfo, windDirectionText, getThemeForWeather } from '../types/weather';
import { TemperatureChart } from './HourlyChart';
import DailyForecast from './DailyForecast';
import CitySearch from './CitySearch';

interface MinimalWeatherCardProps {
  data: WeatherData;
  onCitySelect: (lat: number, lon: number, name: string) => void;
}

export default function MinimalWeatherCard({ data, onCitySelect }: MinimalWeatherCardProps) {
  const theme = getThemeForWeather(data.current.weatherCode);
  const info = getWeatherInfo(data.current.weatherCode);
  const windDir = windDirectionText(data.current.windDirection);

  return (
    <div
      className="min-h-screen pt-12 transition-all duration-500"
      style={{ background: theme.ambientBg }}
    >
      <div className="max-w-2xl mx-auto px-6 pt-10 pb-12">
        {/* Search */}
        <div className="flex justify-end mb-8 animate-fade-in delay-1">
          <CitySearch currentCity={data.city} onSelect={onCitySelect} />
        </div>

        {/* Hero: large centered temperature */}
        <div className="text-center mb-12 animate-fade-in delay-2">
          <div className="text-5xl mb-3">{info.icon}</div>
          <h1 className="text-sm font-medium text-[#9CA3AF] tracking-wide uppercase mb-6">
            {data.city}
          </h1>
          <div className="animate-temp" key={Math.round(data.current.temperature)}>
            <span className="text-[56px] font-semibold text-[#1A1D23] tracking-tight leading-none">
              {Math.round(data.current.temperature)}°
            </span>
          </div>
          <p className="text-[#9CA3AF] text-base mt-2">
            Feels like {Math.round(data.current.feelsLike)}° · {info.label}
          </p>
        </div>

        {/* 4 data points */}
        <div className="grid grid-cols-4 gap-4 mb-8 animate-fade-in delay-3">
          {[
            { label: 'Humidity', value: `${data.current.humidity}%` },
            { label: 'Wind', value: `${data.current.windSpeed.toFixed(1)} km/h` },
            { label: 'Pressure', value: `${Math.round(data.current.pressure)} hPa` },
            { label: 'Cloud', value: `${data.current.cloudCover}%` },
          ].map((item) => (
            <div key={item.label} className="card card-hover px-4 py-3.5 text-center">
              <div className="text-[11px] font-medium text-[#9CA3AF] tracking-wider uppercase mb-0.5">
                {item.label}
              </div>
              <div className="text-base font-medium text-[#1A1D23]">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Wind direction + extra row */}
        <div className="flex items-center justify-center gap-6 text-[#9CA3AF] text-xs mb-12 animate-fade-in delay-3">
          <span>Wind: {windDir} {data.current.windDirection}°</span>
          <span>Visibility: {(data.current.visibility / 1000).toFixed(1)} km</span>
          <span>Precip: {data.current.precipitation.toFixed(1)} mm</span>
        </div>

        {/* 24h temperature chart */}
        <div className="card p-6 mb-6 animate-fade-in delay-4">
          <h3 className="text-xs font-medium text-[#9CA3AF] tracking-wider uppercase mb-3">
            24-Hour Temperature
          </h3>
          <TemperatureChart hourly={data.hourly} />
        </div>

        {/* 5-day forecast */}
        <div className="animate-fade-in delay-5">
          <h3 className="text-xs font-medium text-[#9CA3AF] tracking-wider uppercase mb-3 ml-1">
            5-Day Forecast
          </h3>
          <DailyForecast daily={data.daily} />
        </div>
      </div>
    </div>
  );
}

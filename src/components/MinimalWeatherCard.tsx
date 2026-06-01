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

  const sunrise = data.daily.sunrise[0]?.slice(11, 16) || '--:--';
  const sunset = data.daily.sunset[0]?.slice(11, 16) || '--:--';

  return (
    <div className={`min-h-screen ${theme.gradient} ${theme.bg} transition-all duration-1000`}>
      <div className="max-w-lg mx-auto px-4 pt-20 pb-8">
        {/* City search */}
        <div className="flex justify-end mb-6 animate-fade-in">
          <CitySearch currentCity={data.city} onSelect={onCitySelect} />
        </div>

        {/* Main card */}
        <div className="glass rounded-3xl p-8 text-center animate-fade-in shadow-2xl">
          <div className="text-8xl mb-3">{info.icon}</div>
          <h1 className="text-2xl font-medium text-white/90 mb-1">{data.city}</h1>
          <p className="text-white/50 text-sm mb-6">{info.label}</p>

          <div className="text-9xl font-bold text-white tracking-tighter leading-none">
            {Math.round(data.current.temperature)}°
          </div>
          <p className="text-white/50 text-lg mt-2">
            体感 {Math.round(data.current.feelsLike)}°
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mt-6 text-white/70">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">💧</span>
              <span className="text-sm">{data.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">💨</span>
              <span className="text-sm">{data.current.windSpeed.toFixed(1)} km/h {windDir}</span>
            </div>
          </div>

          {/* Extra info */}
          <div className="flex justify-center gap-6 mt-4 text-white/40 text-xs">
            <span>🎈 {Math.round(data.current.pressure)} hPa</span>
            <span>☁️ {data.current.cloudCover}%</span>
            <span>🌅 {sunrise}</span>
            <span>🌇 {sunset}</span>
          </div>
        </div>

        {/* 24h chart */}
        <div className="glass rounded-3xl p-5 mt-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-white/70 text-sm font-medium mb-3">24 小时温度趋势</h3>
          <TemperatureChart hourly={data.hourly} />
        </div>

        {/* 5-day forecast */}
        <div className="mt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-white/70 text-sm font-medium mb-3 ml-1">5 日预报</h3>
          <DailyForecast daily={data.daily} />
        </div>
      </div>
    </div>
  );
}

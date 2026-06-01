import { useState } from 'react';
import type { WeatherData } from '../types/weather';
import { getWeatherInfo, windDirectionText, getThemeForWeather } from '../types/weather';
import { FY4A_URL, getSatelliteImageUrl } from '../api/weather';
import { TemperatureChart, PrecipitationChart } from './HourlyChart';
import DailyForecast from './DailyForecast';
import CitySearch from './CitySearch';

interface SatelliteDashboardProps {
  data: WeatherData;
  onCitySelect: (lat: number, lon: number, name: string) => void;
}

export default function SatelliteDashboard({ data, onCitySelect }: SatelliteDashboardProps) {
  const [satType, setSatType] = useState<'visible' | 'infrared'>('visible');
  const [fyError, setFyError] = useState(false);
  const theme = getThemeForWeather(data.current.weatherCode);
  const info = getWeatherInfo(data.current.weatherCode);
  const windDir = windDirectionText(data.current.windDirection);

  const sunrise = data.daily.sunrise[0]?.slice(11, 16) || '--:--';
  const sunset = data.daily.sunset[0]?.slice(11, 16) || '--:--';

  return (
    <div
      className="min-h-screen pt-12 transition-all duration-500"
      style={{ background: theme.ambientBg }}
    >
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-12">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-3 mb-6 animate-fade-in delay-1">
          <div>
            <h1 className="text-lg font-semibold text-[#1A1D23]">{data.city}</h1>
            <p className="text-xs text-[#9CA3AF]">FY-4A Satellite · {info.label}</p>
          </div>
          <CitySearch currentCity={data.city} onSelect={onCitySelect} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Satellite image + weather info */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in delay-2">
            {/* FY-4A Satellite image card */}
            <div className="card overflow-hidden">
              {!fyError ? (
                <img
                  src={FY4A_URL}
                  alt="FY-4A Satellite"
                  className="w-full h-48 object-cover"
                  onError={() => setFyError(true)}
                />
              ) : (
                <div
                  className="w-full h-48 flex items-center justify-center"
                  style={{ background: theme.accentBg }}
                >
                  <span className="text-[#9CA3AF] text-sm">Satellite image unavailable</span>
                </div>
              )}
              <div className="px-4 py-2.5 border-t border-[#E2E4E9]">
                <p className="text-xs text-[#9CA3AF]">FY-4A · China Region True Color</p>
              </div>
            </div>

            {/* Weather summary card */}
            <div className="card p-6 text-center">
              <div className="text-5xl mb-2">{info.icon}</div>
              <div className="animate-temp" key={Math.round(data.current.temperature)}>
                <span className="text-[48px] font-semibold text-[#1A1D23] tracking-tight">
                  {Math.round(data.current.temperature)}°
                </span>
              </div>
              <div className="text-sm font-medium text-[#1A1D23] mt-1">{info.label}</div>
              <div className="text-xs text-[#9CA3AF]">
                Feels like {Math.round(data.current.feelsLike)}°
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-5">
                {[
                  { label: 'Humidity', value: `${data.current.humidity}%` },
                  { label: 'Wind', value: `${data.current.windSpeed.toFixed(1)} km/h` },
                  { label: 'Direction', value: windDir },
                  { label: 'Pressure', value: `${Math.round(data.current.pressure)} hPa` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl px-3 py-2.5 text-center"
                    style={{ background: theme.accentBg }}
                  >
                    <div className="text-[11px] font-medium text-[#9CA3AF] tracking-wider uppercase mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-sm font-semibold text-[#1A1D23]">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-around mt-3 pt-3 border-t border-[#E2E4E9]">
                <div>
                  <div className="text-[11px] text-[#9CA3AF] uppercase">Cloud</div>
                  <div className="text-sm font-medium text-[#1A1D23]">{data.current.cloudCover}%</div>
                </div>
                <div className="w-px h-6 bg-[#E2E4E9]" />
                <div>
                  <div className="text-[11px] text-[#9CA3AF] uppercase">Sunrise</div>
                  <div className="text-sm font-medium text-[#1A1D23]">{sunrise}</div>
                </div>
                <div className="w-px h-6 bg-[#E2E4E9]" />
                <div>
                  <div className="text-[11px] text-[#9CA3AF] uppercase">Sunset</div>
                  <div className="text-sm font-medium text-[#1A1D23]">{sunset}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Charts + Himawari */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in delay-3">
            {/* Temperature chart */}
            <div className="card p-6">
              <h3 className="text-xs font-medium text-[#9CA3AF] tracking-wider uppercase mb-3">
                24h Temperature
              </h3>
              <TemperatureChart hourly={data.hourly} />
            </div>

            {/* Precipitation chart */}
            <div className="card p-6">
              <h3 className="text-xs font-medium text-[#9CA3AF] tracking-wider uppercase mb-3">
                24h Precipitation Probability
              </h3>
              <PrecipitationChart hourly={data.hourly} />
            </div>

            {/* Himawari-8 satellite switcher */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-[#E2E4E9] flex items-center justify-between">
                <h3 className="text-xs font-medium text-[#9CA3AF] tracking-wider uppercase">
                  Himawari-8 Satellite
                </h3>
                <div className="flex gap-1 bg-[#F3F4F6] rounded-lg p-0.5">
                  <button
                    onClick={() => setSatType('visible')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      satType === 'visible'
                        ? 'bg-white text-[#1A1D23] shadow-sm'
                        : 'text-[#9CA3AF] hover:text-[#6B7280]'
                    }`}
                  >
                    Visible
                  </button>
                  <button
                    onClick={() => setSatType('infrared')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      satType === 'infrared'
                        ? 'bg-white text-[#1A1D23] shadow-sm'
                        : 'text-[#9CA3AF] hover:text-[#6B7280]'
                    }`}
                  >
                    Infrared
                  </button>
                </div>
              </div>
              <img
                src={getSatelliteImageUrl(satType)}
                alt={satType === 'visible' ? 'Himawari-8 Visible' : 'Himawari-8 Infrared'}
                className="w-full h-52 object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* 5-day forecast */}
        <div className="mt-6 animate-fade-in delay-4">
          <h3 className="text-xs font-medium text-[#9CA3AF] tracking-wider uppercase mb-3 ml-1">
            5-Day Forecast
          </h3>
          <DailyForecast daily={data.daily} />
        </div>
      </div>
    </div>
  );
}

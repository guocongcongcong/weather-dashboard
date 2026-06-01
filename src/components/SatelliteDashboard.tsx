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
    <div className="relative min-h-screen overflow-hidden">
      {/* Satellite background */}
      <div className="absolute inset-0 z-0">
        {!fyError ? (
          <img
            src={FY4A_URL}
            alt="FY-4A 卫星云图"
            className="w-full h-full object-cover"
            onError={() => setFyError(true)}
          />
        ) : (
          <div className={`w-full h-full ${theme.gradient} ${theme.bg}`} />
        )}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-16 pb-8 px-4 max-w-5xl mx-auto min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 animate-fade-in">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {data.city}
            </h1>
            <p className="text-white/60 text-sm mt-0.5">
              风云四号 A 星 · 中国区域真彩色
            </p>
          </div>
          <CitySearch currentCity={data.city} onSelect={onCitySelect} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main weather card */}
          <div className="lg:col-span-1 glass rounded-3xl p-6 animate-fade-in">
            <div className="text-center">
              <div className="text-6xl mb-2">{info.icon}</div>
              <div className="text-7xl font-bold text-white tracking-tighter">
                {Math.round(data.current.temperature)}°
              </div>
              <div className="text-white/70 text-lg mt-1">{info.label}</div>
              <div className="text-white/40 text-sm">
                体感 {Math.round(data.current.feelsLike)}°C
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-white/40 text-xs">湿度</div>
                <div className="text-white font-semibold text-lg">{data.current.humidity}%</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-white/40 text-xs">风速</div>
                <div className="text-white font-semibold text-lg">
                  {data.current.windSpeed.toFixed(1)}
                  <span className="text-xs text-white/50 ml-0.5">km/h</span>
                </div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-white/40 text-xs">风向</div>
                <div className="text-white font-semibold text-lg">{windDir}</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-white/40 text-xs">气压</div>
                <div className="text-white font-semibold text-lg">
                  {Math.round(data.current.pressure)}
                  <span className="text-xs text-white/50 ml-0.5">hPa</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-3 mt-3 text-center flex justify-around">
              <div>
                <div className="text-white/40 text-xs">云量</div>
                <div className="text-white font-semibold">{data.current.cloudCover}%</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-white/40 text-xs">日出</div>
                <div className="text-white font-semibold">{sunrise}</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-white/40 text-xs">日落</div>
                <div className="text-white font-semibold">{sunset}</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass rounded-3xl p-5">
              <h3 className="text-white/70 text-sm font-medium mb-3">24h 温度变化</h3>
              <TemperatureChart hourly={data.hourly} />
            </div>

            <div className="glass rounded-3xl p-5">
              <h3 className="text-white/70 text-sm font-medium mb-3">24h 降水概率</h3>
              <PrecipitationChart hourly={data.hourly} />
            </div>

            {/* Satellite switcher + Himawari thumbnail */}
            <div className="glass rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white/70 text-sm font-medium">卫星视图</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSatType('visible')}
                    className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                      satType === 'visible'
                        ? 'bg-white/20 text-white'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    可见光
                  </button>
                  <button
                    onClick={() => setSatType('infrared')}
                    className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                      satType === 'infrared'
                        ? 'bg-white/20 text-white'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    红外
                  </button>
                </div>
              </div>
              <img
                src={getSatelliteImageUrl(satType)}
                alt={satType === 'visible' ? 'Himawari-8 可见光' : 'Himawari-8 红外'}
                className="w-full h-48 object-cover rounded-xl"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <p className="text-white/30 text-xs mt-2 text-center">
                Himawari-8 · {satType === 'visible' ? '可见光' : '红外'}云图
              </p>
            </div>
          </div>
        </div>

        {/* 5-day forecast */}
        <div className="mt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-white/70 text-sm font-medium mb-3">5日预报</h3>
          <DailyForecast daily={data.daily} />
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { useWeather } from './hooks/useWeather';
import NavBar from './components/NavBar';
import MinimalWeatherCard from './components/MinimalWeatherCard';
import WindFieldView from './components/WindFieldView';
import SatelliteDashboard from './components/SatelliteDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState(2);
  const { data, loading, error, lastUpdated, refresh, setLocation } = useWeather();

  const handleCitySelect = useCallback(
    (lat: number, lon: number, name: string) => {
      setLocation(lat, lon, name);
    },
    [setLocation]
  );

  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-5xl mb-4">🌧</div>
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={() => refresh()}
            className="px-6 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors cursor-pointer"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">正在获取天气数据...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <NavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={() => refresh()}
        lastUpdated={lastUpdated}
        loading={loading}
      />

      {activeTab === 0 && (
        <MinimalWeatherCard data={data} onCitySelect={handleCitySelect} />
      )}
      {activeTab === 1 && (
        <WindFieldView data={data} onCitySelect={handleCitySelect} />
      )}
      {activeTab === 2 && (
        <SatelliteDashboard data={data} onCitySelect={handleCitySelect} />
      )}

      {loading && data && (
        <div className="fixed top-14 left-0 right-0 z-40 flex justify-center">
          <div className="glass rounded-full px-4 py-1.5 flex items-center gap-2 text-white/70 text-xs">
            <div className="w-3 h-3 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
            更新中...
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useCallback } from 'react';
import { useWeather } from './hooks/useWeather';
import NavBar from './components/NavBar';
import MinimalWeatherCard from './components/MinimalWeatherCard';
import WindFieldView from './components/WindFieldView';
import SatelliteDashboard from './components/SatelliteDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const { data, loading, error, lastUpdated, refresh, setLocation } = useWeather();

  const handleCitySelect = useCallback(
    (lat: number, lon: number, name: string) => {
      setLocation(lat, lon, name);
    },
    [setLocation]
  );

  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">&#x1F327;</div>
          <p className="text-base text-[#6B7280] mb-4">{error}</p>
          <button
            onClick={() => refresh()}
            className="px-5 py-2 bg-[#1A1D23] text-white text-sm font-medium rounded-lg hover:bg-[#374151] transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#E5E7EB] border-t-[#9CA3AF] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#9CA3AF]">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
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
          <div className="bg-white border border-[#E2E4E9] rounded-full px-4 py-1.5 flex items-center gap-2 text-[#9CA3AF] text-xs shadow-md">
            <div className="w-3 h-3 border-2 border-[#E5E7EB] border-t-[#9CA3AF] rounded-full animate-spin" />
            Updating...
          </div>
        </div>
      )}
    </div>
  );
}

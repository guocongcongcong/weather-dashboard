import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData } from '../api/weather';
import type { WeatherData } from '../types/weather';

const DEFAULT_LAT = 39.9042;
const DEFAULT_LON = 116.4074;
const DEFAULT_CITY = '北京';

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [lon, setLon] = useState(DEFAULT_LON);
  const [cityName, setCityName] = useState(DEFAULT_CITY);

  const refresh = useCallback(async (newLat?: number, newLon?: number, newCity?: string) => {
    const useLat = newLat ?? lat;
    const useLon = newLon ?? lon;
    const useCity = newCity ?? cityName;

    setLoading(true);
    setError(null);
    try {
      const result = await fetchWeatherData(useLat, useLon, useCity);
      setData(result);
      setLastUpdated(new Date());
    } catch {
      setError('获取天气数据失败，请检查网络后重试');
    } finally {
      setLoading(false);
    }
  }, [lat, lon, cityName]);

  const setLocation = useCallback((newLat: number, newLon: number, newCity: string) => {
    setLat(newLat);
    setLon(newLon);
    setCityName(newCity);
    refresh(newLat, newLon, newCity);
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, lastUpdated, refresh, setLocation, lat, lon, cityName };
}

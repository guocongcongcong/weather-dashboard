import type { WeatherData, CityResult } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<CityResult[]> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=zh&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: Record<string, unknown>) => ({
    name: r.name as string,
    country: r.country as string,
    admin1: r.admin1 as string | undefined,
    lat: r.latitude as number,
    lon: r.longitude as number,
  }));
}

export async function fetchWeatherData(lat: number, lon: number, cityName?: string): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover,pressure_msl,precipitation,visibility',
    hourly: 'temperature_2m,precipitation_probability,weather_code,cloud_cover',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum',
    timezone: 'Asia/Shanghai',
    forecast_days: '5',
  });

  const res = await fetch(`${FORECAST_URL}?${params}`);
  const data = await res.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      weatherCode: data.current.weather_code,
      cloudCover: data.current.cloud_cover,
      pressure: data.current.pressure_msl,
      precipitation: data.current.precipitation,
      visibility: data.current.visibility,
    },
    hourly: {
      time: data.hourly.time,
      temperature2m: data.hourly.temperature_2m,
      precipitationProbability: data.hourly.precipitation_probability,
      weatherCode: data.hourly.weather_code,
      cloudCover: data.hourly.cloud_cover,
    },
    daily: {
      time: data.daily.time,
      temperature2mMax: data.daily.temperature_2m_max,
      temperature2mMin: data.daily.temperature_2m_min,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
      precipitationSum: data.daily.precipitation_sum,
      weatherCode: data.daily.weather_code,
    },
    city: cityName || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    lat,
    lon,
  };
}

export function getSatelliteImageUrl(type: 'visible' | 'infrared' = 'visible'): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = Math.floor(now.getMinutes() / 10) * 10;
  const minuteStr = String(minute).padStart(2, '0');
  const ts = `${year}${month}${day}${hour}${minuteStr}00`;

  if (type === 'infrared') {
    return `https://www.jma.go.jp/jp/gms/imgs_c/infrared/1/${ts}-00.png`;
  }
  return `https://www.jma.go.jp/jp/gms/imgs_c/visible/1/${ts}-00.png`;
}

export const FY4A_URL = 'http://img.nsmc.org.cn/CLOUDIMAGE/FY4A/MTCC/FY4A_CHINA.JPG';

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  cloudCover: number;
  pressure: number;
  precipitation: number;
  visibility: number;
}

export interface HourlyData {
  time: string[];
  temperature2m: number[];
  precipitationProbability: number[];
  weatherCode: number[];
  cloudCover: number[];
}

export interface DailyData {
  time: string[];
  temperature2mMax: number[];
  temperature2mMin: number[];
  sunrise: string[];
  sunset: string[];
  precipitationSum: number[];
  weatherCode: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyData;
  daily: DailyData;
  city: string;
  lat: number;
  lon: number;
}

export interface CityResult {
  name: string;
  country: string;
  admin1?: string;
  lat: number;
  lon: number;
}

export const WMO_CODES: Record<number, { icon: string; label: string }> = {
  0: { icon: '☀️', label: '晴' },
  1: { icon: '🌤', label: '少云' },
  2: { icon: '⛅', label: '多云' },
  3: { icon: '☁️', label: '阴' },
  45: { icon: '🌫', label: '雾' },
  48: { icon: '🌫', label: '雾凇' },
  51: { icon: '🌧', label: '小雨' },
  53: { icon: '🌧', label: '小雨' },
  55: { icon: '🌧', label: '小雨' },
  61: { icon: '🌧', label: '雨' },
  63: { icon: '🌧', label: '中雨' },
  65: { icon: '🌧', label: '大雨' },
  71: { icon: '❄️', label: '小雪' },
  73: { icon: '❄️', label: '中雪' },
  75: { icon: '❄️', label: '大雪' },
  77: { icon: '❄️', label: '雪粒' },
  80: { icon: '🌧', label: '阵雨' },
  81: { icon: '🌧', label: '中阵雨' },
  82: { icon: '🌧', label: '大阵雨' },
  85: { icon: '❄️', label: '阵雪' },
  86: { icon: '❄️', label: '大阵雪' },
  95: { icon: '⛈', label: '雷暴' },
  96: { icon: '⛈', label: '雷暴伴冰雹' },
  99: { icon: '⛈', label: '强雷暴' },
};

export function getWeatherInfo(code: number) {
  return WMO_CODES[code] || { icon: '🌡', label: '未知' };
}

export function getThemeForWeather(code: number): {
  bg: string;
  gradient: string;
  accent: string;
} {
  if (code === 0) {
    return {
      bg: 'from-amber-500 via-orange-400 to-yellow-300',
      gradient: 'bg-gradient-to-br',
      accent: '#f59e0b',
    };
  }
  if (code <= 2) {
    return {
      bg: 'from-sky-400 via-blue-400 to-cyan-300',
      gradient: 'bg-gradient-to-br',
      accent: '#38bdf8',
    };
  }
  if (code === 3) {
    return {
      bg: 'from-slate-400 via-gray-400 to-zinc-300',
      gradient: 'bg-gradient-to-br',
      accent: '#94a3b8',
    };
  }
  if (code >= 45 && code <= 48) {
    return {
      bg: 'from-gray-400 via-slate-300 to-gray-200',
      gradient: 'bg-gradient-to-br',
      accent: '#9ca3af',
    };
  }
  if (code >= 51 && code <= 82) {
    return {
      bg: 'from-slate-600 via-blue-800 to-gray-700',
      gradient: 'bg-gradient-to-b',
      accent: '#60a5fa',
    };
  }
  if (code >= 71 && code <= 86) {
    return {
      bg: 'from-blue-100 via-white to-slate-100',
      gradient: 'bg-gradient-to-br',
      accent: '#93c5fd',
    };
  }
  if (code >= 95) {
    return {
      bg: 'from-purple-900 via-indigo-900 to-slate-900',
      gradient: 'bg-gradient-to-br',
      accent: '#a78bfa',
    };
  }
  return {
    bg: 'from-sky-400 via-blue-400 to-indigo-400',
    gradient: 'bg-gradient-to-br',
    accent: '#38bdf8',
  };
}

export function windDirectionText(deg: number): string {
  const dirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const idx = Math.round(deg / 45) % 8;
  return dirs[idx];
}

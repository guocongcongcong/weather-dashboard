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
  accentBg: string;
  accentBorder: string;
  accentText: string;
  chartColor: string;
  ambientBg: string;
} {
  if (code === 0) {
    return {
      accentBg: '#FFFBEB',
      accentBorder: '#FDE68A',
      accentText: '#92400E',
      chartColor: '#F59E0B',
      ambientBg: 'linear-gradient(135deg, #FFFBEB 0%, #FFF7ED 50%, #FFFFFF 100%)',
    };
  }
  if (code <= 2) {
    return {
      accentBg: '#EFF6FF',
      accentBorder: '#BFDBFE',
      accentText: '#1E40AF',
      chartColor: '#3B82F6',
      ambientBg: 'linear-gradient(135deg, #EFF6FF 0%, #F5F9FF 50%, #FFFFFF 100%)',
    };
  }
  if (code === 3) {
    return {
      accentBg: '#F3F4F6',
      accentBorder: '#D1D5DB',
      accentText: '#374151',
      chartColor: '#6B7280',
      ambientBg: 'linear-gradient(135deg, #F3F4F6 0%, #F9FAFB 50%, #FFFFFF 100%)',
    };
  }
  if (code >= 45 && code <= 48) {
    return {
      accentBg: '#F9FAFB',
      accentBorder: '#E5E7EB',
      accentText: '#4B5563',
      chartColor: '#9CA3AF',
      ambientBg: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #FFFFFF 100%)',
    };
  }
  if (code >= 51 && code <= 82) {
    return {
      accentBg: '#ECFEFF',
      accentBorder: '#A5F3FC',
      accentText: '#155E75',
      chartColor: '#06B6D4',
      ambientBg: 'linear-gradient(135deg, #ECFEFF 0%, #F0F9FF 50%, #F8FAFC 100%)',
    };
  }
  if (code >= 71 && code <= 86) {
    return {
      accentBg: '#F0F9FF',
      accentBorder: '#BAE6FD',
      accentText: '#075985',
      chartColor: '#7DD3FC',
      ambientBg: 'linear-gradient(135deg, #F0F9FF 0%, #F8FAFC 50%, #FFFFFF 100%)',
    };
  }
  if (code >= 95) {
    return {
      accentBg: '#FAF5FF',
      accentBorder: '#D8B4FE',
      accentText: '#6B21A8',
      chartColor: '#A855F7',
      ambientBg: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 50%, #F8FAFC 100%)',
    };
  }
  return {
    accentBg: '#EFF6FF',
    accentBorder: '#BFDBFE',
    accentText: '#1E40AF',
    chartColor: '#3B82F6',
    ambientBg: 'linear-gradient(135deg, #EFF6FF 0%, #F5F9FF 50%, #FFFFFF 100%)',
  };
}

export function windDirectionText(deg: number): string {
  const dirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const idx = Math.round(deg / 45) % 8;
  return dirs[idx];
}

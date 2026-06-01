import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import type { WeatherData } from '../types/weather';
import { windDirectionText } from '../types/weather';
import CitySearch from './CitySearch';

interface WindFieldViewProps {
  data: WeatherData;
  onCitySelect: (lat: number, lon: number, name: string) => void;
}

interface Particle {
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

function generateWindGrid(
  lat: number,
  lon: number,
  centerSpeed: number,
  centerDir: number
): { lats: number[]; lons: number[]; u: Float32Array; v: Float32Array; rows: number; cols: number } {
  const latStart = lat - 20;
  const latEnd = lat + 20;
  const lonStart = lon - 30;
  const lonEnd = lon + 30;
  const rows = 40;
  const cols = 60;

  const lats: number[] = [];
  const lons: number[] = [];
  const u = new Float32Array(rows * cols);
  const v = new Float32Array(rows * cols);

  const centerRad = (centerDir * Math.PI) / 180;
  const baseU = -Math.sin(centerRad) * centerSpeed;
  const baseV = -Math.cos(centerRad) * centerSpeed;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const glat = latStart + (r / (rows - 1)) * (latEnd - latStart);
      const glon = lonStart + (c / (cols - 1)) * (lonEnd - lonStart);
      lats.push(glat);
      lons.push(glon);

      const dlat = glat - lat;
      const dlon = glon - lon;
      const dist = Math.sqrt(dlat * dlat + dlon * dlon) * 100;
      const angle = Math.atan2(dlat, dlon);
      const swirlStrength = Math.min(3, 15 / (dist + 1));
      const uSwirl = -Math.sin(angle) * swirlStrength * (dlat > 0 ? 1 : -1);
      const vSwirl = Math.cos(angle) * swirlStrength * (dlat > 0 ? 1 : -1);
      const wave = Math.sin(glat * 0.5) * Math.cos(glon * 0.3) * 2;

      const idx = r * cols + c;
      u[idx] = baseU + uSwirl + wave * 0.5;
      v[idx] = baseV + vSwirl + wave * 0.3;
    }
  }
  return { lats, lons, u, v, rows, cols };
}

export default function WindFieldView({ data, onCitySelect }: WindFieldViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const windGridRef = useRef<ReturnType<typeof generateWindGrid> | null>(null);

  const initParticles = useCallback((count: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        age: Math.random() * 100,
        maxAge: 80 + Math.random() * 120,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [data.lat, data.lon],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
      preferCanvas: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, [data.lat, data.lon]);

  useEffect(() => {
    windGridRef.current = generateWindGrid(
      data.lat,
      data.lon,
      data.current.windSpeed,
      data.current.windDirection
    );
    particlesRef.current = initParticles(800);
  }, [data, initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const leafletMap = mapRef.current;
    if (!canvas || !leafletMap) return;

    function resize() {
      const container = leafletMap!.getContainer();
      canvas!.width = container.clientWidth;
      canvas!.height = container.clientHeight;
    }

    leafletMap.on('resize', resize);
    leafletMap.on('move', resize);
    leafletMap.on('zoom', resize);
    resize();

    let lastTime = 0;

    function animate(timestamp: number) {
      const dt = lastTime ? Math.min((timestamp - lastTime) / 16, 3) : 1;
      lastTime = timestamp;

      const ctx = canvas!.getContext('2d');
      if (!ctx) return;
      const wind = windGridRef.current;
      if (!wind) return;

      const w = canvas!.width;
      const h = canvas!.height;
      ctx.clearRect(0, 0, w, h);

      const bounds = leafletMap!.getBounds();
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const west = bounds.getWest();

      const latRange = north - south;
      const lonRange = east - west;

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const plat = north - p.y * latRange;
        const plon = west + p.x * lonRange;

        const windLatIdx =
          ((plat - wind.lats[0]) / (wind.lats[wind.lats.length - 1] - wind.lats[0])) *
          (wind.rows - 1);
        const windLonIdx =
          ((plon - wind.lons[0]) / (wind.lons[wind.lons.length - 1] - wind.lons[0])) *
          (wind.cols - 1);

        const r0 = Math.max(0, Math.min(wind.rows - 1, Math.floor(windLatIdx)));
        const c0 = Math.max(0, Math.min(wind.cols - 1, Math.floor(windLonIdx)));
        const r1 = Math.min(wind.rows - 1, r0 + 1);
        const c1 = Math.min(wind.cols - 1, c0 + 1);

        const fr = windLatIdx - r0;
        const fc = windLonIdx - c0;

        const idx00 = r0 * wind.cols + c0;
        const idx01 = r0 * wind.cols + c1;
        const idx10 = r1 * wind.cols + c0;
        const idx11 = r1 * wind.cols + c1;

        const u =
          (1 - fr) * (1 - fc) * wind.u[idx00] +
          (1 - fr) * fc * wind.u[idx01] +
          fr * (1 - fc) * wind.u[idx10] +
          fr * fc * wind.u[idx11];

        const v =
          (1 - fr) * (1 - fc) * wind.v[idx00] +
          (1 - fr) * fc * wind.v[idx01] +
          fr * (1 - fc) * wind.v[idx10] +
          fr * fc * wind.v[idx11];

        const scale = 0.00003 * dt;
        p.x += u * scale;
        p.y += v * scale;
        p.age += dt;

        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        if (p.age > p.maxAge) {
          p.age = 0;
          p.x = Math.random();
          p.y = Math.random();
        }

        const alpha = p.age < 5 ? p.age / 5 : p.age > p.maxAge - 10 ? (p.maxAge - p.age) / 10 : 1;
        const screenX = p.x * w;
        const screenY = p.y * h;

        if (screenX < -5 || screenX > w + 5 || screenY < -5 || screenY > h + 5) continue;

        ctx.beginPath();
        ctx.arc(screenX, screenY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${alpha * 0.8})`;
        ctx.fill();

        const trailLen = 4;
        const trailU = u * scale * trailLen;
        const trailV = v * scale * trailLen;

        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX - trailU, screenY - trailV);
        ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      leafletMap.off('resize', resize);
      leafletMap.off('move', resize);
      leafletMap.off('zoom', resize);
    };
  }, []);

  const windDir = windDirectionText(data.current.windDirection);

  return (
    <div className="min-h-screen bg-[#F7F8FA] pt-12">
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <div>
            <h1 className="text-lg font-semibold text-[#1A1D23]">Wind Field</h1>
            <p className="text-xs text-[#9CA3AF]">{data.city} · real-time wind patterns</p>
          </div>
          <CitySearch currentCity={data.city} onSelect={onCitySelect} />
        </div>

        {/* Map card */}
        <div className="card overflow-hidden mb-4 animate-fade-in delay-2 relative" style={{ height: '480px' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ borderRadius: '16px' }}
          />
        </div>

        {/* Data bar */}
        <div className="card animate-fade-in delay-3">
          <div className="flex items-center justify-around py-4 px-6">
            <div className="text-center">
              <div className="text-[11px] font-medium text-[#9CA3AF] tracking-wider uppercase mb-0.5">
                Wind Speed
              </div>
              <div className="text-xl font-semibold text-[#1A1D23]">
                {data.current.windSpeed.toFixed(1)} <span className="text-sm text-[#9CA3AF] font-normal">km/h</span>
              </div>
            </div>
            <div className="w-px h-10 bg-[#E2E4E9]" />
            <div className="text-center">
              <div className="text-[11px] font-medium text-[#9CA3AF] tracking-wider uppercase mb-0.5">
                Direction
              </div>
              <div className="text-xl font-semibold text-[#1A1D23]">
                {windDir} <span className="text-sm text-[#9CA3AF] font-normal">{data.current.windDirection}°</span>
              </div>
            </div>
            <div className="w-px h-10 bg-[#E2E4E9]" />
            <div className="text-center">
              <div className="text-[11px] font-medium text-[#9CA3AF] tracking-wider uppercase mb-0.5">
                Gusts
              </div>
              <div className="text-xl font-semibold text-[#1A1D23]">
                {(data.current.windSpeed * 1.3).toFixed(1)} <span className="text-sm text-[#9CA3AF] font-normal">km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

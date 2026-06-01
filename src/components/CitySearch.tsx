import { useState, useRef, useEffect } from 'react';
import { searchCities } from '../api/weather';
import type { CityResult } from '../types/weather';

interface CitySearchProps {
  currentCity: string;
  onSelect: (lat: number, lon: number, name: string) => void;
}

export default function CitySearch({ currentCity, onSelect }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSearch(q: string) {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setSearching(true);
    try {
      const cities = await searchCities(q);
      setResults(cities);
      setOpen(cities.length > 0);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleSelect(city: CityResult) {
    onSelect(city.lat, city.lon, `${city.name}${city.admin1 ? `, ${city.admin1}` : ''}`);
    setQuery('');
    setOpen(false);
    setResults([]);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={currentCity}
          className="w-48 pl-9 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm
                     placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15
                     transition-all duration-200"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
          {results.map((city, i) => (
            <button
              key={`${city.lat}-${city.lon}-${i}`}
              onClick={() => handleSelect(city)}
              className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white
                         transition-colors border-b border-white/5 last:border-none cursor-pointer"
            >
              <span className="font-medium">{city.name}</span>
              {city.admin1 && <span className="text-white/40 ml-1">· {city.admin1}</span>}
              <span className="text-white/30 ml-1">{city.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

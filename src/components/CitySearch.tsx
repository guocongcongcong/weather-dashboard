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
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
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
          className="w-44 pl-8 pr-3 py-1.5 rounded-lg bg-white border border-[#E2E4E9] text-[#1A1D23] text-sm
                     placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D1D5DB] focus:ring-2 focus:ring-[#F3F4F6]
                     transition-all duration-200"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border-2 border-[#E5E7EB] border-t-[#9CA3AF] rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-[#E2E4E9] rounded-xl overflow-hidden shadow-lg z-50">
          {results.map((city, i) => (
            <button
              key={`${city.lat}-${city.lon}-${i}`}
              onClick={() => handleSelect(city)}
              className="w-full px-4 py-2.5 text-left text-sm text-[#1A1D23] hover:bg-[#F7F8FA]
                         transition-colors border-b border-[#F3F4F6] last:border-none cursor-pointer"
            >
              <span className="font-medium">{city.name}</span>
              {city.admin1 && <span className="text-[#9CA3AF] ml-1">· {city.admin1}</span>}
              <span className="text-[#D1D5DB] ml-1">{city.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

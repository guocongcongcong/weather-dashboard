interface NavBarProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
  loading: boolean;
}

const tabs = [
  { id: 0, label: 'Overview' },
  { id: 1, label: 'Wind' },
  { id: 2, label: 'Satellite' },
];

export default function NavBar({ activeTab, onTabChange, onRefresh, lastUpdated, loading }: NavBarProps) {
  const minutesAgo = lastUpdated
    ? Math.floor((Date.now() - lastUpdated.getTime()) / 60000)
    : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E4E9]">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-[#1A1D23] tracking-tight mr-4">
            Weather
          </span>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'text-[#1A1D23]'
                  : 'text-[#9CA3AF] hover:text-[#6B7280]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#1A1D23] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {minutesAgo !== null && (
            <span className="text-xs text-[#9CA3AF] hidden sm:inline tabular-nums">
              Updated {minutesAgo === 0 ? 'just now' : `${minutesAgo}m ago`}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-md hover:bg-[#F3F4F6] transition-colors cursor-pointer disabled:opacity-40"
            title="Refresh"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`text-[#6B7280] ${loading ? 'animate-spin' : ''}`}
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

interface NavBarProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
  loading: boolean;
}

const tabs = [
  { id: 0, label: '极简', icon: '✦' },
  { id: 1, label: '风场', icon: '🌬' },
  { id: 2, label: '卫星', icon: '🛰' },
];

export default function NavBar({ activeTab, onTabChange, onRefresh, lastUpdated, loading }: NavBarProps) {
  const minutesAgo = lastUpdated
    ? Math.floor((Date.now() - lastUpdated.getTime()) / 60000)
    : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/90 hover:bg-white/10'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {minutesAgo !== null && (
            <span className="text-xs text-white/50 hidden sm:inline">
              更新于 {minutesAgo === 0 ? '刚刚' : `${minutesAgo} 分钟前`}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
            title="刷新数据"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-white/70 ${loading ? 'animate-spin' : ''}`}>
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

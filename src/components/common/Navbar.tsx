import React from 'react';

interface NavbarProps {
  activeTab: 'dashboard' | 'workout' | 'nutrition' | 'profile';
  onSelectTab: (tab: 'dashboard' | 'workout' | 'nutrition' | 'profile') => void;
  userEmail?: string;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, userEmail, onSignOut }) => {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-zinc-950 text-lg">
            F
          </div>
          <span className="font-bold text-lg text-zinc-100">FitBee</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-amber-400 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('workout')}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              activeTab === 'workout'
                ? 'bg-zinc-800 text-amber-400 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => onSelectTab('nutrition')}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              activeTab === 'nutrition'
                ? 'bg-zinc-800 text-amber-400 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Nutrition
          </button>
          <button
            onClick={() => onSelectTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-zinc-800 text-amber-400 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Profile
          </button>
        </nav>

        {/* User Info / Logout */}
        {userEmail && (
          <div className="hidden md:flex items-center gap-3 text-xs">
            <span className="text-zinc-400">{userEmail}</span>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-zinc-400 hover:text-red-400 transition-colors font-medium"
              >
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

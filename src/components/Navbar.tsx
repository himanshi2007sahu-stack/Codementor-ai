import React from 'react';
import {
  Code2,
  Sparkles,
  Flame,
  BookOpen,
  PlayCircle,
  Terminal,
  Calendar,
  Layers,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';

export type NavTab = 'dashboard' | 'syllabus' | 'teacher' | 'visualizer' | 'lab' | 'planner';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  streakDays: number;
  currentTopicTitle?: string;
  onResetProgress: () => void;
  hasGeminiKey?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  streakDays,
  currentTopicTitle,
  onResetProgress,
  hasGeminiKey = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Terminal className="w-4 h-4" /> },
    { id: 'syllabus', label: 'My Syllabus', icon: <Layers className="w-4 h-4" /> },
    { id: 'teacher', label: 'AI Teacher', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'visualizer', label: 'Visualizer', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'lab', label: 'Coding Lab', icon: <Code2 className="w-4 h-4" /> },
    { id: 'planner', label: 'Study Planner', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070c18]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070c18] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight font-sans">
                  CodeMentor <span className="text-cyan-400 font-mono">AI</span>
                </span>
                <span className="hidden md:inline text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                  DSA Teacher
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5 hidden sm:block">
                Master Algorithms with Intuition & Visual Dry-Runs
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/80">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Status Bar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold font-mono">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
              <span>{streakDays}d Streak</span>
            </div>

            {/* AI Engine Status Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{hasGeminiKey ? 'Gemini 3.8 Active' : 'Curriculum Engine'}</span>
            </div>

            {/* Reset progress button */}
            <button
              onClick={() => {
                if (window.confirm('Reset sample progress to initial state?')) {
                  onResetProgress();
                }
              }}
              title="Reset Sample Progress"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800/80 space-y-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onSelectTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

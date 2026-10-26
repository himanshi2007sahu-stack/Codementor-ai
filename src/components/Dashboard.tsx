import React from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  Layers,
  Code2,
  Calendar,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { CollegeSyllabus, UserStats, StudyTask } from '../types/dsa';

interface DashboardProps {
  syllabus: CollegeSyllabus;
  stats: UserStats;
  tasks: StudyTask[];
  onSelectTopic: (topicId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'syllabus' | 'teacher' | 'visualizer' | 'lab' | 'planner') => void;
  onToggleTaskComplete: (taskId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  syllabus,
  stats,
  tasks,
  onSelectTopic,
  onNavigateTab,
  onToggleTaskComplete,
}) => {
  // Find next unfinished topic
  const allTopics = syllabus.modules.flatMap((m) =>
    m.topics.map((t) => ({ ...t, moduleTitle: m.title }))
  );
  const nextTopic =
    allTopics.find((t) => t.status === 'in_progress') ||
    allTopics.find((t) => t.status === 'not_started') ||
    allTopics[0];

  const completedTopicsCount = allTopics.filter((t) => t.status === 'completed').length;
  const progressPercent = allTopics.length > 0 ? Math.round((completedTopicsCount / allTopics.length) * 100) : 0;

  // Filter tasks for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.date === todayStr);

  const totalProblemsSolved =
    stats.problemsSolved.easy + stats.problemsSolved.medium + stats.problemsSolved.hard;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Hero Welcome & Continue Learning CTA */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0d1630] via-[#0b1227] to-[#070b18] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                {stats.streakDays} Day Learning Streak
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {syllabus.institution || 'University DSA Portal'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to conquer Data Structures today?
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Your personalized study roadmap is ready. Today’s goal: Master pointer invariants and complete your dry-run exercises.
            </p>

            {/* Quick stats mini-bar */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
              <div>
                <span className="text-slate-500 block">Syllabus Progress</span>
                <span className="text-white font-bold text-sm font-mono">{progressPercent}% Completed</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block">Problems Solved</span>
                <span className="text-cyan-400 font-bold text-sm font-mono">{totalProblemsSolved} Challenges</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block">Total Focus Time</span>
                <span className="text-violet-400 font-bold text-sm font-mono">{stats.totalStudyMinutes} mins</span>
              </div>
            </div>
          </div>

          {/* Continue Learning CTA Card */}
          {nextTopic && (
            <div className="bg-[#090f22]/90 border border-cyan-500/30 rounded-2xl p-6 min-w-[300px] sm:min-w-[340px] space-y-4 shadow-xl backdrop-blur-sm relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  NEXT LESSON
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                  {nextTopic.difficulty}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{nextTopic.title}</h3>
                <span className="text-xs text-slate-400 block mt-0.5">{nextTopic.moduleTitle}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> ~{nextTopic.estimatedHours}h</span>
                <span>•</span>
                <span>{nextTopic.subtopics.length} key subtopics</span>
              </div>

              <button
                onClick={() => {
                  onSelectTopic(nextTopic.id);
                  onNavigateTab('teacher');
                }}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all group"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Continue Learning
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Syllabus Completion</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{progressPercent}%</div>
            <span className="text-xs text-slate-400 mt-1 block">
              {completedTopicsCount} of {allTopics.length} topics mastered
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-cyan-400 rounded-full transition-all duration-500"
            />
          </div>
        </div>

        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Study Streak</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{stats.streakDays} Days</div>
            <span className="text-xs text-slate-400 mt-1 block">
              Daily goal met! Keep the momentum
            </span>
          </div>
          <span className="text-[10px] text-amber-400 font-mono font-bold block">
            🔥 Active Today
          </span>
        </div>

        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Problems Solved</span>
            <span className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Code2 className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{totalProblemsSolved}</div>
            <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
              <span className="text-emerald-400">{stats.problemsSolved.easy} Easy</span>
              <span>•</span>
              <span className="text-amber-400">{stats.problemsSolved.medium} Med</span>
              <span>•</span>
              <span className="text-rose-400">{stats.problemsSolved.hard} Hard</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Tasks</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {tasks.filter((t) => !t.completed).length}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              {todayTasks.filter((t) => !t.completed).length} scheduled for today
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Today's Tasks & Weekly Study Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Tasks (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1329] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white tracking-wide">Today's Study Plan</h3>
              <button
                onClick={() => onNavigateTab('planner')}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                View Full Planner →
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {todayTasks.length > 0 ? (
                todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleTaskComplete(t.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                          t.completed ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700'
                        }`}
                      >
                        {t.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <h4 className={`text-xs font-bold ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {t.topicTitle}
                        </h4>
                        <span className="text-[10px] text-slate-500">{t.durationMinutes} mins • {t.type}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTopic(t.topicId);
                        onNavigateTab('teacher');
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold shrink-0"
                    >
                      Start
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 font-mono">
                  No pending tasks for today. You're ahead of schedule!
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Daily Target: 60 minutes</span>
            <button
              onClick={() => onNavigateTab('planner')}
              className="text-cyan-400 font-semibold"
            >
              Adjust Goal
            </button>
          </div>
        </div>

        {/* Weekly Study Activity Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1329] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Weekly Study Momentum</h3>
              <p className="text-xs text-slate-400">Minutes invested and algorithmic challenges completed</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {stats.weeklyActivity.reduce((acc, d) => acc + d.minutes, 0)} Mins This Week
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-3 px-2 pt-4">
            {stats.weeklyActivity.map((day, idx) => {
              const maxMinutes = 100;
              const heightPct = Math.min(100, Math.round((day.minutes / maxMinutes) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{day.minutes}m</span>
                  <div className="w-full max-w-[36px] bg-slate-900 rounded-t-lg h-32 flex items-end p-0.5 overflow-hidden">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        idx === 5
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-lg shadow-cyan-500/20'
                          : 'bg-gradient-to-t from-violet-600/70 to-violet-400/70'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-semibold">{day.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-violet-500" /> Weekday Sessions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400" /> Weekend Deep-Work
              </span>
            </div>
            <span className="font-mono text-emerald-400 font-bold">+18% vs last week</span>
          </div>
        </div>
      </div>

      {/* 4. Quick Action Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('visualizer')}
          className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group flex flex-col justify-between min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
              <Sparkles className="w-5 h-5" />
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Algorithm Visualizer
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Arrays, Linked Lists, BST, BFS/DFS</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('lab')}
          className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group flex flex-col justify-between min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <Code2 className="w-5 h-5" />
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Java Coding Lab
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Test runner, constraints & AI reviews</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('syllabus')}
          className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-violet-500/40 text-left transition-all group flex flex-col justify-between min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500 group-hover:text-slate-950 transition-colors">
              <Layers className="w-5 h-5" />
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
              College Syllabus Hub
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Paste raw syllabus & build units</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('planner')}
          className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Clock className="w-5 h-5" />
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Spaced Flashcards
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Active recall & memory retention</p>
          </div>
        </button>
      </div>
    </div>
  );
};

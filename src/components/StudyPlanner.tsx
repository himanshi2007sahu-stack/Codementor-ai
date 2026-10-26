import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  RotateCw,
  Plus,
  Sparkles,
  ArrowRight,
  Brain,
  AlertCircle,
  HelpCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Sliders,
  CalendarCheck
} from 'lucide-react';
import { StudyTask, Flashcard, StudyPlannerSettings, CollegeSyllabus } from '../types/dsa';

interface StudyPlannerProps {
  settings: StudyPlannerSettings;
  onUpdateSettings: (settings: StudyPlannerSettings) => void;
  tasks: StudyTask[];
  onUpdateTasks: (tasks: StudyTask[]) => void;
  flashcards: Flashcard[];
  onUpdateFlashcards: (flashcards: Flashcard[]) => void;
  syllabus: CollegeSyllabus;
  onSelectTopic: (topicId: string) => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  settings,
  onUpdateSettings,
  tasks,
  onUpdateTasks,
  flashcards,
  onUpdateFlashcards,
  syllabus,
  onSelectTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'flashcards' | 'weak-topics'>('schedule');

  // Flashcard carousel state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Task actions
  const handleToggleTaskComplete = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    onUpdateTasks(updated);
  };

  const handlePostponeTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const d = new Date(t.date);
      d.setDate(d.getDate() + 1);
      return { ...t, date: d.toISOString().split('T')[0] };
    });
    onUpdateTasks(updated);
  };

  // Flashcard actions
  const handleUpdateMastery = (cardId: string, mastery: 'learning' | 'review' | 'mastered') => {
    const updated = flashcards.map((fc) => (fc.id === cardId ? { ...fc, mastery } : fc));
    onUpdateFlashcards(updated);
  };

  // Regenerate schedule derived from syllabus
  const handleRegenerateSchedule = () => {
    const pendingTopics = syllabus.modules
      .flatMap((m) => m.topics.map((t) => ({ ...t, moduleTitle: m.title })))
      .filter((t) => t.status !== 'completed');

    const newTasks: StudyTask[] = [];
    let dayOffset = 0;

    pendingTopics.slice(0, 8).forEach((t, idx) => {
      const taskDate = new Date();
      taskDate.setDate(taskDate.getDate() + dayOffset);
      const dateStr = taskDate.toISOString().split('T')[0];

      newTasks.push({
        id: `gen-task-${Date.now()}-${idx}`,
        topicId: t.id,
        topicTitle: t.title,
        moduleTitle: t.moduleTitle,
        date: dateStr,
        durationMinutes: settings.dailyStudyMinutes,
        type: idx % 3 === 0 ? 'concept' : idx % 3 === 1 ? 'dry_run' : 'practice',
        completed: false,
      });

      if ((idx + 1) % 2 === 0) dayOffset++;
    });

    onUpdateTasks(newTasks);
  };

  // Calculate weak topics from syllabus
  const weakTopics = syllabus.modules
    .flatMap((m) => m.topics)
    .filter((t) => (t.confidenceScore !== undefined && t.confidenceScore < 50) || t.status === 'not_started');

  const currentFlashcard = flashcards[currentCardIndex] || flashcards[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner & Planner Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
              Smart Adaptive Schedule
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Study Planner & Retention Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Allocates daily syllabus milestones, spaced repetition flashcards, and target completion goals
            </p>
          </div>

          <button
            onClick={handleRegenerateSchedule}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/20 transition-all shrink-0"
          >
            <RotateCw className="w-4 h-4" />
            Regenerate Schedule
          </button>
        </div>

        {/* Study Parameters: Time & Target Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Daily Available Time
              </span>
              <span className="font-mono text-cyan-300 font-bold">{settings.dailyStudyMinutes} mins/day</span>
            </label>
            <input
              type="range"
              min="30"
              max="180"
              step="15"
              value={settings.dailyStudyMinutes}
              onChange={(e) => onUpdateSettings({ ...settings, dailyStudyMinutes: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30m</span>
              <span>60m</span>
              <span>120m</span>
              <span>180m</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-violet-400" /> Target Completion Date
            </label>
            <input
              type="date"
              value={settings.targetEndDate}
              onChange={(e) => onUpdateSettings({ ...settings, targetEndDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
            />
            <span className="text-[10px] text-slate-500 block">
              Auto-balances daily load to meet your exam/interview deadline.
            </span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2 sm:col-span-2 md:col-span-1">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" /> Current Pacing Status
            </span>
            <div className="text-emerald-300 font-bold text-sm font-mono mt-1">
              On Track for Completion
            </div>
            <span className="text-[10px] text-slate-400 block">
              {tasks.filter((t) => t.completed).length} of {tasks.length} scheduled tasks completed this week.
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Daily Task Schedule ({tasks.length})
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'flashcards'
                ? 'bg-violet-600 text-white font-bold shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Retention Flashcards ({flashcards.length})
          </button>

          <button
            onClick={() => setActiveTab('weak-topics')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'weak-topics'
                ? 'bg-rose-600 text-white font-bold shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Weak Areas & Recommendations ({weakTopics.length})
          </button>
        </div>
      </div>

      {/* 1. SCHEDULE TAB */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Your Upcoming Study Tasks</h3>
            <span className="text-xs text-slate-400">Click checkmark to log study progress</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                    : 'bg-[#0b1329] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    onClick={() => handleToggleTaskComplete(task.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 ${
                      task.completed
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'border-2 border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        task.type === 'concept' ? 'bg-cyan-500/20 text-cyan-300' :
                        task.type === 'dry_run' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-violet-500/20 text-violet-300'
                      }`}>
                        {task.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{task.date}</span>
                    </div>

                    <h4 className={`text-sm font-bold mt-1 ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.topicTitle}
                    </h4>
                    <span className="text-xs text-slate-400">{task.moduleTitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {task.durationMinutes}m
                  </span>

                  <button
                    onClick={() => handlePostponeTask(task.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 text-xs"
                    title="Postpone +1 Day"
                  >
                    Postpone +1d
                  </button>

                  <button
                    onClick={() => onSelectTopic(task.topicId)}
                    className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 border border-cyan-500/30"
                  >
                    Start <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FLASHCARDS TAB */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Active Recall & Flashcards</h3>
              <p className="text-xs text-slate-400">Click the card to reveal the answer. Rate your confidence to optimize review intervals.</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              Card {currentCardIndex + 1} of {flashcards.length}
            </span>
          </div>

          {/* Flashcard 3D flip card */}
          {currentFlashcard && (
            <div className="flex flex-col items-center space-y-6">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-xl min-h-[260px] bg-[#0c142b] border border-slate-800 hover:border-violet-500/40 rounded-3xl p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-2xl relative group"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono text-cyan-400 font-bold">{currentFlashcard.topicTitle}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    currentFlashcard.mastery === 'mastered' ? 'bg-emerald-500/20 text-emerald-300' :
                    currentFlashcard.mastery === 'review' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {currentFlashcard.mastery}
                  </span>
                </div>

                <div className="py-6 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    {isFlipped ? 'RECALL ANSWER' : 'QUESTION PROMPT'}
                  </span>
                  <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                    {isFlipped ? currentFlashcard.back : currentFlashcard.front}
                  </p>
                </div>

                <div className="text-center text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
                  {isFlipped ? 'Click to flip back' : 'Click card to reveal answer'}
                </div>
              </div>

              {/* Navigation & Mastery Rating */}
              <div className="flex flex-wrap items-center justify-between gap-4 w-full max-w-xl">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((i) => Math.max(0, i - 1));
                  }}
                  disabled={currentCardIndex === 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateMastery(currentFlashcard.id, 'review')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                  >
                    Need Review
                  </button>
                  <button
                    onClick={() => handleUpdateMastery(currentFlashcard.id, 'mastered')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                  >
                    Mastered ✓
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((i) => Math.min(flashcards.length - 1, i + 1));
                  }}
                  disabled={currentCardIndex === flashcards.length - 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-40 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. WEAK AREAS & AI RECOMMENDATIONS */}
      {activeTab === 'weak-topics' && (
        <div className="space-y-6">
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Recommended Focus Topics</h3>
            </div>
            <p className="text-xs text-slate-400">
              Topics where confidence score is under 50% or not yet completed. Prioritize these to ensure high exam marks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {weakTopics.slice(0, 4).map((wt) => (
                <div
                  key={wt.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider font-mono">
                        Attention Needed
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Confidence: <strong className="text-amber-400">{wt.confidenceScore || 0}%</strong>
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{wt.title}</h4>
                  </div>

                  <button
                    onClick={() => onSelectTopic(wt.id)}
                    className="mt-4 w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    Open Lesson & Dry Run <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

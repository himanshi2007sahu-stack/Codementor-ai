import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SyllabusManager } from './components/SyllabusManager';
import { TeacherLesson } from './components/TeacherLesson';
import { VisualizerStudio, VisualizerMode } from './components/Visualizer/VisualizerStudio';
import { CodingLab } from './components/CodingLab';
import { StudyPlanner } from './components/StudyPlanner';
import {
  CollegeSyllabus,
  UserStats,
  StudyPlannerSettings,
  StudyTask,
  Flashcard,
} from './types/dsa';
import {
  getStoredSyllabus,
  saveStoredSyllabus,
  getStoredStats,
  saveStoredStats,
  getStoredSettings,
  saveStoredSettings,
  getStoredTasks,
  saveStoredTasks,
  getStoredFlashcards,
  saveStoredFlashcards,
  getStoredCurrentTopicId,
  saveStoredCurrentTopicId,
  INITIAL_STATS,
} from './utils/storage';
import { checkServerHealth } from './services/geminiService';
import { DEFAULT_SYLLABUS } from './data/defaultSyllabus';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [syllabus, setSyllabus] = useState<CollegeSyllabus>(getStoredSyllabus);
  const [stats, setStats] = useState<UserStats>(getStoredStats);
  const [settings, setSettings] = useState<StudyPlannerSettings>(getStoredSettings);
  const [tasks, setTasks] = useState<StudyTask[]>(getStoredTasks);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(getStoredFlashcards);
  const [currentTopicId, setCurrentTopicId] = useState<string>(getStoredCurrentTopicId);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('binary-search');
  const [labProblemId, setLabProblemId] = useState<string>('prob-two-sum');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);

  // Check server health and Gemini API key status on mount
  useEffect(() => {
    checkServerHealth().then((health) => {
      setHasGeminiKey(health.hasGeminiKey);
    });
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    saveStoredSyllabus(syllabus);
  }, [syllabus]);

  useEffect(() => {
    saveStoredStats(stats);
  }, [stats]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStoredFlashcards(flashcards);
  }, [flashcards]);

  useEffect(() => {
    saveStoredCurrentTopicId(currentTopicId);
  }, [currentTopicId]);

  // Topic selection handler
  const handleSelectTopic = (topicId: string) => {
    setCurrentTopicId(topicId);
    setActiveTab('teacher');
  };

  // Open Visualizer with specific mode
  const handleOpenVisualizer = (diagramType: any) => {
    const validModes: VisualizerMode[] = [
      'arrays',
      'linked-list',
      'stacks',
      'queues',
      'binary-search',
      'sorting',
      'trees',
      'recursion',
      'graphs',
    ];
    if (validModes.includes(diagramType)) {
      setVisualizerMode(diagramType);
    } else {
      setVisualizerMode('binary-search');
    }
    setActiveTab('visualizer');
  };

  // Open Problem in Coding Lab
  const handleOpenProblem = (problemId: string) => {
    setLabProblemId(problemId);
    setActiveTab('lab');
  };

  // Mark Topic Mastered
  const handleMarkTopicCompleted = (topicId: string) => {
    const isAlreadyCompleted = stats.completedTopicIds.includes(topicId);

    // Update syllabus status
    const newModules = syllabus.modules.map((m) => ({
      ...m,
      topics: m.topics.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            status: isAlreadyCompleted ? ('in_progress' as const) : ('completed' as const),
            confidenceScore: isAlreadyCompleted ? 60 : 100,
          };
        }
        return t;
      }),
    }));
    setSyllabus({ ...syllabus, modules: newModules });

    // Update stats
    const updatedCompletedTopicIds = isAlreadyCompleted
      ? stats.completedTopicIds.filter((id) => id !== topicId)
      : [...stats.completedTopicIds, topicId];

    setStats({
      ...stats,
      completedTopicIds: updatedCompletedTopicIds,
      topicsCompleted: updatedCompletedTopicIds.length,
      totalStudyMinutes: stats.totalStudyMinutes + 45,
    });
  };

  // Problem solved callback
  const handleProblemSolved = (problemId: string, difficulty: 'Easy' | 'Medium' | 'Hard') => {
    if (stats.solvedProblemIds.includes(problemId)) return;

    const diffKey = difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
    setStats({
      ...stats,
      solvedProblemIds: [...stats.solvedProblemIds, problemId],
      problemsSolved: {
        ...stats.problemsSolved,
        [diffKey]: stats.problemsSolved[diffKey] + 1,
      },
      totalStudyMinutes: stats.totalStudyMinutes + 30,
    });
  };

  // Toggle task complete in dashboard/planner
  const handleToggleTaskComplete = (taskId: string) => {
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  // Reset progress to clean defaults
  const handleResetProgress = () => {
    localStorage.clear();
    setSyllabus(DEFAULT_SYLLABUS);
    setStats(INITIAL_STATS);
    setTasks(getStoredTasks());
    setFlashcards(getStoredFlashcards());
    setCurrentTopicId('topic-binary-search');
    setActiveTab('dashboard');
  };

  // Check current topic completion status
  const isCurrentTopicCompleted = stats.completedTopicIds.includes(currentTopicId);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sleek Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        streakDays={stats.streakDays}
        currentTopicTitle={currentTopicId}
        onResetProgress={handleResetProgress}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <Dashboard
            syllabus={syllabus}
            stats={stats}
            tasks={tasks}
            onSelectTopic={handleSelectTopic}
            onNavigateTab={setActiveTab}
            onToggleTaskComplete={handleToggleTaskComplete}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusManager
            syllabus={syllabus}
            onUpdateSyllabus={setSyllabus}
            onSelectTopic={handleSelectTopic}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherLesson
            topicId={currentTopicId}
            onOpenVisualizer={handleOpenVisualizer}
            onOpenProblem={handleOpenProblem}
            onMarkTopicCompleted={handleMarkTopicCompleted}
            isCompleted={isCurrentTopicCompleted}
          />
        )}

        {activeTab === 'visualizer' && (
          <VisualizerStudio
            initialMode={visualizerMode}
            onSelectTopic={handleSelectTopic}
          />
        )}

        {activeTab === 'lab' && (
          <CodingLab
            initialProblemId={labProblemId}
            onProblemSolved={handleProblemSolved}
            solvedProblemIds={stats.solvedProblemIds}
          />
        )}

        {activeTab === 'planner' && (
          <StudyPlanner
            settings={settings}
            onUpdateSettings={setSettings}
            tasks={tasks}
            onUpdateTasks={setTasks}
            flashcards={flashcards}
            onUpdateFlashcards={setFlashcards}
            syllabus={syllabus}
            onSelectTopic={handleSelectTopic}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#050810] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CodeMentor AI</span>
            <span>—</span>
            <span>Personal Data Structures & Algorithms Teacher</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Built with React, Vite & Tailwind CSS</span>
            <span>•</span>
            <span>Java 21 Simulation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

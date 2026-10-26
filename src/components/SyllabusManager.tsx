import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Layers,
  Wand2,
  RotateCcw,
  AlertCircle,
  Save,
  Check
} from 'lucide-react';
import { CollegeSyllabus, SyllabusModule, SyllabusTopic, DSACategory, Difficulty } from '../types/dsa';
import { SYLLABUS_PRESETS, DEFAULT_SYLLABUS } from '../data/defaultSyllabus';
import { parseSyllabus } from '../services/geminiService';

interface SyllabusManagerProps {
  syllabus: CollegeSyllabus;
  onUpdateSyllabus: (newSyllabus: CollegeSyllabus) => void;
  onSelectTopic: (topicId: string) => void;
}

export const SyllabusManager: React.FC<SyllabusManagerProps> = ({
  syllabus,
  onUpdateSyllabus,
  onSelectTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'editor' | 'paste'>('roadmap');
  const [pastedText, setPastedText] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<{ moduleId: string; topic: SyllabusTopic } | null>(null);

  // Quick preset loader
  const handleLoadPreset = (rawText: string) => {
    setPastedText(rawText);
  };

  // AI Parse handler
  const handleParseSyllabus = async () => {
    if (!pastedText.trim()) return;
    setIsParsing(true);
    try {
      const parsed = await parseSyllabus(pastedText);
      onUpdateSyllabus(parsed);
      setActiveTab('roadmap');
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsing(false);
    }
  };

  // Reorder topics within a module
  const moveTopic = (moduleId: string, topicIndex: number, direction: 'up' | 'down') => {
    const newModules = syllabus.modules.map((mod) => {
      if (mod.id !== moduleId) return mod;
      const topics = [...mod.topics];
      const targetIndex = direction === 'up' ? topicIndex - 1 : topicIndex + 1;
      if (targetIndex < 0 || targetIndex >= topics.length) return mod;
      const temp = topics[topicIndex];
      topics[topicIndex] = topics[targetIndex];
      topics[targetIndex] = temp;
      return { ...mod, topics };
    });
    onUpdateSyllabus({ ...syllabus, modules: newModules });
  };

  // Delete topic
  const deleteTopic = (moduleId: string, topicId: string) => {
    const newModules = syllabus.modules.map((mod) => {
      if (mod.id !== moduleId) return mod;
      return { ...mod, topics: mod.topics.filter((t) => t.id !== topicId) };
    });
    onUpdateSyllabus({ ...syllabus, modules: newModules });
  };

  // Add new topic
  const addTopic = (moduleId: string) => {
    const newTopic: SyllabusTopic = {
      id: `topic-${Date.now()}`,
      title: 'New DSA Topic',
      category: 'basics',
      difficulty: 'Medium',
      estimatedHours: 2,
      subtopics: ['Core Concept', 'Implementation', 'Analysis'],
      status: 'not_started',
      confidenceScore: 0,
    };

    const newModules = syllabus.modules.map((mod) => {
      if (mod.id !== moduleId) return mod;
      return { ...mod, topics: [...mod.topics, newTopic] };
    });
    onUpdateSyllabus({ ...syllabus, modules: newModules });
    setEditingTopic({ moduleId, topic: newTopic });
  };

  // Save edited topic
  const handleSaveEditedTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;
    const { moduleId, topic } = editingTopic;

    const newModules = syllabus.modules.map((mod) => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        topics: mod.topics.map((t) => (t.id === topic.id ? topic : t)),
      };
    });

    onUpdateSyllabus({ ...syllabus, modules: newModules });
    setEditingTopic(null);
  };

  // Compute total topics & completion
  const allTopics = syllabus.modules.flatMap((m) => m.topics);
  const completedCount = allTopics.filter((t) => t.status === 'completed').length;
  const progressPct = allTopics.length > 0 ? Math.round((completedCount / allTopics.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner with Stats & Navigation */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              {syllabus.institution || 'University Syllabus'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {syllabus.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized roadmap built from your college units and coursework requirements
            </p>
          </div>

          {/* Overall progress indicator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 min-w-[220px]">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-500"
                  strokeDasharray={`${progressPct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono font-bold text-xs text-white">{progressPct}%</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block">Syllabus Progress</span>
              <span className="text-sm font-bold text-white">
                {completedCount} of {allTopics.length} Topics
              </span>
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Ordered Roadmap ({syllabus.modules.length} Units)
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'editor'
                ? 'bg-violet-600 text-white font-bold shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Curriculum Editor
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'paste'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Paste College Syllabus
          </button>
        </div>
      </div>

      {/* 1. ROADMAP VIEW */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8">
          {syllabus.modules.map((mod, modIdx) => (
            <div
              key={mod.id}
              className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative"
            >
              {/* Unit Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
                    U{mod.unitNumber}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{mod.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{mod.description}</p>
                  </div>
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  {mod.topics.length} Topics • {mod.topics.reduce((acc, t) => acc + t.estimatedHours, 0)} Hours
                </span>
              </div>

              {/* Topics Roadmap Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mod.topics.map((topic, topicIdx) => {
                  const isDone = topic.status === 'completed';
                  const isInProg = topic.status === 'in_progress';

                  return (
                    <div
                      key={topic.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : isInProg
                          ? 'bg-cyan-950/20 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isDone ? 'bg-emerald-500/20 text-emerald-300' :
                            isInProg ? 'bg-cyan-500/20 text-cyan-300' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {topic.status.replace('_', ' ')}
                          </span>

                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" /> {topic.estimatedHours}h
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {topic.title}
                        </h4>

                        {/* Subtopics preview */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {topic.subtopics.slice(0, 3).map((sub, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800/80"
                            >
                              {sub}
                            </span>
                          ))}
                          {topic.subtopics.length > 3 && (
                            <span className="text-[10px] text-slate-500 px-1 py-0.5">
                              +{topic.subtopics.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                        <span className={`text-[10px] font-semibold ${
                          topic.difficulty === 'Easy' ? 'text-emerald-400' :
                          topic.difficulty === 'Medium' ? 'text-amber-400' :
                          'text-rose-400'
                        }`}>
                          {topic.difficulty}
                        </span>

                        <button
                          onClick={() => onSelectTopic(topic.id)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                        >
                          Start Lesson <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. CURRICULUM EDITOR */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Reorder, Edit, or Add Topics</h3>
            <span className="text-xs text-slate-400">Use arrow buttons to adjust teaching sequence</span>
          </div>

          {syllabus.modules.map((mod) => (
            <div key={mod.id} className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-bold text-white">
                  Unit {mod.unitNumber}: {mod.title}
                </span>
                <button
                  onClick={() => addTopic(mod.id)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 border border-cyan-500/30"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Topic
                </button>
              </div>

              <div className="space-y-2">
                {mod.topics.map((t, idx) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-500 text-[11px] w-5">#{idx + 1}</span>
                      <span className="font-semibold text-white">{t.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {t.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => moveTopic(mod.id, idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveTopic(mod.id, idx, 'down')}
                        disabled={idx === mod.topics.length - 1}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingTopic({ moduleId: mod.id, topic: t })}
                        className="p-1 rounded bg-slate-800 hover:bg-cyan-500/20 text-cyan-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTopic(mod.id, t.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. PASTE COLLEGE SYLLABUS */}
      {activeTab === 'paste' && (
        <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white">Import Your University DSA Syllabus</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Paste the text from your college PDF, course portal, or syllabus document. CodeMentor AI will automatically extract units, topics, and build your personalized roadmap.
            </p>
          </div>

          {/* Quick preset chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">Or choose a pre-configured curriculum:</span>
            <div className="flex flex-wrap gap-2">
              {SYLLABUS_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadPreset(p.rawText)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition-all text-left"
                >
                  <span className="font-bold text-cyan-300 block">{p.name}</span>
                  <span className="text-[10px] text-slate-500">{p.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <textarea
              rows={10}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your college syllabus text here (e.g. Unit 1: Arrays & Complexity, Unit 2: Linked Lists, Unit 3: Stacks...)"
              className="w-full bg-[#070d1c] border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Uses Gemini AI parser with heuristic offline fallback engine.</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPastedText('')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Clear
              </button>
              <button
                onClick={handleParseSyllabus}
                disabled={isParsing || !pastedText.trim()}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
              >
                {isParsing ? (
                  <>Parsing Curriculum...</>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate My Roadmap
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleSaveEditedTopic}
            className="bg-[#0c142b] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">Edit Topic Details</h3>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Topic Title</label>
              <input
                type="text"
                value={editingTopic.topic.title}
                onChange={(e) =>
                  setEditingTopic({
                    ...editingTopic,
                    topic: { ...editingTopic.topic, title: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Difficulty</label>
                <select
                  value={editingTopic.topic.difficulty}
                  onChange={(e) =>
                    setEditingTopic({
                      ...editingTopic,
                      topic: { ...editingTopic.topic, difficulty: e.target.value as Difficulty },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Estimated Hours</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={editingTopic.topic.estimatedHours}
                  onChange={(e) =>
                    setEditingTopic({
                      ...editingTopic,
                      topic: { ...editingTopic.topic, estimatedHours: parseInt(e.target.value) || 2 },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Status</label>
              <select
                value={editingTopic.topic.status}
                onChange={(e) =>
                  setEditingTopic({
                    ...editingTopic,
                    topic: { ...editingTopic.topic, status: e.target.value as any },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed / Mastered</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTopic(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
              >
                Save Topic
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

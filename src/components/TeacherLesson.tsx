import React, { useState } from 'react';
import {
  Sparkles,
  Languages,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Send,
  Loader2,
  ArrowRight,
  Cpu,
  Clock,
  Zap,
  Check,
  X
} from 'lucide-react';
import { TopicDetail } from '../types/dsa';
import { TOPIC_DETAILS } from '../data/curriculumDetails';
import { askGeminiTeacher, TeacherResponse } from '../services/geminiService';

interface TeacherLessonProps {
  topicId: string;
  onOpenVisualizer: (mode: any) => void;
  onOpenProblem: (problemId: string) => void;
  onMarkTopicCompleted: (topicId: string) => void;
  isCompleted: boolean;
}

export const TeacherLesson: React.FC<TeacherLessonProps> = ({
  topicId,
  onOpenVisualizer,
  onOpenProblem,
  onMarkTopicCompleted,
  isCompleted,
}) => {
  const detail: TopicDetail = TOPIC_DETAILS[topicId] || TOPIC_DETAILS['topic-binary-search'];

  // Language & explanation style toggle
  const [style, setStyle] = useState<'english' | 'hinglish'>('english');

  // Interactive line-by-line code viewer state
  const [selectedLine, setSelectedLine] = useState<number>(3);

  // Dry run step viewer
  const [dryRunStepIndex, setDryRunStepIndex] = useState<number>(0);

  // AI Modal/Drawer state
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<TeacherResponse | null>(null);
  const [aiActiveAction, setAiActiveAction] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string>('');

  // Quiz state
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Trigger AI Action
  const triggerAiAction = async (action: 'explain-simply' | 'another-example' | 'hint' | 'explain-code' | 'ask') => {
    setAiActiveAction(action);
    setAiLoading(true);
    setAiResponse(null);

    const res = await askGeminiTeacher({
      topic: detail.title,
      mode: action,
      context: action === 'explain-code' ? detail.javaCode : detail.whatItIs,
      question: action === 'ask' ? customQuestion : undefined,
      language: 'Java',
      style: style,
    });

    setAiResponse(res);
    setAiLoading(false);
  };

  // Handle quiz option select
  const handleSelectQuizOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    detail.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* 1. Header Banner & Quick Actions */}
      <div className="bg-gradient-to-br from-[#0c142b] via-[#090e1f] to-[#060a14] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {detail.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                detail.difficulty === 'Easy' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                detail.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              }`}>
                {detail.difficulty}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> ~{detail.estimatedHours} Hours
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {detail.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {detail.whatItIs}
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <button
              onClick={() => onMarkTopicCompleted(detail.id)}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? 'Topic Mastered ✓' : 'Mark as Mastered'}
            </button>

            <button
              onClick={() => onOpenVisualizer(detail.diagramType)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm font-semibold transition-all"
            >
              <PlayCircle className="w-4 h-4 text-cyan-400" />
              Launch Visualizer
            </button>
          </div>
        </div>

        {/* AI Quick Actions Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI DSA Teacher Actions</span>
            </div>

            {/* Language style switcher */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setStyle('english')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  style === 'english'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setStyle('hinglish')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  style === 'hinglish'
                    ? 'bg-violet-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                Hinglish
              </button>
            </div>
          </div>

          {/* Interactive action pills */}
          <div className="flex flex-wrap gap-2.5 mt-4">
            <button
              onClick={() => triggerAiAction('explain-simply')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Explain Simply
            </button>

            <button
              onClick={() => triggerAiAction('another-example')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Show Another Example
            </button>

            <button
              onClick={() => triggerAiAction('hint')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Give Me a Hint
            </button>

            <button
              onClick={() => triggerAiAction('explain-code')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              Explain This Code
            </button>

            <button
              onClick={() => {
                setShowQuizModal(true);
                setQuizSubmitted(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-semibold transition-all ml-auto"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Take Quiz ({detail.quiz.length} Questions)
            </button>
          </div>

          {/* Ask AI custom question input */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && customQuestion.trim() && triggerAiAction('ask')}
              placeholder={`Ask CodeMentor AI any doubt about ${detail.title} (e.g. why is low <= high required?)...`}
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              onClick={() => customQuestion.trim() && triggerAiAction('ask')}
              disabled={aiLoading || !customQuestion.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Ask
            </button>
          </div>
        </div>
      </div>

      {/* AI Teacher Response Box (when triggered) */}
      {(aiLoading || aiResponse) && (
        <div className="bg-[#0e162e] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">
                CodeMentor AI — {aiActiveAction?.replace('-', ' ')}
              </span>
            </div>
            {aiResponse?.fallback && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Offline Curriculum Fallback Engine
              </span>
            )}
          </div>

          {aiLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span>Analyzing curriculum algorithms & drafting response...</span>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
              {aiResponse?.text}
            </div>
          )}
        </div>
      )}

      {/* 2. Why Needed & Real-World Industry Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400">
            <Cpu className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Why It Is Needed</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {detail.whyNeeded}
          </p>
        </div>

        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-violet-400">
            <ExternalLink className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Where Tech Giants Use It</h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {detail.whereUsed.map((use, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Intuitive Explanation (English & Hinglish) */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Beginner-Friendly Explanation ({style === 'english' ? 'Simple English' : 'Hinglish Mode'})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {style === 'hinglish' ? 'Conversational Hindi + Tech Terms' : 'Analogy-first pedagogy'}
          </span>
        </div>

        <div className="prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
          {style === 'english' ? detail.explanationEnglish : detail.explanationHinglish}
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">Everyday Real-Life Analogy</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{detail.realLifeAnalogy}</p>
          </div>
        </div>
      </div>

      {/* 4. Step-by-Step Interactive Dry Run */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Step-by-Step Algorithm Dry Run</h3>
            <p className="text-xs text-slate-400">Walk through pointer positions and variable state changes step-by-step</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDryRunStepIndex((i) => Math.max(0, i - 1))}
              disabled={dryRunStepIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold border border-slate-800"
            >
              Previous
            </button>
            <span className="text-xs font-mono text-cyan-400 font-bold px-2">
              Step {dryRunStepIndex + 1} of {detail.dryRunSteps.length}
            </span>
            <button
              onClick={() => setDryRunStepIndex((i) => Math.min(detail.dryRunSteps.length - 1, i + 1))}
              disabled={dryRunStepIndex === detail.dryRunSteps.length - 1}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 text-xs font-bold transition-all shadow-md"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Current Dry Run Step Card */}
        {detail.dryRunSteps[dryRunStepIndex] && (
          <div className="bg-[#090e1e] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                Phase #{detail.dryRunSteps[dryRunStepIndex].step}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Active Line: <strong className="text-amber-400">Line {detail.dryRunSteps[dryRunStepIndex].activeCodeLine || 1}</strong>
              </span>
            </div>

            <h4 className="text-sm font-semibold text-white">
              {detail.dryRunSteps[dryRunStepIndex].description}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {detail.dryRunSteps[dryRunStepIndex].explanation}
            </p>

            {/* Variable Table State */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                Memory Variables Snapshot
              </span>
              <div className="flex flex-wrap gap-3">
                {Object.entries(detail.dryRunSteps[dryRunStepIndex].variables).map(([key, val]) => (
                  <div key={key} className="bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800 text-xs font-mono">
                    <span className="text-cyan-400 font-semibold">{key}: </span>
                    <span className="text-amber-300 font-bold">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Java Code Explained Line-by-Line */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Java Implementation (Interactive Line Inspector)
            </h3>
            <p className="text-xs text-slate-400">Click or hover any line to view its algorithmic breakdown and pointer invariants</p>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 text-xs font-mono border border-slate-700">
            Language: Java 21 LTS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Code block */}
          <div className="lg:col-span-3 bg-[#080d1a] border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto shadow-inner">
            {detail.javaCodeLines.map((item) => {
              const isSelected = selectedLine === item.line;
              return (
                <div
                  key={item.line}
                  onClick={() => setSelectedLine(item.line)}
                  className={`flex items-start gap-3 py-1 px-2 rounded cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-100 border-l-2 border-cyan-400'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <span className="w-6 text-slate-600 select-none text-right shrink-0">{item.line}</span>
                  <pre className="m-0 font-mono text-xs whitespace-pre">{item.code}</pre>
                </div>
              );
            })}
          </div>

          {/* Line explanation inspector */}
          <div className="lg:col-span-2 bg-[#090e1f] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400">Line #{selectedLine} Breakdown</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Inspector</span>
              </div>

              {(() => {
                const activeExplanation = detail.javaCodeLines.find((l) => l.line === selectedLine) || detail.javaCodeLines[0];
                return (
                  <div className="space-y-3">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-cyan-200">
                      {activeExplanation.code}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeExplanation.explanation}
                    </p>
                    {activeExplanation.note && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                        {activeExplanation.note}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
              💡 Tip: Trace pointer movements on scratchpad before coding.
            </div>
          </div>
        </div>
      </div>

      {/* 6. Time & Space Complexity Breakdown */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h3 className="text-base font-bold text-white tracking-wide pb-3 border-b border-slate-800">
          Asymptotic Time & Space Complexity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 block">Best Case</span>
            <span className="text-base font-mono font-bold text-emerald-400 mt-1 block">
              {detail.timeComplexity.best}
            </span>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 block">Average Case</span>
            <span className="text-base font-mono font-bold text-cyan-400 mt-1 block">
              {detail.timeComplexity.average}
            </span>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 block">Worst Case</span>
            <span className="text-base font-mono font-bold text-amber-400 mt-1 block">
              {detail.timeComplexity.worst}
            </span>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 block">Auxiliary Space</span>
            <span className="text-base font-mono font-bold text-purple-400 mt-1 block">
              {detail.spaceComplexity.complexity}
            </span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
          <strong>Mathematical Proof & Rationale:</strong> {detail.timeComplexity.explanation} {detail.spaceComplexity.explanation}
        </div>
      </div>

      {/* 7. Common Mistakes & Edge Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Common Pitfalls & Mistakes</h3>
          </div>
          <div className="space-y-3">
            {detail.commonMistakes.map((m, idx) => (
              <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-rose-500/20 text-xs space-y-1">
                <span className="text-rose-300 font-semibold block">⚠️ {m.mistake}</span>
                <span className="text-slate-300 block">💡 <strong>Fix:</strong> {m.fix}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Critical Edge Cases to Test</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {detail.edgeCases.map((edge, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{edge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 8. Practice Problems (Solve in Lab) */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Targeted Coding Problems for {detail.title}
            </h3>
            <p className="text-xs text-slate-400">Open directly in the interactive Java Coding Lab with test cases</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {detail.problemIds.map((probId) => (
            <div
              key={probId}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    Java
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400">Interview Core</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {probId.replace('prob-', '').replace(/-/g, ' ').toUpperCase()}
                </h4>
              </div>

              <button
                onClick={() => onOpenProblem(probId)}
                className="mt-4 w-full py-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                Solve in Lab <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0c142b] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowQuizModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider font-mono">Concept Check</span>
              <h3 className="text-xl font-bold text-white mt-1">{detail.title} — Quiz</h3>
              <p className="text-xs text-slate-400 mt-1">Answer the questions below to test your algorithmic comprehension.</p>
            </div>

            <div className="space-y-6">
              {detail.quiz.map((q, qIdx) => {
                const selectedOpt = quizAnswers[q.id];
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div key={q.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <span className="text-xs text-slate-400 font-mono font-bold">Question {qIdx + 1}:</span>
                    <h4 className="text-sm font-semibold text-white">{q.question}</h4>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 border-slate-800';

                        if (selectedOpt === optIdx) {
                          btnStyle = 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50';
                        }

                        if (quizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-semibold';
                          } else if (selectedOpt === optIdx && !isCorrect) {
                            btnStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOption(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIdx === q.correctIndex && (
                              <Check className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                        <span className="font-bold text-cyan-400 block mb-1">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {quizSubmitted ? (
                <div className="text-sm font-bold text-emerald-400">
                  Your Score: {calculateQuizScore()} / {detail.quiz.length} Correct!
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  Answer all questions then submit
                </div>
              )}

              <div className="flex gap-2">
                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <button
                    onClick={() => setShowQuizModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

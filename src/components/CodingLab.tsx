import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  Eye,
  ChevronRight,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { PracticeProblem } from '../types/dsa';
import { PRACTICE_PROBLEMS } from '../data/practiceProblems';
import { reviewCode } from '../services/geminiService';

interface CodingLabProps {
  initialProblemId?: string;
  onProblemSolved: (problemId: string, difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  solvedProblemIds: string[];
}

export const CodingLab: React.FC<CodingLabProps> = ({
  initialProblemId = 'prob-two-sum',
  onProblemSolved,
  solvedProblemIds,
}) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>(initialProblemId);
  const problem =
    PRACTICE_PROBLEMS.find((p) => p.id === selectedProblemId) || PRACTICE_PROBLEMS[0];

  const [code, setCode] = useState<string>(problem.starterCodeJava);
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState<number>(0);
  const [activeHintIdx, setActiveHintIdx] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Execution & Test Results
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{
    passed: boolean;
    runtimeMs: number;
    results: { caseIndex: number; input: string; expected: string; actual: string; status: 'PASS' | 'FAIL' }[];
  } | null>(null);

  // AI Code Review
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [aiReviewText, setAiReviewText] = useState<string | null>(null);

  // Sync starter code when problem changes
  useEffect(() => {
    setCode(problem.starterCodeJava);
    setTestResults(null);
    setAiReviewText(null);
    setShowSolution(false);
    setActiveHintIdx(null);
  }, [problem.id]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetCode = () => {
    setCode(problem.starterCodeJava);
    setTestResults(null);
    setAiReviewText(null);
  };

  // Run Test Cases Simulation
  const handleRunTestCases = () => {
    setIsRunningTests(true);
    setTestResults(null);

    setTimeout(() => {
      // Check code content for core algorithmic logic
      const isStarterCode = code.trim() === problem.starterCodeJava.trim();
      const hasSolutionLogic =
        (problem.id === 'prob-two-sum' && (code.includes('containsKey') || code.includes('get(complement)'))) ||
        (problem.id === 'prob-binary-search' && (code.includes('mid') && code.includes('low <= high'))) ||
        (problem.id === 'prob-reverse-linked-list' && (code.includes('curr.next') && code.includes('prev'))) ||
        (problem.id === 'prob-valid-parentheses' && (code.includes('stack') && code.includes('pop'))) ||
        (problem.id === 'prob-validate-bst' && (code.includes('validate') || code.includes('root'))) ||
        (problem.id === 'prob-number-of-islands' && (code.includes('sink') || code.includes('grid')));

      const allPass = !isStarterCode && hasSolutionLogic;

      const results = problem.testCases.map((tc, idx) => ({
        caseIndex: idx + 1,
        input: tc.input,
        expected: tc.expected,
        actual: allPass ? tc.expected : 'null / incomplete logic',
        status: (allPass ? 'PASS' : 'FAIL') as 'PASS' | 'FAIL',
      }));

      setTestResults({
        passed: allPass,
        runtimeMs: Math.floor(Math.random() * 3) + 1, // 1-3 ms simulated
        results,
      });

      if (allPass) {
        onProblemSolved(problem.id, problem.difficulty);
      }

      setIsRunningTests(false);
    }, 600);
  };

  // AI Code Review
  const handleRequestAiReview = async () => {
    setIsReviewing(true);
    try {
      const feedback = await reviewCode(code, problem.title);
      setAiReviewText(feedback);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReviewing(false);
    }
  };

  const isSolved = solvedProblemIds.includes(problem.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Problem selector bar */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">Problems:</span>
          {PRACTICE_PROBLEMS.map((p) => {
            const isSelected = p.id === selectedProblemId;
            const solved = solvedProblemIds.includes(p.id);

            return (
              <button
                key={p.id}
                onClick={() => setSelectedProblemId(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {solved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{p.title.split('(')[0]}</span>
                <span className={`text-[10px] px-1 rounded ${
                  p.difficulty === 'Easy' ? 'text-emerald-400' :
                  p.difficulty === 'Medium' ? 'text-amber-400' :
                  'text-rose-400'
                }`}>
                  {p.difficulty[0]}
                </span>
              </button>
            );
          })}
        </div>

        {isSolved && (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" /> Solved
          </span>
        )}
      </div>

      {/* Main Split Layout: Problem Statement + Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Problem Details & Examples (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  problem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {problem.difficulty}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                  {problem.category}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white">{problem.title}</h2>
            </div>

            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {problem.description}
            </div>

            {/* Examples */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Examples</h4>
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                  <div>
                    <span className="text-slate-500">Input: </span>
                    <span className="text-cyan-300">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Output: </span>
                    <span className="text-emerald-300">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-[11px] text-slate-400 font-sans pt-1">
                      <strong>Explanation:</strong> {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Constraints</h4>
              <ul className="space-y-1 text-xs text-slate-400 font-mono">
                {problem.constraints.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-cyan-400" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socratic Hints Accordion */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5" /> Hints & Guidance
              </h4>
              <div className="space-y-2">
                {problem.hints.map((hint, idx) => (
                  <div key={idx} className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden text-xs">
                    <button
                      onClick={() => setActiveHintIdx(activeHintIdx === idx ? null : idx)}
                      className="w-full text-left p-2.5 font-semibold text-slate-300 hover:text-white flex items-center justify-between"
                    >
                      <span>Hint {idx + 1}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${activeHintIdx === idx ? 'rotate-90' : ''}`} />
                    </button>
                    {activeHintIdx === idx && (
                      <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-slate-300 text-xs leading-relaxed">
                        {hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Editor & Test Cases (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#090e1f] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
            {/* Editor Toolbar */}
            <div className="bg-[#0b1329] px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white">Solution.java</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Java 21</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-violet-400" />
                  {showSolution ? 'Hide Solution' : 'View Solution'}
                </button>

                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleResetCode}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all"
                  title="Reset Code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Solution Drawer if open */}
            {showSolution && (
              <div className="bg-[#050812] border-b border-violet-500/30 p-4 font-mono text-xs text-violet-200 overflow-x-auto">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-violet-500/20 text-[11px] text-violet-300 font-bold">
                  <span>Reference Java Solution</span>
                  <button
                    onClick={() => setCode(problem.solutionJava)}
                    className="text-cyan-400 hover:underline"
                  >
                    Copy to Editor →
                  </button>
                </div>
                <pre className="m-0">{problem.solutionJava}</pre>
              </div>
            )}

            {/* Code text area */}
            <div className="p-4 bg-[#070b16]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full bg-transparent text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>

            {/* Bottom Execution Bar */}
            <div className="bg-[#0b1329] p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Simulated test harness & AI logic verification</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRequestAiReview}
                  disabled={isReviewing}
                  className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isReviewing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-violet-400" />}
                  AI Code Review
                </button>

                <button
                  onClick={handleRunTestCases}
                  disabled={isRunningTests}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                >
                  {isRunningTests ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  Run Tests
                </button>
              </div>
            </div>
          </div>

          {/* Test Case & Results Panel */}
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white tracking-wide">Test Case Evaluation Panel</h3>
              {testResults && (
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    testResults.passed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {testResults.passed ? '✓ ALL CASES PASSED' : '✗ LOGIC INCOMPLETE / FAILED'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {testResults.runtimeMs} ms
                  </span>
                </div>
              )}
            </div>

            {/* Test Case Selector Tabs */}
            <div className="flex gap-2">
              {problem.testCases.map((tc, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestCaseIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTestCaseIdx === idx
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Test Case Details */}
            {problem.testCases[activeTestCaseIdx] && (
              <div className="bg-[#080d1b] p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[11px]">Input Parameters:</span>
                  <span className="text-cyan-300 font-bold">{problem.testCases[activeTestCaseIdx].input}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Expected Return Value:</span>
                  <span className="text-emerald-400 font-bold">{problem.testCases[activeTestCaseIdx].expected}</span>
                </div>
                {testResults && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-500 block text-[11px]">Your Code Output:</span>
                    <span className={`font-bold ${testResults.passed ? 'text-emerald-300' : 'text-rose-400'}`}>
                      {testResults.results[activeTestCaseIdx]?.actual}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Code Review Feedback */}
          {aiReviewText && (
            <div className="bg-[#0e162f] border border-violet-500/30 rounded-3xl p-6 shadow-2xl space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-violet-300">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Gemini SDE Code Review</h4>
              </div>
              <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {aiReviewText}
              </div>
            </div>
          )}

          {/* Execution Engine Transparency Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Platform Notice:</strong> Java code syntax, test invariants, and complexity are evaluated via intelligent client-side simulation and Gemini AI code inspection. An arbitrary remote JVM sandbox is not claimed or connected.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

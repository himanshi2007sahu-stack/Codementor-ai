import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  Layers,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

export type VisualizerMode =
  | 'arrays'
  | 'linked-list'
  | 'stacks'
  | 'queues'
  | 'binary-search'
  | 'sorting'
  | 'trees'
  | 'recursion'
  | 'graphs';

interface VisualizerStudioProps {
  initialMode?: VisualizerMode;
  onSelectTopic?: (topicId: string) => void;
}

export const VisualizerStudio: React.FC<VisualizerStudioProps> = ({
  initialMode = 'binary-search',
  onSelectTopic
}) => {
  const [mode, setMode] = useState<VisualizerMode>(initialMode);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(800);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Array / Binary Search / Sorting state
  const [arrayData, setArrayData] = useState<number[]>([12, 24, 35, 48, 59, 71, 83, 95]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [bsPointers, setBsPointers] = useState<{ low: number; mid: number; high: number }>({ low: 0, mid: 3, high: 7 });
  const [bsTarget, setBsTarget] = useState<number>(59);

  // Linked list state
  const [linkedList, setLinkedList] = useState<{ id: string; val: number; nextId: string | null }[]>([
    { id: 'n1', val: 10, nextId: 'n2' },
    { id: 'n2', val: 25, nextId: 'n3' },
    { id: 'n3', val: 40, nextId: 'n4' },
    { id: 'n4', val: 75, nextId: null },
  ]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>('n1');
  const [llNewVal, setLlNewVal] = useState<number>(50);

  // Stack state
  const [stackItems, setStackItems] = useState<number[]>([15, 30, 45]);
  const [stackInput, setStackInput] = useState<number>(60);

  // Queue state
  const [queueItems, setQueueItems] = useState<number[]>([10, 20, 30, 40]);
  const [queueInput, setQueueInput] = useState<number>(50);

  // Sorting state
  const [sortArray, setSortArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sortType, setSortType] = useState<'bubble' | 'selection' | 'insertion'>('bubble');

  // Tree / BST state
  const [bstNodes, setBstNodes] = useState<{ val: number; left?: number; right?: number }[]>([
    { val: 50, left: 30, right: 70 },
    { val: 30, left: 20, right: 40 },
    { val: 70, left: 60, right: 85 },
    { val: 20 },
    { val: 40 },
    { val: 60 },
    { val: 85 },
  ]);
  const [highlightTreeVal, setHighlightTreeVal] = useState<number | null>(null);

  // Recursion call stack state
  const [recursionStack, setRecursionStack] = useState<{ func: string; n: number; returnVal?: number; state: string }[]>([]);
  const [recursionN, setRecursionN] = useState<number>(4);

  // Graph state
  const [graphVisited, setGraphVisited] = useState<number[]>([0]);
  const [graphQueue, setGraphQueue] = useState<number[]>([0]);
  const [graphCurrent, setGraphCurrent] = useState<number>(0);

  // Timer reference for playback
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMode(initialMode);
    resetSimulation(initialMode);
  }, [initialMode]);

  // Reset simulation based on mode
  const resetSimulation = (selectedMode = mode) => {
    setIsPlaying(false);
    setStepIndex(0);
    setActiveIndices([]);
    setSortedIndices([]);

    if (selectedMode === 'binary-search') {
      const arr = [12, 24, 35, 48, 59, 71, 83, 95];
      setArrayData(arr);
      setBsPointers({ low: 0, mid: Math.floor((0 + arr.length - 1) / 2), high: arr.length - 1 });
      setLogMessages(['Initialized Binary Search. Target = ' + bsTarget + ', Low = 0, High = 7']);
    } else if (selectedMode === 'sorting') {
      const initial = [64, 34, 25, 12, 22, 11, 90];
      setSortArray(initial);
      setLogMessages(['Loaded array: [' + initial.join(', ') + ']. Ready to sort using ' + sortType + ' sort.']);
    } else if (selectedMode === 'arrays') {
      setArrayData([10, 20, 30, 40, 50]);
      setLogMessages(['Array initialized with 5 elements. Ready for index access or two-pointer reversal.']);
    } else if (selectedMode === 'linked-list') {
      setLinkedList([
        { id: 'n1', val: 10, nextId: 'n2' },
        { id: 'n2', val: 25, nextId: 'n3' },
        { id: 'n3', val: 40, nextId: 'n4' },
        { id: 'n4', val: 75, nextId: null },
      ]);
      setActiveNodeId('n1');
      setLogMessages(['Linked list initialized: 10 -> 25 -> 40 -> 75 -> null']);
    } else if (selectedMode === 'stacks') {
      setStackItems([15, 30, 45]);
      setLogMessages(['Stack initialized. Top element: 45. LIFO policy active.']);
    } else if (selectedMode === 'queues') {
      setQueueItems([10, 20, 30, 40]);
      setLogMessages(['Queue initialized. Front element: 10, Rear element: 40. FIFO active.']);
    } else if (selectedMode === 'trees') {
      setHighlightTreeVal(50);
      setLogMessages(['BST root is 50. Left subtree values < 50, Right subtree values > 50.']);
    } else if (selectedMode === 'recursion') {
      setRecursionStack([{ func: 'factorial', n: recursionN, state: 'Calling factorial(' + recursionN + ')' }]);
      setLogMessages(['Recursion started: factorial(' + recursionN + ') pushed to call stack.']);
    } else if (selectedMode === 'graphs') {
      setGraphVisited([0]);
      setGraphQueue([0]);
      setGraphCurrent(0);
      setLogMessages(['Graph BFS started at Node 0. Enqueued 0, visited = {0}.']);
    }
  };

  // Step Forward handler
  const stepForward = () => {
    if (mode === 'binary-search') {
      const { low, high } = bsPointers;
      if (low > high) {
        setLogMessages((prev) => ['Target not found in array. Search space exhausted (low > high).', ...prev]);
        setIsPlaying(false);
        return;
      }
      const mid = low + Math.floor((high - low) / 2);
      const midVal = arrayData[mid];

      setActiveIndices([mid]);

      if (midVal === bsTarget) {
        setSortedIndices([mid]);
        setBsPointers({ low, mid, high });
        setLogMessages((prev) => [`🎯 Target ${bsTarget} FOUND at index ${mid}! (midVal == target)`, ...prev]);
        setIsPlaying(false);
      } else if (midVal < bsTarget) {
        const nextLow = mid + 1;
        setBsPointers({ low: nextLow, mid: nextLow + Math.floor((high - nextLow) / 2), high });
        setLogMessages((prev) => [
          `Index ${mid} value (${midVal}) < target (${bsTarget}). Discard left half. New search window: [${nextLow}..${high}]`,
          ...prev,
        ]);
      } else {
        const nextHigh = mid - 1;
        setBsPointers({ low, mid: low + Math.floor((nextHigh - low) / 2), high: nextHigh });
        setLogMessages((prev) => [
          `Index ${mid} value (${midVal}) > target (${bsTarget}). Discard right half. New search window: [${low}..${nextHigh}]`,
          ...prev,
        ]);
      }
      setStepIndex((s) => s + 1);
    } else if (mode === 'sorting') {
      // Step single iteration of bubble sort
      const arr = [...sortArray];
      let swapped = false;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          setActiveIndices([i, i + 1]);
          setSortArray(arr);
          setLogMessages((prev) => [`Swapped ${temp} and ${arr[i]} at indices ${i} and ${i + 1}.`, ...prev]);
          swapped = true;
          break;
        }
      }
      if (!swapped) {
        setSortedIndices(arr.map((_, idx) => idx));
        setLogMessages((prev) => ['🎉 Array is completely sorted!', ...prev]);
        setIsPlaying(false);
      }
      setStepIndex((s) => s + 1);
    } else if (mode === 'recursion') {
      // Progress recursion
      const current = recursionStack[recursionStack.length - 1];
      if (current && current.n > 1) {
        const nextN = current.n - 1;
        setRecursionStack((prev) => [
          ...prev,
          { func: 'factorial', n: nextN, state: `Calling factorial(${nextN})` },
        ]);
        setLogMessages((prev) => [`Pushed stack frame: factorial(${nextN}) (Base case n==1 not reached)`, ...prev]);
      } else {
        setLogMessages((prev) => [
          `Reached base case n=1 (returns 1). Unwinding stack: computing results backwards!`,
          ...prev,
        ]);
        setIsPlaying(false);
      }
      setStepIndex((s) => s + 1);
    } else if (mode === 'graphs') {
      // Simple BFS step
      const adj: Record<number, number[]> = {
        0: [1, 2],
        1: [0, 3],
        2: [0, 3, 4],
        3: [1, 2, 5],
        4: [2, 5],
        5: [3, 4],
      };
      if (graphQueue.length > 0) {
        const curr = graphQueue[0];
        const remainingQ = graphQueue.slice(1);
        const neighbors = adj[curr] || [];
        const unvisitedNeighbors = neighbors.filter((n) => !graphVisited.includes(n));

        const newVisited = [...graphVisited, ...unvisitedNeighbors];
        const newQueue = [...remainingQ, ...unvisitedNeighbors];

        setGraphCurrent(curr);
        setGraphVisited(newVisited);
        setGraphQueue(newQueue);
        setLogMessages((prev) => [
          `Dequeued node ${curr}. Enqueued unvisited neighbors: [${unvisitedNeighbors.join(', ')}].`,
          ...prev,
        ]);
      } else {
        setLogMessages((prev) => ['All connected graph nodes explored via BFS.', ...prev]);
        setIsPlaying(false);
      }
      setStepIndex((s) => s + 1);
    } else {
      setStepIndex((s) => s + 1);
    }
  };

  // Automatic playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        stepForward();
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speedMs, bsPointers, sortArray, recursionStack, graphQueue]);

  // Stack operations
  const handleStackPush = () => {
    if (stackItems.length >= 7) {
      setLogMessages((prev) => ['Stack Overflow warning: maximum display height reached!', ...prev]);
      return;
    }
    setStackItems((prev) => [...prev, stackInput]);
    setLogMessages((prev) => [`Pushed ${stackInput} to top of stack. New Top: ${stackInput}`, ...prev]);
    setStackInput((prev) => prev + 15);
  };

  const handleStackPop = () => {
    if (stackItems.length === 0) {
      setLogMessages((prev) => ['Stack Underflow: stack is already empty! Cannot pop.', ...prev]);
      return;
    }
    const popped = stackItems[stackItems.length - 1];
    setStackItems((prev) => prev.slice(0, prev.length - 1));
    setLogMessages((prev) => [`Popped top element (${popped}) from stack.`, ...prev]);
  };

  // Queue operations
  const handleQueueEnqueue = () => {
    if (queueItems.length >= 8) {
      setLogMessages((prev) => ['Queue is full for this display window!', ...prev]);
      return;
    }
    setQueueItems((prev) => [...prev, queueInput]);
    setLogMessages((prev) => [`Enqueued ${queueInput} at Rear of queue.`, ...prev]);
    setQueueInput((prev) => prev + 10);
  };

  const handleQueueDequeue = () => {
    if (queueItems.length === 0) {
      setLogMessages((prev) => ['Queue is empty! Cannot dequeue.', ...prev]);
      return;
    }
    const dequeued = queueItems[0];
    setQueueItems((prev) => prev.slice(1));
    setLogMessages((prev) => [`Dequeued Front element (${dequeued}) from queue. (FIFO principle)`, ...prev]);
  };

  // Linked list operations
  const handleLinkedListInsertHead = () => {
    const newId = 'n' + (Date.now() % 1000);
    const newHead = { id: newId, val: llNewVal, nextId: linkedList[0]?.id || null };
    setLinkedList([newHead, ...linkedList]);
    setLogMessages((prev) => [`Inserted new Node(${llNewVal}) at Head in O(1) time.`, ...prev]);
    setLlNewVal((v) => v + 5);
  };

  const handleLinkedListReverse = () => {
    // Reverse array representation
    const reversed = [...linkedList].reverse().map((node, i, arr) => ({
      ...node,
      nextId: arr[i + 1] ? arr[i + 1].id : null,
    }));
    setLinkedList(reversed);
    setLogMessages((prev) => ['Reversed linked list pointers in-place! New head: ' + reversed[0]?.val, ...prev]);
  };

  const modes: { id: VisualizerMode; label: string; badge: string }[] = [
    { id: 'binary-search', label: 'Binary Search', badge: 'O(log n)' },
    { id: 'sorting', label: 'Sorting Suite', badge: 'O(n log n)' },
    { id: 'arrays', label: 'Arrays & Two-Pointer', badge: 'O(1) Access' },
    { id: 'linked-list', label: 'Linked List', badge: 'Pointers' },
    { id: 'stacks', label: 'Stack (LIFO)', badge: 'Push/Pop' },
    { id: 'queues', label: 'Queue (FIFO)', badge: 'Enqueue/Dequeue' },
    { id: 'trees', label: 'BST & Trees', badge: 'Hierarchy' },
    { id: 'recursion', label: 'Recursion Call Tree', badge: 'Stack Frames' },
    { id: 'graphs', label: 'Graph BFS / DFS', badge: 'Network' },
  ];

  return (
    <div className="space-y-6">
      {/* Visualizer header & mode selector */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Interactive Algorithm & DSA Visualizer</h2>
                <p className="text-xs sm:text-sm text-slate-400">Step-by-step memory simulation with live pointers and state inspection</p>
              </div>
            </div>
          </div>

          {/* Controls toolbar */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={stepForward}
              disabled={isPlaying}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 disabled:opacity-50"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Next Step
            </button>

            <button
              onClick={() => resetSimulation()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            {/* Speed slider */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs text-slate-400">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Speed:</span>
              <input
                type="range"
                min="200"
                max="1500"
                step="100"
                value={1700 - speedMs}
                onChange={(e) => setSpeedMs(1700 - parseInt(e.target.value))}
                className="w-16 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
          {modes.map((m) => {
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  resetSimulation(m.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{m.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800 text-slate-500'}`}>
                  {m.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main visualization display stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#090f20] border border-slate-800/90 rounded-2xl p-6 min-h-[380px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top visualizer status bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3 mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">{mode.replace('-', ' ')} SIMULATION</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Step Count: <strong className="text-cyan-400">{stepIndex}</strong></span>
              {mode === 'binary-search' && (
                <span>Target: <strong className="text-amber-400 font-mono">{bsTarget}</strong></span>
              )}
            </div>
          </div>

          {/* Canvas Area: dynamic per mode */}
          <div className="flex-1 flex items-center justify-center py-6 relative z-10">
            {/* 1. BINARY SEARCH VISUALIZER */}
            {mode === 'binary-search' && (
              <div className="w-full space-y-8">
                {/* Visual array slots */}
                <div className="flex flex-wrap justify-center gap-3">
                  {arrayData.map((val, idx) => {
                    const isLow = idx === bsPointers.low;
                    const isMid = idx === bsPointers.mid;
                    const isHigh = idx === bsPointers.high;
                    const isOutOfRange = idx < bsPointers.low || idx > bsPointers.high;
                    const isFound = sortedIndices.includes(idx);

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        {/* Pointer badges above */}
                        <div className="h-5 flex items-center gap-1 text-[10px] font-mono font-bold">
                          {isLow && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">L</span>}
                          {isMid && <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-bounce">MID</span>}
                          {isHigh && <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40">H</span>}
                        </div>

                        {/* Cell box */}
                        <div
                          className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center font-mono font-bold text-base transition-all duration-300 shadow-lg ${
                            isFound
                              ? 'bg-emerald-500 text-slate-950 scale-110 shadow-emerald-500/40 ring-4 ring-emerald-400/30'
                              : isMid
                              ? 'bg-cyan-500/20 text-cyan-200 border-2 border-cyan-400 ring-4 ring-cyan-500/20'
                              : isOutOfRange
                              ? 'bg-slate-900/40 text-slate-600 border border-slate-800/50 opacity-40'
                              : 'bg-slate-800/90 text-slate-200 border border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {val}
                        </div>

                        {/* Index below */}
                        <span className="text-[11px] font-mono text-slate-500">[{idx}]</span>
                      </div>
                    );
                  })}
                </div>

                {/* Subarray range indicators */}
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span>Low Index: <span className="text-emerald-400 font-mono font-bold">{bsPointers.low}</span></span>
                    <span>Mid Index: <span className="text-cyan-400 font-mono font-bold">{bsPointers.mid}</span></span>
                    <span>High Index: <span className="text-purple-400 font-mono font-bold">{bsPointers.high}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Change Target:</span>
                    <select
                      value={bsTarget}
                      onChange={(e) => {
                        setBsTarget(parseInt(e.target.value));
                        resetSimulation('binary-search');
                      }}
                      className="bg-slate-800 text-white font-mono px-2 py-1 rounded border border-slate-700 text-xs"
                    >
                      {arrayData.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                      <option value={99}>99 (Not Found)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SORTING VISUALIZER */}
            {mode === 'sorting' && (
              <div className="w-full space-y-6">
                <div className="h-48 flex items-end justify-center gap-3 px-4 border-b border-slate-800/80 pb-2">
                  {sortArray.map((height, idx) => {
                    const isActive = activeIndices.includes(idx);
                    const isSorted = sortedIndices.includes(idx);
                    return (
                      <div key={idx} className="flex-1 max-w-[48px] flex flex-col items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400 font-bold">{height}</span>
                        <div
                          style={{ height: `${height * 1.8}px` }}
                          className={`w-full rounded-t-lg transition-all duration-300 shadow-md ${
                            isSorted
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-emerald-500/30'
                              : isActive
                              ? 'bg-gradient-to-t from-amber-500 to-rose-400 animate-pulse ring-2 ring-amber-300'
                              : 'bg-gradient-to-t from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400'
                          }`}
                        />
                        <span className="text-[10px] font-mono text-slate-600">[{idx}]</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>Algorithm:</span>
                    <span className="px-2 py-1 rounded bg-slate-800 text-cyan-300 font-mono border border-slate-700">
                      Bubble Sort
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-400" /> Comparing</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400" /> Sorted</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ARRAYS & TWO POINTERS */}
            {mode === 'arrays' && (
              <div className="w-full space-y-6">
                <div className="flex justify-center gap-3">
                  {arrayData.map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <div className="w-14 h-16 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center font-mono font-bold shadow-lg">
                        <span className="text-white text-base">{val}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">[{idx}]</span>
                      <span className="text-[9px] font-mono text-cyan-400">0x{100 + idx * 4}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  Memory formula: <code className="text-cyan-300">Address = Base (0x100) + (Index * 4 Bytes)</code> → Guaranteed O(1) Access!
                </div>
              </div>
            )}

            {/* 4. LINKED LIST */}
            {mode === 'linked-list' && (
              <div className="w-full space-y-6">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 overflow-x-auto py-4">
                  {linkedList.map((node, i) => (
                    <React.Fragment key={node.id}>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-cyan-400 font-mono mb-1">
                          {i === 0 ? 'HEAD' : node.nextId === null ? 'TAIL' : `Node ${i + 1}`}
                        </span>
                        <div className="w-24 rounded-xl bg-slate-800/90 border border-slate-700 p-2 text-center shadow-lg hover:border-cyan-500/50 transition-all">
                          <div className="border-b border-slate-700 pb-1 mb-1 font-mono font-bold text-white text-sm">
                            {node.val}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                            <span>next:</span>
                            <span className="text-purple-400 font-bold">{node.nextId ? '•' : 'null'}</span>
                          </div>
                        </div>
                      </div>

                      {node.nextId && (
                        <div className="flex items-center text-cyan-400">
                          <span className="w-4 sm:w-6 h-0.5 bg-cyan-500/70" />
                          <ChevronRight className="w-4 h-4 -ml-1" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Quick actions for Linked List */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button
                    onClick={handleLinkedListInsertHead}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium border border-cyan-500/30"
                  >
                    + Insert Node at Head (O(1))
                  </button>
                  <button
                    onClick={handleLinkedListReverse}
                    className="px-3 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-xs font-medium border border-violet-500/30"
                  >
                    ⇄ Reverse Pointers (O(n))
                  </button>
                </div>
              </div>
            )}

            {/* 5. STACK */}
            {mode === 'stacks' && (
              <div className="w-full flex flex-col md:flex-row items-center justify-around gap-8">
                {/* Visual Stack Bucket */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-purple-400 font-mono font-bold mb-2">TOP (Last In, First Out)</span>
                  <div className="w-40 min-h-[220px] border-2 border-dashed border-purple-500/40 border-t-0 rounded-b-2xl p-2 flex flex-col-reverse gap-2 bg-slate-900/60 shadow-inner">
                    {stackItems.map((val, idx) => (
                      <div
                        key={idx}
                        className={`w-full py-2.5 rounded-xl text-center font-mono font-bold text-sm shadow-md transition-all ${
                          idx === stackItems.length - 1
                            ? 'bg-purple-600 text-white ring-2 ring-purple-400 animate-pulse'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {val}
                      </div>
                    ))}
                    {stackItems.length === 0 && (
                      <div className="text-xs text-slate-600 text-center py-10 font-mono italic">
                        Stack Empty
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-mono mt-2">BASE</span>
                </div>

                {/* Stack Controls */}
                <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 w-full max-w-xs">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Stack Operations</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={handleStackPush}
                      className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md"
                    >
                      Push({stackInput})
                    </button>
                    <button
                      onClick={handleStackPop}
                      className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-200 hover:text-rose-400 border border-slate-700 text-xs font-semibold transition-all"
                    >
                      Pop()
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Push and Pop execute in strictly <code className="text-cyan-400">O(1)</code> time.
                  </p>
                </div>
              </div>
            )}

            {/* 6. QUEUE */}
            {mode === 'queues' && (
              <div className="w-full flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-rose-400 block">DEQUEUE</span>
                    <span className="text-[10px] text-slate-500 font-mono">FRONT</span>
                  </div>

                  {/* Horizontal conveyor belt queue */}
                  <div className="flex items-center gap-2 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 min-w-[280px] overflow-x-auto">
                    {queueItems.map((val, idx) => (
                      <div
                        key={idx}
                        className={`w-12 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-md ${
                          idx === 0
                            ? 'bg-rose-500/30 text-rose-200 border-2 border-rose-500'
                            : idx === queueItems.length - 1
                            ? 'bg-emerald-500/30 text-emerald-200 border-2 border-emerald-500'
                            : 'bg-slate-800 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {val}
                      </div>
                    ))}
                    {queueItems.length === 0 && (
                      <span className="text-xs text-slate-600 font-mono px-4">Queue Empty</span>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 block">ENQUEUE</span>
                    <span className="text-[10px] text-slate-500 font-mono">REAR</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleQueueEnqueue}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md"
                  >
                    + Enqueue({queueInput})
                  </button>
                  <button
                    onClick={handleQueueDequeue}
                    className="px-4 py-2 rounded-lg bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 border border-rose-500/40 text-xs font-semibold transition-all"
                  >
                    - Dequeue() [FIFO]
                  </button>
                </div>
              </div>
            )}

            {/* 7. TREES (BST) */}
            {mode === 'trees' && (
              <div className="w-full flex flex-col items-center space-y-4">
                {/* SVG/DOM Tree Node Render */}
                <div className="relative w-full max-w-sm h-52 flex flex-col items-center justify-between">
                  {/* Level 0: Root */}
                  <div className="w-12 h-12 rounded-full bg-cyan-600 border-2 border-cyan-400 flex items-center justify-center font-mono font-bold text-white shadow-lg text-sm z-10">
                    50
                  </div>

                  {/* Level 1 */}
                  <div className="w-full flex justify-around px-8 z-10">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-cyan-500/50 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs shadow-md">
                      30
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-cyan-500/50 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs shadow-md">
                      70
                    </div>
                  </div>

                  {/* Level 2 */}
                  <div className="w-full flex justify-between px-2 z-10">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-slate-300 text-xs">
                      20
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-slate-300 text-xs">
                      40
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-slate-300 text-xs">
                      60
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-slate-300 text-xs">
                      85
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 text-center">
                  BST Invariant: <span className="text-cyan-300 font-mono">Left &lt; Root &lt; Right</span>. In-order traversal visits: 20, 30, 40, 50, 60, 70, 85 (Sorted!).
                </p>
              </div>
            )}

            {/* 8. RECURSION CALL STACK */}
            {mode === 'recursion' && (
              <div className="w-full space-y-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-amber-400 font-mono font-bold mb-2">JVM Execution Call Stack</span>
                  <div className="w-full max-w-md space-y-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shadow-inner">
                    {recursionStack.map((frame, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs ${
                          idx === recursionStack.length - 1
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 ring-2 ring-amber-500/30'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400">Frame #{idx + 1}</span>
                          <span className="font-bold">{frame.func}({frame.n})</span>
                        </div>
                        <span className="text-[11px] text-cyan-400 font-semibold">{frame.state}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 9. GRAPH BFS / DFS */}
            {mode === 'graphs' && (
              <div className="w-full flex flex-col items-center space-y-4">
                <div className="flex flex-wrap justify-center gap-4 max-w-sm">
                  {[0, 1, 2, 3, 4, 5].map((nodeId) => {
                    const isCurrent = graphCurrent === nodeId;
                    const isVisited = graphVisited.includes(nodeId);
                    const isInQueue = graphQueue.includes(nodeId);

                    return (
                      <div
                        key={nodeId}
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-bold transition-all shadow-md ${
                          isCurrent
                            ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-400/40 scale-110'
                            : isVisited
                            ? 'bg-emerald-500/30 border-2 border-emerald-500 text-emerald-200'
                            : isInQueue
                            ? 'bg-amber-500/30 border border-amber-400 text-amber-200'
                            : 'bg-slate-800 border border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="text-base">Node {nodeId}</span>
                        <span className="text-[9px] uppercase font-semibold">
                          {isCurrent ? 'Current' : isVisited ? 'Visited' : isInQueue ? 'Queued' : 'Unseen'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-4">
                  <span>Queue: <code className="text-amber-400 font-mono">[{graphQueue.join(', ')}]</code></span>
                  <span>Visited Set: <code className="text-emerald-400 font-mono">&#123;{graphVisited.join(', ')}&#125;</code></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick jump to theoretical topic */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              Need line-by-line Java code & quiz for this topic?
            </span>
            {onSelectTopic && (
              <button
                onClick={() => {
                  const topicMap: Record<VisualizerMode, string> = {
                    'binary-search': 'topic-binary-search',
                    'arrays': 'topic-arrays',
                    'linked-list': 'topic-singly-linked-list',
                    'stacks': 'topic-stacks',
                    'queues': 'topic-queues',
                    'trees': 'topic-bst',
                    'graphs': 'topic-graphs',
                    'sorting': 'topic-sorting',
                    'recursion': 'topic-recursion',
                  };
                  onSelectTopic(topicMap[mode] || 'topic-binary-search');
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                Open Full Teacher Lesson <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Execution Logs & Invariants panel */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">Live Execution Logs</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {logMessages.length} events
              </span>
            </div>

            {/* Event log feed */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {logMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl text-xs font-mono border transition-all ${
                    i === 0
                      ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-slate-500 mt-0.5">#{logMessages.length - i}</span>
                    <span className="leading-relaxed">{msg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theoretical Big-O Quick Card */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">Complexity Invariants</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Time Complexity</span>
                <span className="text-cyan-400 font-mono font-bold">
                  {mode === 'binary-search' ? 'O(log n)' : mode === 'sorting' ? 'O(n²)' : mode === 'arrays' ? 'O(1) access' : 'O(1) / O(n)'}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Auxiliary Space</span>
                <span className="text-purple-400 font-mono font-bold">
                  {mode === 'recursion' ? 'O(n) Stack' : mode === 'graphs' ? 'O(V) Queue' : 'O(1) In-Place'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

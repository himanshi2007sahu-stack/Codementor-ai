import { CollegeSyllabus, SyllabusModule, SyllabusTopic, DSACategory } from '../types/dsa';

export interface TeacherRequestParams {
  topic: string;
  mode: 'explain-simply' | 'another-example' | 'hint' | 'explain-code' | 'ask';
  context?: string;
  question?: string;
  language?: string;
  style?: 'english' | 'hinglish';
}

export interface TeacherResponse {
  success: boolean;
  text: string;
  fallback: boolean;
  error?: string;
}

export async function checkServerHealth(): Promise<{ ok: boolean; hasGeminiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { ok: false, hasGeminiKey: false };
    return await res.json();
  } catch (e) {
    return { ok: false, hasGeminiKey: false };
  }
}

export async function askGeminiTeacher(params: TeacherRequestParams): Promise<TeacherResponse> {
  try {
    const res = await fetch('/api/gemini/teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.text) {
      return {
        success: true,
        text: data.text,
        fallback: false,
      };
    }

    // Server reported fallback (no key or error)
    return {
      success: true,
      text: getLocalFallbackTeacherResponse(params),
      fallback: true,
    };
  } catch (err: any) {
    console.warn('Teacher API fallback triggered:', err);
    return {
      success: true,
      text: getLocalFallbackTeacherResponse(params),
      fallback: true,
    };
  }
}

function getLocalFallbackTeacherResponse(params: TeacherRequestParams): string {
  const { topic, mode, style = 'english' } = params;

  if (mode === 'explain-simply') {
    if (style === 'hinglish') {
      return `### 💡 ${topic} — Simple Hinglish Mein Samajhte Hain!

1. **Yeh Kya Hai?**
   ${topic} computer memory mein data ko organise karne ka ek solid tareeqa hai. Jaise ek almirah mein alag-alag compartments hote hain kapde rakhne ke liye, waise hi yeh data ko efficiently handle karta hai.

2. **Asli Zindagi Ka Example (Real-Life):**
   Socho ek bus conductor tickets de raha hai line mein khade passengers ko. Sabse pehle aane wale ko pehle ticket milti hai (FIFO). ${topic} bhi isi tarah rules follow karta hai taaki code fast aur bug-free rahe.

3. **Kyu Chahiye?**
   Bina structured data ke CPU ko har baar poori memory scan karni padegi (O(n)), jo bahut slow hai. Is structure se hum O(1) ya O(log n) time mein operations kar sakte hain!

4. **Mental Model:**
   - Always remember: Data + Operations + Constraints.
   - Pointers ko link aur unlink karte waqt hamesha backup reference rakho!`;
    }

    return `### 💡 ${topic} — Plain English Intuition

1. **The Core Idea:**
   ${topic} is an organized way of storing and manipulating data in your computer's RAM so that operations like searching, inserting, and deleting happen with minimal CPU cycles.

2. **The Metaphor:**
   Imagine an airport luggage carousel or a spiral binder notebook. Every element has its designated slot and rules for entry and exit.

3. **Why It Outperforms Naive Approaches:**
   Instead of searching randomly or re-allocating memory continuously, ${topic} provides mathematical guarantees (Big-O bounds) on execution time and space.

4. **Quick Memory Rule:**
   Master the pointer invariants and boundary conditions (0-indexed base, length - 1, and null termination).`;
  }

  if (mode === 'another-example') {
    return `### 🏢 Real-World Tech Application for ${topic}

**Industry Scenario: High-Scale Audio Streaming (Spotify / Netflix Buffering)**
- **The Challenge:** When you stream music while driving through a tunnel, playback cannot stutter.
- **How ${topic} Solves It:** The player pre-fetches the next audio chunks into a memory buffer. As you listen, chunks are processed in order while new network packets arrive asynchronously.
- **Why this DSA Wins:** Constant time O(1) operations ensure that the audio rendering thread never blocks, preventing audio dropouts or UI freezing.`;
  }

  if (mode === 'hint') {
    return `### 🧭 Socratic Mentor Hints for ${topic}

- **Hint 1 (Intuition):** Look at the input constraints and order. Is the data sorted, or can sorting it simplify the solution from O(n²) to O(n log n)?
- **Hint 2 (Pointers/Invariants):** Can you maintain two pointers (e.g., slow/fast or left/right) to avoid nested loops?
- **Hint 3 (Edge Cases):** What happens if the input has 0 elements, 1 element, or all identical elements? Check your boundary conditions before writing the loop body.`;
  }

  if (mode === 'explain-code') {
    return `### 🔍 Line-by-Line Code Breakdown for ${topic}

- **Pointers & Initialization:** Sets up the tracking pointers (like \`low\`, \`high\` or \`prev\`, \`curr\`) in stack memory.
- **The Loop Invariant:** The while loop condition guarantees that we only traverse valid ranges without accessing null or out-of-bounds indices.
- **State Transition:** In each iteration, we either move the pointers closer together or swap/link references.
- **Termination & Return:** When the loop condition becomes false, the algorithm either returns the computed answer or a sentinel value (e.g. -1 or null) indicating not found.`;
  }

  return `### 🎓 CodeMentor Teacher Answer for ${topic}

Here is what you need to focus on:
1. Understand the underlying memory layout (Contiguous vs Node-based pointer chain).
2. Trace small test cases on paper (n = 3 or 4 elements) before writing code.
3. Quantify the time complexity (operations per input size n) and auxiliary space on the heap/stack.
Keep practicing active dry-runs!`;
}

export async function parseSyllabus(rawText: string): Promise<CollegeSyllabus> {
  try {
    const res = await fetch('/api/gemini/parse-syllabus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syllabusText: rawText }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.modules?.length > 0) {
        return {
          id: 'custom-' + Date.now(),
          title: json.data.title || 'Custom College DSA Syllabus',
          institution: 'Imported Syllabus',
          lastUpdated: new Date().toISOString().split('T')[0],
          modules: json.data.modules.map((m: any, idx: number) => ({
            id: m.id || `mod-${idx + 1}`,
            unitNumber: idx + 1,
            title: m.title || `Unit ${idx + 1}`,
            description: m.description || 'Module topics and algorithms',
            topics: (m.topics || []).map((t: any, tIdx: number) => ({
              id: t.id || `top-${idx + 1}-${tIdx + 1}`,
              title: t.title || 'Topic',
              category: mapCategory(t.category || t.title),
              difficulty: (t.difficulty as any) || 'Medium',
              estimatedHours: t.estimatedHours || 3,
              subtopics: t.subtopics || ['Fundamentals', 'Implementation', 'Complexity Analysis'],
              status: 'not_started',
              confidenceScore: 0,
            })),
          })),
        };
      }
    }
  } catch (e) {
    console.warn('API syllabus parser fell back to local regex parser', e);
  }

  // Heuristic offline syllabus parser
  return parseSyllabusHeuristically(rawText);
}

function mapCategory(input: string): DSACategory {
  const s = input.toLowerCase();
  if (s.includes('array') || s.includes('string')) return 'arrays';
  if (s.includes('link') || s.includes('list')) return 'linked-lists';
  if (s.includes('stack') || s.includes('queue')) return 'stacks-queues';
  if (s.includes('tree') || s.includes('bst') || s.includes('heap')) return 'trees';
  if (s.includes('graph') || s.includes('bfs') || s.includes('dfs')) return 'graphs';
  if (s.includes('sort') || s.includes('search')) return 'sorting-searching';
  if (s.includes('recur') || s.includes('dp') || s.includes('dynamic')) return 'dp-recursion';
  return 'basics';
}

function parseSyllabusHeuristically(rawText: string): CollegeSyllabus {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const modules: SyllabusModule[] = [];
  let currentModule: SyllabusModule | null = null;
  let unitCounter = 1;

  for (const line of lines) {
    const isModuleHeader =
      /^(unit|module|section|chapter|part)\s+[0-9ivx]+/i.test(line) ||
      /^unit\s*[-:]/i.test(line);

    if (isModuleHeader || (!currentModule && line.length > 5)) {
      currentModule = {
        id: `mod-${unitCounter}`,
        unitNumber: unitCounter,
        title: line,
        description: 'Key concepts and algorithmic structures for this unit.',
        topics: [],
      };
      modules.push(currentModule);
      unitCounter++;
      continue;
    }

    if (currentModule) {
      // Split subtopics or comma/colon separated items
      const subItems = line.split(/[:;,\.]/).map((s) => s.trim()).filter((s) => s.length > 3);
      if (subItems.length > 0) {
        const primaryTitle = subItems[0];
        const subtopics = subItems.slice(1, 5);
        if (subtopics.length === 0) {
          subtopics.push('Concept & Definition', 'Java Implementation', 'Time & Space Analysis');
        }

        const category = mapCategory(primaryTitle);
        currentModule.topics.push({
          id: `topic-${modules.length}-${currentModule.topics.length + 1}`,
          title: primaryTitle,
          category,
          difficulty: category === 'graphs' ? 'Hard' : category === 'basics' ? 'Easy' : 'Medium',
          estimatedHours: 3,
          subtopics,
          status: 'not_started',
          confidenceScore: 0,
        });
      }
    }
  }

  if (modules.length === 0 || modules.every((m) => m.topics.length === 0)) {
    // Fallback module if raw text was a single paragraph
    return {
      id: 'custom-' + Date.now(),
      title: 'Imported DSA Curriculum',
      institution: 'Custom Syllabus',
      lastUpdated: new Date().toISOString().split('T')[0],
      modules: [
        {
          id: 'mod-1',
          unitNumber: 1,
          title: 'Unit 1: Data Structures & Algorithms Core',
          description: 'Parsed topics from syllabus text.',
          topics: [
            {
              id: 'top-1',
              title: 'Arrays & Two Pointers',
              category: 'arrays',
              difficulty: 'Easy',
              estimatedHours: 3,
              subtopics: ['Contiguous RAM', 'Index Arithmetic', 'Two Pointers'],
              status: 'not_started',
            },
            {
              id: 'top-2',
              title: 'Linked Lists & Pointers',
              category: 'linked-lists',
              difficulty: 'Medium',
              estimatedHours: 3,
              subtopics: ['Singly Linked List', 'Node manipulation', 'Reversal'],
              status: 'not_started',
            },
            {
              id: 'top-3',
              title: 'Binary Trees & Traversals',
              category: 'trees',
              difficulty: 'Medium',
              estimatedHours: 4,
              subtopics: ['Inorder', 'Preorder', 'Postorder', 'BST'],
              status: 'not_started',
            },
          ],
        },
      ],
    };
  }

  return {
    id: 'custom-' + Date.now(),
    title: 'Custom College DSA Syllabus',
    institution: 'Parsed from user syllabus text',
    lastUpdated: new Date().toISOString().split('T')[0],
    modules,
  };
}

export async function reviewCode(code: string, problemTitle: string): Promise<string> {
  try {
    const res = await fetch('/api/gemini/code-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, problemTitle, language: 'Java' }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.feedback) {
        return data.feedback;
      }
    }
  } catch (e) {
    console.warn('Code review fell back to static analyzer', e);
  }

  // Static Java code analysis feedback
  return analyzeJavaCodeStatically(code, problemTitle);
}

function analyzeJavaCodeStatically(code: string, problemTitle: string): string {
  const hasWhile = code.includes('while');
  const hasFor = code.includes('for');
  const hasReturn = code.includes('return');
  const hasNullCheck = code.includes('null') || code.includes('isEmpty') || code.includes('length == 0');
  const hasOverflowProtection = code.includes('low + (high - low) / 2');

  let score = 7;
  const feedbackItems: string[] = [];

  if (!hasReturn) {
    score -= 3;
    feedbackItems.push('❌ **Missing Return Statement**: Your method does not appear to return the expected value.');
  }

  if (problemTitle.toLowerCase().includes('binary search')) {
    if (hasOverflowProtection) {
      score += 2;
      feedbackItems.push('✅ **Safe Midpoint**: Great job using `low + (high - low) / 2` to prevent 32-bit signed integer overflow!');
    } else if (code.includes('(low + high) / 2')) {
      feedbackItems.push('⚠️ **Edge Case Warning**: `(low + high) / 2` can overflow in Java if `low + high > Integer.MAX_VALUE`. Prefer `low + (high - low) / 2`.');
    }
  }

  if (!hasNullCheck) {
    feedbackItems.push('⚠️ **Null Safety**: Consider adding defensive checks for `null` or empty inputs at the start of your method.');
  } else {
    feedbackItems.push('✅ **Defensive Programming**: Good guard clauses for boundary and null conditions.');
  }

  if (hasWhile || hasFor) {
    feedbackItems.push('✅ **Loop Invariants**: Iteration logic is present. Ensure loop termination conditions prevent infinite loops.');
  }

  return `### 🤖 CodeMentor AI Review: "${problemTitle}"

**Overall Quality Score:** ${Math.min(10, Math.max(1, score))}/10

#### Analysis & Observations:
${feedbackItems.join('\n\n')}

#### Complexity Estimation:
- **Estimated Time:** ${hasFor && hasWhile ? 'O(n²)' : (hasFor || hasWhile) ? 'O(n) or O(log n)' : 'O(1)'}
- **Estimated Auxiliary Space:** ${code.includes('new int[') || code.includes('HashMap') || code.includes('ArrayList') ? 'O(n) auxiliary heap memory' : 'O(1) constant in-place'}

#### Clean Code Advice:
Keep variable names expressive and maintain consistent Java indentation.`;
}

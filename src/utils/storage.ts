import { CollegeSyllabus, UserStats, StudyPlannerSettings, StudyTask, Flashcard } from '../types/dsa';
import { DEFAULT_SYLLABUS } from '../data/defaultSyllabus';

const STORAGE_KEYS = {
  SYLLABUS: 'codementor_syllabus_v1',
  STATS: 'codementor_stats_v1',
  SETTINGS: 'codementor_settings_v1',
  TASKS: 'codementor_tasks_v1',
  FLASHCARDS: 'codementor_flashcards_v1',
  CURRENT_TOPIC_ID: 'codementor_current_topic_id_v1',
};

export const INITIAL_STATS: UserStats = {
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalStudyMinutes: 380,
  topicsCompleted: 2,
  problemsSolved: {
    easy: 6,
    medium: 3,
    hard: 1,
  },
  weeklyActivity: [
    { day: 'Mon', minutes: 45, problems: 2 },
    { day: 'Tue', minutes: 60, problems: 3 },
    { day: 'Wed', minutes: 30, problems: 1 },
    { day: 'Thu', minutes: 75, problems: 4 },
    { day: 'Fri', minutes: 50, problems: 2 },
    { day: 'Sat', minutes: 90, problems: 5 },
    { day: 'Sun', minutes: 30, problems: 1 },
  ],
  completedTopicIds: ['topic-time-complexity', 'topic-arrays'],
  solvedProblemIds: ['prob-two-sum', 'prob-binary-search'],
  weakTopicIds: ['topic-graphs', 'topic-bst'],
};

export const INITIAL_SETTINGS: StudyPlannerSettings = {
  dailyStudyMinutes: 60,
  targetEndDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  preferredLanguage: 'Java',
  explanationStyle: 'english',
};

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    topicId: 'topic-arrays',
    topicTitle: 'Arrays',
    front: 'Why does an array allow O(1) random access by index?',
    back: 'Contiguous memory layout enables instantaneous address calculation via hardware offset: Address = Base + (Index * Element_Size).',
    category: 'arrays',
    mastery: 'mastered',
  },
  {
    id: 'fc-2',
    topicId: 'topic-binary-search',
    topicTitle: 'Binary Search',
    front: 'What is the safe formula for mid in binary search to prevent overflow in Java?',
    back: 'int mid = low + (high - low) / 2;\nAvoid (low + high) / 2 because low + high can exceed Integer.MAX_VALUE (2^31 - 1).',
    category: 'sorting-searching',
    mastery: 'review',
  },
  {
    id: 'fc-3',
    topicId: 'topic-singly-linked-list',
    topicTitle: 'Linked Lists',
    front: 'Why can we not perform O(1) binary search on a Singly Linked List even if it is sorted?',
    back: 'Linked list nodes are scattered across memory without index arithmetic; reaching the midpoint requires O(n) sequential pointer hops.',
    category: 'linked-lists',
    mastery: 'learning',
  },
  {
    id: 'fc-4',
    topicId: 'topic-stacks',
    topicTitle: 'Stacks',
    front: 'What data structure is optimal for matching balanced parentheses and why?',
    back: 'A Stack (LIFO), because the most recently opened parenthesis must be the first one closed.',
    category: 'stacks-queues',
    mastery: 'mastered',
  },
  {
    id: 'fc-5',
    topicId: 'topic-bst',
    topicTitle: 'BST Property',
    front: 'What does In-order traversal of a valid Binary Search Tree produce?',
    back: 'In-order traversal (Left -> Node -> Right) strictly visits all elements in ascending sorted order.',
    category: 'trees',
    mastery: 'review',
  },
  {
    id: 'fc-6',
    topicId: 'topic-graphs',
    topicTitle: 'Graph BFS',
    front: 'Why must we mark a node as visited when ENQUEUEING rather than when DEQUEUEING in BFS?',
    back: 'If you wait until dequeueing, other neighbor nodes will add the same vertex to the queue multiple times, causing exponential redundant work.',
    category: 'graphs',
    mastery: 'learning',
  },
];

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    topicId: 'topic-binary-search',
    topicTitle: 'Binary Search & Order Statistics',
    moduleTitle: 'Unit 1: Linear Arrays',
    date: new Date().toISOString().split('T')[0],
    durationMinutes: 45,
    type: 'concept',
    completed: true,
  },
  {
    id: 'task-2',
    topicId: 'topic-singly-linked-list',
    topicTitle: 'Singly Linked List Reversal Dry Run',
    moduleTitle: 'Unit 2: Linked Lists',
    date: new Date().toISOString().split('T')[0],
    durationMinutes: 40,
    type: 'dry_run',
    completed: false,
  },
  {
    id: 'task-3',
    topicId: 'topic-stacks',
    topicTitle: 'Valid Parentheses Code Practice (Java)',
    moduleTitle: 'Unit 3: Stacks & Queues',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    durationMinutes: 60,
    type: 'practice',
    completed: false,
  },
  {
    id: 'task-4',
    topicId: 'topic-bst',
    topicTitle: 'Binary Search Tree Validation',
    moduleTitle: 'Unit 5: Trees',
    date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    durationMinutes: 45,
    type: 'concept',
    completed: false,
  },
];

export function getStoredSyllabus(): CollegeSyllabus {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SYLLABUS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading syllabus from localStorage', e);
  }
  return DEFAULT_SYLLABUS;
}

export function saveStoredSyllabus(syllabus: CollegeSyllabus): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SYLLABUS, JSON.stringify(syllabus));
  } catch (e) {
    console.error('Failed saving syllabus to localStorage', e);
  }
}

export function getStoredStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading stats from localStorage', e);
  }
  return INITIAL_STATS;
}

export function saveStoredStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed saving stats to localStorage', e);
  }
}

export function getStoredSettings(): StudyPlannerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading settings from localStorage', e);
  }
  return INITIAL_SETTINGS;
}

export function saveStoredSettings(settings: StudyPlannerSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed saving settings to localStorage', e);
  }
}

export function getStoredTasks(): StudyTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading tasks from localStorage', e);
  }
  return INITIAL_TASKS;
}

export function saveStoredTasks(tasks: StudyTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed saving tasks to localStorage', e);
  }
}

export function getStoredFlashcards(): Flashcard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading flashcards from localStorage', e);
  }
  return INITIAL_FLASHCARDS;
}

export function saveStoredFlashcards(flashcards: Flashcard[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards));
  } catch (e) {
    console.error('Failed saving flashcards to localStorage', e);
  }
}

export function getStoredCurrentTopicId(): string {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.CURRENT_TOPIC_ID);
    if (val) return val;
  } catch (e) {
    console.error('Failed reading currentTopicId', e);
  }
  return 'topic-binary-search';
}

export function saveStoredCurrentTopicId(topicId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_TOPIC_ID, topicId);
  } catch (e) {
    console.error('Failed saving currentTopicId', e);
  }
}

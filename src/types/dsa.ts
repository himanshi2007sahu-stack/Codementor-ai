export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type DSACategory =
  | 'basics'
  | 'arrays'
  | 'linked-lists'
  | 'stacks-queues'
  | 'sorting-searching'
  | 'trees'
  | 'graphs'
  | 'dp-recursion';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DryRunStep {
  step: number;
  description: string;
  variables: Record<string, string | number | boolean>;
  activeCodeLine?: number;
  explanation: string;
}

export interface CodeLineExplanation {
  line: number;
  code: string;
  explanation: string;
  note?: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: DSACategory;
  topicId: string;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCodeJava: string;
  solutionJava: string;
  hints: string[];
  testCases: {
    input: string;
    expected: string;
  }[];
}

export interface TopicDetail {
  id: string;
  title: string;
  category: DSACategory;
  difficulty: Difficulty;
  estimatedHours: number;
  whatItIs: string;
  whyNeeded: string;
  whereUsed: string[];
  explanationEnglish: string;
  explanationHinglish: string;
  realLifeAnalogy: string;
  visualDiagramDescription: string;
  diagramType: 'array' | 'linked-list' | 'stack' | 'queue' | 'tree' | 'graph' | 'binary-search' | 'sorting' | 'recursion';
  dryRunSteps: DryRunStep[];
  javaCode: string;
  javaCodeLines: CodeLineExplanation[];
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
    explanation: string;
  };
  spaceComplexity: {
    complexity: string;
    explanation: string;
  };
  commonMistakes: {
    mistake: string;
    fix: string;
  }[];
  edgeCases: string[];
  quiz: QuizQuestion[];
  problemIds: string[];
}

export interface SyllabusTopic {
  id: string;
  title: string;
  category: DSACategory;
  difficulty: Difficulty;
  estimatedHours: number;
  subtopics: string[];
  status: 'not_started' | 'in_progress' | 'completed';
  confidenceScore?: number; // 0 to 100
  notes?: string;
}

export interface SyllabusModule {
  id: string;
  title: string;
  description: string;
  unitNumber: number;
  topics: SyllabusTopic[];
}

export interface CollegeSyllabus {
  id: string;
  title: string;
  institution?: string;
  lastUpdated: string;
  modules: SyllabusModule[];
}

export interface StudyTask {
  id: string;
  topicId: string;
  topicTitle: string;
  moduleTitle: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  type: 'concept' | 'dry_run' | 'practice' | 'revision';
  completed: boolean;
}

export interface Flashcard {
  id: string;
  topicId: string;
  topicTitle: string;
  front: string;
  back: string;
  category: DSACategory;
  mastery: 'learning' | 'review' | 'mastered';
}

export interface UserStats {
  streakDays: number;
  lastActiveDate: string;
  totalStudyMinutes: number;
  topicsCompleted: number;
  problemsSolved: {
    easy: number;
    medium: number;
    hard: number;
  };
  weeklyActivity: {
    day: string;
    minutes: number;
    problems: number;
  }[];
  completedTopicIds: string[];
  solvedProblemIds: string[];
  weakTopicIds: string[];
}

export interface StudyPlannerSettings {
  dailyStudyMinutes: number;
  targetEndDate: string;
  preferredLanguage: 'Java';
  explanationStyle: 'english' | 'hinglish';
}

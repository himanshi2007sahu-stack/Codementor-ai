import { CollegeSyllabus } from '../types/dsa';

export const DEFAULT_SYLLABUS: CollegeSyllabus = {
  id: 'college-core-dsa',
  title: 'B.Tech / University Data Structures & Algorithms (Core Curriculum)',
  institution: 'Standard University Engineering Syllabus',
  lastUpdated: new Date().toISOString().split('T')[0],
  modules: [
    {
      id: 'mod-1',
      unitNumber: 1,
      title: 'Unit 1: Foundations & Linear Arrays',
      description: 'Asymptotic notation, Big-O analysis, static vs dynamic arrays, two-pointer techniques, and prefix sums.',
      topics: [
        {
          id: 'topic-time-complexity',
          title: 'Time & Space Complexity (Asymptotic Notation)',
          category: 'basics',
          difficulty: 'Easy',
          estimatedHours: 2,
          subtopics: ['Big-O, Omega, Theta notations', 'Worst, Average, Best cases', 'Auxiliary space vs Total space'],
          status: 'completed',
          confidenceScore: 90,
        },
        {
          id: 'topic-arrays',
          title: 'Arrays & Dynamic Arrays (ArrayList in Java)',
          category: 'arrays',
          difficulty: 'Easy',
          estimatedHours: 3,
          subtopics: ['Contiguous memory allocation', 'Index arithmetic O(1)', 'Two-pointer technique', 'Prefix sums & sliding window'],
          status: 'completed',
          confidenceScore: 85,
        },
        {
          id: 'topic-binary-search',
          title: 'Binary Search & Order Statistics',
          category: 'sorting-searching',
          difficulty: 'Easy',
          estimatedHours: 3,
          subtopics: ['Divide and conquer principle', 'Loop invariants (low <= high)', 'Search in rotated sorted array', 'Binary search on answer space'],
          status: 'in_progress',
          confidenceScore: 65,
        },
      ],
    },
    {
      id: 'mod-2',
      unitNumber: 2,
      title: 'Unit 2: Linked Lists & Memory Pointer Models',
      description: 'Node structures, pointer manipulations, singly and doubly linked lists, Floyd cycle detection, and reversing lists.',
      topics: [
        {
          id: 'topic-singly-linked-list',
          title: 'Singly Linked Lists',
          category: 'linked-lists',
          difficulty: 'Medium',
          estimatedHours: 3,
          subtopics: ['Node creation and memory linking', 'Insert at head/tail/k-th position', 'Delete by value or position', 'Reversal in O(n) time O(1) space'],
          status: 'in_progress',
          confidenceScore: 60,
        },
        {
          id: 'topic-doubly-linked-list',
          title: 'Doubly Linked Lists & Circular Lists',
          category: 'linked-lists',
          difficulty: 'Medium',
          estimatedHours: 2,
          subtopics: ['Prev and Next pointers', 'Bidirectional traversal', 'Circular queue via linked list', 'LRU Cache architecture'],
          status: 'not_started',
          confidenceScore: 40,
        },
      ],
    },
    {
      id: 'mod-3',
      unitNumber: 3,
      title: 'Unit 3: Stacks & Queues (LIFO / FIFO Paradigms)',
      description: 'Stack frame models, monotonic stacks, queue implementations, circular queues, and deque applications.',
      topics: [
        {
          id: 'topic-stacks',
          title: 'Stacks (LIFO) & Monotonic Stacks',
          category: 'stacks-queues',
          difficulty: 'Easy',
          estimatedHours: 3,
          subtopics: ['Push, Pop, Peek in O(1)', 'Parentheses matching', 'Next Greater Element', 'Call stack simulation'],
          status: 'not_started',
          confidenceScore: 30,
        },
        {
          id: 'topic-queues',
          title: 'Queues (FIFO) & Circular Buffers',
          category: 'stacks-queues',
          difficulty: 'Easy',
          estimatedHours: 2,
          subtopics: ['Enqueue & Dequeue in O(1)', 'Circular array indexing with modulo', 'Deque (Double-ended queue)', 'BFS buffer queue'],
          status: 'not_started',
          confidenceScore: 30,
        },
      ],
    },
    {
      id: 'mod-4',
      unitNumber: 4,
      title: 'Unit 4: Recursion & Sorting Algorithms',
      description: 'Mathematical induction, recursion trees, divide-and-conquer, Bubble/Selection/Insertion sorts, Merge Sort and Quick Sort.',
      topics: [
        {
          id: 'topic-recursion',
          title: 'Recursion & Call Stack Mechanics',
          category: 'dp-recursion',
          difficulty: 'Medium',
          estimatedHours: 3,
          subtopics: ['Base case vs Recursive case', 'Activation records in RAM', 'Fibonacci & Factorial recursion trees', 'Backtracking introduction'],
          status: 'not_started',
          confidenceScore: 25,
        },
        {
          id: 'topic-sorting',
          title: 'Sorting Algorithms (Comparison Sorts)',
          category: 'sorting-searching',
          difficulty: 'Medium',
          estimatedHours: 4,
          subtopics: ['Bubble, Selection, and Insertion Sort O(n^2)', 'Merge Sort divide-and-conquer O(n log n)', 'Quick Sort partition algorithm', 'Stability in sorting algorithms'],
          status: 'not_started',
          confidenceScore: 35,
        },
      ],
    },
    {
      id: 'mod-5',
      unitNumber: 5,
      title: 'Unit 5: Hierarchical Trees & Binary Search Trees',
      description: 'Binary trees, tree traversals (In-order, Pre-order, Post-order, Level-order), BST invariant, insertion, deletion, and balancing.',
      topics: [
        {
          id: 'topic-binary-trees',
          title: 'Binary Trees & Traversals',
          category: 'trees',
          difficulty: 'Medium',
          estimatedHours: 4,
          subtopics: ['Tree terminology (root, height, depth, leaves)', 'DFS Traversals (Inorder, Preorder, Postorder)', 'BFS Level-order traversal', 'Height and diameter of tree'],
          status: 'not_started',
          confidenceScore: 20,
        },
        {
          id: 'topic-bst',
          title: 'Binary Search Trees (BST)',
          category: 'trees',
          difficulty: 'Medium',
          estimatedHours: 3,
          subtopics: ['BST Property (Left < Root < Right)', 'O(log n) Search and Insert', 'Node deletion (3 cases)', 'Validating BST'],
          status: 'not_started',
          confidenceScore: 20,
        },
      ],
    },
    {
      id: 'mod-6',
      unitNumber: 6,
      title: 'Unit 6: Graph Algorithms & Traversals',
      description: 'Graph representations (Adjacency Matrix, Adjacency List), Breadth-First Search (BFS), Depth-First Search (DFS), and cycle detection.',
      topics: [
        {
          id: 'topic-graphs',
          title: 'Graph Theory & Traversals (BFS / DFS)',
          category: 'graphs',
          difficulty: 'Hard',
          estimatedHours: 5,
          subtopics: ['Adjacency matrix vs Adjacency list', 'BFS queue-based traversal', 'DFS recursive & stack traversal', 'Cycle detection in directed & undirected graphs'],
          status: 'not_started',
          confidenceScore: 15,
        },
      ],
    },
  ],
};

export const SYLLABUS_PRESETS: { name: string; description: string; rawText: string }[] = [
  {
    name: 'University B.Tech CS (Standard 6 Units)',
    description: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting & Searching, Complexity',
    rawText: `Unit I: Introduction & Arrays
Asymptotic Notations: Big O, Big Omega, Theta. Time and space complexity.
Arrays: Representation of 1D and 2D arrays, row major and column major, insertion, deletion, searching (Linear and Binary Search).

Unit II: Linked Lists
Singly Linked Lists: Creation, Insertion at beginning, end, and middle. Deletion, traversal, searching.
Doubly Linked Lists: Structure, bidirectional traversal, insertion, deletion. Circular Linked Lists.

Unit III: Stacks and Queues
Stack: Array and linked list representation of stack. Operations: Push, Pop, Peek. Applications: Infix to Postfix conversion, Parentheses balancing.
Queue: Simple Queue, Circular Queue, Deque, Priority Queue. Array and Linked list representations.

Unit IV: Trees & Binary Search Trees
Binary Tree: Terminology, representations, Traversals (Pre-order, In-order, Post-order).
Binary Search Tree: Properties, Search, Insert, Delete, Height and balance factors.

Unit V: Graphs & Applications
Graph representations: Adjacency matrix, adjacency list.
Traversals: Breadth First Search (BFS), Depth First Search (DFS).
Shortest paths and Spanning trees: Dijkstra's algorithm, Prim's and Kruskal's algorithms.

Unit VI: Sorting and Searching Algorithms
Sorting: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort.
Analysis of sorting algorithms: Best, Average, Worst case time and space complexities.`,
  },
  {
    name: 'LeetCode 75 / SDE Interview Prep',
    description: 'Two pointers, Sliding Window, Fast & Slow Pointers, Monotonic Stack, Trees, Backtracking, Graphs',
    rawText: `Module 1: Array & String Mastery
Two Pointers, Sliding Window, Prefix Sums, Kadane's Algorithm for Maximum Subarray.

Module 2: Linked Lists for Interviews
Fast and Slow Pointers (Floyd Cycle), Reversing Linked List, Merge Two Sorted Lists, Remove Nth Node From End.

Module 3: Stacks & Queues Interview Patterns
Valid Parentheses, Monotonic Stack (Next Greater Element, Daily Temperatures), Min Stack, Implementing Queue using Stacks.

Module 4: Binary Search & Divide and Conquer
Binary Search Template, Search in Rotated Sorted Array, Find Minimum in Rotated Sorted Array, Capacity to Ship Packages.

Module 5: Trees & Binary Search Trees
Maximum Depth of Binary Tree, Invert Binary Tree, Validate Binary Search Tree, Lowest Common Ancestor, Level Order Traversal.

Module 6: Graphs & Breadth-First / Depth-First Search
Number of Islands, Clone Graph, Course Schedule (Topological Sort), Word Ladder, Pacific Atlantic Water Flow.`,
  },
  {
    name: 'GATE CSE Data Structures & Algorithms',
    description: 'Mathematical Analysis, Recurrence Relations, Master Theorem, Advanced BST, Graph Theory',
    rawText: `Section 1: Programming and Data Structures
Recursion: Master Theorem, Substitution Method, Recursion Tree Method.
Arrays: Multi-dimensional array mapping.
Stacks & Queues: Applications and simulations.
Linked Lists: Single, Double, Circular.
Trees: Binary trees, Binary search trees, AVL trees (rotations and balancing).
Heaps: Min-heap, Max-heap, Heap sort, Priority queues.

Section 2: Algorithms & Complexity
Asymptotic analysis of worst and average time/space complexities.
Searching & Sorting: Quick sort, Merge sort, Counting sort, Radix sort.
Divide and conquer, Greedy techniques (Huffman coding, Fractional knapsack).
Graph algorithms: Connected components, Shortest paths (Dijkstra, Bellman-Ford), Minimum spanning trees (Kruskal, Prim).`,
  },
];

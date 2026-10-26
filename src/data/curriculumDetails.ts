import { TopicDetail } from '../types/dsa';

export const TOPIC_DETAILS: Record<string, TopicDetail> = {
  'topic-arrays': {
    id: 'topic-arrays',
    title: 'Arrays & Dynamic Arrays',
    category: 'arrays',
    difficulty: 'Easy',
    estimatedHours: 3,
    whatItIs: 'An array is a fundamental linear data structure consisting of a collection of elements, each identified by at least one array index or key, stored at contiguous (adjacent) physical memory locations.',
    whyNeeded: 'Computers need rapid, instant memory access. Because arrays are contiguous, CPU hardware can calculate the physical address of any element in O(1) constant time: Address = Base_Address + (Index * Element_Size). Dynamic arrays (like Java ArrayList) solve fixed-size limitations by doubling capacity when full.',
    whereUsed: [
      'OS memory buffers and hardware register blocks',
      'Database index leaf nodes for fast disk reads',
      'Image processing: 2D/3D pixel buffers (RGB color matrices)',
      'Game development: Framebuffers, player coordinate lists, leaderboard caches'
    ],
    explanationEnglish: `Think of an array like a row of numbered lockers in a school hallway. All the lockers are strictly in a line, side-by-side with no gaps. If you know the first locker's address and the size of each locker, you can instantly walk directly to locker #42 without checking lockers 0 to 41.

Because the memory is completely contiguous, your CPU's hardware cache loves arrays! It pulls neighboring elements into L1/L2 cache automatically (spatial locality), making array traversals blazing fast compared to scattered pointers.`,
    explanationHinglish: `Array ko ek simple school ke lockers ki row samajh lo! Sabhi lockers bilkul ek saath, bina kisi gap ke lage hue hain. Agar aapko pata hai ki pehla locker kahan hai, toh aap bina baaki lockers ko check kiye seedhe locker number 42 pe ja sakte ho. Isko O(1) random access bolte hain!

Lekin iska sabse bada drawback ye hai ki size pehle se decide karna padta hai. Agar lockers full ho gaye, toh pura bada locker set nayi jagah shift karna padta hai (jaise Java ka ArrayList double size karta hai).`,
    realLifeAnalogy: 'A row of movie theater seats (Row D, Seats 1 to 20). Every seat is consecutively numbered and placed side-by-side. You immediately locate seat 7 by counting from seat 1.',
    visualDiagramDescription: 'Contiguous RAM slots: [0x100: Val 12] -> [0x104: Val 45] -> [0x108: Val 78] -> [0x10C: Val 99]',
    diagramType: 'array',
    dryRunSteps: [
      {
        step: 1,
        description: 'Initialize array and pointers for Two-Sum / Reverse array',
        variables: { left: 0, right: 4, 'arr[left]': 10, 'arr[right]': 50 },
        activeCodeLine: 2,
        explanation: 'Left pointer points to index 0 (val: 10), Right pointer points to index 4 (val: 50).'
      },
      {
        step: 2,
        description: 'Swap elements at left and right pointers',
        variables: { left: 0, right: 4, temp: 10, 'swapped': '10 <-> 50' },
        activeCodeLine: 4,
        explanation: 'Store arr[left] in temp. Set arr[left] = arr[right], and arr[right] = temp.'
      },
      {
        step: 3,
        description: 'Advance pointers towards the middle',
        variables: { left: 1, right: 3, 'arr[left]': 20, 'arr[right]': 40 },
        activeCodeLine: 6,
        explanation: 'Increment left to 1, decrement right to 3. Repeat comparison.'
      },
      {
        step: 4,
        description: 'Swap middle adjacent elements',
        variables: { left: 1, right: 3, temp: 20, 'swapped': '20 <-> 40' },
        activeCodeLine: 4,
        explanation: 'Elements at 1 and 3 are successfully swapped.'
      },
      {
        step: 5,
        description: 'Pointers meet at index 2 (middle element)',
        variables: { left: 2, right: 2, condition: 'left < right is FALSE' },
        activeCodeLine: 7,
        explanation: 'Pointers meet or cross. Array reversal completes in O(n/2) iterations.'
      }
    ],
    javaCode: `public class ArrayReversal {
    public static void reverseArray(int[] arr) {
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
}`,
    javaCodeLines: [
      { line: 1, code: 'public class ArrayReversal {', explanation: 'Class definition enclosing the algorithm.' },
      { line: 2, code: '    public static void reverseArray(int[] arr) {', explanation: 'Method takes an integer array reference directly modified in-place.' },
      { line: 3, code: '        int left = 0;', explanation: 'Initializes the left pointer at the beginning index 0.' },
      { line: 4, code: '        int right = arr.length - 1;', explanation: 'Initializes the right pointer at the final valid index (length - 1).' },
      { line: 5, code: '        while (left < right) {', explanation: 'Loop condition: runs until pointers meet in the center.' },
      { line: 6, code: '            int temp = arr[left];', explanation: 'Temporarily saves left value before overwriting.' },
      { line: 7, code: '            arr[left] = arr[right];', explanation: 'Copies right value into the left slot.' },
      { line: 8, code: '            arr[right] = temp;', explanation: 'Places saved temp into the right slot (swap complete).' },
      { line: 9, code: '            left++;', explanation: 'Moves left pointer one step right.' },
      { line: 10, code: '            right--;', explanation: 'Moves right pointer one step left.' },
      { line: 11, code: '        }', explanation: 'End of while loop.' },
      { line: 12, code: '    }', explanation: 'End of method.' },
      { line: 13, code: '}', explanation: 'End of class.' }
    ],
    timeComplexity: {
      best: 'O(1) Access',
      average: 'O(n) Search / Insert / Delete',
      worst: 'O(n) Insertion requiring resizing',
      explanation: 'Random index access is instant O(1) via hardware pointer offset. Searching unsorted array or inserting at index 0 requires shifting n elements, taking O(n).'
    },
    spaceComplexity: {
      complexity: 'O(1) Auxiliary',
      explanation: 'In-place two-pointer technique uses only two integer variables (left, right), requiring zero extra heap memory.'
    },
    commonMistakes: [
      {
        mistake: 'ArrayIndexOutOfBoundsException by accessing arr[arr.length]',
        fix: 'Remember Java array indices run from 0 to arr.length - 1. Never use <= arr.length in loops.'
      },
      {
        mistake: 'Assuming ArrayList.add(element) is always O(1) without considering capacity resize',
        fix: 'ArrayList append is amortized O(1), but when the capacity threshold is reached, it allocates a new array of 1.5x/2x size and copies all elements in O(n).'
      }
    ],
    edgeCases: [
      'Empty array (length == 0): Ensure bounds checks prevent accessing arr[0]',
      'Single element array (length == 1): left == right from start; while (left < right) gracefully skips',
      'Even vs Odd length arrays: Odd length leaves center element unswapped; Even length swaps all pairs cleanly'
    ],
    quiz: [
      {
        id: 'q-arr-1',
        question: 'Why is accessing arr[i] an O(1) operation in memory?',
        options: [
          'Because the CPU guesses where the number is',
          'Because contiguous memory allows direct address calculation: Base + (i * size)',
          'Because arrays are always sorted in RAM',
          'Because Java uses hash maps internally for all arrays'
        ],
        correctIndex: 1,
        explanation: 'Since memory slots are adjacent and uniform in size, calculating any index address takes exactly one multiplication and addition.'
      },
      {
        id: 'q-arr-2',
        question: 'What is the time complexity of inserting an element at the beginning (index 0) of an array of size n?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        correctIndex: 2,
        explanation: 'Every existing element from index 0 to n-1 must be shifted one position to the right to make room, taking O(n) shifts.'
      }
    ],
    problemIds: ['prob-two-sum', 'prob-max-subarray', 'prob-rotate-array']
  },

  'topic-binary-search': {
    id: 'topic-binary-search',
    title: 'Binary Search Algorithm',
    category: 'sorting-searching',
    difficulty: 'Easy',
    estimatedHours: 3,
    whatItIs: 'Binary Search is an efficient divide-and-conquer search algorithm that finds the position of a target value within a sorted array by repeatedly halving the search interval.',
    whyNeeded: 'Linear search takes up to 1,000,000 checks on a million items. Binary Search does it in at most 20 checks (log2(1,000,000) ≈ 19.93). It is the backbone of high-performance database indexing and range queries.',
    whereUsed: [
      'Git Bisect: Finding the exact commit that introduced a bug among thousands of commits',
      'Database B-Tree index lookups in MySQL & PostgreSQL',
      'IP routing prefix lookups in network switches',
      'Compiler symbol table lookups for variable definitions'
    ],
    explanationEnglish: `Imagine opening a physical 1,000-page English dictionary to find the word "Search". You do not start reading page 1, 2, 3... You flip directly to page 500 (the middle). You see "Mango". Since "Search" comes alphabetically after "Mango", you discard pages 1 through 500 completely. Now your search space is cut in half! Repeat this process until you land right on the word.`,
    explanationHinglish: `Maan lijiye aapke paas 1000 pages ki moti dictionary hai aur aapko "Matrix" word dhoondna hai. Aap pehle page se shuru nahi karenge, balki book ko beech se (page 500) kholenge. Wahan agar "King" mila, toh aapko pata chal gaya ki "Matrix" right side wale half mein hi hoga. Left side ke 500 pages ko bina dekhe drop kar do! Har step mein search space aadhi ho jaati hai!`,
    realLifeAnalogy: 'The "Higher or Lower" guessing game. If someone picks a secret number from 1 to 100, guessing 50 immediately eliminates half the possibilities.',
    visualDiagramDescription: 'Array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] | Target: 23 | Low=0, High=9, Mid=4 (Val 16) -> 23 > 16 so Low moves to Mid+1 (5)',
    diagramType: 'binary-search',
    dryRunSteps: [
      {
        step: 1,
        description: 'Initialize bounds: low = 0, high = 6. Target = 35',
        variables: { low: 0, high: 6, mid: 3, 'arr[mid]': 20, target: 35 },
        activeCodeLine: 3,
        explanation: 'Mid calculation: 0 + (6 - 0) / 2 = 3. arr[3] is 20.'
      },
      {
        step: 2,
        description: 'Compare arr[mid] (20) with Target (35)',
        variables: { comparison: '20 < 35', action: 'Discard left half. low = mid + 1 = 4' },
        activeCodeLine: 6,
        explanation: 'Since array is sorted, target cannot exist at indices <= 3.'
      },
      {
        step: 3,
        description: 'Recalculate mid for remaining subarray [4..6]',
        variables: { low: 4, high: 6, mid: 5, 'arr[mid]': 42, target: 35 },
        activeCodeLine: 3,
        explanation: 'Mid: 4 + (6 - 4) / 2 = 5. arr[5] is 42.'
      },
      {
        step: 4,
        description: 'Compare arr[mid] (42) with Target (35)',
        variables: { comparison: '42 > 35', action: 'Discard right half. high = mid - 1 = 4' },
        activeCodeLine: 8,
        explanation: 'Target must be to the left of index 5.'
      },
      {
        step: 5,
        description: 'Subarray narrowed to single element index 4',
        variables: { low: 4, high: 4, mid: 4, 'arr[mid]': 35, target: 35 },
        activeCodeLine: 4,
        explanation: 'arr[4] == 35! Target found at index 4. Return 4.'
      }
    ],
    javaCode: `public class BinarySearch {
    public static int search(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;
        while (low <= high) {
            // Avoid integer overflow: low + (high - low) / 2
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1; // Target not found
    }
}`,
    javaCodeLines: [
      { line: 1, code: 'public class BinarySearch {', explanation: 'Class declaration.' },
      { line: 2, code: '    public static int search(int[] nums, int target) {', explanation: 'Method accepts sorted array nums and target integer, returns index or -1.' },
      { line: 3, code: '        int low = 0;', explanation: 'Leftmost search boundary index.' },
      { line: 4, code: '        int high = nums.length - 1;', explanation: 'Rightmost search boundary index.' },
      { line: 5, code: '        while (low <= high) {', explanation: 'Crucial: use <= so single-element range (low == high) is checked.' },
      { line: 6, code: '            int mid = low + (high - low) / 2;', explanation: 'Safe midpoint calculation preventing (low + high) integer 32-bit overflow.' },
      { line: 7, code: '            if (nums[mid] == target) {', explanation: 'Target found condition.' },
      { line: 8, code: '                return mid;', explanation: 'Return target index immediately.' },
      { line: 9, code: '            } else if (nums[mid] < target) {', explanation: 'Target is in the right half.' },
      { line: 10, code: '                low = mid + 1;', explanation: 'Eliminate left half and mid by moving low past mid.' },
      { line: 11, code: '            } else {', explanation: 'Target is in the left half.' },
      { line: 12, code: '                high = mid - 1;', explanation: 'Eliminate right half and mid by moving high below mid.' },
      { line: 13, code: '            }', explanation: 'End branch.' },
      { line: 14, code: '        }', explanation: 'End while loop.' },
      { line: 15, code: '        return -1;', explanation: 'If search space is exhausted, target is not present.' },
      { line: 16, code: '    }', explanation: 'End method.' },
      { line: 17, code: '}', explanation: 'End class.' }
    ],
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
      explanation: 'At each iteration, the remaining search window is divided by 2 (n -> n/2 -> n/4 ... -> 1). This takes exactly floor(log2(n)) + 1 steps.'
    },
    spaceComplexity: {
      complexity: 'O(1)',
      explanation: 'Iterative binary search uses only three pointer variables (low, high, mid).'
    },
    commonMistakes: [
      {
        mistake: 'Using (low + high) / 2 which causes integer overflow in Java if low + high > 2,147,483,647',
        fix: 'Always use int mid = low + (high - low) / 2;'
      },
      {
        mistake: 'Using while (low < high) instead of while (low <= high)',
        fix: 'With low < high, if the target is located when low == high, the loop terminates without checking that final element.'
      }
    ],
    edgeCases: [
      'Target smaller than first element: low remains 0, high becomes -1, returns -1',
      'Target larger than last element: high remains n-1, low becomes n, returns -1',
      'Array with duplicates: standard binary search finds ANY valid index; lower_bound / upper_bound needed for first/last occurrences'
    ],
    quiz: [
      {
        id: 'q-bs-1',
        question: 'What is the maximum number of comparisons needed to find an element in a sorted array of 1,024 elements?',
        options: ['1,024', '512', '11', '100'],
        correctIndex: 2,
        explanation: 'log2(1024) = 10, plus 1 final comparison = 11 maximum comparisons.'
      },
      {
        id: 'q-bs-2',
        question: 'Why is `low + (high - low) / 2` preferred over `(low + high) / 2`?',
        options: [
          'It is faster for the CPU',
          'It prevents integer overflow when low + high exceeds Integer.MAX_VALUE',
          'It allows searching unsorted arrays',
          'It uses floating point numbers'
        ],
        correctIndex: 1,
        explanation: 'In Java, if low + high exceeds 2^31 - 1, it overflows into negative numbers, causing ArrayIndexOutOfBoundsException.'
      }
    ],
    problemIds: ['prob-binary-search', 'prob-search-insert', 'prob-find-rotated-min']
  },

  'topic-singly-linked-list': {
    id: 'topic-singly-linked-list',
    title: 'Singly Linked Lists',
    category: 'linked-lists',
    difficulty: 'Medium',
    estimatedHours: 3,
    whatItIs: 'A linked list is a linear data collection whose elements (called nodes) are not stored at contiguous memory locations. Instead, each node contains a data payload and a reference (pointer) to the next node in the chain.',
    whyNeeded: 'Arrays require contiguous memory blocks, which can fail if memory is fragmented, and resizing an array requires expensive reallocation. Linked lists allow effortless O(1) insertion and deletion at the head without shifting any other elements.',
    whereUsed: [
      'Undo/Redo buffers in text editors (e.g. VS Code, Google Docs)',
      'Blockchain blocks (each block points cryptographically to previous block)',
      'Operating System process free-lists in kernel memory management',
      'Adjacency lists in sparse graph representations'
    ],
    explanationEnglish: `Think of a linked list like a treasure hunt! Clue 1 gives you a message and says: "Next clue is buried under the old oak tree". You walk to the tree, find Clue 2, which has another message and says: "Next clue is inside locker 8". You cannot jump straight to Clue 5 because you do not know where it is until you visit Clue 1, 2, 3, and 4 in order.`,
    explanationHinglish: `Linked List ko ek Treasure Hunt (Khazane ki khoj) samjho! Pehli chitthi (Head Node) mein message likha hai aur sath mein agle clue ka address diya hai. Jab tak aap pehle clue tak nahi pahunchenge, tab tak aapko agle clue ka pata nahi chalega. Isme saare elements memory mein alag-alag scattered jagahon pe rehte hain, bas ek dusre ka pointer pakad ke judte hain.`,
    realLifeAnalogy: 'A train with connected carriages. Each carriage has passenger seats and a mechanical coupler locking onto the next carriage.',
    visualDiagramDescription: 'Head -> [Node: 10 | next] -> [Node: 20 | next] -> [Node: 30 | null]',
    diagramType: 'linked-list',
    dryRunSteps: [
      {
        step: 1,
        description: 'Initialize pointers for list reversal: prev = null, curr = head (val: 10)',
        variables: { prev: 'null', curr: 'Node(10)', nextNode: 'null' },
        activeCodeLine: 3,
        explanation: 'We need prev to keep track of the reversed tail, and nextNode to avoid losing the rest of the list.'
      },
      {
        step: 2,
        description: 'Save nextNode = curr.next (Node(20))',
        variables: { prev: 'null', curr: 'Node(10)', nextNode: 'Node(20)' },
        activeCodeLine: 5,
        explanation: 'Cache next node before breaking curr.next pointer.'
      },
      {
        step: 3,
        description: 'Reverse link: curr.next = prev (points to null)',
        variables: { 'curr.next': 'null', prev: 'null', curr: 'Node(10)' },
        activeCodeLine: 6,
        explanation: 'Node(10) now points backwards to null (it is the new tail).'
      },
      {
        step: 4,
        description: 'Advance pointers: prev = curr (Node 10), curr = nextNode (Node 20)',
        variables: { prev: 'Node(10)', curr: 'Node(20)', nextNode: 'Node(20)' },
        activeCodeLine: 7,
        explanation: 'Shift our sliding window one node rightward.'
      },
      {
        step: 5,
        description: 'Process Node(20) to point to Node(10)',
        variables: { 'curr.next': 'Node(10)', prev: 'Node(20)', curr: 'Node(30)' },
        activeCodeLine: 6,
        explanation: 'Node(20) points to Node(10). Continue until curr == null.'
      }
    ],
    javaCode: `public class LinkedListReversal {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    public static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next; // 1. Save next
            curr.next = prev;              // 2. Reverse pointer
            prev = curr;                   // 3. Move prev forward
            curr = nextTemp;               // 4. Move curr forward
        }
        return prev; // prev is the new head of reversed list
    }
}`,
    javaCodeLines: [
      { line: 1, code: 'public class LinkedListReversal {', explanation: 'Class declaration.' },
      { line: 2, code: '    static class ListNode { int val; ListNode next; ... }', explanation: 'Node blueprint with integer value and next pointer.' },
      { line: 8, code: '    public static ListNode reverseList(ListNode head) {', explanation: 'Reverses list in O(n) time and O(1) space in-place.' },
      { line: 9, code: '        ListNode prev = null;', explanation: 'Tracks the node that will become the next target for curr.' },
      { line: 10, code: '        ListNode curr = head;', explanation: 'Pointer currently being redirected backwards.' },
      { line: 11, code: '        while (curr != null) {', explanation: 'Loop runs through every node until reaching the end.' },
      { line: 12, code: '            ListNode nextTemp = curr.next;', explanation: 'Crucial: backup reference to the forward node before severing the link.' },
      { line: 13, code: '            curr.next = prev;', explanation: 'Reverse the pointer: curr now points backward to prev.' },
      { line: 14, code: '            prev = curr;', explanation: 'Move prev pointer to current node.' },
      { line: 15, code: '            curr = nextTemp;', explanation: 'Move curr pointer forward to next node.' },
      { line: 16, code: '        }', explanation: 'End while loop.' },
      { line: 17, code: '        return prev;', explanation: 'prev now points to the original tail, which is the new head.' },
      { line: 18, code: '    }', explanation: 'End method.' },
      { line: 19, code: '}', explanation: 'End class.' }
    ],
    timeComplexity: {
      best: 'O(1) Insert at Head',
      average: 'O(n) Traversal & Search',
      worst: 'O(n) Insert at Tail without tail pointer',
      explanation: 'Inserting at head is instant O(1) because we only rewrite two references. Finding the k-th node requires traversing k pointers, taking O(k).'
    },
    spaceComplexity: {
      complexity: 'O(1) Auxiliary',
      explanation: 'Pointer reversal modifies existing links in place using only two reference variables.'
    },
    commonMistakes: [
      {
        mistake: 'Losing reference to the rest of the list: curr.next = prev BEFORE saving curr.next in nextTemp',
        fix: 'Always store nextTemp = curr.next on the first line inside the loop before mutating curr.next.'
      },
      {
        mistake: 'NullPointerException when accessing node.next without verifying node != null',
        fix: 'Always check if head == null or curr != null before traversing.'
      }
    ],
    edgeCases: [
      'Empty list (head == null): Returns null immediately without error',
      'Single node list (head.next == null): prev becomes head, returns head correctly',
      'Cycle in list: Standard traversal results in infinite loop; Floyd Cycle detection (tortoise & hare) required'
    ],
    quiz: [
      {
        id: 'q-ll-1',
        question: 'What is the time complexity of inserting a new node at the beginning of a singly linked list with n nodes?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correctIndex: 0,
        explanation: 'Creating a new node and setting newNode.next = head takes constant O(1) operations.'
      },
      {
        id: 'q-ll-2',
        question: 'Why does an array offer faster random access than a linked list?',
        options: [
          'Arrays are sorted by default',
          'Arrays have contiguous memory allowing instant O(1) address arithmetic, whereas linked lists require following pointers sequentially',
          'Linked lists use more CPU threads',
          'Java forbids random access on linked lists'
        ],
        correctIndex: 1,
        explanation: 'Linked list nodes are scattered across the heap, requiring O(k) pointer dereferences to reach index k.'
      }
    ],
    problemIds: ['prob-reverse-linked-list', 'prob-detect-cycle', 'prob-merge-two-sorted-lists']
  },

  'topic-stacks': {
    id: 'topic-stacks',
    title: 'Stacks (LIFO: Last In, First Out)',
    category: 'stacks-queues',
    difficulty: 'Easy',
    estimatedHours: 3,
    whatItIs: 'A stack is a linear data structure that follows the LIFO (Last-In, First-Out) principle. All insertions (push) and deletions (pop) occur exclusively at one designated end called the top.',
    whyNeeded: 'Programs constantly execute nested operations. When function A calls function B, which calls function C, the computer must remember where to resume when each function returns. A stack data structure is the only natural mechanism to manage this call history.',
    whereUsed: [
      'Call stack execution in JVM, V8 (JavaScript), and C runtimes',
      'Browser Back/Forward navigation history buttons',
      'Undo/Redo command stacks in software like Figma or Word',
      'Syntax parsing: Matching HTML/XML tags and balanced brackets in compilers'
    ],
    explanationEnglish: `Think of a stack like a spring-loaded plate dispenser in a cafeteria. When clean plates are added, they are pushed onto the top. When you take a plate to eat, you always grab the very top plate—the one that was put there most recently! You cannot remove a plate from the bottom without taking off all the plates above it first.`,
    explanationHinglish: `Stack ko ek plate ke dher ki tarah samjho! Shadi ya buffet mein plates ek ke upar ek rakhi hoti hain. Jo plate sabse aakhiri mein upar rakhi gayi (Last In), sabse pehle wahi uthayi jaati hai (First Out). Agar aapko beech ya neeche ki plate nikalni hai, toh pehle upar ki sabhi plates hatani padengi. Isko bolte hain LIFO!`,
    realLifeAnalogy: 'A stack of dinner plates or a spring-loaded Pringles can. You always consume the top chip first.',
    visualDiagramDescription: 'Stack Top -> [ 30 ] \n             [ 20 ] \n             [ 10 ] (Base)',
    diagramType: 'stack',
    dryRunSteps: [
      {
        step: 1,
        description: 'Initialize empty stack for Valid Parentheses: "({[]})"',
        variables: { stack: '[]', char: '(', action: 'push' },
        activeCodeLine: 4,
        explanation: 'Encountered opening bracket "(". Push onto stack.'
      },
      {
        step: 2,
        description: 'Encountered "{", push onto stack',
        variables: { stack: "['(', '{']", char: '{', action: 'push' },
        activeCodeLine: 4,
        explanation: 'Opening bracket "{" pushed. Stack size is 2.'
      },
      {
        step: 3,
        description: 'Encountered "[", push onto stack',
        variables: { stack: "['(', '{', '[']", char: '[', action: 'push' },
        activeCodeLine: 4,
        explanation: 'Opening bracket "[" pushed. Stack size is 3.'
      },
      {
        step: 4,
        description: 'Encountered "]", compare with stack top',
        variables: { stackTop: '[', char: ']', match: 'true', stackAfter: "['(', '{']" },
        activeCodeLine: 8,
        explanation: 'Closing bracket "]" matches top "[". Pop top.'
      },
      {
        step: 5,
        description: 'Encountered "}", matches top "{". Pop.',
        variables: { stackTop: '{', char: '}', match: 'true', stackAfter: "['(']" },
        activeCodeLine: 8,
        explanation: 'Matches. Stack reduced to 1 element.'
      },
      {
        step: 6,
        description: 'Encountered ")", matches top "(". Pop.',
        variables: { stackTop: '(', char: ')', match: 'true', stackAfter: '[]' },
        activeCodeLine: 8,
        explanation: 'Stack is now empty and all characters consumed. Valid string: TRUE!'
      }
    ],
    javaCode: `import java.util.ArrayDeque;
import java.util.Deque;

public class ValidParentheses {
    public static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) {
                return false;
            }
        }
        return stack.isEmpty();
    }
}`,
    javaCodeLines: [
      { line: 1, code: 'import java.util.ArrayDeque; Deque;', explanation: 'ArrayDeque is preferred over legacy java.util.Stack because it is faster and unsynchronized.' },
      { line: 5, code: '    public static boolean isValid(String s) {', explanation: 'Returns true if brackets match and nest properly.' },
      { line: 6, code: '        Deque<Character> stack = new ArrayDeque<>();', explanation: 'Instantiates double-ended queue used as LIFO stack.' },
      { line: 7, code: '        for (char c : s.toCharArray()) {', explanation: 'Iterate through each character.' },
      { line: 8, code: '            if (c == \'(\') stack.push(\')\');', explanation: 'Trick: push expected closing bracket so check is simple equality!' },
      { line: 9, code: '            else if (c == \'{\') stack.push(\'}\');', explanation: 'Push corresponding expected curly brace.' },
      { line: 10, code: '            else if (c == \'[\') stack.push(\']\');', explanation: 'Push corresponding expected square bracket.' },
      { line: 11, code: '            else if (stack.isEmpty() || stack.pop() != c) {', explanation: 'If closing bracket occurs without open counterpart or mismatches, invalid.' },
      { line: 12, code: '                return false;', explanation: 'Immediate rejection.' },
      { line: 13, code: '            }', explanation: 'End if.' },
      { line: 14, code: '        }', explanation: 'End for loop.' },
      { line: 15, code: '        return stack.isEmpty();', explanation: 'Valid only if every open bracket was matched and stack is clean.' }
    ],
    timeComplexity: {
      best: 'O(1) push, pop, peek',
      average: 'O(n) string validation',
      worst: 'O(n) for processing n characters',
      explanation: 'Every push, pop, and peek operates exclusively on the top element in guaranteed O(1) time.'
    },
    spaceComplexity: {
      complexity: 'O(n) worst case',
      explanation: 'When input consists entirely of open brackets (e.g. "(((((("), all n characters are pushed to stack.'
    },
    commonMistakes: [
      {
        mistake: 'Using legacy `java.util.Stack` in modern Java',
        fix: 'Use `Deque<T> stack = new ArrayDeque<>()`. java.util.Stack extends Vector, incurring unnecessary synchronization lock overhead on single-threaded execution.'
      },
      {
        mistake: 'Forgetting to check `stack.isEmpty()` before calling `stack.pop()`',
        fix: 'Calling pop() on an empty stack throws NoSuchElementException. Always check isEmpty() first.'
      }
    ],
    edgeCases: [
      'String begins with closing bracket (e.g. "}"): stack is empty on first comparison, immediately returns false',
      'Odd length string: Cannot possibly be balanced, returns false',
      'Only opening brackets (e.g. "(((("): Loop completes with items remaining on stack; return stack.isEmpty() handles this cleanly'
    ],
    quiz: [
      {
        id: 'q-stk-1',
        question: 'Which principle does a Stack follow?',
        options: ['FIFO (First In, First Out)', 'LIFO (Last In, First Out)', 'Random Access', 'Priority Ordering'],
        correctIndex: 1,
        explanation: 'LIFO: The last item pushed to the stack is the first item removed.'
      },
      {
        id: 'q-stk-2',
        question: 'Which Java collection is recommended for implementing a high-performance stack?',
        options: ['java.util.Vector', 'java.util.Stack', 'java.util.ArrayDeque', 'java.util.HashSet'],
        correctIndex: 2,
        explanation: 'ArrayDeque provides an unsynchronized, resizable array-backed stack that outperforms java.util.Stack.'
      }
    ],
    problemIds: ['prob-valid-parentheses', 'prob-min-stack', 'prob-daily-temperatures']
  },

  'topic-bst': {
    id: 'topic-bst',
    title: 'Binary Search Trees (BST)',
    category: 'trees',
    difficulty: 'Medium',
    estimatedHours: 3,
    whatItIs: 'A Binary Search Tree is a node-based binary tree data structure where for every node: all values in its left subtree are strictly LESS than the node, and all values in its right subtree are strictly GREATER than the node.',
    whyNeeded: 'Arrays provide fast O(1) random access but slow O(n) insertions. Linked lists provide fast O(1) insertions but slow O(n) search. A balanced BST gives the best of both worlds: O(log n) search, insert, and delete!',
    whereUsed: [
      'Java TreeSet & TreeMap (implemented via Red-Black BST)',
      'Database indexes and filesystem directories (B-trees, a generalized multi-way BST)',
      'Auto-complete dictionary prefix systems',
      '3D graphics spatial partitioning (BSP Trees)'
    ],
    explanationEnglish: `A BST is like a tree where every fork in the road makes a decision. Stand at the root. If the number you are looking for is smaller than the current signpost, go left. If it is larger, go right. Because every single decision eliminates an entire half of the tree, you reach your destination in just O(log n) steps!`,
    explanationHinglish: `BST ek smart tree hai jisme har node par ek simple rule hota hai: Chhote numbers hamesha LEFT mein jayenge, aur bade numbers hamesha RIGHT mein jayenge! Agar aap root node (maan lo 50) pe khade ho aur aapko 25 dhoondna hai, toh aapko right side dekhne ki zaroorat hi nahi hai, seedhe left branch mein jao. Har turn pe aadhi branch eliminate ho jaati hai!`,
    realLifeAnalogy: 'A corporate organizational chart where employees are sorted strictly by employee ID number or seniority at every branch.',
    visualDiagramDescription: '       [ 50 ]\n      /      \\\n   [ 30 ]    [ 70 ]\n   /    \\    /    \\\n [20]  [40] [60]  [80]',
    diagramType: 'tree',
    dryRunSteps: [
      {
        step: 1,
        description: 'Insert 65 into BST with root 50',
        variables: { curr: 50, valToInsert: 65, comparison: '65 > 50' },
        activeCodeLine: 4,
        explanation: '65 is greater than root 50. Move to right subtree (node 70).'
      },
      {
        step: 2,
        description: 'Compare 65 with node 70',
        variables: { curr: 70, valToInsert: 65, comparison: '65 < 70' },
        activeCodeLine: 6,
        explanation: '65 is less than 70. Move to left subtree of 70.'
      },
      {
        step: 3,
        description: 'Left child of 70 is null. Position found!',
        variables: { '70.left': 'null', action: 'Create node 65 as 70.left' },
        activeCodeLine: 8,
        explanation: 'Attach new TreeNode(65) at 70.left. BST property preserved!'
      }
    ],
    javaCode: `public class BinarySearchTree {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    public static TreeNode insert(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) {
            root.left = insert(root.left, val);
        } else if (val > root.val) {
            root.right = insert(root.right, val);
        }
        return root;
    }

    public static boolean search(TreeNode root, int val) {
        if (root == null) return false;
        if (root.val == val) return true;
        return val < root.val ? search(root.left, val) : search(root.right, val);
    }
}`,
    javaCodeLines: [
      { line: 1, code: 'public class BinarySearchTree {', explanation: 'Class declaration.' },
      { line: 7, code: '    public static TreeNode insert(TreeNode root, int val) {', explanation: 'Recursive insertion preserving BST invariants.' },
      { line: 8, code: '        if (root == null) return new TreeNode(val);', explanation: 'Base case: empty position found, create new node.' },
      { line: 9, code: '        if (val < root.val) {', explanation: 'Smaller value belongs in the left subtree.' },
      { line: 10, code: '            root.left = insert(root.left, val);', explanation: 'Recurse left and reconnect link.' },
      { line: 11, code: '        } else if (val > root.val) {', explanation: 'Larger value belongs in the right subtree.' },
      { line: 12, code: '            root.right = insert(root.right, val);', explanation: 'Recurse right and reconnect link.' },
      { line: 13, code: '        }', explanation: 'End conditional.' },
      { line: 14, code: '        return root;', explanation: 'Return unchanged root pointer.' }
    ],
    timeComplexity: {
      best: 'O(log n) balanced tree',
      average: 'O(log n) random insertions',
      worst: 'O(n) degenerate skewed tree (like linked list)',
      explanation: 'In a balanced BST of height h, search is O(h) = O(log n). If elements are inserted in sorted order (1, 2, 3, 4, 5), the tree degrades into a straight line taking O(n).'
    },
    spaceComplexity: {
      complexity: 'O(h) call stack',
      explanation: 'Recursion uses call stack frames proportional to tree height (O(log n) average, O(n) worst).'
    },
    commonMistakes: [
      {
        mistake: 'Checking only direct children instead of the entire subtree during BST validation',
        fix: 'A valid BST requires that ALL nodes in the left subtree are smaller than root, not just root.left. Validate using min/max bounds: validate(node, min, max).'
      },
      {
        mistake: 'Assuming BST is always O(log n) without self-balancing',
        fix: 'Plain BSTs can degrade to O(n). Self-balancing trees (AVL or Red-Black trees) guarantee O(log n) height.'
      }
    ],
    edgeCases: [
      'Empty tree (root == null): search returns false, insert returns new root',
      'Duplicate values: Usually ignored, counted in a frequency field, or placed strictly right',
      'Deleting node with 2 children: Must replace with Inorder Successor (smallest node in right subtree) or Inorder Predecessor'
    ],
    quiz: [
      {
        id: 'q-bst-1',
        question: 'Which traversal of a Binary Search Tree produces elements in ascending sorted order?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctIndex: 1,
        explanation: 'In-order traversal visits Left Subtree -> Root -> Right Subtree, which yields strictly sorted order in a BST.'
      },
      {
        id: 'q-bst-2',
        question: 'What is the worst-case time complexity of searching in an unbalanced BST with n nodes?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 2,
        explanation: 'If inserted in sorted order (e.g. 10, 20, 30, 40), the tree becomes a skewed linked list with height n, taking O(n).'
      }
    ],
    problemIds: ['prob-validate-bst', 'prob-lowest-common-ancestor', 'prob-kth-smallest-bst']
  },

  'topic-graphs': {
    id: 'topic-graphs',
    title: 'Graph Theory & Traversals (BFS & DFS)',
    category: 'graphs',
    difficulty: 'Hard',
    estimatedHours: 5,
    whatItIs: 'A graph is a non-linear data structure consisting of a finite set of vertices (or nodes) and a collection of edges that connect pairs of vertices. Edges can be directed or undirected, weighted or unweighted.',
    whyNeeded: 'Real-world networks are non-hierarchical. Social relationships, internet web pages, flight routes, and city road maps cannot be modeled as simple trees because they contain cycles and multiple interconnected routes.',
    whereUsed: [
      'Google Maps & Uber: Dijkstra / A* algorithms for shortest driving route',
      'LinkedIn & Facebook: "People you may know" (friends of friends network graph)',
      'Web Crawlers: Googlebot discovering new web pages via Breadth-First Search',
      'Package Managers (npm, Maven): Topological sort to resolve build dependencies'
    ],
    explanationEnglish: `Think of a graph like a subway map of a major city. Each subway station is a vertex (node). The railway tracks connecting two stations are edges.
- Breadth-First Search (BFS) is like ripples expanding in a pond when you drop a stone. You visit all immediate neighbor stations (1 stop away), then all stations 2 stops away, then 3 stops away. BFS always guarantees the shortest number of hops!
- Depth-First Search (DFS) is like exploring a dark labyrinth. You pick one tunnel and run as deep as you can until you hit a dead end, then backtrack to the last junction and try another tunnel.`,
    explanationHinglish: `Graph ko metro train network samjho! Har metro station ek Vertex (Node) hai, aur do stations ko jodne wali track ek Edge hai.
- BFS (Breadth-First Search) bilkul paani mein patthar phekne jaisa hai—pehla round (radius 1) ke saare stations dekho, fir radius 2 ke, fir radius 3 ke. Ye hamesha SHORTEST PATH nikalta hai!
- DFS (Depth-First Search) kisi bhool-bhulaiya (maze) ko explore karne jaisa hai: ek raste pe tab tak chalte jao jab tak aage rasta band na ho jaye, fir peeche mud ke dusra rasta lo!`,
    realLifeAnalogy: 'Social media network: You (Node) are connected to your direct friends (Edges). BFS finds 1st degree, 2nd degree, and 3rd degree connections.',
    visualDiagramDescription: '(Node 0) --- (Node 1) ---\n   |           |         \\\n(Node 2) --- (Node 3) --- (Node 4)',
    diagramType: 'graph',
    dryRunSteps: [
      {
        step: 1,
        description: 'Start BFS from source vertex 0. Initialize visited set and queue.',
        variables: { queue: '[ 0 ]', visited: '{ 0 }', current: 0 },
        activeCodeLine: 3,
        explanation: 'Enqueued source 0 and marked visited.'
      },
      {
        step: 2,
        description: 'Dequeue 0. Visit its unvisited neighbors: 1 and 2.',
        variables: { dequeued: 0, neighbors: '[1, 2]', queue: '[ 1, 2 ]', visited: '{ 0, 1, 2 }' },
        activeCodeLine: 6,
        explanation: 'Nodes 1 and 2 are 1 hop away. Enqueue both.'
      },
      {
        step: 3,
        description: 'Dequeue 1. Visit neighbor 3 (already visited 0 is skipped).',
        variables: { dequeued: 1, neighbors: '[0, 3]', queue: '[ 2, 3 ]', visited: '{ 0, 1, 2, 3 }' },
        activeCodeLine: 6,
        explanation: 'Node 3 is 2 hops away from source 0. Enqueue.'
      },
      {
        step: 4,
        description: 'Dequeue 2. Neighbor 3 is already visited.',
        variables: { dequeued: 2, queue: '[ 3 ]', visited: '{ 0, 1, 2, 3 }' },
        activeCodeLine: 6,
        explanation: 'Node 2 has no new unvisited neighbors.'
      },
      {
        step: 5,
        description: 'Dequeue 3. Queue becomes empty. BFS traversal complete!',
        variables: { dequeued: 3, queue: '[]', order: '[0, 1, 2, 3]' },
        activeCodeLine: 8,
        explanation: 'All reachable vertices explored in level order.'
      }
    ],
    javaCode: `import java.util.*;

public class GraphBFS {
    public static List<Integer> bfs(int numVertices, List<List<Integer>> adj, int startNode) {
        List<Integer> result = new ArrayList<>();
        boolean[] visited = new boolean[numVertices];
        Queue<Integer> queue = new LinkedList<>();

        visited[startNode] = true;
        queue.offer(startNode);

        while (!queue.isEmpty()) {
            int curr = queue.poll();
            result.add(curr);

            for (int neighbor : adj.get(curr)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
        return result;
    }
}`,
    javaCodeLines: [
      { line: 1, code: 'import java.util.*;', explanation: 'Import collection frameworks.' },
      { line: 4, code: '    public static List<Integer> bfs(...) {', explanation: 'BFS traversal returning nodes in level order.' },
      { line: 5, code: '        List<Integer> result = new ArrayList<>();', explanation: 'Stores visited nodes sequence.' },
      { line: 6, code: '        boolean[] visited = new boolean[numVertices];', explanation: 'Crucial: marks visited nodes to prevent infinite loops in cyclic graphs.' },
      { line: 7, code: '        Queue<Integer> queue = new LinkedList<>();', explanation: 'FIFO Queue drives level-by-level exploration.' },
      { line: 9, code: '        visited[startNode] = true;', explanation: 'Mark start node visited before enqueuing.' },
      { line: 10, code: '        queue.offer(startNode);', explanation: 'Add start node to queue.' },
      { line: 12, code: '        while (!queue.isEmpty()) {', explanation: 'Continue while there are nodes remaining to explore.' },
      { line: 13, code: '            int curr = queue.poll();', explanation: 'Remove next vertex in level order.' },
      { line: 14, code: '            result.add(curr);', explanation: 'Record visited vertex.' },
      { line: 16, code: '            for (int neighbor : adj.get(curr)) {', explanation: 'Iterate all outgoing edges.' },
      { line: 17, code: '                if (!visited[neighbor]) {', explanation: 'Only process vertices not yet seen.' },
      { line: 18, code: '                    visited[neighbor] = true;', explanation: 'Mark immediately so duplicates are not enqueued multiple times.' },
      { line: 19, code: '                    queue.offer(neighbor);', explanation: 'Enqueue neighbor for next level.' },
      { line: 20, code: '                }', explanation: 'End if.' },
      { line: 21, code: '            }', explanation: 'End neighbor loop.' },
      { line: 22, code: '        }', explanation: 'End while loop.' },
      { line: 23, code: '        return result;', explanation: 'Return traversal order.' }
    ],
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
      explanation: 'Every vertex V is enqueued and dequeued once, and every edge E is examined once via the adjacency list.'
    },
    spaceComplexity: {
      complexity: 'O(V)',
      explanation: 'Visited array of size V plus queue holding up to V vertices.'
    },
    commonMistakes: [
      {
        mistake: 'Marking a node as visited when DEQUEUEING instead of when ENQUEUEING',
        fix: 'Always mark `visited[neighbor] = true` the moment it is pushed to the queue. If you wait until it is polled, the same node will be added to the queue multiple times by other neighbors, wasting memory and CPU.'
      },
      {
        mistake: 'Forgetting that graphs may be disconnected (having multiple components)',
        fix: 'If the graph might have isolated islands, run a loop from 0 to V-1: if (!visited[i]) bfs(i);'
      }
    ],
    edgeCases: [
      'Disconnected graph: BFS from node 0 only visits vertices in component 0',
      'Graph with self-loops: visited array protects against infinite self-referencing loops',
      'Single vertex with no edges: Loop processes node 0 and returns [0] correctly'
    ],
    quiz: [
      {
        id: 'q-grp-1',
        question: 'Which traversal algorithm is guaranteed to find the shortest path in an unweighted graph?',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'In-order Traversal', 'Post-order Traversal'],
        correctIndex: 1,
        explanation: 'Because BFS explores in concentric waves (all 1-edge paths, then 2-edge paths), the first time it reaches a destination is guaranteed to be the shortest path.'
      },
      {
        id: 'q-grp-2',
        question: 'What is the time complexity of BFS using an Adjacency List representation with V vertices and E edges?',
        options: ['O(V^2)', 'O(V + E)', 'O(E log V)', 'O(V * E)'],
        correctIndex: 1,
        explanation: 'Each vertex is visited once (O(V)) and each edge is inspected once (O(E)), summing to O(V + E).'
      }
    ],
    problemIds: ['prob-number-of-islands', 'prob-clone-graph', 'prob-course-schedule']
  }
};

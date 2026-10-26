import { PracticeProblem } from '../types/dsa';

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 'prob-two-sum',
    title: 'Two Sum (Array Indices)',
    difficulty: 'Easy',
    category: 'arrays',
    topicId: 'topic-arrays',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    starterCodeJava: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        // Tip: Use a HashMap to store value -> index for O(n) lookup!
        Map<Integer, Integer> map = new HashMap<>();
        
        return new int[]{};
    }
}`,
    solutionJava: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
    hints: [
      'Brute force takes O(n^2) by checking every pair. Can we do better with auxiliary space?',
      'As you iterate through the array, what number do you need to complete the target sum? complement = target - nums[i]',
      'A HashMap can store elements seen so far with their index, providing O(1) average lookup.'
    ],
    testCases: [
      { input: '[2, 7, 11, 15], 9', expected: '[0, 1]' },
      { input: '[3, 2, 4], 6', expected: '[1, 2]' },
      { input: '[3, 3], 6', expected: '[0, 1]' }
    ]
  },
  {
    id: 'prob-binary-search',
    title: 'Binary Search (Standard Template)',
    difficulty: 'Easy',
    category: 'sorting-searching',
    topicId: 'topic-binary-search',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    examples: [
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4'
      },
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1'
      }
    ],
    starterCodeJava: `public class Solution {
    public int search(int[] nums, int target) {
        // Implement O(log n) binary search
        int low = 0;
        int high = nums.length - 1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            // Complete logic here
        }
        return -1;
    }
}`,
    solutionJava: `public class Solution {
    public int search(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
}`,
    hints: [
      'Set low = 0 and high = nums.length - 1.',
      'Always calculate mid safely: low + (high - low) / 2.',
      'Compare nums[mid] with target: if target is larger, search right half (low = mid + 1).'
    ],
    testCases: [
      { input: '[-1, 0, 3, 5, 9, 12], 9', expected: '4' },
      { input: '[-1, 0, 3, 5, 9, 12], 2', expected: '-1' },
      { input: '[5], 5', expected: '0' }
    ]
  },
  {
    id: 'prob-reverse-linked-list',
    title: 'Reverse a Singly Linked List',
    difficulty: 'Easy',
    category: 'linked-lists',
    topicId: 'topic-singly-linked-list',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    examples: [
      {
        input: 'head = [1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]',
        explanation: 'The linked list pointers are redirected backwards.'
      },
      {
        input: 'head = [1, 2]',
        output: '[2, 1]',
        explanation: '2 -> 1 -> null'
      }
    ],
    starterCodeJava: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int val) { this.val = val; }
 * }
 */
public class Solution {
    public ListNode reverseList(ListNode head) {
        // Implement in-place reversal in O(n) time and O(1) space
        ListNode prev = null;
        ListNode curr = head;
        
        return prev;
    }
}`,
    solutionJava: `public class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`,
    hints: [
      'You need three pointers: prev, curr, and nextTemp.',
      'Before changing curr.next, save curr.next into nextTemp.',
      'Point curr.next to prev, then advance prev = curr and curr = nextTemp.'
    ],
    testCases: [
      { input: '[1, 2, 3, 4, 5]', expected: '[5, 4, 3, 2, 1]' },
      { input: '[1, 2]', expected: '[2, 1]' },
      { input: '[]', expected: '[]' }
    ]
  },
  {
    id: 'prob-valid-parentheses',
    title: 'Valid Parentheses (Stack LIFO)',
    difficulty: 'Easy',
    category: 'stacks-queues',
    topicId: 'topic-stacks',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    starterCodeJava: `import java.util.*;

public class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        // Push closing bracket upon seeing opening bracket
        
        return false;
    }
}`,
    solutionJava: `import java.util.*;

public class Solution {
    public boolean isValid(String s) {
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
    hints: [
      'A stack data structure naturally matches inner-most brackets first.',
      'When you see an opening bracket, push its expected closing bracket onto the stack.',
      'When you see a closing bracket, pop from the stack and compare for equality.'
    ],
    testCases: [
      { input: '"()"', expected: 'true' },
      { input: '"()[]{}"', expected: 'true' },
      { input: '"(]"', expected: 'false' }
    ]
  },
  {
    id: 'prob-validate-bst',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    category: 'trees',
    topicId: 'topic-bst',
    description: `Given the \`root\` of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys strictly less than the node's key.
- The right subtree of a node contains only nodes with keys strictly greater than the node's key.
- Both the left and right subtrees must also be binary search trees.`,
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1'
    ],
    examples: [
      {
        input: 'root = [2, 1, 3]',
        output: 'true'
      },
      {
        input: 'root = [5, 1, 4, null, null, 3, 6]',
        output: 'false',
        explanation: 'The root node\'s value is 5 but its right child\'s value is 4.'
      }
    ],
    starterCodeJava: `public class Solution {
    public boolean isValidBST(TreeNode root) {
        // Pass min and max range down the recursive calls
        return validate(root, null, null);
    }
    
    private boolean validate(TreeNode node, Integer min, Integer max) {
        // Implement bounding checks
        return true;
    }
}`,
    solutionJava: `public class Solution {
    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }
    
    private boolean validate(TreeNode node, Integer min, Integer max) {
        if (node == null) return true;
        if ((min != null && node.val <= min) || (max != null && node.val >= max)) {
            return false;
        }
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }
}`,
    hints: [
      'Checking only node.left < node < node.right is NOT sufficient because a grand-child in the right subtree might be smaller than the root!',
      'Pass down an allowed interval (min, max). When moving left, update max = node.val. When moving right, update min = node.val.',
      'Use Integer object or Long to handle 32-bit boundary values.'
    ],
    testCases: [
      { input: '[2, 1, 3]', expected: 'true' },
      { input: '[5, 1, 4, null, null, 3, 6]', expected: 'false' }
    ]
  },
  {
    id: 'prob-number-of-islands',
    title: 'Number of Islands (Graph BFS / DFS)',
    difficulty: 'Medium',
    category: 'graphs',
    topicId: 'topic-graphs',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1'
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3'
      }
    ],
    starterCodeJava: `public class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        // Traverse every cell; when finding '1', increment count and sink island via DFS/BFS
        
        return count;
    }
}`,
    solutionJava: `public class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        int rows = grid.length;
        int cols = grid[0].length;
        
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    sinkIsland(grid, r, c);
                }
            }
        }
        return count;
    }
    
    private void sinkIsland(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') {
            return;
        }
        grid[r][c] = '0'; // mark as visited
        sinkIsland(grid, r + 1, c);
        sinkIsland(grid, r - 1, c);
        sinkIsland(grid, r, c + 1);
        sinkIsland(grid, r, c - 1);
    }
}`,
    hints: [
      'Think of the 2D grid as an undirected graph where each land cell has edges to its 4 cardinal neighbors.',
      'Whenever you encounter a \'1\', it represents a new connected component (island).',
      'Trigger a DFS or BFS from that cell to visit and "sink" (change to \'0\') all connected land cells.'
    ],
    testCases: [
      { input: '4x5 grid with 1 island', expected: '1' },
      { input: '4x5 grid with 3 islands', expected: '3' }
    ]
  }
];

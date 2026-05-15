type LangCode = 'python' | 'javascript' | 'typescript' | 'java' | 'cpp' | 'go' | 'rust' | 'ruby'

interface StarterTemplates {
  python: string
  javascript: string
  typescript: string
  java: string
  cpp: string
  go: string
  rust: string
  ruby: string
}

const DEFAULT: StarterTemplates = {
  python: `from typing import List, Optional

class Solution:
    def solve(self) -> None:
        pass`,
  javascript: `/**
 * @return {*}
 */
var solution = function() {
    
};`,
  typescript: `function solution(): any {
    
}`,
  java: `class Solution {
    public Object solve() {
        return null;
    }
}`,
  cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    void solve() {
        
    }
};`,
  go: `package main

func solution() interface{} {
    return nil
}`,
  rust: `fn solution() -> Option<i32> {
    None
}`,
  ruby: `def solution()
  
end`,
}

function slugToCamel(slug: string): string {
  return slug
    .split('-')
    .map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1))
    .join('')
}

function slugToPascal(slug: string): string {
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')
}

function paramNames(slug: string): string {
  const map: Record<string, string> = {
    'two-integer-sum': 'nums: List[int], target: int',
    'duplicate-integer': 'nums: List[int]',
    'is-anagram': 's: str, t: str',
    'group-anagrams': 'strs: List[str]',
    'top-k-frequent-elements': 'nums: List[int], k: int',
    'encode-and-decode-strings': 'strs: List[str]',
    'products-of-array-discluding-self': 'nums: List[int]',
    'valid-sudoku': 'board: List[List[str]]',
    'longest-consecutive-sequence': 'nums: List[int]',
    'valid-palindrome': 's: str',
    'two-sum-ii-input-array-is-sorted': 'numbers: List[int], target: int',
    'three-sum': 'nums: List[int]',
    'container-with-most-water': 'height: List[int]',
    'trapping-rain-water': 'height: List[int]',
    'best-time-to-buy-and-sell-stock': 'prices: List[int]',
    'longest-substring-without-repeating-characters': 's: str',
    'longest-repeating-character-replacement': 's: str, k: int',
    'minimum-window-substring': 's: str, t: str',
    'valid-parentheses': 's: str',
    'minimum-stack': '',
    'evaluate-reverse-polish-notation': 'tokens: List[str]',
    'generate-parentheses': 'n: int',
    'daily-temperatures': 'temperatures: List[int]',
    'car-fleet': 'target: int, position: List[int], speed: List[int]',
    'binary-search': 'nums: List[int], target: int',
    'search-a-2d-matrix': 'matrix: List[List[int]], target: int',
    'find-minimum-in-rotated-sorted-array': 'nums: List[int]',
    'search-in-rotated-sorted-array': 'nums: List[int], target: int',
    'reverse-linked-list': 'head: Optional[ListNode]',
    'merge-two-sorted-lists': 'list1: Optional[ListNode], list2: Optional[ListNode]',
    'linked-list-cycle-detection': 'head: Optional[ListNode]',
    'reorder-linked-list': 'head: Optional[ListNode]',
    'remove-nth-node-from-end-of-list': 'head: Optional[ListNode], n: int',
    'copy-linked-list-with-random-pointer': 'head: Optional[Node]',
    'add-two-numbers': 'l1: Optional[ListNode], l2: Optional[ListNode]',
    'invert-binary-tree': 'root: Optional[TreeNode]',
    'maximum-depth-of-binary-tree': 'root: Optional[TreeNode]',
    'same-tree': 'p: Optional[TreeNode], q: Optional[TreeNode]',
    'subtree-of-another-tree': 'root: Optional[TreeNode], subRoot: Optional[TreeNode]',
    'lowest-common-ancestor-in-binary-search-tree': 'root: Optional[TreeNode], p: Optional[TreeNode], q: Optional[TreeNode]',
    'binary-tree-level-order-traversal': 'root: Optional[TreeNode]',
    'validate-binary-search-tree': 'root: Optional[TreeNode]',
    'kth-smallest-element-in-a-bst': 'root: Optional[TreeNode], k: int',
    'construct-binary-tree-from-preorder-and-inorder-traversal': 'preorder: List[int], inorder: List[int]',
    'serialize-and-deserialize-binary-tree': 'root: Optional[TreeNode]',
  }
  return map[slug] || `*args`
}

const STARTER_CODE: Record<string, Partial<StarterTemplates>> = {}

function generate(slug: string, topic?: string): StarterTemplates {
  if (STARTER_CODE[slug]) {
    return { ...DEFAULT, ...STARTER_CODE[slug] }
  }

  const fn = slugToCamel(slug)
  const cls = slugToPascal(slug)
  const pyParams = paramNames(slug)

  const needsLinkedList = slug.includes('linked-list') || slug.includes('list')
  const needsTreeNode = slug.includes('tree') || slug.includes('bst') || slug.includes('binary')
  const needsNode = slug.includes('node')
  const needsGraph = slug.includes('graph') || slug.includes('island') || slug.includes('matrix')

  let imports = 'from typing import List'
  if (needsLinkedList) imports += ', Optional'
  if (needsTreeNode) imports += ', Optional'
  if (needsNode) imports += ', Optional'
  if (needsGraph) imports += ', List'

  let pyExtra = ''
  let tsExtra = ''
  let javaExtra = ''
  let cppExtra = ''

  if (needsLinkedList) {
    pyExtra = `\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next`
    tsExtra = `\n\nclass ListNode {\n  val: number\n  next: ListNode | null\n  constructor(val?: number, next?: ListNode | null) {\n    this.val = val ?? 0\n    this.next = next ?? null\n  }\n}`
    javaExtra = `\n\nclass ListNode {\n    int val;\n    ListNode next;\n    ListNode() {}\n    ListNode(int val) { this.val = val; }\n    ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n}`
    cppExtra = `\n\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode() : val(0), next(nullptr) {}\n    ListNode(int x) : val(x), next(nullptr) {}\n    ListNode(int x, ListNode *next) : val(x), next(next) {}\n};`
  }
  if (needsTreeNode) {
    const extra = `\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right`
    if (!pyExtra) pyExtra = extra
    const ts = `\n\nclass TreeNode {\n  val: number\n  left: TreeNode | null\n  right: TreeNode | null\n  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {\n    this.val = val ?? 0\n    this.left = left ?? null\n    this.right = right ?? null\n  }\n}`
    if (!tsExtra) tsExtra = ts
    const j = `\n\nclass TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    TreeNode() {}\n    TreeNode(int val) { this.val = val; }\n    TreeNode(int val, TreeNode left, TreeNode right) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}`
    if (!javaExtra) javaExtra = j
    const c = `\n\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode() : val(0), left(nullptr), right(nullptr) {}\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n};`
    if (!cppExtra) cppExtra = c
  }

  const retType = slug.includes('binary-search') ? 'int'
    : slug.includes('palindrome') || slug.includes('anagram') || slug.includes('valid-') || slug.includes('same-tree') || slug.includes('duplicate') || slug.includes('has-cycle') || slug.includes('subtree') ? 'bool'
    : slug.includes('string') || slug.includes('longest-substring') || slug.includes('serialize') ? 'str'
    : slug.includes('sum') || slug.includes('max') || slug.includes('min') || slug.includes('depth') || slug.includes('kth') || slug.includes('top-k') ? 'int'
    : slug.includes('list') || slug.includes('array') ? 'List'
    : slug.includes('tree') || slug.includes('node') ? 'Optional'
    : 'Any'

  const jsParams = pyParams.replace(/List\[(\w+)\]/g, '$1[]').replace(/Optional\[(\w+)\]/g, '$1 | null').replace(/, /g, ', ')

  return {
    python: `${imports}${pyExtra}

class Solution:
    def ${fn}(self${pyParams ? ', ' + pyParams : ''}):
        pass`,
    javascript: `/**${jsParams ? `\n * @param {${jsParams.replace(/[A-Z][a-z]+\[\]/g, 'number[]').replace(/str/g, 'string').replace(/int/g, 'number')}}` : ''}
 * @return {${retType === 'List' ? 'number[]' : retType === 'str' ? 'string' : retType === 'bool' ? 'boolean' : 'number'}}
 */
var ${fn} = function(${jsParams.split(', ').map(p => p.split(':')[0].trim()).filter(Boolean).join(', ')}) {
    
};`,
    typescript: `${tsExtra}

function ${fn}(${jsParams}): ${retType === 'List' ? 'number[]' : retType === 'Optional' ? 'TreeNode | null' : retType} {
    
}`,
    java: `${javaExtra}

class Solution {
    public ${retType === 'List' ? 'List<Integer>' : retType === 'str' ? 'String' : retType === 'bool' ? 'boolean' : retType === 'Optional' ? 'TreeNode' : 'int'} ${fn}(${jsParams}) {
        ${retType === 'bool' ? 'return false;' : retType === 'int' ? 'return 0;' : retType === 'str' ? 'return "";' : 'return null;'}
    }
}`,
    cpp: `${cppExtra}

class Solution {
public:
    ${retType === 'List' ? 'vector<int>' : retType === 'str' ? 'string' : retType === 'bool' ? 'bool' : retType === 'Optional' ? 'TreeNode*' : 'int'} ${fn}(${jsParams}) {
        ${retType === 'bool' ? 'return false;' : retType === 'int' ? 'return 0;' : retType === 'str' ? 'return "";' : 'return nullptr;'}
    }
};`,
    go: `package main

func ${fn}() interface{} {
    return nil
}`,
    rust: `fn ${fn}() -> Option<i32> {
    None
}`,
    ruby: `def ${fn}()
  
end`,
  }
}

export function getStarterCode(slug: string, language: LangCode, topic?: string): string {
  return generate(slug, topic)[language]
}

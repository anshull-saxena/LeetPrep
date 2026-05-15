'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Play, RotateCcw, Loader2, CheckCircle2, XCircle, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', version: '18.15.0', template: `function solution() {\n  // Write your code here\n  return null;\n}\n\nconsole.log(solution());` },
  { id: 'python', label: 'Python', version: '3.10.0', template: `def solution():\n    # Write your code here\n    pass\n\nprint(solution())` },
  { id: 'java', label: 'Java', version: '15.0.2', template: `public class Main {\n    public static void main(String[] args) {\n        System.out.println(solution());\n    }\n    \n    public static Object solution() {\n        // Write your code here\n        return null;\n    }\n}` },
  { id: 'cpp', label: 'C++', version: '10.2.0', template: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << solution() << endl;\n    return 0;\n}\n\nauto solution() {\n    // Write your code here\n    return nullptr;\n}` },
  { id: 'typescript', label: 'TypeScript', version: '5.0.3', template: `function solution(): any {\n  // Write your code here\n  return null;\n}\n\nconsole.log(solution());` },
  { id: 'go', label: 'Go', version: '1.16.0', template: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println(solution())\n}\n\nfunc solution() interface{} {\n    // Write your code here\n    return nil\n}` },
  { id: 'rust', label: 'Rust', version: '1.68.2', template: `fn main() {\n    println!("{:?}", solution());\n}\n\nfn solution() -> Option<i32> {\n    // Write your code here\n    None\n}` },
  { id: 'ruby', label: 'Ruby', version: '3.2.1', template: `def solution()\n  # Write your code here\n  nil\nend\n\nputs solution()` },
]

interface CodeEditorProps {
  questionTitle?: string
}

type OutputStatus = 'idle' | 'running' | 'success' | 'error'

export function CodeEditor({ questionTitle }: CodeEditorProps) {
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [code, setCode] = useState(language.template)
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<OutputStatus>('idle')
  const [expanded, setExpanded] = useState(false)

  const switchLanguage = (id: string) => {
    const lang = LANGUAGES.find(l => l.id === id) || LANGUAGES[0]
    setLanguage(lang)
    setCode(lang.template)
    setOutput('')
    setStatus('idle')
  }

  const runCode = async () => {
    setStatus('running')
    setOutput('')

    try {
      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language.id,
          version: language.version,
          files: [{ content: code }],
        }),
      })

      const data = await res.json()

      if (data.run?.output) {
        setOutput(data.run.output)
        setStatus(data.run.code === 0 ? 'success' : 'error')
      } else if (data.message) {
        setOutput(data.message)
        setStatus('error')
      } else {
        setOutput('No output')
        setStatus('success')
      }
    } catch (e) {
      setOutput('Execution failed. Check your internet connection.')
      setStatus('error')
    }
  }

  const resetCode = () => {
    setCode(language.template)
    setOutput('')
    setStatus('idle')
  }

  return (
    <div className={cn(
      'border border-white/10 rounded-2xl overflow-hidden bg-[#1e1e1e] transition-all',
      expanded ? 'fixed inset-4 z-50 flex flex-col' : ''
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#2d2d2d] border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Code</span>
          {questionTitle && (
            <span className="text-xs text-muted-foreground/50 hidden sm:inline">— {questionTitle}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language.id}
            onChange={e => switchLanguage(e.target.value)}
            className="h-7 rounded-md bg-[#3c3c3c] border border-white/10 px-2 text-xs text-foreground focus:outline-none"
          >
            {LANGUAGES.map(l => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="h-7 w-7"
          >
            {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className={cn(expanded ? 'flex-1' : 'h-56')}>
        <MonacoEditor
          language={language.id}
          value={code}
          onChange={val => setCode(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            tabSize: 2,
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-t border-white/5">
        <Button
          size="sm"
          onClick={runCode}
          disabled={status === 'running'}
          className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
        >
          {status === 'running' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-current" />
          )}
          Run
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetCode}
          className="h-8 gap-1.5 text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
        {status === 'success' && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 ml-auto">
            <CheckCircle2 className="h-3.5 w-3.5" /> Executed successfully
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-1 text-xs text-red-400 ml-auto">
            <XCircle className="h-3.5 w-3.5" /> Error
          </span>
        )}
      </div>

      {/* Output */}
      {output && (
        <div className="border-t border-white/5 bg-[#1a1a1a]">
          <div className="px-4 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-[#2d2d2d]/50">
            Output
          </div>
          <pre className={cn(
            'p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap max-h-40 scrollbar-thin',
            status === 'error' ? 'text-red-400' : 'text-green-400'
          )}>
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}

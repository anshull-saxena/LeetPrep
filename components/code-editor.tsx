'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Play, RotateCcw, Loader2, CheckCircle2, XCircle, Maximize2, Minimize2, Cloud, CloudOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSavedCode } from '@/hooks/use-saved-code'
import { getStarterCode } from '@/lib/starter-code'
import { cn } from '@/lib/utils'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const BROWSER_LANGS = ['javascript', 'typescript']

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
  problemSlug?: string
}

type OutputStatus = 'idle' | 'running' | 'success' | 'error'

export function CodeEditor({ questionTitle, problemSlug }: CodeEditorProps) {
  const { saveCode, getSavedCode, syncStatus } = useSavedCode()
  const questionId = questionTitle || '__global__'
  const saved = getSavedCode(questionId)

  function getTemplate(langId: string): string {
    if (problemSlug) {
      return getStarterCode(problemSlug, langId as any)
    }
    return LANGUAGES.find(l => l.id === langId)?.template || LANGUAGES[0].template
  }

  const defaultLang = LANGUAGES.find(l => l.id === saved?.language) || LANGUAGES[0]

  const [language, setLanguage] = useState(defaultLang)
  const [code, setCode] = useState(saved?.code ?? getTemplate(defaultLang.id))
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<OutputStatus>('idle')
  const [expanded, setExpanded] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveCode(questionId, language.id, code)
    }, 1500)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [code, language.id, questionId, saveCode])

  // Restore saved language+code on question change
  useEffect(() => {
    const s = getSavedCode(questionId)
    if (s) {
      const lang = LANGUAGES.find(l => l.id === s.language) || LANGUAGES[0]
      setLanguage(lang)
      setCode(s.code)
    } else {
      setLanguage(LANGUAGES[0])
      setCode(getTemplate(LANGUAGES[0].id))
    }
    setOutput('')
    setStatus('idle')
  }, [questionId, getSavedCode, problemSlug])

  const switchLanguage = (id: string) => {
    const lang = LANGUAGES.find(l => l.id === id) || LANGUAGES[0]
    const s = getSavedCode(questionId)
    if (s && s.language === id) {
      setLanguage(lang)
      setCode(s.code)
    } else {
      setLanguage(lang)
      setCode(getTemplate(id))
    }
    setOutput('')
    setStatus('idle')
  }

  const runCode = () => {
    setStatus('running')
    setOutput('')

    if (!BROWSER_LANGS.includes(language.id)) {
      setOutput(
        `${language.label} execution requires a backend API.\n\n` +
        `Switch to JavaScript or TypeScript for instant in-browser execution.\n\n` +
        `To run all languages, deploy Piston:\n` +
        `https://railway.app/template/piston\n` +
        `Then set NEXT_PUBLIC_PISTON_API_URL in .env.local`
      )
      setStatus('error')
      return
    }

    try {
      const logs: string[] = []
      const mockConsole = {
        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
        warn: (...args: any[]) => logs.push('⚠ ' + args.join(' ')),
        error: (...args: any[]) => logs.push('✖ ' + args.join(' ')),
        info: (...args: any[]) => logs.push(args.join(' ')),
      }

      const fn = new Function('console', code)
      fn(mockConsole)

      if (logs.length === 0) {
        setOutput('(no output)')
      } else {
        setOutput(logs.join('\n'))
      }
      setStatus('success')
    } catch (e: any) {
      setOutput(e?.message || String(e))
      setStatus('error')
    }
  }

  const resetCode = () => {
    const t = getTemplate(language.id)
    setCode(t)
    setOutput('')
    setStatus('idle')
    saveCode(questionId, language.id, t)
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
          {syncStatus === 'synced' && (
            <Cloud className="h-3 w-3 text-emerald-400/50" />
          )}
          {syncStatus === 'offline' && (
            <CloudOff className="h-3 w-3 text-red-400/50" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language.id}
            onChange={e => switchLanguage(e.target.value)}
            className="h-7 rounded-md bg-[#3c3c3c] border border-white/10 px-2 text-xs text-foreground focus:outline-none"
          >
            {LANGUAGES.map(l => (
              <option key={l.id} value={l.id}>
                {l.label}{BROWSER_LANGS.includes(l.id) ? '' : ' ⚡'}
              </option>
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
        <span className="text-[10px] text-muted-foreground/40 ml-auto font-mono">
          Auto-saved
        </span>
        {status === 'success' && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Executed
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-1 text-xs text-red-400">
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

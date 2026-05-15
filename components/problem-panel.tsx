'use client'

import React, { useEffect, useState } from 'react'
import { Loader2, AlertCircle, Lightbulb, TestTube } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProblemData {
  title: string
  titleSlug: string
  content: string
  difficulty: string
  exampleTestcases: string
  topicTags: { name: string; slug: string }[]
  hints: string[]
}

interface ProblemPanelProps {
  leetcodeSlug: string
  difficulty: string
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  Medium: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  Hard: 'text-red-400 border-red-400/30 bg-red-400/10',
}

export function ProblemPanel({ leetcodeSlug, difficulty }: ProblemPanelProps) {
  const [data, setData] = useState<ProblemData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    setData(null)
    setShowHints(false)

    fetch(`/api/problem/${leetcodeSlug}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) {
          setError(d.error)
        } else {
          setData(d)
        }
      })
      .catch(() => setError('Failed to load problem'))
      .finally(() => setLoading(false))
  }, [leetcodeSlug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading problem...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 py-8 text-xs text-muted-foreground justify-center">
        <AlertCircle className="h-4 w-4 text-red-400" />
        {error || 'Problem description unavailable'}
      </div>
    )
  }

  // Parse test cases
  const testCases = data.exampleTestcases
    ? data.exampleTestcases.split('\n').filter(Boolean)
    : []

  return (
    <div className="space-y-5 text-sm">
      {/* Title + difficulty */}
      <div className="flex items-center gap-3">
        <h2 className="font-bold text-base">{data.title}</h2>
        <Badge variant="outline" className={cn('text-[10px] font-bold shrink-0', DIFFICULTY_COLOR[difficulty])}>
          {difficulty}
        </Badge>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {data.topicTags.map(tag => (
          <span key={tag.slug} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground font-medium">
            {tag.name}
          </span>
        ))}
      </div>

      {/* Description - render HTML safely */}
      <div
        className="prose prose-invert prose-sm max-w-none [&_code]:text-xs [&_code]:bg-white/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-white/5 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/5 [&_pre]:text-xs [&_p]:leading-relaxed [&_li]:leading-relaxed [&_strong]:text-foreground [&_em]:text-foreground [&_.example-block]:bg-white/[0.02] [&_.example-block]:rounded-xl [&_.example-block]:p-4 [&_.example-block]:border [&_.example-block]:border-white/5 [&_.example-block]:my-3"
        dangerouslySetInnerHTML={{ __html: data.content
          .replace(/<strong class="example">/g, '<strong class="example text-xs uppercase tracking-wider text-muted-foreground font-bold">')
          .replace(/<p>\s*&nbsp;\s*<\/p>/g, '')
        }}
      />

      {/* Example test cases */}
      {testCases.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <TestTube className="h-3 w-3" />
            Test Cases
          </div>
          <div className="space-y-1">
            {testCases.map((tc, i) => (
              <pre key={i} className="text-xs font-mono bg-white/[0.02] border border-white/5 rounded-lg p-2.5 overflow-x-auto">
                {tc}
              </pre>
            ))}
          </div>
        </div>
      )}

      {/* Hints */}
      {data.hints?.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            <Lightbulb className="h-3 w-3" />
            {showHints ? 'Hide' : 'Show'} Hints ({data.hints.length})
          </button>
          {showHints && (
            <ul className="space-y-1.5 list-disc pl-4">
              {data.hints.map((hint, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-relaxed">{hint}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

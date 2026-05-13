'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ExternalLink, Search, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useCompletion } from '@/hooks/use-completion'
import { cn } from '@/lib/utils'
import type { AppMode } from '@/components/mode-selector'

interface BlindQuestion {
  title: string
  difficulty: string
  topic: string
  leetcode_url: string
  neetcode_url: string
  problem_slug?: string
}

interface PathViewProps {
  mode: Exclude<AppMode, 'company'>
  onBack: () => void
}

const FILE_MAP: Record<Exclude<AppMode, 'company'>, string> = {
  blind75: '/Path/blind75_scraped.json',
  blind150: '/Path/blind150_scraped.json',
  blind300: '/Path/blind300_scraped.json',
}

const LABEL_MAP: Record<Exclude<AppMode, 'company'>, string> = {
  blind75: 'Blind 75',
  blind150: 'Blind 150',
  blind300: 'Blind 300',
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  Medium: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  Hard: 'text-red-400 border-red-400/30 bg-red-400/10',
}

export function PathView({ mode, onBack }: PathViewProps) {
  const [questions, setQuestions] = useState<BlindQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [diffFilter, setDiffFilter] = useState<string>('all')
  const [topicFilter, setTopicFilter] = useState<string>('all')
  const { isCompleted, toggleCompletion } = useCompletion()

  useEffect(() => {
    setLoading(true)
    fetch(FILE_MAP[mode])
      .then(r => r.json())
      .then(data => setQuestions(data.questions ?? []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false))
  }, [mode])

  const topics = useMemo(() => {
    const set = new Set(questions.map(q => q.topic))
    return Array.from(set).sort()
  }, [questions])

  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false
      if (diffFilter !== 'all' && q.difficulty !== diffFilter) return false
      if (topicFilter !== 'all' && q.topic !== topicFilter) return false
      return true
    })
  }, [questions, search, diffFilter, topicFilter])

  const completedCount = useMemo(
    () => questions.filter(q => isCompleted(q.title)).length,
    [questions, isCompleted]
  )

  return (
    <div className="flex min-h-screen bg-background flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-background/80 backdrop-blur-xl px-4 md:px-6 py-3 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-base tracking-tight">{LABEL_MAP[mode]}</h1>
          <p className="text-xs text-muted-foreground">
            {completedCount}/{questions.length} completed
          </p>
        </div>
        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: questions.length ? `${(completedCount / questions.length) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {questions.length ? Math.round((completedCount / questions.length) * 100) : 0}%
          </span>
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 md:px-6 py-3 flex flex-wrap gap-2 border-b border-white/5">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm bg-white/5 border-white/10"
          />
        </div>
        <select
          value={diffFilter}
          onChange={e => setDiffFilter(e.target.value)}
          className="h-8 rounded-md border border-white/10 bg-white/5 px-2 text-xs text-foreground focus:outline-none"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={topicFilter}
          onChange={e => setTopicFilter(e.target.value)}
          className="h-8 rounded-md border border-white/10 bg-white/5 px-2 text-xs text-foreground focus:outline-none"
        >
          <option value="all">All Topics</option>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Question list */}
      <div className="flex-1 px-4 md:px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">No questions found.</div>
        ) : (
          <div className="space-y-1">
            {filtered.map((q, i) => {
              const done = isCompleted(q.title)
              return (
                <div
                  key={q.title + i}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors',
                    done ? 'bg-white/3 opacity-60' : 'bg-white/5 hover:bg-white/8'
                  )}
                >
                  <Checkbox
                    checked={done}
                    onCheckedChange={() => toggleCompletion(q.title)}
                    className="h-4 w-4 rounded border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className={cn('font-medium text-sm', done && 'line-through text-muted-foreground')}>
                      {q.title}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">{q.topic}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn('text-[10px] font-bold shrink-0', DIFFICULTY_COLOR[q.difficulty] ?? '')}
                  >
                    {q.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 shrink-0">
                    {q.leetcode_url && (
                      <a href={q.leetcode_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                    {q.neetcode_url && (
                      <a href={q.neetcode_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-violet-400 hover:text-violet-300">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

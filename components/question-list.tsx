'use client'

import React, { useState, useCallback, useMemo, memo } from 'react'
import { Question } from '@/lib/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useCompletion } from '@/hooks/use-completion'
import { ExternalLink, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { TableVirtuoso } from 'react-virtuoso'

interface QuestionListProps {
  questions: Question[]
  companyId: string
  timeframe: string
  loading?: boolean
  maxFrequency?: number
}

// Memoized Question Row to prevent unnecessary re-renders during scroll
const QuestionRow = memo(({ 
  q, 
  idx, 
  isDone, 
  isCelebrating, 
  isHighPriority, 
  frequencyPercent, 
  frequency, 
  handleToggle 
}: { 
  q: Question; 
  idx: number; 
  isDone: boolean; 
  isCelebrating: boolean; 
  isHighPriority: boolean; 
  frequencyPercent: number; 
  frequency: number; 
  handleToggle: (id: string) => void; 
}) => {
  return (
    <>
      <TableCell className="text-center px-2 md:px-4">
        <div className={cn(isCelebrating && "celebrate")}>
          <Checkbox
            checked={isDone}
            onCheckedChange={() => handleToggle(q.id)}
            className="h-5 w-5 rounded-md border-2 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all hover:border-primary/50"
          />
        </div>
      </TableCell>
      <TableCell className="px-2 md:px-4">
        <div className="flex flex-col py-1">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-bold text-xs md:text-sm tracking-tight transition-all",
              isDone && "line-through text-muted-foreground"
            )}>
              {q.title}
            </span>
            {isHighPriority && !isDone && (
              <Badge className="bg-primary/20 text-primary border-none hover:bg-primary/30 text-[8px] h-4 font-black uppercase tracking-tighter shrink-0">Must Solve</Badge>
            )}
            <Badge
              variant="outline"
              className={cn(
                "sm:hidden capitalize font-black text-[8px] border-none px-2 py-0 rounded-full tracking-widest shrink-0",
                q.difficulty === 'easy' && "bg-emerald-500/10 text-emerald-400",
                q.difficulty === 'medium' && "bg-amber-500/10 text-amber-400",
                q.difficulty === 'hard' && "bg-rose-500/10 text-rose-400",
              )}
            >
              {q.difficulty.charAt(0)}
            </Badge>
          </div>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {q.topics.slice(0, 2).map(t => (
              <span key={t} className="text-[8px] md:text-[9px] font-bold text-muted-foreground/80 bg-muted/40 px-1.5 md:px-2 py-0.5 rounded-full border border-white/5">
                {t}
              </span>
            ))}
          </div>
          <div className="md:hidden mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-muted/20 rounded-full overflow-hidden border border-white/5 max-w-[100px]">
              <div
                className={cn(
                  "h-full transition-all duration-1000 ease-out rounded-full",
                  frequencyPercent > 80 ? "bg-primary shadow-[0_0_10px_rgba(139,92,246,0.3)]" :
                  frequencyPercent > 40 ? "bg-primary/70" : "bg-primary/30"
                )}
                style={{ width: `${frequencyPercent}%` }}
              />
            </div>
            <span className="text-[8px] font-black text-muted-foreground tabular-nums">
              {Math.round(frequencyPercent)}%
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-center">
        <Badge
          variant="outline"
          className={cn(
            "capitalize font-black text-[9px] border-none px-3 py-1 rounded-full tracking-widest",
            q.difficulty === 'easy' && "bg-emerald-500/10 text-emerald-400",
            q.difficulty === 'medium' && "bg-amber-500/10 text-amber-400",
            q.difficulty === 'hard' && "bg-rose-500/10 text-rose-400",
          )}
        >
          {q.difficulty}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={cn(
                      "h-full transition-all duration-1000 ease-out rounded-full",
                      frequencyPercent > 80 ? "bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(139,92,246,0.3)]" :
                      frequencyPercent > 40 ? "bg-primary/70" : "bg-primary/30"
                    )}
                    style={{ width: `${frequencyPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-muted-foreground tabular-nums w-8">
                  {Math.round(frequencyPercent)}%
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-card border-white/10 font-bold text-xs rounded-xl backdrop-blur-xl">
              <p>Score: {frequency.toFixed(3)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="px-2 md:px-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 md:h-9 md:w-9 rounded-xl md:opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary">
          <a href={q.leetcodeUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </TableCell>
    </>
  )
})
QuestionRow.displayName = 'QuestionRow'

export function QuestionList({ questions, companyId, timeframe, loading, maxFrequency: providedMaxFrequency }: QuestionListProps) {
  const { isCompleted, toggleCompletion, isLoaded } = useCompletion()
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'frequency',
    direction: 'desc',
  })
  const [celebratingId, setCelebratingId] = useState<string | null>(null)

  const handleToggle = useCallback((questionId: string) => {
    const wasDone = isCompleted(questionId)
    toggleCompletion(questionId)
    if (!wasDone) {
      setCelebratingId(questionId)
      setTimeout(() => setCelebratingId(null), 700)
    }
  }, [isCompleted, toggleCompletion])

  const maxFrequency = useMemo(() => providedMaxFrequency || Math.max(
    ...questions.map((q) => parseFloat(q.companies[companyId]?.[timeframe] || '0')),
    0.000001
  ), [questions, companyId, timeframe, providedMaxFrequency])

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => {
      if (sortConfig.key === 'frequency') {
        const freqA = parseFloat(a.companies[companyId]?.[timeframe] || '0')
        const freqB = parseFloat(b.companies[companyId]?.[timeframe] || '0')
        return sortConfig.direction === 'asc' ? freqA - freqB : freqB - freqA
      }
      if (sortConfig.key === 'difficulty') {
        const difficultyOrder: Record<string, number> = { easy: 1, medium: 2, hard: 3 }
        const diffA = difficultyOrder[a.difficulty] || 0
        const diffB = difficultyOrder[b.difficulty] || 0
        return sortConfig.direction === 'asc' ? diffA - diffB : diffB - diffA
      }
      if (sortConfig.key === 'title') {
        return sortConfig.direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      }
      return 0
    })
  }, [questions, companyId, timeframe, sortConfig])

  const requestSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  if (loading || !isLoaded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading Questions</h3>
        </div>
        <div className="border border-white/5 rounded-[20px] overflow-hidden bg-card/50 backdrop-blur-sm shadow-2xl">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
              <div className="h-5 w-5 rounded-md bg-muted/30 shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-64 bg-muted/30 rounded shimmer" style={{ animationDelay: `${i * 0.1}s` }} />
                <div className="flex gap-2">
                  <div className="h-3 w-16 bg-muted/30 rounded shimmer" style={{ animationDelay: `${i * 0.1 + 0.05}s` }} />
                  <div className="h-3 w-12 bg-muted/30 rounded shimmer" style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
                </div>
              </div>
              <div className="h-4 w-20 bg-muted/30 rounded shimmer" />
              <div className="h-2 w-32 bg-muted/30 rounded-full shimmer" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/10 rounded-2xl border border-white/5 border-dashed">
        <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow-sm">
          <Trophy className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold">No questions found</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Try adjusting your filters or selecting a different timeframe.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2 px-2 shrink-0">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority Questions</h3>
      </div>
      <div className="border border-white/5 rounded-[20px] overflow-hidden bg-card/50 backdrop-blur-sm shadow-2xl shadow-foreground/5 gpu-accelerate">
        <TableVirtuoso
          useWindowScroll
          data={sortedQuestions}
                increaseViewportBy={300}
                components={{
                  Table: (props) => (
                    <table 
                      {...props} 
                      className="w-full caption-bottom text-sm border-collapse" 
                    />
                  ),
                  TableHead: TableHeader,
                  TableRow: (props) => {
      
            const idx = props['data-index']
            const q = sortedQuestions[idx]
            if (!q) return <TableRow {...props} />
            
            const isDone = isCompleted(q.id)
            const isCelebrating = celebratingId === q.id
            
            return (
              <TableRow
                {...props}
                className={cn(
                  "group transition-none border-b-white/5",
                  isDone ? "bg-muted/5 opacity-40" : "hover:bg-primary/[0.03]",
                  isCelebrating && "bg-primary/10 animate-pulse",
                  props.className
                )}
              />
            )
          },
            TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
          }}
          fixedHeaderContent={() => (
            <TableRow className="hover:bg-transparent border-b-white/5 bg-muted/30 backdrop-blur-md">
              <TableHead className="w-[50px] md:w-[60px] text-center font-black text-[10px] uppercase tracking-wider">Status</TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors font-black text-[10px] uppercase tracking-wider"
                onClick={() => requestSort('title')}
              >
                Problem {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="hidden sm:table-cell w-[100px] md:w-[120px] cursor-pointer hover:text-primary transition-colors font-black text-[10px] uppercase tracking-wider text-center"
                onClick={() => requestSort('difficulty')}
              >
                Difficulty {sortConfig.key === 'difficulty' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="hidden md:table-cell w-[150px] md:w-[180px] cursor-pointer hover:text-primary transition-colors font-black text-[10px] uppercase tracking-wider"
                onClick={() => requestSort('frequency')}
              >
                Recurrence {sortConfig.key === 'frequency' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="w-[50px] md:w-[60px]"></TableHead>
            </TableRow>
          )}
          itemContent={(idx, q) => {
            const frequency = parseFloat(q.companies[companyId]?.[timeframe] || '0')
            const frequencyPercent = (frequency / maxFrequency) * 100
            const isDone = isCompleted(q.id)
            const isHighPriority = idx < 10 && frequencyPercent > 50
            const isCelebrating = celebratingId === q.id

            return (
              <QuestionRow 
                q={q}
                idx={idx}
                isDone={isDone}
                isCelebrating={isCelebrating}
                isHighPriority={isHighPriority}
                frequencyPercent={frequencyPercent}
                frequency={frequency}
                handleToggle={handleToggle}
              />
            )
          }}
        />
      </div>
    </div>
  )
}

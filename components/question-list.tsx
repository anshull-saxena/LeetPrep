'use client'

import { useState } from 'react'
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
import { ExternalLink, Loader2, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface QuestionListProps {
  questions: Question[]
  companyId: string
  timeframe: string
  loading?: boolean
  maxFrequency?: number
}

export function QuestionList({ questions, companyId, timeframe, loading, maxFrequency: providedMaxFrequency }: QuestionListProps) {
  const { isCompleted, toggleCompletion, isLoaded } = useCompletion()
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'frequency',
    direction: 'desc',
  })

  if (loading || !isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
           <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
           </div>
        </div>
        <div className="text-center">
           <p className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Analyzing Patterns</p>
           <p className="text-xs text-muted-foreground mt-1">Fetching latest interview data...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No questions found</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Try adjusting your filters or search query.
        </p>
      </div>
    )
  }

  // Calculate max frequency for progress bar scaling
  const maxFrequency = providedMaxFrequency || Math.max(
    ...questions.map((q) => parseFloat(q.companies[companyId]?.[timeframe] || '0')),
    0.000001 // avoid division by zero
  )

  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortConfig.key === 'frequency') {
      const freqA = parseFloat(a.companies[companyId]?.[timeframe] || '0')
      const freqB = parseFloat(b.companies[companyId]?.[timeframe] || '0')
      return sortConfig.direction === 'asc' ? freqA - freqB : freqB - freqA
    }
    if (sortConfig.key === 'difficulty') {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
      const diffA = difficultyOrder[a.difficulty] || 0
      const diffB = difficultyOrder[b.difficulty] || 0
      return sortConfig.direction === 'asc' ? diffA - diffB : diffB - diffA
    }
    if (sortConfig.key === 'title') {
        return sortConfig.direction === 'asc' 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
    }
    return 0
  })

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
         <div className="h-2 w-2 rounded-full bg-primary" />
         <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority Questions</h3>
      </div>
      <div className="border rounded-[20px] overflow-hidden bg-card/50 backdrop-blur-sm shadow-2xl shadow-foreground/5 border-white/5">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b-white/5">
              <TableHead className="w-[60px] text-center font-black text-[10px] uppercase tracking-wider">Status</TableHead>
              <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors font-black text-[10px] uppercase tracking-wider"
                  onClick={() => requestSort('title')}
              >
                  Problem {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                  className="w-[120px] cursor-pointer hover:text-primary transition-colors font-black text-[10px] uppercase tracking-wider text-center"
                  onClick={() => requestSort('difficulty')}
              >
                  Difficulty {sortConfig.key === 'difficulty' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                  className="w-[180px] cursor-pointer hover:text-primary transition-colors font-black text-[10px] uppercase tracking-wider"
                  onClick={() => requestSort('frequency')}
              >
                  Recurrence {sortConfig.key === 'frequency' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQuestions.map((q, idx) => {
              const frequency = parseFloat(q.companies[companyId]?.[timeframe] || '0')
              const frequencyPercent = (frequency / maxFrequency) * 100
              const isDone = isCompleted(q.id)
              const isHighPriority = idx < 10 && frequencyPercent > 50

              return (
                <TableRow key={q.id} className={cn(
                  "group transition-all duration-200 border-b-white/5", 
                  isDone ? "bg-muted/10 opacity-40" : "hover:bg-primary/[0.02]"
                )}>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={isDone} 
                      onCheckedChange={() => toggleCompletion(q.id)}
                      className="h-5 w-5 rounded-md border-2 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col py-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-bold text-sm tracking-tight transition-all", 
                          isDone && "line-through text-muted-foreground"
                        )}>
                          {q.title}
                        </span>
                        {isHighPriority && !isDone && (
                          <Badge className="bg-primary/20 text-primary border-none hover:bg-primary/30 text-[9px] h-4 font-black uppercase tracking-tighter animate-in-fade">Must Solve</Badge>
                        )}
                      </div>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {q.topics.slice(0, 3).map(t => (
                          <span key={t} className="text-[9px] font-bold text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded-full border border-white/5">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "capitalize font-black text-[9px] border-none px-3 py-1 rounded-full tracking-widest",
                        q.difficulty === 'easy' && "bg-emerald-500/10 text-emerald-500",
                        q.difficulty === 'medium' && "bg-amber-500/10 text-amber-500",
                        q.difficulty === 'hard' && "bg-rose-500/10 text-rose-500",
                      )}
                    >
                      {q.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className={cn(
                                  "h-full transition-all duration-1000 ease-out rounded-full",
                                  frequencyPercent > 80 ? "bg-primary shadow-[0_0_10px_rgba(139,92,246,0.3)]" : 
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
                        <TooltipContent className="bg-foreground text-background font-bold text-xs rounded-lg border-none">
                          <p>Score: {frequency.toFixed(3)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary">
                      <a href={q.leetcodeUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

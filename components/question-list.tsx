'use client'

import { Question } from '@/lib/data'
import { ExternalLink, Tag, TrendingUp, Circle, Search } from 'lucide-react'

interface QuestionListProps {
  questions: Question[]
  totalCount: number
  selectedCompanyId: string | null
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-500'
    case 'medium':
      return 'text-yellow-500'
    case 'hard':
      return 'text-red-500'
    default:
      return 'text-muted-foreground'
  }
}

export default function QuestionList({ questions, totalCount, selectedCompanyId }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border bg-card p-16 text-center shadow-sm">
        <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No matches found</h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2">
        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          Showing {questions.length} problems
        </div>
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest hidden sm:flex">
          <span className="w-24 text-center">Difficulty</span>
          <span className="w-20 text-right">Frequency</span>
        </div>
      </div>

      <div className="space-y-2">
        {questions.map((question, index) => {
          const frequency = selectedCompanyId ? question.companies[selectedCompanyId]?.['alltime'] || 'N/A' : 'N/A';
          return (
            <a
              key={question.id}
              href={question.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-4 py-4 flex items-center justify-between bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground/60 w-6 hidden md:block">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate pr-2">
                    {question.title}
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                </div>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Circle className={`w-2.5 h-2.5 fill-current ${getDifficultyColor(question.difficulty)}`} />
                    <span className={`text-[11px] font-bold capitalize ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </div>
                  
                  {question.topics.slice(0, 3).map(topic => (
                    <div
                      key={topic}
                      className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground border border-border/50"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {topic}
                    </div>
                  ))}
                  {question.topics.length > 3 && (
                    <span className="text-[10px] text-muted-foreground/60">
                      +{question.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-8 ml-4">
                <div className="flex flex-col items-end sm:w-20 hidden sm:flex">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    {frequency}
                  </div>
                  <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Frequency</div>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

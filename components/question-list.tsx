'use client'

import { Question } from '@/lib/data'
import { ExternalLink } from 'lucide-react'

interface QuestionListProps {
  questions: Question[]
  totalCount: number
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    case 'hard':
      return 'bg-red-500/20 text-red-300 border-red-500/30'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getTimePeriodLabel = (period: string) => {
  switch (period) {
    case 'last-6-months':
      return 'Last 6m'
    case '1-year':
      return '1 year'
    case 'all-time':
      return 'All time'
    default:
      return period
  }
}

export default function QuestionList({ questions, totalCount }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No problems match your filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground font-mono px-1">
        Showing {questions.length} of {totalCount} problems
      </div>

      <div className="space-y-2 border border-border rounded-lg bg-card divide-y divide-border overflow-hidden">
        {questions.map(question => (
          <a
            key={question.id}
            href={question.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-sm font-medium text-foreground group-hover:text-accent truncate">
                  {question.title}
                </h3>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded border ${getDifficultyColor(
                    question.difficulty
                  )}`}
                >
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {getTimePeriodLabel(question.timePeriod)}
                </span>
                {question.topics.map(topic => (
                  <span
                    key={topic}
                    className="text-xs px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 ml-4 text-right">
              <div className="text-xs text-muted-foreground font-mono">
                {question.frequency}x
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

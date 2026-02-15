'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Question } from "@/lib/data"
import { ExternalLink, CheckCircle } from "lucide-react"

interface QuestionModalProps {
  question: Question
  children: React.ReactNode
  isCompleted: boolean
  onMarkAsComplete: (id: string) => void
}

export function QuestionModal({ question, children, isCompleted, onMarkAsComplete }: QuestionModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{question.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              question.difficulty === 'easy' ? 'bg-green-500/20 text-green-600' :
              question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-600' :
              'bg-red-500/20 text-red-600'
            }`}>
              {question.difficulty}
            </span>
            <div className="flex flex-wrap gap-2">
                {question.topics.map(topic => (
                    <span key={topic} className="px-2 py-1 text-xs bg-gray-200 rounded-full">{topic}</span>
                ))}
            </div>
          </div>
          <Button asChild>
            <a href={question.leetcodeUrl} target="_blank" rel="noopener noreferrer">
              View on LeetCode <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button onClick={() => onMarkAsComplete(question.id)} disabled={isCompleted}>
            {isCompleted ? <><CheckCircle className="w-4 h-4 mr-2" />Completed</> : 'Mark as Complete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

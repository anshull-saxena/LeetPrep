'use client'

import { Input } from '@/components/ui/input'
import { Filter, Clock, Search } from 'lucide-react'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedDifficulties: string[]
  onDifficultyChange: (difficulties: string[]) => void
  selectedTime: string
  onTimeChange: (time: string) => void
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy', color: 'border-green-500/30 text-green-600 dark:text-green-400', active: 'bg-green-500/20' },
  { value: 'medium', label: 'Medium', color: 'border-yellow-500/30 text-yellow-600 dark:text-yellow-400', active: 'bg-yellow-500/20' },
  { value: 'hard', label: 'Hard', color: 'border-red-500/30 text-red-600 dark:text-red-400', active: 'bg-red-500/20' },
]

const timeOptions = [
  { value: 'all-time', label: 'All Time' },
  { value: 'last-6-months', label: 'Last 6 Months' },
  { value: '1-year', label: '1 Year' },
]

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedDifficulties,
  onDifficultyChange,
  selectedTime,
  onTimeChange,
}: FilterBarProps) {
  const toggleDifficulty = (difficulty: string) => {
    if (selectedDifficulties.includes(difficulty)) {
      onDifficultyChange(selectedDifficulties.filter(d => d !== difficulty))
    } else {
      onDifficultyChange([...selectedDifficulties, difficulty])
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filter by problem name or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-10 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          {difficultyOptions.map(option => (
            <button
              key={option.value}
              onClick={() => toggleDifficulty(option.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                selectedDifficulties.includes(option.value)
                  ? `${option.color} ${option.active} border-transparent shadow-sm`
                  : 'border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-border hidden md:block" />

        {/* Time Period Filter */}
        <div className="flex items-center gap-2 group">
          <Clock className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <select
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer hover:text-primary transition-colors"
          >
            {timeOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-card">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

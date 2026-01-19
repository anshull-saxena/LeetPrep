'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedDifficulties: string[]
  onDifficultyChange: (difficulties: string[]) => void
  selectedTime: string
  onTimeChange: (time: string) => void
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { value: 'hard', label: 'Hard', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
]

const timeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'last-6-months', label: 'Last 6 Months' },
  { value: '1-year', label: '1 Year' },
  { value: 'all-time', label: 'All Time' },
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
    <div className="space-y-4 border border-border rounded-lg bg-card p-4">
      {/* Search */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">Search</label>
        <Input
          placeholder="Search by problem title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Difficulty Filter */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">Difficulty</label>
        <div className="flex gap-2">
          {difficultyOptions.map(option => (
            <button
              key={option.value}
              onClick={() => toggleDifficulty(option.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-all ${
                selectedDifficulties.includes(option.value)
                  ? option.color
                  : 'border-border bg-secondary text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Period Filter */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">Time Period</label>
        <select
          value={selectedTime}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {timeOptions.map(option => (
            <option key={option.value} value={option.value} className="bg-card">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

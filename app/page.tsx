'use client'

import { useState, useEffect, useMemo } from 'react'
import CompanySelector from '@/components/company-selector'
import QuestionList from '@/components/question-list'
import FilterBar from '@/components/filter-bar'
import { Company, Question } from '@/lib/data'
import { fetchCompanies, fetchQuestions } from '@/lib/api'

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>(['easy', 'medium', 'hard'])
  const [timeFilter, setTimeFilter] = useState<string>('all-time') // Default to all-time
  const [loading, setLoading] = useState(true)
  const [questionsLoading, setQuestionsLoading] = useState(false)

  // Load companies on mount
  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await fetchCompanies()
        setCompanies(data)
      } catch (error) {
        console.error('Failed to load companies', error)
      } finally {
        setLoading(false)
      }
    }
    loadCompanies()
  }, [])

  // Load questions when company or time filter changes
  useEffect(() => {
    if (!selectedCompanyId) {
      setQuestions([])
      return
    }

    async function loadQuestions() {
      setQuestionsLoading(true)
      try {
        const data = await fetchQuestions(selectedCompanyId!, timeFilter)
        setQuestions(data)
      } catch (error) {
        console.error('Failed to load questions', error)
        setQuestions([])
      } finally {
        setQuestionsLoading(false)
      }
    }

    loadQuestions()
  }, [selectedCompanyId, timeFilter])

  const filteredQuestions = useMemo(() => {
    if (!questions.length) return []

    let result = questions

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(q =>
        q.title.toLowerCase().includes(query) || q.id.includes(query)
      )
    }

    // Filter by difficulty
    result = result.filter(q => difficultyFilter.includes(q.difficulty))

    return result
  }, [questions, searchQuery, difficultyFilter])

  const selectedCompanyName = companies.find(c => c.id === selectedCompanyId)?.name

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-accent flex items-center justify-center text-accent-foreground font-mono text-sm font-bold">
              LC
            </span>
            Interview Prep
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Company-wise LeetCode problems</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Sidebar - Company Selection */}
        <div className="lg:col-span-1">
          <CompanySelector
            companies={companies}
            selectedId={selectedCompanyId}
            onSelect={setSelectedCompanyId}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {!selectedCompanyId ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <div className="space-y-3">
                <p className="text-muted-foreground">Select a company to view their LeetCode problems</p>
                <p className="text-sm text-muted-foreground">Start preparing for interviews by exploring company-specific questions</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-4">{selectedCompanyName}</h2>
                <FilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedDifficulties={difficultyFilter}
                  onDifficultyChange={setDifficultyFilter}
                  selectedTime={timeFilter}
                  onTimeChange={setTimeFilter}
                />
              </div>

              {questionsLoading ? (
                <div className="rounded-lg border border-border bg-card p-12 text-center text-muted-foreground">
                  Loading questions...
                </div>
              ) : (
                <QuestionList
                  questions={filteredQuestions}
                  totalCount={questions.length}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

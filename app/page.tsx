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
  const [selectedTopic, setSelectedTopic] = useState<string>('All')
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

  // Load questions when company or search query changes
  useEffect(() => {
    if (!selectedCompanyId) {
      setQuestions([])
      return
    }

    async function loadQuestions() {
      setQuestionsLoading(true)
      try {
        const data = await fetchQuestions(selectedCompanyId!, searchQuery)
        setQuestions(data)
      } catch (error) {
        console.error('Failed to load questions', error)
        setQuestions([])
      } finally {
        setQuestionsLoading(false)
      }
    }

    loadQuestions()
  }, [selectedCompanyId, searchQuery])

  const filteredQuestions = useMemo(() => {
    if (!questions.length) return []

    let result = questions

    // Filter by difficulty
    result = result.filter(q => difficultyFilter.includes(q.difficulty))

    // Filter by topic
    if (selectedTopic !== 'All') {
      result = result.filter(q => q.topics.includes(selectedTopic))
    }

    return result
  }, [questions, difficultyFilter, selectedTopic])

  const allTopics = useMemo(() => {
    const topics = new Set<string>()
    topics.add('All')
    questions.forEach(q => q.topics.forEach(t => topics.add(t)))
    return Array.from(topics).sort()
  }, [questions])

  const selectedCompanyName = companies.find(c => c.id === selectedCompanyId)?.name

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-mono text-sm font-bold">
                LC
              </span>
              Interview Prep
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5">Master your next tech interview</p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <span className="text-muted-foreground px-3 py-1 bg-secondary rounded-full">
              {companies.length} Companies tracked
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Sidebar - Company Selection */}
        <div className="lg:col-span-3 space-y-6">
          <CompanySelector
            companies={companies}
            selectedId={selectedCompanyId}
            onSelect={setSelectedCompanyId}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {selectedCompanyId ? (
            <>
              {/* Company Header & Stats */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground capitalize mb-1">{selectedCompanyName}</h2>
                    <p className="text-muted-foreground text-sm">Most frequent interview questions for {selectedCompanyName}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-secondary/50 rounded-lg px-4 py-2 border border-border min-w-[100px]">
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total</div>
                      <div className="text-xl font-bold">{questions.length}</div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg px-4 py-2 border border-green-500/20 min-w-[100px]">
                      <div className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Easy</div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {questions.filter(q => q.difficulty === 'easy').length}
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg px-4 py-2 border border-yellow-500/20 min-w-[100px]">
                      <div className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider">Med</div>
                      <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                        {questions.filter(q => q.difficulty === 'medium').length}
                      </div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg px-4 py-2 border border-red-500/20 min-w-[100px]">
                      <div className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">Hard</div>
                      <div className="text-xl font-bold text-red-600 dark:text-red-400">
                        {questions.filter(q => q.difficulty === 'hard').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters & Topic Tabs */}
              <div className="space-y-4">
                <FilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedDifficulties={difficultyFilter}
                  onDifficultyChange={setDifficultyFilter}
                />

                {/* Topic Tabs */}
                {questions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto scrollbar-hide py-1">
                    {allTopics.map(topic => (
                      <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                          selectedTopic === topic
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-card text-muted-foreground border-border hover:border-muted-foreground'
                        }`}
                      >
                        {topic}
                        <span className="ml-1.5 opacity-60">
                          {topic === 'All' ? questions.length : questions.filter(q => q.topics.includes(topic)).length}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Questions List */}
              {questionsLoading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-card border border-border rounded-xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground animate-pulse text-sm">Preparing custom roadmap...</p>
                </div>
              ) : (
                <QuestionList
                  questions={filteredQuestions}
                  totalCount={questions.length}
                  selectedCompanyId={selectedCompanyId}
                />
              )}
            </>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 bg-card border-2 border-dashed border-border rounded-2xl">
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-muted-foreground">?</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Ready to start?</h2>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                Select a company from the sidebar to view their most frequently asked LeetCode questions categorized by DSA topics.
              -              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

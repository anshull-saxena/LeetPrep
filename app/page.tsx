'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  BookOpen,
  Code2,
  Trophy,
  Filter,
  BarChart3,
  ListTodo,
  CheckCircle2,
  Zap
} from 'lucide-react'

import { Company, Question } from '@/lib/data'
import { fetchCompanies, fetchQuestions } from '@/lib/api'
import { QuestionList } from '@/components/question-list'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCompletion } from '@/hooks/use-completion'
import { Progress } from '@/components/ui/progress'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts'

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [timeframe, setTimeframe] = useState<string>('alltime')
  const [loading, setLoading] = useState(true)
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [companySearch, setCompanySearch] = useState('')
  const { isCompleted } = useCompletion()

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe']

  // Load companies on mount
  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await fetchCompanies()
        setCompanies(data)
        // Default to Amazon if nothing selected
        if (data.length > 0 && !selectedCompanyId) {
          const hasAmazon = data.find(c => c.id.toLowerCase() === 'amazon')
          setSelectedCompanyId(hasAmazon ? hasAmazon.id : data[0].id)
        }
      } catch (error) {
        console.error('Failed to load companies', error)
      } finally {
        setLoading(false)
      }
    }
    loadCompanies()
  }, [])

  // Load questions when company changes
  useEffect(() => {
    if (!selectedCompanyId) {
      setQuestions([])
      return
    }

    async function loadQuestions() {
      setQuestionsLoading(true)
      try {
        const data = await fetchQuestions(selectedCompanyId!, '')
        setQuestions(data)
      } catch (error) {
        console.error('Failed to load questions', error)
        setQuestions([])
      } finally {
        setQuestionsLoading(false)
      }
    }

    loadQuestions()
  }, [selectedCompanyId])

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => 
      c.name.toLowerCase().includes(companySearch.toLowerCase())
    )
  }, [companies, companySearch])

  const filteredQuestions = useMemo(() => {
    if (!questions.length || !selectedCompanyId) return []

    return questions.filter(q => {
      const hasTimeframeData = q.companies[selectedCompanyId]?.[timeframe]
      if (!hasTimeframeData) return false

      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false

      if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false

      const completed = isCompleted(q.id)
      if (statusFilter === 'completed' && !completed) return false
      if (statusFilter === 'todo' && completed) return false

      return true
    })
  }, [questions, selectedCompanyId, timeframe, searchQuery, difficultyFilter, statusFilter, isCompleted])

  // New stats calculated for the whole company (not affected by search/filters)
  const companyQuestions = useMemo(() => {
    if (!questions.length || !selectedCompanyId) return []
    return questions.filter(q => q.companies[selectedCompanyId]?.[timeframe])
  }, [questions, selectedCompanyId, timeframe])

  const companyStats = useMemo(() => {
    const total = companyQuestions.length
    const completed = companyQuestions.filter(q => isCompleted(q.id)).length
    const percentage = total > 0 ? (completed / total) * 100 : 0
    return { total, completed, percentage }
  }, [companyQuestions, isCompleted])

  const maxFrequencyInCompany = useMemo(() => {
    if (!companyQuestions.length || !selectedCompanyId) return 0.000001
    return Math.max(
      ...companyQuestions.map(q => parseFloat(q.companies[selectedCompanyId]?.[timeframe] || '0')),
      0.000001
    )
  }, [companyQuestions, selectedCompanyId, timeframe])

  const stats = useMemo(() => {
    const total = filteredQuestions.length
    const completed = filteredQuestions.filter(q => isCompleted(q.id)).length
    const easy = filteredQuestions.filter(q => q.difficulty === 'easy').length
    const medium = filteredQuestions.filter(q => q.difficulty === 'medium').length
    const hard = filteredQuestions.filter(q => q.difficulty === 'hard').length
    
    // Topic distribution for chart
    const topicMap: Record<string, number> = {}
    filteredQuestions.forEach(q => {
      q.topics.forEach(t => {
        topicMap[t] = (topicMap[t] || 0) + 1
      })
    })
    
    const topicData = Object.entries(topicMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5 topics

    return { total, completed, easy, medium, hard, topicData }
  }, [filteredQuestions, isCompleted])

  const trendingCompanies = ['amazon', 'google', 'meta', 'apple', 'microsoft', 'netflix', 'uber', 'airbnb']
  const selectedCompanyName = companies.find(c => c.id === selectedCompanyId)?.name

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-80 border-r bg-card/30 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-8 border-b bg-background/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">LeetPrep</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground">Version 2026.1</p>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input 
              placeholder="Search 150+ companies..." 
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="pl-10 bg-muted/40 border-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary h-10 rounded-xl transition-all" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {loading ? (
            <div className="space-y-3 px-2">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="h-11 bg-muted/30 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            filteredCompanies.map(company => (
              <button
                key={company.id}
                onClick={() => setSelectedCompanyId(company.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-between group ${
                  selectedCompanyId === company.id
                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02] z-10'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:translate-x-1'
                }`}
              >
                <span className="flex items-center gap-2">
                  {company.name}
                  {trendingCompanies.includes(company.id.toLowerCase()) && (
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                      selectedCompanyId === company.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                    }`}>Hot</span>
                  )}
                </span>
                {selectedCompanyId === company.id ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
                )}
              </button>
            ))
          )}
          {!loading && filteredCompanies.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No companies found</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t bg-muted/10">
          <div className="flex items-center gap-4 px-2">
             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center border-2 border-background shadow-sm">
                <span className="text-xs font-bold">JD</span>
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Premium User</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sync Active</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-muted/5">
        {selectedCompanyId ? (
          <>
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-md z-10 p-8">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <Badge variant="outline" className="rounded-full px-3 py-0 border-primary/30 text-primary bg-primary/5 text-[10px] font-black uppercase tracking-widest">Company Focus</Badge>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-foreground">{selectedCompanyName}</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Cracking {selectedCompanyName} requires mastering these specific patterns.</p>
                  </div>
                  
                  <div className="bg-card/50 p-1.5 rounded-2xl border shadow-sm self-start">
                    <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
                      <TabsList className="bg-transparent gap-1">
                        <TabsTrigger value="6months" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5">6M</TabsTrigger>
                        <TabsTrigger value="1year" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5">1Y</TabsTrigger>
                        <TabsTrigger value="2year" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5">2Y</TabsTrigger>
                        <TabsTrigger value="alltime" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5">All</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Progress Card */}
                  <Card className="col-span-1 md:col-span-2 shadow-xl shadow-primary/5 border-none bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                       <Trophy className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-black uppercase tracking-wider text-primary/80">Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-3 mb-4">
                        <span className="text-5xl font-black tracking-tighter">{Math.round(companyStats.percentage)}%</span>
                        <span className="text-muted-foreground font-bold pb-2">Completed</span>
                      </div>
                      <Progress value={companyStats.percentage} className="h-3 shadow-inner shadow-black/5" />
                      <div className="flex justify-between mt-3 text-xs font-bold text-muted-foreground">
                        <span>{companyStats.completed} SOLVED</span>
                        <span>{companyStats.total - companyStats.completed} REMAINING</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Topic Chart */}
                  <Card className="col-span-1 md:col-span-2 shadow-xl shadow-foreground/5 border-none bg-card relative overflow-hidden">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Topic Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[140px] p-0 flex items-center">
                      <div className="w-1/2 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.topicData}
                              cx="50%"
                              cy="50%"
                              innerRadius={35}
                              outerRadius={55}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {stats.topicData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-1/2 pr-6 space-y-1.5">
                        {stats.topicData.map((topic, i) => (
                          <div key={topic.name} className="flex items-center justify-between text-[10px] font-bold">
                            <div className="flex items-center gap-2 truncate">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                              <span className="truncate uppercase tracking-tight">{topic.name}</span>
                            </div>
                            <span className="text-muted-foreground ml-2">{topic.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </header>

            {/* Filter Bar */}
            <div className="px-8 py-4 border-b flex flex-wrap items-center gap-4 bg-background/40 sticky top-0 z-10 backdrop-blur-md">
              <div className="relative w-full md:w-[400px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by question title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-none ring-1 ring-border h-11 rounded-xl"
                />
              </div>
              <div className="flex items-center gap-3">
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-[160px] bg-background border-none ring-1 ring-border h-11 rounded-xl font-bold text-xs uppercase tracking-wider">
                    <Filter className="w-3.5 h-3.5 mr-2 opacity-50" />
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">🟢 Easy</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="hard">🔴 Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] bg-background border-none ring-1 ring-border h-11 rounded-xl font-bold text-xs uppercase tracking-wider">
                    <ListTodo className="w-3.5 h-3.5 mr-2 opacity-50" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">⏳ To Do</SelectItem>
                    <SelectItem value="completed">✅ Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-auto text-xs font-black uppercase tracking-widest text-muted-foreground">
                 Showing {filteredQuestions.length} Problems
              </div>
            </div>

            {/* Question List */}
            <div className="flex-1 overflow-auto p-8 custom-scrollbar">
              <div className="max-w-[1400px] mx-auto">
                <QuestionList 
                  questions={filteredQuestions} 
                  companyId={selectedCompanyId} 
                  timeframe={timeframe}
                  loading={questionsLoading}
                  maxFrequency={maxFrequencyInCompany}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-12">
               <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
               <div className="relative h-40 w-40 bg-card rounded-[40px] flex items-center justify-center border shadow-2xl shadow-primary/10 rotate-3">
                  <Trophy className="w-20 h-20 text-primary animate-bounce" />
               </div>
            </div>
            <h2 className="text-6xl font-black tracking-tighter mb-4">Master the Grind.</h2>
            <p className="text-muted-foreground max-w-[500px] text-xl font-medium leading-relaxed">
              Real-time LeetCode interview patterns from top-tier tech companies. Choose your target and start solving.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-8">
               {[
                 { label: '3000+', sub: 'Questions' },
                 { label: '150+', sub: 'Companies' },
                 { label: '2026', sub: 'Latest Data' }
               ].map(stat => (
                 <div key={stat.label} className="text-center">
                    <p className="text-2xl font-black tracking-tighter">{stat.label}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.sub}</p>
                 </div>
               ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

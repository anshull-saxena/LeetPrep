'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Code2,
  Trophy,
  Filter,
  ListTodo,
  CheckCircle2,
  Zap,
  LogIn,
  LogOut,
  Cloud,
  CloudOff,
  Loader2,
  Command,
  Sparkles,
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
import { useAuth } from '@/components/auth-provider'
import { ProgressRing } from '@/components/progress-ring'
import { CommandPalette } from '@/components/command-palette'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

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
  const { isCompleted, syncStatus } = useCompletion()
  const { user, loading: authLoading, error: authError, signInWithGoogle, signOut } = useAuth()
  const { toast } = useToast()

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe']

  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await fetchCompanies()
        setCompanies(data)
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

  // Show toast for authentication errors
  useEffect(() => {
    if (authError) {
      toast({
        title: 'Authentication Error',
        description: authError,
        variant: 'destructive',
      })
    }
  }, [authError, toast])

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

    const topicMap: Record<string, number> = {}
    filteredQuestions.forEach(q => {
      q.topics.forEach(t => {
        topicMap[t] = (topicMap[t] || 0) + 1
      })
    })
    const topicData = Object.entries(topicMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    return { total, completed, easy, medium, hard, topicData }
  }, [filteredQuestions, isCompleted])

  const trendingCompanies = ['amazon', 'google', 'meta', 'apple', 'microsoft', 'netflix', 'uber', 'airbnb']
  const selectedCompanyName = companies.find(c => c.id === selectedCompanyId)?.name

  const syncLabel = syncStatus === 'synced' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'offline' ? 'Offline' : 'Local Only'
  const syncColor = syncStatus === 'synced' ? 'bg-emerald-500' : syncStatus === 'syncing' ? 'bg-amber-400' : syncStatus === 'offline' ? 'bg-red-500' : 'bg-muted-foreground'

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Command Palette */}
      <CommandPalette
        companies={companies}
        questions={filteredQuestions}
        onSelectCompany={setSelectedCompanyId}
      />

      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-card/30 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-8 border-b border-white/5 bg-background/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 neon-glow-sm">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight gradient-text">LeetPrep</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground">Version 2026.1</p>
              </div>
            </div>
          </div>

          {/* Search with Cmd+K hint */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search companies..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="pl-10 pr-20 bg-muted/40 border-none ring-1 ring-white/5 focus-visible:ring-2 focus-visible:ring-primary h-10 rounded-xl transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-white/5">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Company List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {loading ? (
            <div className="space-y-3 px-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-11 bg-muted/30 rounded-xl shimmer" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : (
            filteredCompanies.map((company, index) => (
              <button
                key={company.id}
                onClick={() => setSelectedCompanyId(company.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-between group stagger-item ${
                  selectedCompanyId === company.id
                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02] z-10 neon-glow-sm'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:translate-x-1'
                }`}
                style={{ animationDelay: `${Math.min(index * 0.02, 0.5)}s` }}
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

        {/* Auth Section */}
        <div className="p-5 border-t border-white/5 bg-muted/5">
          {authLoading ? (
            <div className="flex items-center gap-3 px-2">
              <div className="h-10 w-10 rounded-full bg-muted/30 shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-muted/30 rounded shimmer" />
                <div className="h-2 w-16 bg-muted/30 rounded shimmer" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3 px-2">
              <div className="relative">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="h-10 w-10 rounded-full border-2 border-primary/30 shadow-lg shadow-primary/10"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-primary/30">
                    <span className="text-xs font-black text-white">
                      {(user.displayName || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${syncColor} ${syncStatus === 'syncing' ? 'animate-pulse' : syncStatus === 'synced' ? 'pulse-glow' : ''}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.displayName || 'User'}</p>
                <div className="flex items-center gap-1.5">
                  {syncStatus === 'synced' ? (
                    <Cloud className="h-3 w-3 text-emerald-400" />
                  ) : syncStatus === 'offline' ? (
                    <CloudOff className="h-3 w-3 text-red-400" />
                  ) : (
                    <Loader2 className="h-3 w-3 text-amber-400 animate-spin" />
                  )}
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{syncLabel}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={signInWithGoogle}
              className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-foreground font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 gap-3"
              variant="ghost"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-muted/5">
        {selectedCompanyId ? (
          <>
            {/* Header */}
            <header className="border-b border-white/5 bg-background/80 backdrop-blur-md z-10 p-8">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="rounded-full px-3 py-0 border-primary/30 text-primary bg-primary/5 text-[10px] font-black uppercase tracking-widest">Company Focus</Badge>
                      <Badge variant="outline" className="rounded-full px-3 py-0 border-white/10 text-muted-foreground bg-white/5 text-[10px] font-black uppercase tracking-widest gap-1">
                        <Sparkles className="h-3 w-3" />
                        {companyStats.total} Problems
                      </Badge>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter gradient-text">{selectedCompanyName}</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Cracking {selectedCompanyName} requires mastering these specific patterns.</p>
                  </div>

                  <div className="bg-card/50 p-1.5 rounded-2xl border border-white/5 shadow-sm self-start neon-glow-sm">
                    <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
                      <TabsList className="bg-transparent gap-1">
                        <TabsTrigger value="30days" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 px-4 text-xs font-bold">30D</TabsTrigger>
                        <TabsTrigger value="3months" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 px-4 text-xs font-bold">3M</TabsTrigger>
                        <TabsTrigger value="6months" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 px-4 text-xs font-bold">6M</TabsTrigger>
                        <TabsTrigger value="1year" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 px-4 text-xs font-bold">1Y</TabsTrigger>
                        <TabsTrigger value="alltime" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 px-4 text-xs font-bold">All</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Progress Card with Ring */}
                  <Card className="col-span-1 md:col-span-2 shadow-xl shadow-primary/5 border-none bg-gradient-to-br from-primary/10 via-card to-transparent relative overflow-hidden group glass-card-hover">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                      <Trophy className="h-32 w-32" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <ProgressRing progress={companyStats.percentage} size={100} strokeWidth={7} />
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/80 mb-2">Overall Progress</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-emerald-400">{companyStats.completed} Solved</span>
                              <span className="text-muted-foreground">{companyStats.total - companyStats.completed} Remaining</span>
                            </div>
                            <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${companyStats.percentage}%`,
                                  boxShadow: '0 0 10px oklch(0.5 0.2 280 / 0.4)',
                                }}
                              />
                            </div>
                          </div>
                          {/* Difficulty breakdown mini-stats */}
                          <div className="flex gap-4 mt-3">
                            <span className="text-[10px] font-bold text-emerald-400">E: {stats.easy}</span>
                            <span className="text-[10px] font-bold text-amber-400">M: {stats.medium}</span>
                            <span className="text-[10px] font-bold text-rose-400">H: {stats.hard}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Topic Chart */}
                  <Card className="col-span-1 md:col-span-2 shadow-xl shadow-foreground/5 border-none bg-card relative overflow-hidden glass-card-hover">
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
                            <RechartsTooltip
                              contentStyle={{
                                background: 'oklch(0.12 0 0)',
                                border: '1px solid oklch(0.2 0 0)',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            />
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
                        {stats.topicData.length === 0 && (
                          <p className="text-[10px] text-muted-foreground">No topic data</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </header>

            {/* Filter Bar */}
            <div className="px-8 py-4 border-b border-white/5 flex flex-wrap items-center gap-4 bg-background/40 sticky top-0 z-10 backdrop-blur-md">
              <div className="relative w-full md:w-[400px] group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filter by question title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-none ring-1 ring-white/5 focus-visible:ring-primary h-11 rounded-xl"
                />
              </div>
              <div className="flex items-center gap-3">
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-[160px] bg-background border-none ring-1 ring-white/5 h-11 rounded-xl font-bold text-xs uppercase tracking-wider">
                    <Filter className="w-3.5 h-3.5 mr-2 opacity-50" />
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-white/10 shadow-2xl bg-card/95 backdrop-blur-xl">
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] bg-background border-none ring-1 ring-white/5 h-11 rounded-xl font-bold text-xs uppercase tracking-wider">
                    <ListTodo className="w-3.5 h-3.5 mr-2 opacity-50" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-white/10 shadow-2xl bg-card/95 backdrop-blur-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {filteredQuestions.length} Problems
                </div>
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
            <div className="relative mb-12 animate-in-scale">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse-slow" />
              <div className="relative h-40 w-40 bg-card rounded-[40px] flex items-center justify-center border border-white/5 shadow-2xl shadow-primary/10 rotate-3 neon-glow">
                <Trophy className="w-20 h-20 text-primary" />
              </div>
            </div>
            <h2 className="text-6xl font-black tracking-tighter mb-4 gradient-text animate-in-fade">Master the Grind.</h2>
            <p className="text-muted-foreground max-w-[500px] text-xl font-medium leading-relaxed animate-in-fade" style={{ animationDelay: '0.1s' }}>
              Real-time LeetCode interview patterns from top-tier tech companies. Choose your target and start solving.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              {[
                { label: '3200+', sub: 'Questions' },
                { label: '690+', sub: 'Companies' },
                { label: '2026', sub: 'Latest Data' }
              ].map((stat, i) => (
                <div key={stat.label} className="text-center animate-in-fade" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                  <p className="text-2xl font-black tracking-tighter gradient-text">{stat.label}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 animate-in-fade" style={{ animationDelay: '0.5s' }}>
              <Badge variant="outline" className="rounded-full px-4 py-1.5 border-white/10 text-muted-foreground bg-white/5 text-[10px] font-bold uppercase tracking-widest gap-2">
                <Command className="h-3 w-3" />
                Press ⌘K to quick search
              </Badge>
            </div>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}

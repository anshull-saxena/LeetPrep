'use client'

import React, { useState, useEffect, useMemo } from 'react'
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
  Menu,
  ChevronDown,
  ChevronUp,
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
import { LandingPage } from '@/components/landing-page'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { Logo, LogoText } from '@/components/logo'
import { SidebarContent } from '@/components/sidebar-content'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

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
  const [dashboardOpen, setDashboardOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { isCompleted, syncStatus } = useCompletion()
  const { user, loading: authLoading, error: authError, signInWithGoogle, signOut } = useAuth()
  const { toast } = useToast()

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe']

  // Handle auto-closing dashboard on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setDashboardOpen(false)
      } else {
        setDashboardOpen(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-12 animate-pulse" />
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm font-bold text-muted-foreground">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />
  }

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Command Palette */}
      <CommandPalette
        companies={companies}
        questions={filteredQuestions}
        onSelectCompany={setSelectedCompanyId}
      />

      {/* Sidebar - Desktop */}
      <aside className="w-80 border-r border-white/5 bg-card/30 backdrop-blur-xl flex flex-col hidden md:flex fixed h-screen left-0 top-0 z-30">
        <SidebarContent
          companySearch={companySearch}
          setCompanySearch={setCompanySearch}
          loading={loading}
          filteredCompanies={filteredCompanies}
          selectedCompanyId={selectedCompanyId}
          setSelectedCompanyId={setSelectedCompanyId}
          trendingCompanies={trendingCompanies}
          authLoading={authLoading}
          user={user}
          syncStatus={syncStatus}
          syncLabel={syncLabel}
          syncColor={syncColor}
          signOut={signOut}
          signInWithGoogle={signInWithGoogle}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-muted/5 md:ml-80">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background/80 backdrop-blur-md z-20 shrink-0">
          <LogoText />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80 border-r border-white/5">
              <div className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </div>
              <SidebarContent
                companySearch={companySearch}
                setCompanySearch={setCompanySearch}
                loading={loading}
                filteredCompanies={filteredCompanies}
                selectedCompanyId={selectedCompanyId}
                setSelectedCompanyId={setSelectedCompanyId}
                trendingCompanies={trendingCompanies}
                authLoading={authLoading}
                user={user}
                syncStatus={syncStatus}
                syncLabel={syncLabel}
                syncColor={syncColor}
                signOut={signOut}
                signInWithGoogle={signInWithGoogle}
              />
            </SheetContent>
          </Sheet>
        </div>

        {selectedCompanyId ? (
          <div className="flex flex-col">
            {/* Header */}
            <header className="border-b border-white/5 bg-background/50 backdrop-blur-sm z-10 p-4 md:p-8">
              <div className="flex flex-col gap-4 md:gap-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="rounded-full px-3 py-0 border-primary/30 text-primary bg-primary/5 text-[10px] font-black uppercase tracking-widest">Company Focus</Badge>
                      <Badge variant="outline" className="rounded-full px-3 py-0 border-white/10 text-muted-foreground bg-white/5 text-[10px] font-black uppercase tracking-widest gap-1">
                        <Sparkles className="h-3 w-3" />
                        {companyStats.total} Problems
                      </Badge>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter gradient-text">{selectedCompanyName}</h1>
                    <p className="text-xs md:text-base text-muted-foreground mt-1 md:mt-2 font-medium">Cracking {selectedCompanyName} requires mastering these patterns.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-card/50 p-1.5 rounded-2xl border border-white/5 shadow-sm self-start neon-glow-sm">
                      <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
                        <TabsList className="bg-transparent gap-1">
                          <TabsTrigger value="30days" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 px-3 md:px-4 text-[10px] md:text-xs font-bold">30D</TabsTrigger>
                          <TabsTrigger value="3months" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 px-3 md:px-4 text-[10px] md:text-xs font-bold">3M</TabsTrigger>
                          <TabsTrigger value="6months" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 px-3 md:px-4 text-[10px] md:text-xs font-bold">6M</TabsTrigger>
                          <TabsTrigger value="1year" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 px-3 md:px-4 text-[10px] md:text-xs font-bold">1Y</TabsTrigger>
                          <TabsTrigger value="alltime" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 px-3 md:px-4 text-[10px] md:text-xs font-bold">All</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden rounded-xl h-10 w-10 border border-white/5 bg-card/50"
                      onClick={() => setDashboardOpen(!dashboardOpen)}
                    >
                      {dashboardOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Dashboard Grid - Collapsible on Mobile */}
                <Collapsible open={dashboardOpen} onOpenChange={setDashboardOpen}>
                  <CollapsibleContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      {/* Progress Card with Ring */}
                      <Card className="col-span-1 md:col-span-2 shadow-xl shadow-primary/5 border-none bg-gradient-to-br from-primary/10 via-card to-transparent relative overflow-hidden group glass-card-hover">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                          <Trophy className="h-32 w-32" />
                        </div>
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center gap-4 md:gap-6">
                            <ProgressRing progress={companyStats.percentage} size={isMobile ? 80 : 100} strokeWidth={7} />
                            <div className="flex-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary/80 mb-1 md:mb-2">Overall Progress</p>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] md:text-xs font-bold">
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
                              <div className="flex gap-4 mt-2 md:mt-3">
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
                        <CardHeader className="pb-0 p-4 md:p-6">
                          <CardTitle className="text-[10px] md:text-sm font-black uppercase tracking-wider text-muted-foreground">Topic Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[120px] md:h-[140px] p-0 flex items-center">
                          <div className="w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={stats.topicData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={isMobile ? 25 : 35}
                                  outerRadius={isMobile ? 45 : 55}
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
                          <div className="w-1/2 pr-4 md:pr-6 space-y-1 md:space-y-1.5">
                            {stats.topicData.map((topic, i) => (
                              <div key={topic.name} className="flex items-center justify-between text-[8px] md:text-[10px] font-bold">
                                <div className="flex items-center gap-1.5 md:gap-2 truncate">
                                  <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
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
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </header>

            {/* Filter Bar */}
            <div className="px-4 md:px-8 py-4 border-b border-white/5 flex flex-wrap items-center gap-3 md:gap-4 bg-background/50 sticky top-0 z-20 backdrop-blur-sm gpu-accelerate">
              <div className="relative w-full md:w-[400px] group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filter by question title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-none ring-1 ring-white/5 focus-visible:ring-primary h-11 rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-[120px] md:w-[160px] bg-background border-none ring-1 ring-white/5 h-10 md:h-11 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-wider">
                    <Filter className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-2 opacity-50" />
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
                  <SelectTrigger className="w-[120px] md:w-[160px] bg-background border-none ring-1 ring-white/5 h-10 md:h-11 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-wider">
                    <ListTodo className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-2 opacity-50" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-white/10 shadow-2xl bg-card/95 backdrop-blur-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-3">
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {filteredQuestions.length} Problems
                </div>
              </div>
            </div>

            {/* Question List */}
            <div className="px-4 md:px-8 pb-8">
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
          </div>
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

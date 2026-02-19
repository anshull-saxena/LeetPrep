'use client'

import { Search, CheckCircle2, Cloud, CloudOff, Loader2, LogOut, Menu } from 'lucide-react'
import { Company } from '@/lib/data'
import { LogoText } from '@/components/logo'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User } from 'firebase/auth'

interface SidebarContentProps {
  companySearch: string
  setCompanySearch: (value: string) => void
  loading: boolean
  filteredCompanies: Company[]
  selectedCompanyId: string | null
  setSelectedCompanyId: (id: string) => void
  trendingCompanies: string[]
  authLoading: boolean
  user: User | null
  syncStatus: string
  syncLabel: string
  syncColor: string
  signOut: () => void
  signInWithGoogle: () => void
}

export function SidebarContent({
  companySearch,
  setCompanySearch,
  loading,
  filteredCompanies,
  selectedCompanyId,
  setSelectedCompanyId,
  trendingCompanies,
  authLoading,
  user,
  syncStatus,
  syncLabel,
  syncColor,
  signOut,
  signInWithGoogle
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-8 border-b border-white/5 bg-background/50">
        <LogoText className="mb-8" />

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
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-between group stagger-item ${selectedCompanyId === company.id
                  ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02] z-10 neon-glow-sm'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:translate-x-1'
                }`}
              style={{ animationDelay: `${Math.min(index * 0.02, 0.5)}s` }}
            >
              <span className="flex items-center gap-2">
                {company.name}
                {trendingCompanies.includes(company.id.toLowerCase()) && (
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter ${selectedCompanyId === company.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
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
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </Button>
        )}
      </div>
    </div>
  )
}

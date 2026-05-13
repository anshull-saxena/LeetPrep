'use client'

import React from 'react'
import { Building2, Route, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo, LogoText } from '@/components/logo'

export type AppMode = 'company' | 'blind75' | 'blind150' | 'blind300'

interface ModeSelectorProps {
  onSelect: (mode: AppMode) => void
}

const PATHS = [
  {
    id: 'blind75' as AppMode,
    label: 'Blind 75',
    count: 75,
    description: 'The classic curated list of 75 essential LeetCode problems.',
    color: 'from-violet-500/20 to-violet-500/5',
    border: 'border-violet-500/30 hover:border-violet-500/60',
    badge: 'bg-violet-500/10 text-violet-400',
  },
  {
    id: 'blind150' as AppMode,
    label: 'Blind 150',
    count: 150,
    description: 'Extended list covering more patterns and edge cases.',
    color: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/30 hover:border-blue-500/60',
    badge: 'bg-blue-500/10 text-blue-400',
  },
  {
    id: 'blind300' as AppMode,
    label: 'Blind 300',
    count: 300,
    description: 'Comprehensive preparation for top-tier tech interviews.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/30 hover:border-emerald-500/60',
    badge: 'bg-emerald-500/10 text-emerald-400',
  },
]

export function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="flex min-h-screen bg-background items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <Logo className="h-8 w-8" />
          <LogoText className="text-xl font-black" />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-center mb-2">Choose your mode</h1>
        <p className="text-muted-foreground text-center mb-10 text-sm">
          Pick how you want to practice today. You can switch anytime.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {/* Company Wise */}
          <button
            onClick={() => onSelect('company')}
            className="group flex items-center gap-5 rounded-2xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/8 p-6 text-left transition-all duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-base">Company Wise</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">690+ companies</span>
              </div>
              <p className="text-sm text-muted-foreground">Browse questions by company with frequency data. Know exactly what each company asks.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
          </button>

          {/* Blind Paths */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PATHS.map((path) => (
              <button
                key={path.id}
                onClick={() => onSelect(path.id)}
                className={`group flex flex-col gap-3 rounded-2xl border ${path.border} bg-gradient-to-b ${path.color} p-6 text-left transition-all duration-200`}
              >
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${path.badge}`}>
                    {path.count} problems
                  </span>
                </div>
                <div>
                  <p className="font-bold text-base mb-1">{path.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{path.description}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all mt-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

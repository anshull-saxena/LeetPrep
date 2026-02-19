'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { Search, Building2, Code2, Zap, ExternalLink } from 'lucide-react'
import { Company, Question } from '@/lib/data'

interface CommandPaletteProps {
  companies: Company[]
  questions: Question[]
  onSelectCompany: (id: string) => void
}

export function CommandPalette({ companies, questions, onSelectCompany }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelectCompany = useCallback((id: string) => {
    onSelectCompany(id)
    setOpen(false)
  }, [onSelectCompany])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in-fade"
        onClick={() => setOpen(false)}
      />

      {/* Command dialog */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl">
        <Command
          className="rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10 overflow-hidden"
          loop
        >
          <div className="flex items-center border-b border-white/5 px-4">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Command.Input
              placeholder="Search companies, questions..."
              className="w-full py-4 px-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              autoFocus
            />
            <kbd className="shrink-0 text-[10px] font-mono font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 custom-scrollbar">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Companies" className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-black [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2">
              {companies.slice(0, 20).map((company) => (
                <Command.Item
                  key={company.id}
                  value={company.name}
                  onSelect={() => handleSelectCompany(company.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-foreground/80 data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                >
                  <Building2 className="h-4 w-4 text-primary/60" />
                  <span className="font-medium">{company.name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                    {company.timeframes?.length || 0} periods
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            {questions.length > 0 && (
              <Command.Group heading="Questions" className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-black [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2">
                {questions.slice(0, 15).map((q) => (
                  <Command.Item
                    key={q.id}
                    value={q.title}
                    onSelect={() => {
                      if (q.leetcodeUrl) window.open(q.leetcodeUrl, '_blank')
                      setOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-foreground/80 data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
                  >
                    <Code2 className="h-4 w-4 text-primary/60" />
                    <span className="font-medium flex-1 truncate">{q.title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                      q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {q.difficulty}
                    </span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Quick Actions" className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-black [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2">
              <Command.Item
                value="random question"
                onSelect={() => {
                  if (questions.length > 0) {
                    const random = questions[Math.floor(Math.random() * questions.length)]
                    if (random.leetcodeUrl) window.open(random.leetcodeUrl, '_blank')
                  }
                  setOpen(false)
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-foreground/80 data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground transition-colors"
              >
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="font-medium">Random Question</span>
                <span className="ml-auto text-[10px] text-muted-foreground">Feeling lucky?</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="border-t border-white/5 px-4 py-2.5 flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-muted/50 px-1 py-0.5 rounded text-[9px]">&uarr;&darr;</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-muted/50 px-1 py-0.5 rounded text-[9px]">&crarr;</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-[9px]">Esc</kbd>
              Close
            </span>
          </div>
        </Command>
      </div>
    </div>
  )
}

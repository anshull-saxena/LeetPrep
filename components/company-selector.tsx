'use client'

import { useState, useMemo } from 'react'
import { Company } from '@/lib/data'
import { Input } from '@/components/ui/input'
import { Search, Building2, ChevronRight } from 'lucide-react'

interface CompanySelectorProps {
  companies: Company[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function CompanySelector({
  companies,
  selectedId,
  onSelect,
}: CompanySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCompanies = useMemo(() => {
    return companies.filter(company =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [companies, searchQuery])

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="relative">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Target Companies
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 bg-card border-border highlight-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-250px)]">
        {filteredCompanies.map(company => (
          <button
            key={company.id}
            onClick={() => onSelect(company.id)}
            className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all duration-200 group relative truncate ${
              selectedId === company.id
                ? 'bg-primary text-primary-foreground font-semibold shadow-md'
                : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="truncate pr-2">{company.name}</span>
              {selectedId === company.id ? (
                <ChevronRight className="w-4 h-4 opacity-100" />
              ) : (
                <span className="text-[10px] font-mono opacity-50 bg-muted px-1.5 py-0.5 rounded group-hover:bg-background">
                  {company.id.slice(0, 3)}
                </span>
              )}
            </div>
          </button>
        ))}

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12 px-4 bg-muted/30 rounded-2xl border border-dashed border-border mt-2">
            <p className="text-muted-foreground text-sm">No companies match your search</p>
          </div>
        )}
      </div>
    </div>
  )
}

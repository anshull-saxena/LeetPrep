'use client'

import { useState, useMemo } from 'react'
import { Company } from '@/lib/data'
import { Input } from '@/components/ui/input'

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
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Companies</h3>
        <Input
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="space-y-1 border border-border rounded-lg bg-card divide-y divide-border max-h-96 overflow-y-auto">
        {filteredCompanies.map(company => (
          <button
            key={company.id}
            onClick={() => onSelect(company.id)}
            className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedId === company.id
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
          >
            <div className="flex items-center justify-between">
              <span>{company.name}</span>
              {company.questions.length > 0 && (
                <span className="text-xs font-mono opacity-70">
                  {company.questions.length}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-sm">
          No companies found
        </div>
      )}
    </div>
  )
}

export interface Question {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  frequency: number
  leetcodeUrl: string
  timePeriod: 'last-6-months' | '1-year' | 'all-time'
  topics: string[]
}

export interface Company {
  id: string
  name: string
  questions: Question[]
}

export const sampleData: Company[] = [];

export interface Question {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  leetcodeUrl: string
  companies: {
    [company: string]: {
      [duration:string]: string
    }
  }
  topics: string[]
}

export interface Company {
  id: string
  name: string
  // Questions are now fetched separately
}

export const sampleData: Company[] = [];

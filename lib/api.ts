import { Company, Question } from './data';
import { getTopics } from './topics';

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const res = await fetch('/leetcode_data.json');
    if (!res.ok) throw new Error('Failed to fetch companies');
    const data = await res.json();
    
    return Object.keys(data.companies).map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

export async function fetchQuestions(company?: string, search?: string): Promise<Question[]> {
  try {
    const url = new URL('/api/questions', window.location.origin);
    if (company) url.searchParams.append('company', company);
    if (search) url.searchParams.append('q', search);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch questions');
    const { questions } = await res.json();

    return questions.map((question: any) => ({
        ...question,
        difficulty: question.difficulty.toLowerCase(),
        topics: getTopics(question.id)
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

import { Company, Question } from './data';
import { getTopics } from './topics';

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const res = await fetch('/company_data.json');
    if (!res.ok) throw new Error('Failed to fetch companies');
    const data = await res.json();
    
    // Transform object { "google": [...], ... } into Company array
    return Object.keys(data).map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      questions: [] // Questions loaded on demand
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

export async function fetchQuestions(companyId: string, duration: string): Promise<Question[]> {
  try {
    // Map UI duration to filename duration
    // UI: 'last-6-months', '1-year', 'all-time'
    // Files: '6months', '1year', 'alltime'
    
    let fileDuration = 'alltime';
    if (duration === 'last-6-months') fileDuration = '6months';
    else if (duration === '1-year') fileDuration = '1year';
    else if (duration === '2-years') fileDuration = '2year'; // If you add 2 years option
    else if (duration === 'all-time') fileDuration = 'alltime';

    const path = `/data/LeetCode-Questions-CompanyWise/${companyId}_${fileDuration}.csv`;
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch questions for ${companyId}`);
    const text = await res.text();
    return parseCSV(text, duration);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

function parseCSV(text: string, timePeriod: string): Question[] {
  const lines = text.split('\n');
  const questions: Question[] = [];
  
  // Skip header (index 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',');
    if (parts.length < 6) continue;

    const id = parts[0];
    const title = parts[1];
    const difficulty = parts[3].toLowerCase(); 
    const frequency = parseFloat(parts[4]);
    const leetcodeUrl = parts[parts.length - 1].trim(); 
    
    let normDifficulty: 'easy' | 'medium' | 'hard' = 'medium';
    if (difficulty === 'easy') normDifficulty = 'easy';
    else if (difficulty === 'hard') normDifficulty = 'hard';

    questions.push({
      id,
      title,
      difficulty: normDifficulty,
      frequency: isNaN(frequency) ? 0 : frequency,
      leetcodeUrl,
      timePeriod: timePeriod as any,
      topics: getTopics(id, title)
    });
  }
  
  return questions;
}

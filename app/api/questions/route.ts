import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');
  const search = searchParams.get('q');

  const jsonFilePath = path.join(process.cwd(), 'public', 'leetcode_data.json');
  const fileContents = await fs.readFile(jsonFilePath, 'utf8');
  const data = JSON.parse(fileContents);

  let questions = Object.entries(data.questions).map(([id, questionData]: [string, any]) => ({
    id,
    ...questionData
  }));

  if (company) {
    questions = questions.filter((question: any) => 
      question.companies.hasOwnProperty(company)
    );
  }

  if (search) {
    questions = questions.filter((question: any) => 
      question.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  return NextResponse.json({ questions });
}

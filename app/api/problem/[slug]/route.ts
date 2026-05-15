import { NextRequest, NextResponse } from 'next/server'

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql'

const QUERY = `
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    title
    titleSlug
    content
    difficulty
    exampleTestcases
    topicTags { name slug }
    hints
  }
}
`

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  try {
    const res = await fetch(LEETCODE_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: QUERY,
        variables: { titleSlug: slug },
      }),
      next: { revalidate: 86400 },
    })

    const data = await res.json()

    if (data.errors) {
      return NextResponse.json({ error: data.errors[0]?.message }, { status: 404 })
    }

    return NextResponse.json(data.data?.question || null)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch problem' }, { status: 502 })
  }
}

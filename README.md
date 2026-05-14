# LeetPrep — Ace Your Coding Interviews

Practice LeetCode interview questions sorted by company frequency and curated Blind 75/150/300 paths. Track progress across devices with Google Sign-In + Supabase sync.

## Features

### Company-Wise Practice
- Browse questions from **100+ companies** sorted by frequency and difficulty
- Filter by timeline (last 6 months, 1 year, 2 years)
- Search by LeetCode ID to find company-specific frequency data
- Analysis dashboard with solving trends, weekly stats, and peak hours

### Blind 75 / 150 / 300 Paths
- **Blind 75** — The classic curated list of essential LeetCode problems
- **Blind 150** — Extended list covering more patterns
- **Blind 300** — Comprehensive preparation for top-tier tech interviews
- Filter by difficulty (Easy/Medium/Hard) and topic
- Direct links to LeetCode and NeetCode for each problem
- Progress bar with percentage tracking

### Progress Sync
- Track attempted questions with checkboxes
- **Supabase sync** — progress persists across devices when signed in
- **Local-first** — works offline, syncs when you log in
- **Reset** — clear all progress with one click (sidebar → reset icon)

### Authentication
- Google Sign-In via Firebase Authentication
- Automatic fallback to redirect if pop-ups are blocked
- Sync status indicator (cloud/syncing/offline)

## Access

Visit the website: [hopefuel.vercel.app](https://hopefuel.vercel.app)

## SEO & Discovery

The site is optimized for search engines with:
- Sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- Open Graph / Twitter Card meta tags
- JSON-LD structured data (WebApplication schema)
- Google Search Console verification support

### Google Search Console Setup
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your domain/property (e.g., `https://hopefuel.vercel.app`)
3. Copy the verification meta tag content (looks like `ABC123xyz...`)
4. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=ABC123xyz...
   ```
5. Re-deploy on Vercel
6. Once verified, submit your sitemap: `https://hopefuel.vercel.app/sitemap.xml`

## Setup

### Environment Variables

1. **Copy the environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in credentials** in `.env.local`:

   **Firebase** (for Google Sign-In):
   - Get from [Firebase Console](https://console.firebase.google.com/) > Project Settings > General > Your apps
   - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc.

   **Supabase** (for progress sync):
   - Create a project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Run `supabase/schema.sql` in Supabase SQL Editor
   - Disable RLS on `user_progress` table (Firebase handles auth)

3. **For Vercel deployment**:
   - Add all env vars in Vercel project settings > Environment Variables

### Firebase Authentication Setup

1. **Enable Google Sign-In**:
   - Firebase Console > Authentication > Sign-in method > Enable Google
2. **Add Authorized Domains**:
   - Firebase Console > Authentication > Settings > Authorized domains
   - Add your production domain and `localhost`
3. **Configure OAuth Consent Screen** if needed in Google Cloud Console

### Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Changelog

### v2.0.0
- Blind 75 / 150 / 300 path modes
- Supabase progress sync
- Reset progress option
- Switch mode anytime
- SEO metadata, sitemap, robots.txt, JSON-LD

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Licensed under the MIT License.

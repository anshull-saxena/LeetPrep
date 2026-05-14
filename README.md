<div align="center">

  # LeetPrep — Ace Your Coding Interviews

  <p align="center">
    <strong>Company-Wise LeetCode Questions · Blind 75 · Blind 150 · Blind 300 · Progress Tracker</strong>
  </p>

  <p align="center">
    <a href="https://hopefuel.vercel.app">🌐 Live App</a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#setup">Setup</a>
    ·
    <a href="https://github.com/anshull-saxena/LeetPrep/releases">Changelog</a>
  </p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black)](https://nextjs.org/)
  [![Supabase](https://img.shields.io/badge/Storage-Supabase-3ECF8E)](https://supabase.com/)
  [![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28)](https://firebase.google.com/)

  ---

  **LeetPrep** is a free, open-source LeetCode practice platform that helps software engineers prepare for technical interviews at top tech companies. Practice **company-wise LeetCode questions** organized by frequency and difficulty, or follow curated **Blind 75**, **Blind 150**, and **Blind 300** study paths. Track your progress across devices with **Google Sign-In** and **Supabase cloud sync**.

  Ideal for **FAANG interview preparation**, **DSA practice**, and **coding interview prep**.

</div>

---

## Table of Contents

- [Features](#features)
- [Why LeetPrep?](#why-leetprep)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [SEO & Google Discovery](#seo--google-discovery)
- [Setup & Installation](#setup--installation)
- [Firebase Authentication Setup](#firebase-authentication-setup)
- [Supabase Progress Sync Setup](#supabase-progress-sync-setup)
- [Vercel Deployment](#vercel-deployment)
- [Changelog](#changelog)
- [License](#license)

---

## Features

### Company-Wise LeetCode Practice

Practice **LeetCode interview questions** from **100+ companies** including **Google**, **Amazon**, **Microsoft**, **Meta (Facebook)**, **Apple**, **Netflix**, and more. Each question is tagged with:

- **Frequency data** — see how often each problem appears at a specific company
- **Difficulty levels** — filter by Easy, Medium, or Hard
- **Time filters** — view questions asked in the last 6 months, 1 year, or 2 years
- **LeetCode ID search** — look up any problem to find which companies ask it
- **Analysis dashboard** — track your solving trends, weekly stats, and peak productivity hours

### Blind 75 / Blind 150 / Blind 300 Study Paths

Master the most commonly asked **LeetCode interview problems** with curated study paths:

| Path | Problems | Description |
|------|----------|-------------|
| **Blind 75** | 75 problems | The essential curated list for coding interview prep |
| **Blind 150** | 150 problems | Extended coverage of patterns and edge cases |
| **Blind 300** | 300 problems | Comprehensive preparation for top-tier tech interviews |

Each path includes:
- **Difficulty & topic filters** — focus on your weak areas
- **Search** — find problems by title
- **LeetCode + NeetCode links** — solve and watch explanations
- **Progress bar** — track completion percentage

### Cloud Progress Sync

Never lose your progress. **LeetPrep** uses a **local-first sync architecture**:

- ✅ **Works offline** — progress saved to localStorage immediately
- ☁️ **Supabase cloud sync** — automatically syncs when you sign in
- 🔄 **Smart merge** — combines local and cloud data, no duplicates
- 🗑️ **Reset anytime** — clear all progress from the sidebar

### Authentication

- **Google Sign-In** via Firebase Authentication
- Automatic pop-up to redirect fallback
- Sync status indicator (Cloud / Syncing / Offline)

---

## Why LeetPrep?

There are many LeetCode practice tools, but **LeetPrep** stands out:

1. **Company frequency data** — know exactly what each company asks, not just a generic problem list
2. **Dual mode** — practice by company OR follow structured Blind paths
3. **Free & open source** — no paywalls, no subscriptions
4. **Cross-device sync** — sign in on any device, pick up where you left off
5. **Modern UI** — fast, responsive, dark-mode first

Whether you're preparing for **Google interviews**, **Amazon SDE roles**, **Meta coding rounds**, or **general FAANG interview prep**, LeetPrep gives you the tools to practice efficiently.

---

## Live Demo

Visit the live application: **[https://hopefuel.vercel.app](https://hopefuel.vercel.app)**

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) (App Router) | React framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Firebase Auth](https://firebase.google.com/) | Google Sign-In |
| [Supabase](https://supabase.com/) | Progress persistence |
| [Vercel](https://vercel.com/) | Hosting & deployment |

---

## SEO & Google Discovery

LeetPrep is optimized for search engines and social sharing:

- **Sitemap**: [`/sitemap.xml`](https://hopefuel.vercel.app/sitemap.xml) — indexed by Google
- **Robots.txt**: [`/robots.txt`](https://hopefuel.vercel.app/robots.txt) — crawl instructions
- **Open Graph tags** — rich previews on Twitter, LinkedIn, Slack
- **JSON-LD structured data** — WebApplication schema for search engines
- **Google Search Console** — monitoring and indexing
- **Semantic HTML** — accessible and crawler-friendly

---

## Setup & Installation

### Prerequisites

- Node.js 18+
- A Firebase project (for Google Sign-In)
- A Supabase project (for progress sync)

### Environment Variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
# Firebase (Google Sign-In)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Supabase (progress sync)
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Site URL (for SEO)
NEXT_PUBLIC_SITE_URL=https://hopefuel.vercel.app

# Optional: Google Search Console
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_code
```

### Install & Run

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Firebase Authentication Setup

Enable **Google Sign-In** on your LeetCode practice platform:

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add authorized domains:
   - `localhost` (development)
   - `hopefuel.vercel.app` (production)
   - Any custom domain
4. Configure **OAuth consent screen** in [Google Cloud Console](https://console.cloud.google.com/) if needed

---

## Supabase Progress Sync Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API** — copy URL and anon key
3. Open **SQL Editor** and run the schema from `supabase/schema.sql`
4. Since auth is handled by Firebase (not Supabase), disable RLS on `user_progress`:

```sql
alter table public.user_progress disable row level security;
```

---

## Vercel Deployment

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com/)
3. Add all environment variables in **Project Settings** → **Environment Variables**
4. Deploy — Vercel auto-detects Next.js

---

## Changelog

### v2.0.0 (Latest)
- **Blind 75 / 150 / 300** path modes
- **Supabase** cloud progress sync
- **Reset progress** option
- **Switch mode** between company-wise and blind paths
- **SEO optimization** — sitemap, robots.txt, JSON-LD, OG tags

### v1.0.0
- Company-wise question browser with frequency data
- Google Sign-In via Firebase
- Difficulty and time filters
- Analysis dashboard with solving trends

---

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Licensed under the MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">
  <sub>Built with ❤️ for the coding interview community. If you find this useful, ⭐ the repo!</sub>
</div>

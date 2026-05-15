# Dev.to Article

**Title:** I Built a Free, Open-Source LeetCode Practice App — Here's What I Learned

**Body:**

## The Problem

Preparing for coding interviews usually means juggling multiple tabs — LeetCode for problems, a spreadsheet for tracking, a separate code editor for practice. It's messy.

## What I Built

I built **LeetPrep** — a unified LeetCode practice platform that brings everything together in one place.

### Features

**Company-Wise Questions**
Browse problems from 100+ companies (Google, Amazon, Meta, Microsoft, Apple, etc.) sorted by frequency and difficulty. Filter by timeline — see what companies asked in the last 6 months vs 2 years.

**Blind 75 / 150 / 300 Paths**
Follow curated study paths with a clean UI. Filter by topic and difficulty. Track progress with checkboxes and a progress bar.

**Built-in Code Editor**
Monaco Editor (same engine as VS Code) with syntax highlighting, 8 languages, and **in-browser execution** for JavaScript and TypeScript. No backend needed — your code runs instantly in the browser.

**Problem Descriptions**
Click any question to see the full LeetCode problem description, example test cases, topic tags, and hints — all fetched live from LeetCode's GraphQL API.

**Progress Sync**
Sign in with Google and your progress syncs to Supabase. Local-first architecture — works offline, merges seamlessly when you reconnect.

### Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Supabase (progress persistence)
- Monaco Editor
- Deployed on Vercel

### What I Learned
- LeetCode's GraphQL API is surprisingly accessible and well-structured
- Building a local-first sync architecture is harder than it looks — merge conflicts on a set of strings are simple, but the UX around sync status matters a lot
- Monaco Editor + Next.js requires dynamic imports with SSR disabled
- GitHub release management via CLI (gh) is smooth

### Try It
App: https://hopefuel.vercel.app
GitHub: https://github.com/anshull-saxena/LeetPrep

The entire project is open source (MIT). Contributions and feedback welcome!

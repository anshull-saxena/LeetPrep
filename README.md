# Company-wise LeetCode Website

This repository hosts the code for the Company-wise LeetCode Website, a tool that provides access to LeetCode interview questions from over 100 companies sorted by frequency and difficulty. The website categorizes questions based on their timeline (last 6 months, 1 year, or 2 years) and is based on data provided in the repo: [LeetCode Questions Company Wise](https://github.com/krishnadey30/LeetCode-Questions-CompanyWise.git).

## Features
- Filter questions by difficulty.
- Sort questions by frequency of appearance and difficulty.
- Access company-specific questions.
- Search by LeetCode ID to discover company-specific frequency data.
- Use checkboxes to track attempted questions without needing to log in.
- Monitor your solving trend over time with the Analysis button, which shows metrics like the number of problems solved over the past week or month and identifies peak productivity hours.
- Easily integrate new problems into the platform using the Add feature. Review your contributions by selecting Summary under the Add option.


## Access
Visit the website: [Company-wise LeetCode](https://company-wise-leetcode-farneet.netlify.app/)

## Setup

### Environment Variables

1. **Copy the environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your Firebase credentials** in `.env.local`:
   - Get these from [Firebase Console](https://console.firebase.google.com/)
   - Go to Project Settings > General > Your apps
   - Copy the Firebase SDK configuration values

3. **For Vercel deployment**:
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add all variables from `.env.local` (without the quotes)
   - These will be automatically injected during build

**Important**: Never commit `.env.local` to Git. It's already in `.gitignore`.

### Firebase Authentication Setup

To enable Google Sign-In, you need to configure Firebase properly:

1. **Enable Google Sign-In Provider in Firebase Console**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (`leetprep12`)
   - Navigate to Authentication > Sign-in method
   - Enable Google as a sign-in provider
   - Add your OAuth 2.0 Client ID and Secret (if not already configured)

2. **Add Authorized Domains**:
   - In Firebase Console > Authentication > Settings > Authorized domains
   - Add your production domain (e.g., `company-wise-leetcode-farneet.netlify.app`)
   - Add `localhost` for local development

3. **Configure OAuth Consent Screen** (if needed):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Navigate to APIs & Services > OAuth consent screen
   - Fill in the required information
   - Add test users if in testing mode

4. **Check for Browser Pop-up Blockers**:
   - The app uses pop-ups for Google Sign-In
   - If pop-ups are blocked, it will automatically fallback to redirect method
   - Make sure to allow pop-ups from your domain

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Troubleshooting Google Sign-In

If Google Sign-In is not working:

- **"Pop-up was blocked"**: Allow pop-ups for this site in your browser settings
- **"Unauthorized domain"**: Add your domain to Firebase authorized domains
- **"Google sign-in is not enabled"**: Enable Google provider in Firebase Console
- **Configuration errors**: Check that your Firebase API key is correct in `lib/firebase.ts`

The app now includes:
- Automatic fallback to redirect method if pop-up is blocked
- Detailed error messages for authentication failures
- Toast notifications for errors

## Collaboration
For collaboration inquiries, contact via [LinkedIn](https://www.linkedin.com/in/farneet-singh-6b155b208/).

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Licensed under the MIT License.
